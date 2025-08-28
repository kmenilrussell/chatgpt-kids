import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

// Content moderation keywords and patterns
const INAPPROPRIATE_KEYWORDS = [
  'violence', 'kill', 'death', 'suicide', 'self-harm', 'drugs', 'alcohol', 
  'weapons', 'adult', 'sexual', 'explicit', 'hate', 'racist', 'bullying'
]

const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'self-harm', 'hurt myself', 'depressed', 
  'anxiety', 'panic attack', 'crisis', 'emergency'
]

const COPYRIGHTED_CHARACTERS = [
  'bluey', 'mickey mouse', 'minnie mouse', 'elsa', 'anna', 'frozen',
  'spider-man', 'batman', 'superman', 'disney', 'marvel', 'pixar'
]

export async function POST(request: NextRequest) {
  try {
    const { message, userId, mode = 'general', sessionToken } = await request.json()

    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Message and user ID are required' },
        { status: 400 }
      )
    }

    // Verify user and session
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        parentalControl: true,
        blockedTopics: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify session if provided
    if (sessionToken) {
      const session = await db.session.findFirst({
        where: {
          userId,
          sessionToken,
          isActive: true
        }
      })

      if (!session) {
        return NextResponse.json(
          { error: 'Invalid or expired session' },
          { status: 401 }
        )
      }
    }

    // Content moderation checks
    const moderationResult = await moderateContent(message, user)
    
    if (moderationResult.blocked) {
      return NextResponse.json({
        error: moderationResult.reason,
        isFlagged: true,
        moderationScore: moderationResult.score
      }, { status: 400 })
    }

    // Store user message
    const userMessage = await db.chatMessage.create({
      data: {
        userId,
        content: message,
        role: 'user',
        mode,
        isFlagged: moderationResult.flagged,
        flagReason: moderationResult.flagReason,
        moderationScore: moderationResult.score
      }
    })

    // Get AI response based on mode
    let aiResponse
    try {
      const zai = await ZAI.create()
      
      const systemPrompt = getSystemPrompt(mode, user.ageGroup, user.parentalControl?.maturityLevel)
      
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response right now."

    } catch (aiError) {
      console.error('AI service error:', aiError)
      aiResponse = "I'm having trouble connecting to my AI brain right now. Please try again later!"
    }

    // Moderate AI response
    const aiModerationResult = await moderateContent(aiResponse, user)

    // Store AI response
    const assistantMessage = await db.chatMessage.create({
      data: {
        userId,
        content: aiResponse,
        role: 'assistant',
        mode,
        isFlagged: aiModerationResult.flagged,
        flagReason: aiModerationResult.flagReason,
        moderationScore: aiModerationResult.score
      }
    })

    return NextResponse.json({
      message: aiResponse,
      messageId: assistantMessage.id,
      isFlagged: aiModerationResult.flagged,
      moderationScore: aiModerationResult.score,
      mode
    })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function moderateContent(content: string, user: any) {
  const lowerContent = content.toLowerCase()
  let score = 0
  let flagged = false
  let blocked = false
  let flagReason = ''
  let blockReason = ''

  // Check for crisis content
  const crisisDetected = CRISIS_KEYWORDS.some(keyword => 
    lowerContent.includes(keyword)
  )

  if (crisisDetected) {
    score = 1.0
    flagged = true
    flagReason = 'crisis_detected'
    
    // Log crisis detection
    await db.moderationLog.create({
      data: {
        userId: user.id,
        eventType: 'crisis_detected',
        severity: 'critical',
        description: 'Potential crisis content detected',
        metadata: {
          content: content.substring(0, 100),
          detectedKeywords: CRISIS_KEYWORDS.filter(k => lowerContent.includes(k))
        }
      }
    })
  }

  // Check for inappropriate content
  const inappropriateScore = INAPPROPRIATE_KEYWORDS.reduce((acc, keyword) => {
    return acc + (lowerContent.includes(keyword) ? 0.1 : 0)
  }, 0)

  score += inappropriateScore

  if (inappropriateScore > 0.3) {
    flagged = true
    flagReason = 'inappropriate_content'
  }

  // Check for copyrighted characters
  const copyrightDetected = COPYRIGHTED_CHARACTERS.some(character => 
    lowerContent.includes(character)
  )

  if (copyrightDetected) {
    flagged = true
    flagReason = 'copyrighted_content'
    score += 0.2
  }

  // Check user's blocked topics
  const userBlockedTopics = user.blockedTopics || []
  const blockedTopicDetected = userBlockedTopics.some((topic: any) => {
    if (topic.isRegex) {
      try {
        const regex = new RegExp(topic.keyword, 'i')
        return regex.test(lowerContent)
      } catch {
        return false
      }
    } else {
      return lowerContent.includes(topic.keyword.toLowerCase())
    }
  })

  if (blockedTopicDetected) {
    blocked = true
    blockReason = 'blocked_topic'
    score = 1.0
  }

  // Apply maturity level filtering
  if (user.parentalControl) {
    const maturityLevel = user.parentalControl.maturityLevel
    if (maturityLevel === 'LOW' && score > 0.2) {
      blocked = true
      blockReason = 'maturity_level_exceeded'
    } else if (maturityLevel === 'MEDIUM' && score > 0.5) {
      blocked = true
      blockReason = 'maturity_level_exceeded'
    }
  }

  return {
    score: Math.min(score, 1.0),
    flagged,
    blocked,
    flagReason,
    blockReason
  }
}

function getSystemPrompt(mode: string, ageGroup?: string, maturityLevel?: string) {
  const basePrompt = `You are a helpful, friendly, and educational AI assistant designed specifically for children. `
  
  let ageAppropriatePrompt = ''
  if (ageGroup) {
    switch (ageGroup) {
      case 'UNDER_5':
        ageAppropriatePrompt = `Use very simple language, short sentences, and focus on basic concepts. Be playful and encouraging. `
        break
      case 'AGE_5_8':
        ageAppropriatePrompt = `Use simple language with some new words to help them learn. Be encouraging and educational. `
        break
      case 'AGE_9_12':
        ageAppropriatePrompt = `Use age-appropriate language that challenges them to learn. Be educational and engaging. `
        break
      case 'AGE_13_17':
        ageAppropriatePrompt = `Use more sophisticated language while remaining appropriate. Be educational and supportive. `
        break
    }
  }

  let modePrompt = ''
  switch (mode) {
    case 'study':
      modePrompt = `You are in Study Mode. Provide step-by-step explanations, ask questions to guide their thinking, and give constructive feedback. Make learning interactive and fun. `
      break
    case 'creative':
      modePrompt = `You are in Creative Companion Mode. Be imaginative, playful, and encourage creativity. Use storytelling and imaginative scenarios. `
      break
    default:
      modePrompt = `Be helpful, educational, and age-appropriate. Keep responses positive and constructive. `
  }

  const safetyPrompt = `Always maintain child-safe content. Never discuss inappropriate topics, violence, or adult content. If a user expresses distress, provide supportive, age-appropriate resources and suggest they talk to a trusted adult. `

  return basePrompt + ageAppropriatePrompt + modePrompt + safetyPrompt
}
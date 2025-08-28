import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, pin } = await request.json()

    if (!email || !pin) {
      return NextResponse.json(
        { error: 'Email and PIN are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
      include: {
        parentalControl: true,
        parent: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has a PIN set
    if (!user.pin) {
      return NextResponse.json(
        { error: 'No PIN set for this user' },
        { status: 400 }
      )
    }

    // Validate PIN
    const isPinValid = await bcrypt.compare(pin, user.pin)

    if (!isPinValid) {
      // Log failed PIN attempt for security monitoring
      await db.moderationLog.create({
        data: {
          userId: user.id,
          eventType: 'pin_validation_failed',
          severity: 'medium',
          description: 'Failed PIN validation attempt',
          metadata: {
            attemptTime: new Date().toISOString(),
            ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
          }
        }
      })

      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      )
    }

    // Log successful PIN validation
    await db.moderationLog.create({
      data: {
        userId: user.id,
        eventType: 'pin_validation_success',
        severity: 'low',
        description: 'Successful PIN validation',
        metadata: {
          validationTime: new Date().toISOString(),
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
        }
      }
    })

    // Create or update session
    const sessionToken = generateSessionToken()
    const session = await db.session.create({
      data: {
        userId: user.id,
        sessionToken,
        deviceInfo: {
          userAgent: request.headers.get('user-agent'),
          platform: request.headers.get('sec-ch-ua-platform')
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
      }
    })

    return NextResponse.json({
      message: 'PIN validated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        ageGroup: user.ageGroup,
        isVerified: user.isVerified,
        consentStatus: user.consentStatus
      },
      sessionToken,
      parentalControl: user.parentalControl,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    })

  } catch (error) {
    console.error('PIN validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateSessionToken() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36)
}
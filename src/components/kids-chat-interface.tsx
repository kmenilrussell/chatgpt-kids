"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Send, 
  BookOpen, 
  Palette, 
  Home, 
  Star, 
  Robot, 
  Cat, 
  Dog, 
  Sparkles,
  Clock,
  Shield
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  mode?: string
}

interface KidsChatInterfaceProps {
  onExit: () => void
  userName?: string
  ageGroup?: string
}

const PERSONAS = {
  study: {
    name: "Professor Sparkles",
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    description: "Your learning buddy who makes homework fun!"
  },
  creative: {
    name: "Captain Imagination",
    icon: Palette,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    description: "Your creative friend for amazing stories and art!"
  },
  general: {
    name: "Buddy Bot",
    icon: Robot,
    color: "text-green-500",
    bgColor: "bg-green-100",
    description: "Your friendly AI helper for anything you need!"
  }
}

export default function KidsChatInterface({ onExit, userName = "Friend", ageGroup }: KidsChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hi ${userName}! I'm so excited to chat with you today! 🌟 What would you like to talk about? We can learn something new, create a fun story, or just chat about anything you like!`,
      timestamp: new Date(),
      mode: "general"
    }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentMode, setCurrentMode] = useState<"study" | "creative" | "general">("general")
  const [sessionTime, setSessionTime] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Timer for session tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
      mode: currentMode
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // Simulate API call to chat endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          userId: 'demo-user', // In real app, this would come from auth
          mode: currentMode,
          sessionToken: 'demo-session' // In real app, this would come from auth
        })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
        mode: currentMode
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Error sending message:', error)
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Oops! I'm having trouble talking right now. Can we try again in a moment? 🤖",
        timestamp: new Date(),
        mode: currentMode
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const currentPersona = PERSONAS[currentMode]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${currentPersona.bgColor}`}>
              <currentPersona.icon className={`w-6 h-6 ${currentPersona.color}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {currentPersona.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentPersona.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(sessionTime)}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Safe Mode
            </Badge>
            <Button onClick={onExit} variant="outline" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Chat</CardTitle>
                  <Badge variant="outline">{currentMode} mode</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 px-4 pb-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className={currentPersona.bgColor}>
                              <currentPersona.icon className={`w-4 h-4 ${currentPersona.color}`} />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                            message.role === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {message.role === "user" && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
                              {userName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={currentPersona.bgColor}>
                            <currentPersona.icon className={`w-4 h-4 ${currentPersona.color}`} />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Type your message to ${currentPersona.name}...`}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!inputMessage.trim() || isLoading}
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mode Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Choose Your Adventure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Tabs value={currentMode} onValueChange={(value) => setCurrentMode(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general" className="text-xs">
                      <Robot className="w-3 h-3 mr-1" />
                      Chat
                    </TabsTrigger>
                    <TabsTrigger value="study" className="text-xs">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Study
                    </TabsTrigger>
                    <TabsTrigger value="creative" className="text-xs">
                      <Palette className="w-3 h-3 mr-1" />
                      Create
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-medium">{currentPersona.name}</p>
                  <p className="text-xs">{currentPersona.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Ideas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => setInputMessage("Can you help me with my homework?")}
                >
                  <BookOpen className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-xs">Help with homework</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => setInputMessage("Tell me a fun story!")}
                >
                  <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-xs">Tell a story</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => setInputMessage("Can we play a word game?")}
                >
                  <Star className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-xs">Play a game</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => setInputMessage("Tell me something interesting about animals!")}
                >
                  <Cat className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-xs">Animal facts</span>
                </Button>
              </CardContent>
            </Card>

            {/* Safety Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Staying Safe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                  <p>🤖 Your chats are private and safe</p>
                  <p>🛡️ Bad words and topics are blocked</p>
                  <p>⏰ Time limits help you stay balanced</p>
                  <p>👨‍👩‍👧‍👦 Parents can see your activity</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, BookOpen, Palette, Shield, User, Lock } from "lucide-react"
import KidsChatInterface from "@/components/kids-chat-interface"

export default function Home() {
  const [userType, setUserType] = useState<"kid" | "parent" | null>(null)
  const [pin, setPin] = useState("")
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [inKidsMode, setInKidsMode] = useState(false)
  const [userName, setUserName] = useState("")

  const handleKidMode = () => {
    setUserType("kid")
    setShowPinDialog(true)
  }

  const handleParentMode = () => {
    setUserType("parent")
  }

  const handlePinSubmit = () => {
    if (pin.length === 4) {
      // For demo purposes, accept any 4-digit PIN
      // In real app, this would validate against stored PIN
      setInKidsMode(true)
      setShowPinDialog(false)
      setPin("")
    }
  }

  const handleExitKidsMode = () => {
    setInKidsMode(false)
    setUserType(null)
  }

  if (inKidsMode) {
    return (
      <KidsChatInterface 
        onExit={handleExitKidsMode}
        userName={userName || "Friend"}
        ageGroup="AGE_5_8" // Default age group for demo
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <Badge className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 border-yellow-500">
                Kids
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ChatGPT Kids
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A safe, fun, and educational AI companion designed specifically for children with parental controls you can trust.
          </p>
        </div>

        {/* Name Input for Demo */}
        <div className="max-w-md mx-auto mb-8">
          <div className="space-y-2">
            <Label htmlFor="userName">Your Name (for demo)</Label>
            <Input
              id="userName"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="text-center"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="welcome" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="welcome">Welcome</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
              <TabsTrigger value="parents">For Parents</TabsTrigger>
            </TabsList>

            <TabsContent value="welcome" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer" onClick={handleKidMode}>
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-green-600">Kids Mode</CardTitle>
                    <CardDescription>
                      Start learning and playing with your AI friend!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600" size="lg">
                      Enter Kids Mode
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors cursor-pointer" onClick={handleParentMode}>
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-purple-600">Parent Portal</CardTitle>
                    <CardDescription>
                      Manage settings and monitor your child's activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" size="lg">
                      Parent Dashboard
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <BookOpen className="w-8 h-8 text-blue-500 mb-2" />
                    <CardTitle>Study Mode</CardTitle>
                    <CardDescription>
                      Step-by-step learning with interactive questions and personalized feedback
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <Palette className="w-8 h-8 text-purple-500 mb-2" />
                    <CardTitle>Creative Companion</CardTitle>
                    <CardDescription>
                      Fun personas and sidekicks that spark imagination and creativity
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <Shield className="w-8 h-8 text-green-500 mb-2" />
                    <CardTitle>Safe Content</CardTitle>
                    <CardDescription>
                      Age-appropriate responses with real-time content filtering
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="safety" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Safety First
                  </CardTitle>
                  <CardDescription>
                    We've built ChatGPT Kids with comprehensive safety features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">PIN Protected</h4>
                        <p className="text-sm text-muted-foreground">4-digit PIN gates Kids Mode activation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Content Filtering</h4>
                        <p className="text-sm text-muted-foreground">Real-time moderation and crisis detection</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-purple-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Age Verification</h4>
                        <p className="text-sm text-muted-foreground">COPPA compliant with parental consent</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Privacy First</h4>
                        <p className="text-sm text-muted-foreground">Minimal data collection with easy deletion</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Parental Controls</CardTitle>
                  <CardDescription>
                    Comprehensive tools to keep your child safe online
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Key Features:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Weekly activity summaries and engagement patterns
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        Customizable maturity filters by age group
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        Block specific topics and keywords
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        Session management and time limits
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* PIN Dialog */}
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Parent PIN</DialogTitle>
            <DialogDescription>
              Please enter the 4-digit PIN to access Kids Mode
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin">4-Digit PIN</Label>
              <Input
                id="pin"
                type="password"
                maxLength={4}
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                className="text-center text-2xl tracking-widest"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handlePinSubmit} 
                className="flex-1"
                disabled={pin.length !== 4}
              >
                Enter Kids Mode
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowPinDialog(false)}
              >
                Cancel
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Demo: Any 4-digit PIN will work
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
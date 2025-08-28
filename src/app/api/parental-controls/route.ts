import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { MaturityLevel } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const parentalControl = await db.parentalControl.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            ageGroup: true
          }
        }
      }
    })

    if (!parentalControl) {
      return NextResponse.json(
        { error: 'Parental control settings not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ parentalControl })

  } catch (error) {
    console.error('Get parental controls error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, maturityLevel, enablePin, sessionLimit, timeRestrictions, blockedCategories, enableCrisisDetection, weeklyReports } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if user exists and is a parent
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update or create parental control settings
    const parentalControl = await db.parentalControl.upsert({
      where: { userId },
      update: {
        maturityLevel: maturityLevel || MaturityLevel.MEDIUM,
        enablePin: enablePin ?? true,
        sessionLimit: sessionLimit,
        timeRestrictions: timeRestrictions,
        blockedCategories: blockedCategories,
        enableCrisisDetection: enableCrisisDetection ?? true,
        weeklyReports: weeklyReports ?? true
      },
      create: {
        userId,
        maturityLevel: maturityLevel || MaturityLevel.MEDIUM,
        enablePin: enablePin ?? true,
        sessionLimit: sessionLimit,
        timeRestrictions: timeRestrictions,
        blockedCategories: blockedCategories,
        enableCrisisDetection: enableCrisisDetection ?? true,
        weeklyReports: weeklyReports ?? true
      }
    })

    // Log the settings change
    await db.moderationLog.create({
      data: {
        userId,
        eventType: 'parental_controls_updated',
        severity: 'low',
        description: 'Parental control settings updated',
        metadata: {
          changes: {
            maturityLevel,
            enablePin,
            sessionLimit,
            enableCrisisDetection,
            weeklyReports
          },
          updatedAt: new Date().toISOString()
        }
      }
    })

    return NextResponse.json({
      message: 'Parental control settings updated successfully',
      parentalControl
    })

  } catch (error) {
    console.error('Update parental controls error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
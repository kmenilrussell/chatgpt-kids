import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole, AgeGroup } from '@prisma/client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, ageGroup, parentId, pin } = await request.json()

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Hash PIN if provided (for parental controls)
    const hashedPin = pin ? await bcrypt.hash(pin, 12) : null

    // Create user
    const user = await db.user.create({
      data: {
        email,
        name,
        role: role || UserRole.CHILD,
        ageGroup: ageGroup ? AgeGroup[ageGroup as keyof typeof AgeGroup] : null,
        parentId,
        pin: hashedPin,
        isVerified: false, // Will be verified through age verification process
        consentStatus: false // Parental consent required for children
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        ageGroup: true,
        isVerified: true,
        consentStatus: true,
        createdAt: true
      }
    })

    // Create parental control settings for parents
    if (role === UserRole.PARENT) {
      await db.parentalControl.create({
        data: {
          userId: user.id,
          maturityLevel: 'MEDIUM',
          enablePin: true,
          enableCrisisDetection: true,
          weeklyReports: true
        }
      })
    }

    // If this is a child account with a parent, create age verification record
    if (role === UserRole.CHILD && ageGroup) {
      await db.ageVerification.create({
        data: {
          userId: user.id,
          ageGroup: AgeGroup[ageGroup as keyof typeof AgeGroup],
          verificationMethod: 'self_attestation',
          consentData: {
            selfDeclaredAge: ageGroup,
            requiresParentalConsent: ageGroup === AgeGroup.UNDER_5 || ageGroup === AgeGroup.AGE_5_8
          }
        }
      })
    }

    return NextResponse.json({
      message: 'User registered successfully',
      user,
      requiresParentalConsent: role === UserRole.CHILD && (
        ageGroup === AgeGroup.UNDER_5 || ageGroup === AgeGroup.AGE_5_8
      )
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
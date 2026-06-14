import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'

export const authService = {

  async register({ email, password, firstName, lastName, role, background }) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new Error('Email already in use')

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName,
        lastName,
        role: role ?? 'MEMBER',
        background: background ?? null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        background: true,
        createdAt: true,
      }
    })

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return { user, token }
  },

  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new Error('Invalid credentials')

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new Error('Invalid credentials')

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const { password: _, ...safeUser } = user
    return { user: safeUser, token }
  },

  async me(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        background: true,
        avatar: true,
        skills: true,
        expertises: true,
        createdAt: true,
      }
    })
    if (!user) throw new Error('User not found')
    return user
  }
}
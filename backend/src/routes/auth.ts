import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { drizzle } from 'drizzle-orm/d1'
import { users } from '../schema'
import { eq } from 'drizzle-orm'

const auth = new Hono<{
  Bindings: {
    DB: D1Database
    JWT_SECRET: string
  }
}>()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
})

// Login
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json()
    const { email, password } = loginSchema.parse(body)
    
    const db = drizzle(c.env.DB)
    const user = await db.select().from(users).where(eq(users.email, email)).get()
    
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }
    
    const token = await sign({
      sub: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days
    }, c.env.JWT_SECRET)
    
    return c.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    })
  } catch (error) {
    return c.json({ error: 'Invalid request' }, 400)
  }
})

// Register
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json()
    const { name, email, password } = registerSchema.parse(body)
    
    const db = drizzle(c.env.DB)
    
    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).get()
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 400)
    }
    
    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 10)
    const userId = crypto.randomUUID()
    
    await db.insert(users).values({
      id: userId,
      name,
      email,
      passwordHash,
      createdAt: new Date()
    })
    
    const token = await sign({
      sub: userId,
      email,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
    }, c.env.JWT_SECRET)
    
    return c.json({
      token,
      user: { id: userId, name, email }
    })
  } catch (error) {
    return c.json({ error: 'Invalid request' }, 400)
  }
})

// Get current user
auth.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    const db = drizzle(c.env.DB)
    const user = await db.select().from(users).where(eq(users.id, payload.sub as string)).get()
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }
    
    return c.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    })
  } catch (error) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
})

export default auth
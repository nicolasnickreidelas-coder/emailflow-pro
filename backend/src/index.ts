import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import authRoutes from './routes/auth'
import campaignRoutes from './routes/campaigns'
import templateRoutes from './routes/templates'
import analyticsRoutes from './routes/analytics'
import dashboardRoutes from './routes/dashboard'
import aiRoutes from './routes/ai'

type Bindings = {
  DB: D1Database
  CACHE: KVNamespace
  JWT_SECRET: string
  GROQ_API_KEY: string
  OPENAI_API_KEY: string
  GMAIL_CLIENT_ID: string
  GMAIL_CLIENT_SECRET: string
  GMAIL_REFRESH_TOKEN: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Routes
app.route('/auth', authRoutes)
app.route('/campaigns', campaignRoutes)
app.route('/templates', templateRoutes)
app.route('/analytics', analyticsRoutes)
app.route('/dashboard', dashboardRoutes)
app.route('/ai', aiRoutes)

// Health check
app.get('/', (c) => {
  return c.json({ message: 'EmailFlow Pro API is running!' })
})

export default app
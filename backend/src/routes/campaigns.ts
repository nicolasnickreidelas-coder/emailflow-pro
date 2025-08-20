import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { campaigns, users } from '../schema'
import { eq, and } from 'drizzle-orm'
import { authMiddleware } from '../middleware/auth'
import { z } from 'zod'

const campaignsRouter = new Hono<{
  Bindings: {
    DB: D1Database
    JWT_SECRET: string
  }
  Variables: {
    user: { id: string; email: string }
  }
}>()

campaignsRouter.use('*', authMiddleware)

const createCampaignSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  content: z.string().min(1),
  templateId: z.string().optional(),
  scheduledAt: z.string().optional()
})

// Get all campaigns for user
campaignsRouter.get('/', async (c) => {
  const db = drizzle(c.env.DB)
  const userId = c.get('user').id
  
  const userCampaigns = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.userId, userId))
    .orderBy(campaigns.createdAt)
  
  return c.json(userCampaigns)
})

// Create new campaign
campaignsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const data = createCampaignSchema.parse(body)
    const userId = c.get('user').id
    
    const db = drizzle(c.env.DB)
    const campaignId = crypto.randomUUID()
    
    await db.insert(campaigns).values({
      id: campaignId,
      userId,
      ...data,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      createdAt: new Date()
    })
    
    const campaign = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, campaignId))
      .get()
    
    return c.json(campaign, 201)
  } catch (error) {
    return c.json({ error: 'Invalid request' }, 400)
  }
})

// Get specific campaign
campaignsRouter.get('/:id', async (c) => {
  const campaignId = c.req.param('id')
  const userId = c.get('user').id
  
  const db = drizzle(c.env.DB)
  const campaign = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.id, campaignId), eq(campaigns.userId, userId)))
    .get()
  
  if (!campaign) {
    return c.json({ error: 'Campaign not found' }, 404)
  }
  
  return c.json(campaign)
})

// Update campaign
campaignsRouter.put('/:id', async (c) => {
  try {
    const campaignId = c.req.param('id')
    const userId = c.get('user').id
    const body = await c.req.json()
    
    const db = drizzle(c.env.DB)
    
    // Verify ownership
    const existingCampaign = await db
      .select()
      .from(campaigns)
      .where(and(eq(campaigns.id, campaignId), eq(campaigns.userId, userId)))
      .get()
    
    if (!existingCampaign) {
      return c.json({ error: 'Campaign not found' }, 404)
    }
    
    await db
      .update(campaigns)
      .set({
        ...body,
        updatedAt: new Date()
      })
      .where(eq(campaigns.id, campaignId))
    
    const updatedCampaign = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, campaignId))
      .get()
    
    return c.json(updatedCampaign)
  } catch (error) {
    return c.json({ error: 'Invalid request' }, 400)
  }
})

// Delete campaign
campaignsRouter.delete('/:id', async (c) => {
  const campaignId = c.req.param('id')
  const userId = c.get('user').id
  
  const db = drizzle(c.env.DB)
  
  // Verify ownership
  const campaign = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.id, campaignId), eq(campaigns.userId, userId)))
    .get()
  
  if (!campaign) {
    return c.json({ error: 'Campaign not found' }, 404)
  }
  
  await db.delete(campaigns).where(eq(campaigns.id, campaignId))
  
  return c.json({ message: 'Campaign deleted' })
})

export default campaignsRouter
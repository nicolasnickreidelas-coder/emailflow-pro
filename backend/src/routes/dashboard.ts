import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'

const dashboardRouter = new Hono()
dashboardRouter.use('*', authMiddleware)

dashboardRouter.get('/stats', (c) => {
  return c.json({
    totalCampaigns: 12,
    totalSubscribers: 1250,
    openRate: 24.5,
    revenue: 3450
  })
})

dashboardRouter.get('/chart-data', (c) => {
  return c.json([
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 }
  ])
})

export default dashboardRouter
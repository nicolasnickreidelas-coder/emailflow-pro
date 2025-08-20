import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'

const analyticsRouter = new Hono()
analyticsRouter.use('*', authMiddleware)

analyticsRouter.get('/', (c) => {
  return c.json({ message: 'Analytics data' })
})

export default analyticsRouter
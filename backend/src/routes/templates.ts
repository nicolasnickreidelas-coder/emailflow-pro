import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'

const templatesRouter = new Hono()
templatesRouter.use('*', authMiddleware)

templatesRouter.get('/', (c) => {
  return c.json([])
})

export default templatesRouter
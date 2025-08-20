import { verify } from 'hono/jwt'
import { createMiddleware } from 'hono/factory'

export const authMiddleware = createMiddleware<{
  Bindings: {
    JWT_SECRET: string
  }
  Variables: {
    user: { id: string; email: string }
  }
}>(async (c, next) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    c.set('user', {
      id: payload.sub as string,
      email: payload.email as string
    })
    
    await next()
  } catch (error) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
})
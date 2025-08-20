import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { z } from 'zod'
import Groq from 'groq-sdk'
import OpenAI from 'openai'

const aiRouter = new Hono<{
  Bindings: {
    GROQ_API_KEY: string
    OPENAI_API_KEY: string
    JWT_SECRET: string
  }
  Variables: {
    user: { id: string; email: string }
  }
}>()

aiRouter.use('*', authMiddleware)

const generateEmailSchema = z.object({
  prompt: z.string().min(10),
  tone: z.enum(['professional', 'casual', 'friendly', 'urgent']).default('professional'),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
  provider: z.enum(['groq', 'openai']).default('groq')
})

// Generate email content with AI
aiRouter.post('/generate-email', async (c) => {
  try {
    const body = await c.req.json()
    const { prompt, tone, length, provider } = generateEmailSchema.parse(body)
    
    const systemPrompt = `You are an expert email marketing copywriter. Generate compelling email content that:
- Matches the ${tone} tone
- Is ${length} in length
- Includes a subject line and body
- Is engaging and conversion-focused
- Follows email marketing best practices

Format your response as JSON with "subject" and "body" fields.`

    let generatedContent
    
    if (provider === 'groq') {
      const groq = new Groq({ apiKey: c.env.GROQ_API_KEY })
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        model: 'mixtral-8x7b-32768',
        temperature: 0.7,
        max_tokens: 1000
      })
      
      generatedContent = completion.choices[0]?.message?.content
    } else {
      const openai = new OpenAI({ apiKey: c.env.OPENAI_API_KEY })
      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1000
      })
      
      generatedContent = completion.choices[0]?.message?.content
    }
    
    if (!generatedContent) {
      throw new Error('No content generated')
    }
    
    // Try to parse as JSON, fallback to plain text
    let parsedContent
    try {
      parsedContent = JSON.parse(generatedContent)
    } catch {
      parsedContent = {
        subject: 'Generated Email',
        body: generatedContent
      }
    }
    
    return c.json(parsedContent)
  } catch (error) {
    console.error('AI generation error:', error)
    return c.json({ error: 'Failed to generate content' }, 500)
  }
})

// Generate subject lines
aiRouter.post('/generate-subjects', async (c) => {
  try {
    const body = await c.req.json()
    const { content, count = 5 } = body
    
    const groq = new Groq({ apiKey: c.env.GROQ_API_KEY })
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Generate ${count} compelling email subject lines for the given content. Make them engaging, click-worthy, and relevant. Return as a JSON array of strings.`
        },
        {
          role: 'user',
          content: `Email content: ${content}`
        }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.8,
      max_tokens: 200
    })
    
    const subjects = JSON.parse(completion.choices[0]?.message?.content || '[]')
    return c.json({ subjects })
  } catch (error) {
    return c.json({ error: 'Failed to generate subjects' }, 500)
  }
})

export default aiRouter
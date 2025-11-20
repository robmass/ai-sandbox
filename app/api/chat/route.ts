import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt, provider, model } = await request.json()

    if (!prompt || !provider || !model) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Select the appropriate provider and model
    let selectedModel
    switch (provider) {
      case 'openai':
        selectedModel = openai(model)
        break
      case 'anthropic':
        selectedModel = anthropic(model)
        break
      case 'google':
        selectedModel = google(model)
        break
      default:
        return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
    }

    // Generate the response
    const { text } = await generateText({
      model: selectedModel,
      prompt,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error('Error generating response:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate response',
      },
      { status: 500 }
    )
  }
}

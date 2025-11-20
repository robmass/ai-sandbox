'use client'

import { useState } from 'react'

type LLM = {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'google'
  model: string
}

const AVAILABLE_LLMS: LLM[] = [
  // OpenAI
  { id: 'openai-gpt-4o', name: 'GPT-4o', provider: 'openai', model: 'gpt-4o' },
  {
    id: 'openai-gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    model: 'gpt-4o-mini',
  },
  {
    id: 'openai-gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    model: 'gpt-4-turbo',
  },
  // Anthropic
  {
    id: 'anthropic-claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'anthropic',
    model: 'claude-3-7-sonnet-latest',
  },
  {
    id: 'anthropic-claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    model: 'claude-3-5-haiku-latest',
  },
  {
    id: 'anthropic-claude-4-opus',
    name: 'Claude 4 Opus',
    provider: 'anthropic',
    model: 'claude-opus-4-0',
  },
  // Google
  {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash',
    provider: 'google',
    model: 'gemini-2.5-flash-lite',
  },
  {
    id: 'google-gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'google',
    model: 'gemini-2.5-pro',
  },
]

type Response = {
  text: string
  loading: boolean
  error?: string
}

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [llm1Id, setLlm1Id] = useState(AVAILABLE_LLMS[0]?.id || '')
  const [llm2Id, setLlm2Id] = useState(AVAILABLE_LLMS[1]?.id || '')
  const [response1, setResponse1] = useState<Response>({
    text: '',
    loading: false,
  })
  const [response2, setResponse2] = useState<Response>({
    text: '',
    loading: false,
  })

  const getLLMById = (id: string) => AVAILABLE_LLMS.find((llm) => llm.id === id)

  const fetchResponse = async (
    llmId: string,
    setResponse: React.Dispatch<React.SetStateAction<Response>>
  ) => {
    const llm = getLLMById(llmId)
    if (!llm) return

    setResponse({ text: '', loading: true })

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          provider: llm.provider,
          model: llm.model,
        }),
      })

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`)
      }

      const data = await res.json()
      setResponse({ text: data.response, loading: false })
    } catch (error) {
      setResponse({
        text: '',
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    // Fetch both responses in parallel
    await Promise.all([
      fetchResponse(llm1Id, setResponse1),
      fetchResponse(llm2Id, setResponse2),
    ])
  }

  const isLoading = response1.loading || response2.loading
  const llm1 = getLLMById(llm1Id)
  const llm2 = getLLMById(llm2Id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 p-8 dark:from-zinc-900 dark:to-black">
      <main className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            AI Sandbox
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Compare responses from different AI models
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-800"
        >
          <div className="mb-4">
            <label
              htmlFor="prompt"
              className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              rows={6}
              required
            />
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="llm1"
                className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                LLM 1
              </label>
              <select
                id="llm1"
                value={llm1Id}
                onChange={(e) => setLlm1Id(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
              >
                {AVAILABLE_LLMS.map((llm) => (
                  <option key={llm.id} value={llm.id}>
                    {llm.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="llm2"
                className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                LLM 2
              </label>
              <select
                id="llm2"
                value={llm2Id}
                onChange={(e) => setLlm2Id(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
              >
                {AVAILABLE_LLMS.map((llm) => (
                  <option key={llm.id} value={llm.id}>
                    {llm.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isLoading ? 'Generating...' : 'Compare Responses'}
          </button>
        </form>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Response 1 */}
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-800">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {llm1?.name || 'LLM 1'}
            </h2>
            {response1.loading ? (
              <div className="flex items-center justify-center rounded-lg bg-zinc-50 p-8 dark:bg-zinc-900">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : response1.error ? (
              <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                Error: {response1.error}
              </div>
            ) : response1.text ? (
              <div className="rounded-lg bg-zinc-50 p-4 whitespace-pre-wrap text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                {response1.text}
              </div>
            ) : (
              <div className="rounded-lg bg-zinc-50 p-4 text-zinc-400 dark:bg-zinc-900">
                Response will appear here...
              </div>
            )}
          </div>

          {/* Response 2 */}
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-800">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {llm2?.name || 'LLM 2'}
            </h2>
            {response2.loading ? (
              <div className="flex items-center justify-center rounded-lg bg-zinc-50 p-8 dark:bg-zinc-900">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : response2.error ? (
              <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                Error: {response2.error}
              </div>
            ) : response2.text ? (
              <div className="rounded-lg bg-zinc-50 p-4 whitespace-pre-wrap text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                {response2.text}
              </div>
            ) : (
              <div className="rounded-lg bg-zinc-50 p-4 text-zinc-400 dark:bg-zinc-900">
                Response will appear here...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

// server/src/llm/index.js
import { OpenAIProvider } from './openai.js'

export const MODELS = [
  {
    id: 'qwen2.5:7b',
    name: 'Qwen 2.5 7B (本地)',
    provider: 'ollama',
    model: 'qwen2.5:7b',
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
    apiKey: 'ollama'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    model: 'gpt-4o',
    baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    apiKey: process.env.OPENAI_API_KEY
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    model: 'gpt-4o-mini',
    baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    apiKey: process.env.OPENAI_API_KEY
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'deepseek',
    model: 'deepseek-chat',
    baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
    apiKey: process.env.DEEPSEEK_API_KEY
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'deepseek',
    model: 'deepseek-coder',
    baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
    apiKey: process.env.DEEPSEEK_API_KEY
  }
]

const providers = {}

function getProvider(modelId) {
  const config = MODELS.find(m => m.id === modelId)
  if (!config) throw new Error(`Unknown model: ${modelId}`)

  const cacheKey = `${config.provider}:${config.model}`
  if (providers[cacheKey]) return providers[cacheKey]

  const provider = new OpenAIProvider({
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
    model: config.model
  })

  providers[cacheKey] = provider
  return provider
}

export { getProvider }

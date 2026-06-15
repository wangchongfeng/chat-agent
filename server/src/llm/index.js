// server/src/llm/index.js
import { OpenAIProvider } from './openai.js'
import { AnthropicProvider } from './anthropic.js'

export const MODELS = {
  'openai-gpt4': {
    name: 'GPT-4',
    provider: 'openai',
    model: 'gpt-4'
  },
  'openai-gpt35': {
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    model: 'gpt-3.5-turbo'
  },
  'anthropic-claude3': {
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    model: 'claude-3-sonnet-20240229'
  }
}

const providers = {}

function getProvider(modelId) {
  const config = MODELS[modelId]
  if (!config) throw new Error(`Unknown model: ${modelId}`)

  const cacheKey = `${config.provider}:${config.model}`
  if (providers[cacheKey]) return providers[cacheKey]

  let provider
  if (config.provider === 'openai') {
    provider = new OpenAIProvider({
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
      model: config.model
    })
  } else if (config.provider === 'anthropic') {
    provider = new AnthropicProvider({
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: config.model
    })
  } else {
    throw new Error(`Unknown provider: ${config.provider}`)
  }

  providers[cacheKey] = provider
  return provider
}

export { getProvider }

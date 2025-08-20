import { Provider } from './types'
import { AudioPenProvider } from './AudioPenProvider'
import { VoiceNotesProvider } from './VoiceNotesProvider'
import { AlfieProvider } from './AlfieProvider'

/**
 * Registry for all available providers
 */
export class ProviderRegistry {
  private static providers: Provider[] = [
    new AudioPenProvider(),
    new VoiceNotesProvider(),
    new AlfieProvider(),
  ]
  
  /**
   * Find the first provider that can handle the given payload
   */
  static findProvider(payload: unknown): Provider | null {
    for (const provider of this.providers) {
      if (provider.canHandle(payload)) {
        return provider
      }
    }
    return null
  }
  
  /**
   * Get a provider by name
   */
  static getProvider(name: string): Provider | null {
    return this.providers.find(p => p.name === name) || null
  }
  
  /**
   * Get all registered providers
   */
  static getAllProviders(): Provider[] {
    return [...this.providers]
  }
  
  /**
   * Register a new provider
   */
  static registerProvider(provider: Provider): void {
    // Remove existing provider with same name if exists
    this.providers = this.providers.filter(p => p.name !== provider.name)
    this.providers.push(provider)
  }
}

// Export types and providers for direct use if needed
export * from './types'
export { BaseProvider } from './BaseProvider'
export { AudioPenProvider } from './AudioPenProvider'
export { VoiceNotesProvider } from './VoiceNotesProvider'
export { AlfieProvider } from './AlfieProvider'
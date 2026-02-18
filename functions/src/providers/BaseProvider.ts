import { Provider, BufferData } from './types'

/**
 * Base provider class with shared utility methods
 */
export abstract class BaseProvider implements Provider {
  abstract name: string
  abstract canHandle(payload: unknown): boolean
  abstract transform(payload: unknown): BufferData
  abstract validate(payload: unknown): boolean
  
  /**
   * Parse tags from various formats
   * @param tags - Can be string (comma-separated), array, or undefined
   */
  protected parseTags(tags: unknown): string[] {
    if (!tags) return []
    
    if (typeof tags === 'string') {
      return tags.split(',').map(tag => tag.trim()).filter(Boolean)
    }
    
    if (Array.isArray(tags)) {
      return tags.map(tag => String(tag).trim()).filter(Boolean)
    }
    
    return []
  }
  
  /**
   * Get current ISO timestamp
   */
  protected getCurrentTimestamp(): string {
    return new Date().toISOString()
  }
  
  /**
   * Safely get a string value from an object
   */
  protected getString(obj: Record<string, unknown>, path: string, defaultValue = ''): string {
    const keys = path.split('.')
    let result: unknown = obj

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = (result as Record<string, unknown>)[key]
      } else {
        return defaultValue
      }
    }

    if (typeof result === 'string') {
      return result || defaultValue
    }
    if (typeof result === 'number' || typeof result === 'boolean') {
      return String(result)
    }
    return defaultValue
  }

  /**
   * Check if an object has all required fields
   */
  protected hasRequiredFields(obj: unknown, fields: string[]): boolean {
    if (!obj || typeof obj !== 'object') return false

    for (const field of fields) {
      const keys = field.split('.')
      let current: unknown = obj

      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = (current as Record<string, unknown>)[key]
        } else {
          return false
        }
      }
      if (current === undefined || current === null) return false
    }

    return true
  }
}
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
  protected getString(obj: any, path: string, defaultValue = ''): string {
    const keys = path.split('.')
    let result = obj
    
    for (const key of keys) {
      result = result?.[key]
      if (result === undefined) return defaultValue
    }
    
    return String(result || defaultValue)
  }
  
  /**
   * Check if an object has all required fields
   */
  protected hasRequiredFields(obj: any, fields: string[]): boolean {
    if (!obj || typeof obj !== 'object') return false
    
    for (const field of fields) {
      const keys = field.split('.')
      let current = obj
      
      for (const key of keys) {
        current = current?.[key]
        if (current === undefined || current === null) return false
      }
    }
    
    return true
  }
}
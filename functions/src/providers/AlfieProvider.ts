import { BaseProvider } from './BaseProvider'
import { BufferData, AlfiePayload } from './types'

export class AlfieProvider extends BaseProvider {
  name = 'alfie'
  
  canHandle(payload: unknown): boolean {
    const p = payload as AlfiePayload
    // Alfie has reflection_id and content
    return !!(
      p?.reflection_id &&
      p?.content &&
      p?.metadata // Alfie always has metadata object
    )
  }
  
  validate(payload: unknown): boolean {
    return this.hasRequiredFields(payload, [
      'reflection_id',
      'content',
      'created_at',
    ])
  }
  
  transform(payload: unknown): BufferData {
    const p = payload as AlfiePayload
    
    // Generate tags from metadata
    const tags = this.generateAlfieKeys(p.metadata)
    
    // Generate title if not provided
    const title = p.title || this.generateTitle(p.metadata)
    
    return {
      platform: this.name,
      id: p.reflection_id,
      title,
      content: p.content,
      orig_transcript: p.content, // Alfie doesn't separate transcript from content
      tags,
      date_created: p.created_at,
      timestamp: p.metadata?.timestamp || p.created_at,
      metadata: p.metadata, // Preserve full metadata for templates
    }
  }
  
  /**
   * Generate tags from Alfie metadata
   * Maps all conversation context fields to tags
   */
  private generateAlfieKeys(metadata: AlfiePayload['metadata']): string[] {
    const tags: string[] = []
    
    // Add message type if present
    if (metadata?.messageType) {
      tags.push(`type/${metadata.messageType}`)
    }
    
    // Process conversation context
    const context = metadata?.conversationContext
    if (context) {
      if (context.mood) {
        tags.push(`mood/${context.mood}`)
      }
      if (context.needs) {
        tags.push(`needs/${context.needs}`)
      }
      if (context.energy !== undefined) {
        tags.push(`energy/${context.energy}`)
      }
      if (context.location) {
        tags.push(`location/${context.location}`)
      }
      if (context.timeOfDay) {
        tags.push(`time/${context.timeOfDay}`)
      }
      if (context.timeAvailable) {
        tags.push(`duration/${context.timeAvailable}`)
      }
    }
    
    // Add platform tag
    tags.push('alfie')
    
    return tags
  }
  
  /**
   * Generate a title from metadata if none provided
   */
  private generateTitle(metadata: AlfiePayload['metadata']): string {
    const context = metadata?.conversationContext
    
    if (context?.mood && context?.needs) {
      return `${context.mood} - ${context.needs}`
    }
    
    if (context?.mood) {
      return `Reflection - ${context.mood}`
    }
    
    if (metadata?.messageType) {
      return `${metadata.messageType} reflection`
    }
    
    return 'Alfie Reflection'
  }
}
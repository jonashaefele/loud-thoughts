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
   * Supports both flat structure (new) and nested conversationContext (legacy)
   */
  private generateAlfieKeys(metadata: AlfiePayload['metadata']): string[] {
    const tags: string[] = []

    // Add message type if present
    if (metadata?.messageType) {
      tags.push(`type/${metadata.messageType}`)
    }

    // Add daily review type tag if present
    if (metadata?.type === 'daily-review') {
      tags.push('type/daily-review')
    }

    // Support both flat (new) and nested (legacy) structures
    const flatMood = metadata?.mood
    const flatNeeds = metadata?.needs
    const flatEnergy = metadata?.energy
    const context = metadata?.conversationContext

    // Prefer flat structure, fall back to nested
    const mood = flatMood || context?.mood
    const needs = flatNeeds || context?.needs
    const energy = flatEnergy || context?.energy?.toString()

    if (mood) {
      tags.push(`mood/${mood}`)
    }
    if (needs) {
      tags.push(`needs/${needs}`)
    }
    if (energy !== undefined) {
      tags.push(`energy/${energy}`)
    }

    // Legacy nested-only fields
    if (context?.location) {
      tags.push(`location/${context.location}`)
    }
    if (context?.timeOfDay) {
      tags.push(`time/${context.timeOfDay}`)
    }
    if (context?.timeAvailable) {
      tags.push(`duration/${context.timeAvailable}`)
    }

    // Add ritual context if present
    if (metadata?.ritualContext) {
      tags.push(`ritual/${metadata.ritualContext}`)
    }

    // Add platform tag
    tags.push('alfie')

    return tags
  }
  
  /**
   * Generate a title from metadata if none provided
   * Supports both flat (new) and nested (legacy) structures
   */
  private generateTitle(metadata: AlfiePayload['metadata']): string {
    // Support both flat and nested structures
    const mood = metadata?.mood || metadata?.conversationContext?.mood
    const needs = metadata?.needs || metadata?.conversationContext?.needs

    if (mood && needs) {
      return `${mood} - ${needs}`
    }

    if (mood) {
      return `Reflection - ${mood}`
    }

    if (metadata?.messageType) {
      return `${metadata.messageType} reflection`
    }

    if (metadata?.type === 'daily-review') {
      return 'Daily Review'
    }

    return 'Alfie Reflection'
  }
}
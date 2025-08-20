/**
 * Core types for the provider system
 */

/**
 * Standardized buffer data format that all providers must transform to
 */
export interface BufferData {
  platform: string
  id: string
  title: string
  content: string
  orig_transcript?: string
  tags?: string[]
  date_created: string
  timestamp?: string
  metadata?: Record<string, unknown> // For provider-specific data like Alfie's context
}

/**
 * Interface that all providers must implement
 */
export interface Provider {
  /** Provider name (e.g., 'audiopen', 'voicenotes', 'alfie') */
  name: string
  
  /** Check if this provider can handle the given payload */
  canHandle(payload: unknown): boolean
  
  /** Transform provider-specific payload to standardized BufferData */
  transform(payload: unknown): BufferData
  
  /** Validate that the payload has all required fields */
  validate(payload: unknown): boolean
}

/**
 * AudioPen webhook payload
 */
export interface AudioPenPayload {
  id: string
  title?: string
  body: string
  orig_transcript: string
  tags?: string
  date_created?: string
}

/**
 * VoiceNotes webhook payload
 */
export interface VoiceNotesPayload {
  data: {
    id: string
    title: string
    transcript: string
    summary?: string
  }
  timestamp?: string
}

/**
 * Alfie webhook payload
 */
export interface AlfiePayload {
  reflection_id: string
  user_id: string
  content: string
  title?: string
  metadata: {
    timestamp?: string
    messageType?: string
    conversationContext?: {
      mood?: string
      needs?: string
      energy?: number
      location?: string
      timeOfDay?: string
      timeAvailable?: string
    }
  }
  created_at: string
  updated_at: string
}
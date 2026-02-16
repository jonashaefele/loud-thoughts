/**
 * Todo item structure from Alfie daily reviews
 */
export interface TodoItem {
  label: string
  dueDate: string | null // ISO date e.g. "2026-02-12"
}

/**
 * Captured content from daily reviews
 */
export interface DailyReviewCaptured {
  bodyState?: string
  intense?: string[]
  reflections?: string[]
  tomorrow?: string[]
  letGo?: string[]
}

/**
 * Alfie-specific metadata structure
 */
export interface AlfieMetadata {
  // Standard reflection context
  mood?: 'calm' | 'anxious' | 'happy' | 'sad' | 'stressed' | 'excited' | 'overwhelmed' | 'neutral'
  needs?: 'focus' | 'relax' | 'process' | 'motivate' | 'cope' | 'routine' | 'creative' | 'social'
  energy?: string // "1" | "2" | "3"

  // Legacy nested structure (for backwards compatibility)
  conversationContext?: {
    mood?: string
    needs?: string
    energy?: number
    location?: string
    timeOfDay?: string
    timeAvailable?: string
  }

  // Daily review specific (when type === "daily-review")
  type?: 'daily-review' | 'chat'
  reflectionDate?: string // YYYY-MM-DD in user's local timezone, for saving to correct daily note
  oneLiner?: string // Summary of the day, e.g., "I met Emma in person for the first time"
  todos?: TodoItem[]
  captured?: DailyReviewCaptured
  ritualContext?: 'wind-down' | 'process' | 'ground' | null
  timestamp?: string
  messageType?: string
}

export interface BufferItemData {
  id: string
  title: string
  content: string
  orig_transcript?: string
  tags: string[]
  date_created?: string
  timestamp?: string
  platform: 'voicenotes' | 'audiopen' | 'alfie'
  metadata?: AlfieMetadata | Record<string, unknown> // Provider-specific data
}

export interface BufferItem {
  id: string
  exp: Date
  data: BufferItemData
}

export type NewLineType = 'windows' | 'unixMac' | undefined

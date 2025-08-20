export interface BufferItemData {
  id: string
  title: string
  content: string
  orig_transcript?: string
  tags: string[]
  date_created?: string
  timestamp?: string
  platform: 'voicenotes' | 'audiopen' | 'alfie'
  metadata?: Record<string, unknown> // For provider-specific data
}

export interface BufferItem {
  id: string
  exp: Date
  data: BufferItemData
}

export type NewLineType = 'windows' | 'unixMac' | undefined

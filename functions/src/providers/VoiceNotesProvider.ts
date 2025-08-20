import { BaseProvider } from './BaseProvider'
import { BufferData, VoiceNotesPayload } from './types'

export class VoiceNotesProvider extends BaseProvider {
  name = 'voicenotes'
  
  canHandle(payload: unknown): boolean {
    const p = payload as any
    // VoiceNotes has a data wrapper with specific fields
    return !!(
      p?.data?.id &&
      p?.data?.title &&
      p?.data?.transcript
    )
  }
  
  validate(payload: unknown): boolean {
    return this.hasRequiredFields(payload, [
      'data.id',
      'data.title',
      'data.transcript',
    ])
  }
  
  transform(payload: unknown): BufferData {
    const p = payload as VoiceNotesPayload
    
    return {
      platform: this.name,
      id: p.data.id,
      title: p.data.title,
      content: p.data.summary || p.data.transcript, // Use summary if available, else transcript
      orig_transcript: p.data.transcript,
      tags: [], // VoiceNotes doesn't send tags
      date_created: p.timestamp || this.getCurrentTimestamp(),
      timestamp: p.timestamp,
    }
  }
}
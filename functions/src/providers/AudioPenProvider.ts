import { BaseProvider } from './BaseProvider'
import { BufferData, AudioPenPayload } from './types'

export class AudioPenProvider extends BaseProvider {
  name = 'audiopen'
  
  canHandle(payload: unknown): boolean {
    const p = payload as any
    // AudioPen has these specific fields at root level
    return !!(
      p?.id && 
      (p?.body || p?.orig_transcript) &&
      !p?.data && // VoiceNotes has data wrapper
      !p?.reflection_id // Alfie has reflection_id
    )
  }
  
  validate(payload: unknown): boolean {
    return this.hasRequiredFields(payload, ['id']) &&
           (this.hasRequiredFields(payload, ['body']) || 
            this.hasRequiredFields(payload, ['orig_transcript']))
  }
  
  transform(payload: unknown): BufferData {
    const p = payload as AudioPenPayload
    
    return {
      platform: this.name,
      id: p.id,
      title: p.title || '',
      content: p.body || '',
      orig_transcript: p.orig_transcript || '',
      tags: this.parseTags(p.tags),
      date_created: p.date_created || this.getCurrentTimestamp(),
    }
  }
}
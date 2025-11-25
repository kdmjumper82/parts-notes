export interface VoiceMark {
  id: string;
  timestamp: number;
  note: string;
}

export interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
  isHighlight?: boolean;
}

export interface Note {
  id: string;
  title: string;
  createdAt: number;
  duration: number;
  audioUrl?: string;
  transcript: TranscriptSegment[];
  voiceMarks: VoiceMark[];
  summary?: string;
  actionItems?: string[];
  template?: string;
}

export interface Template {
  id: string;
  name: string;
  sections: string[];
}

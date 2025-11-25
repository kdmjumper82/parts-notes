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

export interface DetailedSummary {
  summary: string;
  outline: string[];
  keyInformation: string[];
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
  detailedSummary?: DetailedSummary;
  actionItems?: string[];
  template?: string;
}

export type AIEngine = 'chatgpt-4o' | 'claude-3.5';

export type MeetingTemplate =
  | 'General Meeting'
  | 'Team Meeting'
  | 'Client Meeting'
  | 'One-on-One Meeting'
  | 'Project Kickoff Meeting'
  | 'Retrospective Meeting';

export interface Template {
  id: string;
  name: string;
  sections: string[];
}

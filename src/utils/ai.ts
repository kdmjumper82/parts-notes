import { TranscriptSegment, VoiceMark, Template } from '../types'

const SAMPLE_TEXTS = [
  "Let's start by discussing the quarterly results and performance metrics.",
  "The main focus for this quarter should be on customer acquisition and retention.",
  "We need to ensure that all team members are aligned with our strategic goals.",
  "I think we should consider implementing a new approach to project management.",
  "The data shows a significant improvement in user engagement over the past month.",
  "It's important that we document all decisions and action items from this meeting.",
  "We should schedule a follow-up meeting to review progress on these initiatives.",
  "The feedback from our users has been overwhelmingly positive.",
  "There are a few technical challenges that we need to address before launch.",
  "Let's make sure everyone has the resources they need to complete their tasks."
]

export function generateTranscript(duration: number, voiceMarks: VoiceMark[]): TranscriptSegment[] {
  const segments: TranscriptSegment[] = []
  const segmentDuration = 8
  const numSegments = Math.ceil(duration / segmentDuration)

  const voiceMarkTimes = new Set(voiceMarks.map(vm => Math.floor(vm.timestamp / segmentDuration)))

  for (let i = 0; i < numSegments; i++) {
    const startTime = i * segmentDuration
    const endTime = Math.min((i + 1) * segmentDuration, duration)
    const isHighlight = voiceMarkTimes.has(i)

    segments.push({
      id: `segment-${i}`,
      startTime,
      endTime,
      text: SAMPLE_TEXTS[i % SAMPLE_TEXTS.length],
      speaker: i % 3 === 0 ? 'Speaker 1' : 'Speaker 2',
      isHighlight
    })
  }

  return segments
}

export function generateSummary(_transcript: TranscriptSegment[], template: Template | null): {
  summary: string
  actionItems: string[]
} {
  const summary = template
    ? `This ${template.name.toLowerCase()} covered several important topics. The discussion included key points about project progress, team alignment, and strategic planning. Participants shared valuable insights and identified areas for improvement.`
    : "This recording captured an important discussion with valuable insights and key decisions. The conversation covered main topics thoroughly and identified several action items for follow-up."

  const actionItems = [
    "Schedule follow-up meeting to review progress",
    "Share meeting notes with all participants",
    "Complete assigned tasks before next review",
    "Gather additional data for next discussion"
  ]

  return { summary, actionItems }
}

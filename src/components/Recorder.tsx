import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Bookmark, Sparkles, X, Save } from 'lucide-react'
import { Note, VoiceMark, TranscriptSegment, Template } from '../types'
import { generateTranscript, generateSummary } from '../utils/ai'
import TemplateSelector from './TemplateSelector'

interface RecorderProps {
  onSave: (note: Note) => void
  onCancel: () => void
}

export default function Recorder({ onSave, onCancel }: RecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [voiceMarks, setVoiceMarks] = useState<VoiceMark[]>([])
  const [currentMarkNote, setCurrentMarkNote] = useState('')
  const [showMarkDialog, setShowMarkDialog] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string>()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number>()
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      startTimeRef.current = Date.now() - recordingTime * 1000

      timerRef.current = window.setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please grant permission and try again.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const addVoiceMark = () => {
    setShowMarkDialog(true)
  }

  const saveVoiceMark = () => {
    if (currentMarkNote.trim()) {
      const mark: VoiceMark = {
        id: Date.now().toString(),
        timestamp: recordingTime,
        note: currentMarkNote
      }
      setVoiceMarks(prev => [...prev, mark])
      setCurrentMarkNote('')
    }
    setShowMarkDialog(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSave = async () => {
    if (!audioUrl) return

    setIsProcessing(true)

    const transcript: TranscriptSegment[] = generateTranscript(recordingTime, voiceMarks)
    const summary = generateSummary(transcript, selectedTemplate)

    const note: Note = {
      id: Date.now().toString(),
      title: `Recording ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      createdAt: Date.now(),
      duration: recordingTime,
      audioUrl,
      transcript,
      voiceMarks,
      summary: summary.summary,
      actionItems: summary.actionItems,
      template: selectedTemplate?.name
    }

    setTimeout(() => {
      setIsProcessing(false)
      onSave(note)
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-pink-500 mb-4">
            {isRecording ? (
              <div className="w-8 h-8 bg-white rounded animate-pulse" />
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
          </div>
          <div className="text-5xl font-bold text-white mb-2">
            {formatTime(recordingTime)}
          </div>
          <p className="text-slate-400">
            {isRecording ? 'Recording in progress...' : audioUrl ? 'Recording complete' : 'Ready to record'}
          </p>
        </div>

        <div className="flex gap-4 justify-center mb-8">
          {!isRecording && !audioUrl && (
            <button
              onClick={startRecording}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all flex items-center gap-2 shadow-lg"
            >
              <Mic className="w-5 h-5" />
              Start Recording
            </button>
          )}

          {isRecording && (
            <>
              <button
                onClick={addVoiceMark}
                className="px-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                <Bookmark className="w-5 h-5" />
                Add VoiceMark
              </button>
              <button
                onClick={stopRecording}
                className="px-8 py-4 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-600 transition-all flex items-center gap-2"
              >
                <Square className="w-5 h-5" />
                Stop
              </button>
            </>
          )}

          {audioUrl && !isProcessing && (
            <>
              <button
                onClick={handleSave}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2 shadow-lg"
              >
                <Save className="w-5 h-5" />
                Save Note
              </button>
              <button
                onClick={onCancel}
                className="px-8 py-4 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-600 transition-all flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </>
          )}
        </div>

        {audioUrl && !isProcessing && (
          <div className="mb-6">
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
          </div>
        )}

        {voiceMarks.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-indigo-400" />
              VoiceMarks ({voiceMarks.length})
            </h3>
            <div className="space-y-2">
              {voiceMarks.map(mark => (
                <div
                  key={mark.id}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-indigo-400 font-mono text-sm mb-1">
                        {formatTime(mark.timestamp)}
                      </div>
                      <div className="text-slate-200">{mark.note}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-indigo-600/20 border border-indigo-500/50 rounded-xl">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
              <span className="text-white font-medium">
                AI is processing your recording...
              </span>
            </div>
          </div>
        )}
      </div>

      {showMarkDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Add VoiceMark</h3>
            <p className="text-slate-400 mb-4">
              Add a note at {formatTime(recordingTime)}
            </p>
            <textarea
              value={currentMarkNote}
              onChange={(e) => setCurrentMarkNote(e.target.value)}
              placeholder="What's important about this moment?"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 min-h-[100px]"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={saveVoiceMark}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all"
              >
                Save Mark
              </button>
              <button
                onClick={() => {
                  setShowMarkDialog(false)
                  setCurrentMarkNote('')
                }}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Download, Play, Pause, Bookmark, FileText, CheckSquare, Edit2, Save, X } from 'lucide-react'
import { Note } from '../types'
import { exportToPDF, exportToTXT, exportToCSV } from '../utils/export'

interface NoteViewerProps {
  note: Note
  onBack: () => void
  onUpdate: (note: Note) => void
}

export default function NoteViewer({ note, onBack, onUpdate }: NoteViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(note.title)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const seekTo = (time: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = time
    setCurrentTime(time)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const saveTitle = () => {
    if (editedTitle.trim()) {
      onUpdate({ ...note, title: editedTitle.trim() })
    }
    setIsEditingTitle(false)
  }

  const handleExport = (format: 'pdf' | 'txt' | 'csv') => {
    switch (format) {
      case 'pdf':
        exportToPDF(note)
        break
      case 'txt':
        exportToTXT(note)
        break
      case 'csv':
        exportToCSV(note)
        break
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Notes
        </button>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-8 border-b border-slate-700">
          <div className="flex items-start justify-between mb-4">
            {isEditingTitle ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
                <button
                  onClick={saveTitle}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setEditedTitle(note.title)
                    setIsEditingTitle(false)
                  }}
                  className="p-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">{note.title}</h1>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('pdf')}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={() => handleExport('txt')}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                TXT
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div>Duration: {formatTime(note.duration)}</div>
            <div>•</div>
            <div>{new Date(note.createdAt).toLocaleString()}</div>
            {note.template && (
              <>
                <div>•</div>
                <div className="px-2 py-1 bg-indigo-600/20 border border-indigo-500/50 rounded text-indigo-400 text-xs">
                  {note.template}
                </div>
              </>
            )}
          </div>
        </div>

        {note.audioUrl && (
          <div className="p-6 bg-slate-800/80 border-b border-slate-700">
            <audio ref={audioRef} src={note.audioUrl} />
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlayPause}
                className="w-12 h-12 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-1" />
                )}
              </button>
              <div className="flex-1">
                <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${(currentTime / note.duration) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(note.duration)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {note.summary && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Summary
                  </h2>
                  <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                    <p className="text-slate-200 leading-relaxed">{note.summary}</p>
                  </div>
                </div>
              )}

              {note.actionItems && note.actionItems.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-green-400" />
                    Action Items
                  </h2>
                  <div className="space-y-2">
                    {note.actionItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 flex items-start gap-3"
                      >
                        <div className="w-5 h-5 rounded border-2 border-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-200">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Transcript
                </h2>
                <div className="space-y-3">
                  {note.transcript.map(segment => (
                    <div
                      key={segment.id}
                      onClick={() => seekTo(segment.startTime)}
                      className={`bg-slate-700/50 rounded-lg p-4 border cursor-pointer transition-all ${
                        segment.isHighlight
                          ? 'border-indigo-500 bg-indigo-600/10'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-indigo-400">
                          {formatTime(segment.startTime)}
                        </span>
                        {segment.speaker && (
                          <span className="text-xs text-slate-500">
                            {segment.speaker}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-200">{segment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {note.voiceMarks.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-indigo-400" />
                  VoiceMarks
                </h2>
                <div className="space-y-3">
                  {note.voiceMarks.map(mark => (
                    <div
                      key={mark.id}
                      onClick={() => seekTo(mark.timestamp)}
                      className="bg-indigo-600/10 rounded-lg p-4 border border-indigo-500/50 cursor-pointer hover:bg-indigo-600/20 transition-all"
                    >
                      <div className="text-sm font-mono text-indigo-400 mb-2">
                        {formatTime(mark.timestamp)}
                      </div>
                      <p className="text-slate-200 text-sm">{mark.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

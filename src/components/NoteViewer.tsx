import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Download, Play, Pause, Bookmark, FileText, CheckSquare, Edit2, Save, X, Sparkles } from 'lucide-react'
import { Note, AIEngine, MeetingTemplate } from '../types'
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
  const [selectedAIEngine, setSelectedAIEngine] = useState<AIEngine>('chatgpt-4o')
  const [selectedTemplate, setSelectedTemplate] = useState<MeetingTemplate>('General Meeting')
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
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

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true)

    // Simulate AI summary generation
    // In a real implementation, this would call an AI API
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const mockDetailedSummary = {
        summary: `The meeting covered the success of DRX 9000 decompression therapy, plans to hire new Customer Service Representatives (CSRs) by the end of February, and updates on system implementations and improvements. Discussions included enhancing client engagement, particularly in the dental sector, refining internal processes, and addressing specific client issues. Creative content planning and adjustments to training operations were also highlighted.`,
        outline: [
          'Therapy Success Testimonial - Speaker 1 shared personal success with DRX 9000 decompression therapy, highlighting significant pain relief and lifestyle improvements.',
          'Client Engagement and Therapy Benefits - Discussion on the importance of helping clients regain quality of life. Emphasis on the role of service providers in improving clients\' well-being.',
          'Hiring and System Expansion Plans - February marked as a crucial month for hiring new CSRs. Plans to increase sales call capacity from six to potentially 30 calls per week. Rebuilding and redeveloping internal and external processes for efficiency.',
          'Client System and Calendar Updates - Rolling out new client systems and calendars for scheduling appointments. Introduction of a general calendar for streamlined booking across different time zones.',
          'Internal Process Improvements - Implementation of notes integration with Slack and other internal systems. Adjustments to call abandonment policies to enhance client service.',
          'Creative Content and Training Enhancements - Development of new training systems to onboard CSR efficiently. Focus on creating consistent and simple training materials to expedite learning.',
          'Client Management and Performance Monitoring - Review of current client statuses, lead generation, and scheduling effectiveness. Specific client feedback and performance metrics discussed for improvement.'
        ],
        keyInformation: [
          'Therapy success with DRX 9000 mentioned to occur within two weeks to two months.',
          'February is a key month for hiring and system rollout.',
          'Calendar updates to include time slots from 7 a.m. to 8 p.m. in 15-minute increments.',
          'Issues with client payment and scheduling systems noted.'
        ]
      }

      onUpdate({
        ...note,
        detailedSummary: mockDetailedSummary
      })
    } catch (error) {
      console.error('Error generating summary:', error)
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const meetingTemplates: { value: MeetingTemplate; label: string; icon: string }[] = [
    { value: 'General Meeting', label: 'General Meeting', icon: '💬' },
    { value: 'Team Meeting', label: 'Team Meeting', icon: '🫱' },
    { value: 'Client Meeting', label: 'Client Meeting', icon: '💼' },
    { value: 'One-on-One Meeting', label: 'One-on-One Meeting', icon: '👥' },
    { value: 'Project Kickoff Meeting', label: 'Project Kickoff Meeting', icon: '🚀' },
    { value: 'Retrospective Meeting', label: 'Retrospective Meeting', icon: '🔄' },
  ]

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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

            {/* Summary Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
                  {!note.detailedSummary ? (
                    <>
                      <h3 className="text-lg text-slate-300 mb-6">
                        You can customize your own summary
                      </h3>

                      {/* AI Engine Selection */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-slate-400 mb-3">AI Engine:</h4>
                        <div className="space-y-2">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="ai-engine"
                              value="chatgpt-4o"
                              checked={selectedAIEngine === 'chatgpt-4o'}
                              onChange={(e) => setSelectedAIEngine(e.target.value as AIEngine)}
                              className="w-4 h-4 text-indigo-600"
                            />
                            <span className="flex items-center gap-2 text-slate-300">
                              <span className="text-lg">🤖</span>
                              ChatGPT-4o
                            </span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="ai-engine"
                              value="claude-3.5"
                              checked={selectedAIEngine === 'claude-3.5'}
                              onChange={(e) => setSelectedAIEngine(e.target.value as AIEngine)}
                              className="w-4 h-4 text-indigo-600"
                            />
                            <span className="flex items-center gap-2 text-slate-300">
                              <span className="text-lg">🔆</span>
                              ClaudeAI-3.5
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Template Selection */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-slate-400 mb-3">Template:</h4>
                        <div className="space-y-2">
                          {meetingTemplates.map((template) => (
                            <label key={template.value} className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="radio"
                                name="template"
                                value={template.value}
                                checked={selectedTemplate === template.value}
                                onChange={(e) => setSelectedTemplate(e.target.value as MeetingTemplate)}
                                className="w-4 h-4 text-indigo-600"
                              />
                              <span className="flex items-center gap-2 text-slate-300 text-sm">
                                <span>{template.icon}</span>
                                {template.label}
                              </span>
                              <button className="ml-auto text-slate-500 hover:text-slate-300">
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Generate Button */}
                      <button
                        onClick={handleGenerateSummary}
                        disabled={isGeneratingSummary}
                        className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingSummary ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Start to summarize
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Generated Summary Display */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">Summary</h3>
                          <button
                            onClick={() => onUpdate({ ...note, detailedSummary: undefined })}
                            className="text-sm text-slate-400 hover:text-white"
                          >
                            Regenerate
                          </button>
                        </div>

                        {/* Summary Section */}
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2">Summary:</h4>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {note.detailedSummary.summary}
                          </p>
                        </div>

                        {/* Outline Section */}
                        {note.detailedSummary.outline.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-2">Outline:</h4>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
                              {note.detailedSummary.outline.map((item, idx) => (
                                <li key={idx} className="leading-relaxed">
                                  {item}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Key Information Section */}
                        {note.detailedSummary.keyInformation.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-2">Key Information:</h4>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
                              {note.detailedSummary.keyInformation.map((item, idx) => (
                                <li key={idx} className="leading-relaxed">
                                  {item}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

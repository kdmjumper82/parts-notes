import { Clock, Trash2, FileText } from 'lucide-react'
import { Note } from '../types'

interface NotesListProps {
  notes: Note[]
  onSelectNote: (note: Note) => void
  onDeleteNote: (id: string) => void
}

export default function NotesList({ notes, onSelectNote, onDeleteNote }: NotesListProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 mb-4">
          <FileText className="w-10 h-10 text-slate-600" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No notes yet</h3>
        <p className="text-slate-400 mb-6">Start recording to create your first note</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map(note => (
        <div
          key={note.id}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all cursor-pointer group"
          onClick={() => onSelectNote(note)}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-white flex-1 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                {note.title}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm('Are you sure you want to delete this note?')) {
                    onDeleteNote(note.id)
                  }
                }}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(note.duration)}
              </div>
              <div>{formatDate(note.createdAt)}</div>
            </div>

            {note.summary && (
              <p className="text-slate-300 text-sm line-clamp-3 mb-4">
                {note.summary}
              </p>
            )}

            {note.template && (
              <div className="inline-block px-3 py-1 bg-indigo-600/20 border border-indigo-500/50 rounded-full text-indigo-400 text-xs font-medium">
                {note.template}
              </div>
            )}

            {note.voiceMarks.length > 0 && (
              <div className="mt-3 text-xs text-slate-500">
                {note.voiceMarks.length} VoiceMark{note.voiceMarks.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

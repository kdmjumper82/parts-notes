import { useState, useEffect } from 'react'
import { FileText, Mic } from 'lucide-react'
import Recorder from './components/Recorder'
import NotesList from './components/NotesList'
import NoteViewer from './components/NoteViewer'
import { Note } from './types'

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [currentView, setCurrentView] = useState<'list' | 'record' | 'view'>('list')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  useEffect(() => {
    const savedNotes = localStorage.getItem('hinotes-notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('hinotes-notes', JSON.stringify(notes))
  }, [notes])

  const handleSaveNote = (note: Note) => {
    setNotes(prev => [note, ...prev])
    setCurrentView('list')
  }

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note)
    setCurrentView('view')
  }

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    if (selectedNote?.id === id) {
      setSelectedNote(null)
      setCurrentView('list')
    }
  }

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n))
    setSelectedNote(updatedNote)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">HiNotes</h1>
                <p className="text-purple-300 text-sm">AI-Powered Note Taking</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentView('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentView === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                My Notes
              </button>
              <button
                onClick={() => setCurrentView('record')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentView === 'record'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Mic className="w-4 h-4" />
                New Recording
              </button>
            </div>
          </div>
        </header>

        <main>
          {currentView === 'list' && (
            <NotesList
              notes={notes}
              onSelectNote={handleSelectNote}
              onDeleteNote={handleDeleteNote}
            />
          )}
          {currentView === 'record' && (
            <Recorder onSave={handleSaveNote} onCancel={() => setCurrentView('list')} />
          )}
          {currentView === 'view' && selectedNote && (
            <NoteViewer
              note={selectedNote}
              onBack={() => setCurrentView('list')}
              onUpdate={handleUpdateNote}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default App

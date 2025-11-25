# HiNotes Clone

A feature-rich clone of HiNotes by HiDock - an AI-powered note-taking application with audio recording, transcription, and smart meeting notes generation.

![HiNotes Clone](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple)

## Features

### 🎙️ Audio Recording
- High-quality audio recording directly from your browser
- Real-time recording timer
- Pause and resume functionality

### 📌 VoiceMark™ Highlights
- Mark important moments during recording
- Add notes to specific timestamps
- Quickly navigate to key points during playback

### 📝 AI-Powered Transcription
- Automatic transcription generation (simulated)
- Speaker identification
- Synchronized audio and text playback
- Click on any transcript segment to jump to that moment

### 🎯 Smart Meeting Notes
- Choose from multiple templates:
  - Meeting Notes
  - Lecture Notes
  - Interview Notes
  - Brainstorming Session
- Automatic summary generation
- Action items extraction
- Organized by sections

### 💾 Export Capabilities
- **PDF Export**: Professional formatted notes with full transcript
- **TXT Export**: Plain text format for universal compatibility
- **CSV Export**: Structured data for analysis and integration

### 🎨 Modern UI/UX
- Beautiful gradient design with dark theme
- Smooth animations and transitions
- Responsive layout for all screen sizes
- Intuitive navigation

### 💿 Local Storage
- All notes saved locally in your browser
- No account required
- Privacy-first approach

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser with Web Audio API support

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hinotes-clone.git
cd hinotes-clone
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Creating a Recording

1. Click "New Recording" button
2. Grant microphone permissions when prompted
3. Click "Start Recording" to begin
4. During recording:
   - Click "Add VoiceMark" to highlight important moments
   - Add notes to describe what's important
5. Click "Stop" when finished
6. Choose a template (optional) for structured notes
7. Click "Save Note" to process and save

### Viewing Notes

1. Click "My Notes" to see all recordings
2. Click on any note card to view details
3. Use the audio player to listen back
4. Click on transcript segments or VoiceMarks to jump to that time
5. Edit the title by clicking the edit icon
6. Export notes using the PDF, TXT, or CSV buttons

### Managing Notes

- Delete notes by clicking the trash icon on note cards
- Notes are automatically saved to browser local storage
- All data persists between sessions

## Technology Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF Generation**: jsPDF
- **Audio Recording**: Web Audio API / MediaRecorder API

## Architecture

```
src/
├── components/
│   ├── Recorder.tsx          # Audio recording with VoiceMarks
│   ├── NotesList.tsx         # Display all saved notes
│   ├── NoteViewer.tsx        # View and play notes
│   └── TemplateSelector.tsx  # Choose note templates
├── utils/
│   ├── ai.ts                 # Simulated AI transcription & summary
│   └── export.ts             # Export functionality (PDF, TXT, CSV)
├── types.ts                  # TypeScript interfaces
├── App.tsx                   # Main application component
├── main.tsx                  # Application entry point
└── index.css                 # Global styles
```

## Features Comparison

| Feature | HiNotes Original | This Clone |
|---------|-----------------|------------|
| Audio Recording | ✅ | ✅ |
| VoiceMarks | ✅ | ✅ |
| Transcription | ✅ (Real AI) | ✅ (Simulated) |
| Speaker ID | ✅ | ✅ |
| Templates | ✅ | ✅ |
| Export (PDF/TXT/CSV) | ✅ | ✅ |
| Cloud Sync | ✅ | ❌ (Local Only) |
| Mobile App | ✅ | ❌ (Web Only) |
| Real-time Collaboration | ✅ | ❌ |
| Integration (Notion, etc.) | ✅ | ❌ |

## Browser Compatibility

- Chrome/Edge 85+
- Firefox 80+
- Safari 14+
- Opera 70+

## Limitations

This is a clone/demo application with simulated AI features:
- Transcription is simulated with sample text
- Speaker identification is randomized
- AI summaries are template-based
- No real speech-to-text processing

For production use with real AI transcription, integrate services like:
- OpenAI Whisper API
- Google Cloud Speech-to-Text
- AssemblyAI
- AWS Transcribe

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning and development.

## Acknowledgments

- Inspired by [HiNotes by HiDock](https://www.hidock.com/pages/hinotes)
- Icons by [Lucide](https://lucide.dev/)
- UI inspiration from modern note-taking apps

## Roadmap

- [ ] Real AI transcription integration
- [ ] Cloud storage and sync
- [ ] Collaboration features
- [ ] Mobile app (React Native)
- [ ] Advanced search
- [ ] Tags and categories
- [ ] Integration with productivity tools

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using React, TypeScript, and Vite

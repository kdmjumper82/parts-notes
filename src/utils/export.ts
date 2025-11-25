import { jsPDF } from 'jspdf'
import { Note } from '../types'

export function exportToPDF(note: Note) {
  const doc = new jsPDF()
  let yPos = 20

  doc.setFontSize(20)
  doc.text(note.title, 20, yPos)
  yPos += 10

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(new Date(note.createdAt).toLocaleString(), 20, yPos)
  yPos += 15

  if (note.summary) {
    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text('Summary', 20, yPos)
    yPos += 7

    doc.setFontSize(10)
    const summaryLines = doc.splitTextToSize(note.summary, 170)
    doc.text(summaryLines, 20, yPos)
    yPos += summaryLines.length * 5 + 10
  }

  if (note.actionItems && note.actionItems.length > 0) {
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text('Action Items', 20, yPos)
    yPos += 7

    doc.setFontSize(10)
    note.actionItems.forEach(item => {
      if (yPos > 280) {
        doc.addPage()
        yPos = 20
      }
      doc.text(`• ${item}`, 25, yPos)
      yPos += 7
    })
    yPos += 10
  }

  if (note.transcript.length > 0) {
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text('Transcript', 20, yPos)
    yPos += 7

    doc.setFontSize(9)
    note.transcript.forEach(segment => {
      if (yPos > 280) {
        doc.addPage()
        yPos = 20
      }

      const time = formatTime(segment.startTime)
      doc.setTextColor(100)
      doc.text(`[${time}] ${segment.speaker || ''}`, 20, yPos)
      yPos += 5

      doc.setTextColor(0)
      const textLines = doc.splitTextToSize(segment.text, 170)
      doc.text(textLines, 20, yPos)
      yPos += textLines.length * 4 + 5
    })
  }

  doc.save(`${note.title}.pdf`)
}

export function exportToTXT(note: Note) {
  let content = `${note.title}\n`
  content += `${new Date(note.createdAt).toLocaleString()}\n`
  content += `Duration: ${formatTime(note.duration)}\n`
  content += `\n${'='.repeat(60)}\n\n`

  if (note.summary) {
    content += `SUMMARY\n\n${note.summary}\n\n`
  }

  if (note.actionItems && note.actionItems.length > 0) {
    content += `ACTION ITEMS\n\n`
    note.actionItems.forEach((item, idx) => {
      content += `${idx + 1}. ${item}\n`
    })
    content += '\n'
  }

  if (note.voiceMarks.length > 0) {
    content += `VOICEMARKS\n\n`
    note.voiceMarks.forEach(mark => {
      content += `[${formatTime(mark.timestamp)}] ${mark.note}\n`
    })
    content += '\n'
  }

  if (note.transcript.length > 0) {
    content += `TRANSCRIPT\n\n`
    note.transcript.forEach(segment => {
      content += `[${formatTime(segment.startTime)}] ${segment.speaker || ''}\n`
      content += `${segment.text}\n\n`
    })
  }

  const blob = new Blob([content], { type: 'text/plain' })
  downloadBlob(blob, `${note.title}.txt`)
}

export function exportToCSV(note: Note) {
  let csv = 'Timestamp,Speaker,Text,Type\n'

  note.transcript.forEach(segment => {
    const time = formatTime(segment.startTime)
    const speaker = segment.speaker || ''
    const text = `"${segment.text.replace(/"/g, '""')}"`
    const type = segment.isHighlight ? 'Highlighted' : 'Regular'
    csv += `${time},${speaker},${text},${type}\n`
  })

  const blob = new Blob([csv], { type: 'text/csv' })
  downloadBlob(blob, `${note.title}.csv`)
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

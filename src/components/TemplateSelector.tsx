import { FileText } from 'lucide-react'
import { Template } from '../types'

const TEMPLATES: Template[] = [
  {
    id: 'meeting',
    name: 'Meeting Notes',
    sections: ['Summary', 'Key Points', 'Action Items', 'Next Steps']
  },
  {
    id: 'lecture',
    name: 'Lecture Notes',
    sections: ['Main Topics', 'Key Concepts', 'Important Details', 'Questions']
  },
  {
    id: 'interview',
    name: 'Interview Notes',
    sections: ['Candidate Overview', 'Technical Skills', 'Strengths', 'Areas for Improvement']
  },
  {
    id: 'brainstorm',
    name: 'Brainstorming Session',
    sections: ['Ideas', 'Decisions', 'Next Actions']
  }
]

interface TemplateSelectorProps {
  selectedTemplate: Template | null
  onSelectTemplate: (template: Template | null) => void
}

export default function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-400" />
        Choose a Template (Optional)
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TEMPLATES.map(template => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(
              selectedTemplate?.id === template.id ? null : template
            )}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedTemplate?.id === template.id
                ? 'bg-indigo-600/20 border-indigo-500 text-white'
                : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
            }`}
          >
            <div className="font-medium mb-1">{template.name}</div>
            <div className="text-xs opacity-70">
              {template.sections.length} sections
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

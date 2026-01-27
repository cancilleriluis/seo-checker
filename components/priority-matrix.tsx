import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Target,
  Coffee,
  Ban,
} from 'lucide-react'

export interface PriorityIssue {
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  effort: 'high' | 'medium' | 'low'
  source: 'seo' | 'geo'
}

interface PriorityMatrixProps {
  issues: PriorityIssue[]
}

function getQuadrant(issue: PriorityIssue): 'quick-win' | 'strategic' | 'nice-to-have' | 'avoid' {
  const highImpact = issue.impact === 'high' || issue.impact === 'medium'
  const lowEffort = issue.effort === 'low' || issue.effort === 'medium'

  if (highImpact && lowEffort) return 'quick-win'
  if (highImpact && !lowEffort) return 'strategic'
  if (!highImpact && lowEffort) return 'nice-to-have'
  return 'avoid'
}

const quadrantConfig = {
  'quick-win': {
    label: 'Quick Wins',
    subtitle: 'High Impact, Low Effort',
    icon: Zap,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    headerColor: 'text-emerald-800',
    badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    iconColor: 'text-emerald-600',
    itemBg: 'bg-emerald-50/50',
    order: 1,
  },
  'strategic': {
    label: 'Strategic',
    subtitle: 'High Impact, High Effort',
    icon: Target,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    headerColor: 'text-blue-800',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-300',
    iconColor: 'text-blue-600',
    itemBg: 'bg-blue-50/50',
    order: 2,
  },
  'nice-to-have': {
    label: 'Nice-to-Have',
    subtitle: 'Low Impact, Low Effort',
    icon: Coffee,
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    headerColor: 'text-slate-700',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-300',
    iconColor: 'text-slate-500',
    itemBg: 'bg-slate-50/50',
    order: 3,
  },
  'avoid': {
    label: 'Avoid for Now',
    subtitle: 'Low Impact, High Effort',
    icon: Ban,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    headerColor: 'text-red-800',
    badgeClass: 'bg-red-100 text-red-700 border-red-300',
    iconColor: 'text-red-500',
    itemBg: 'bg-red-50/50',
    order: 4,
  },
}

export function PriorityMatrix({ issues }: PriorityMatrixProps) {
  const grouped: Record<string, PriorityIssue[]> = {
    'quick-win': [],
    'strategic': [],
    'nice-to-have': [],
    'avoid': [],
  }

  issues.forEach((issue) => {
    const quadrant = getQuadrant(issue)
    grouped[quadrant].push(issue)
  })

  const quadrants = Object.entries(grouped)
    .filter(([, items]) => items.length > 0)
    .sort(([a], [b]) => quadrantConfig[a as keyof typeof quadrantConfig].order - quadrantConfig[b as keyof typeof quadrantConfig].order)

  if (issues.length === 0) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border shadow-lg">
        <CardContent className="pt-6">
          <p className="text-center text-slate-500">No issues found. Your site is in great shape!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Matrix Legend */}
      <Card className="bg-white/90 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Priority Matrix</CardTitle>
          <p className="text-sm text-slate-500">
            Issues categorized by impact on your rankings vs effort to fix.
            Start with Quick Wins for the fastest improvements.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(quadrantConfig).map(([key, config]) => {
              const Icon = config.icon
              const count = grouped[key].length
              return (
                <div
                  key={key}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${config.borderColor} ${config.bgColor}`}
                >
                  <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0`} />
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${config.headerColor}`}>{config.label}</p>
                    <p className="text-xs text-slate-500">{config.subtitle}</p>
                  </div>
                  <Badge variant="outline" className={`ml-auto flex-shrink-0 ${config.badgeClass}`}>
                    {count}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quadrant Cards */}
      {quadrants.map(([key, items]) => {
        const config = quadrantConfig[key as keyof typeof quadrantConfig]
        const Icon = config.icon

        return (
          <Card key={key} className={`border shadow-lg bg-white/90 backdrop-blur-sm`}>
            <CardHeader className="pb-3">
              <CardTitle className={`flex items-center gap-2 ${config.headerColor}`}>
                <Icon className="w-5 h-5" />
                {config.label}
                <Badge variant="outline" className={`ml-2 ${config.badgeClass}`}>
                  {items.length} {items.length === 1 ? 'issue' : 'issues'}
                </Badge>
              </CardTitle>
              <p className="text-sm text-slate-500">{config.subtitle} — {
                key === 'quick-win' ? 'Tackle these first for the biggest ROI.' :
                key === 'strategic' ? 'Plan these into your roadmap for long-term gains.' :
                key === 'nice-to-have' ? 'Address when you have spare time.' :
                'Low return on investment. Deprioritize these.'
              }</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {items.map((issue, index) => (
                  <li
                    key={index}
                    className={`p-4 rounded-lg border ${config.borderColor} ${config.itemBg}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800">{issue.title}</p>
                        <p className="text-sm text-slate-500 mt-1">{issue.description}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`flex-shrink-0 text-xs ${
                          issue.source === 'seo'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}
                      >
                        {issue.source === 'seo' ? 'SEO' : 'GEO'}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs text-slate-400">
                        Impact: <span className="font-medium text-slate-600 capitalize">{issue.impact}</span>
                      </span>
                      <span className="text-xs text-slate-300">|</span>
                      <span className="text-xs text-slate-400">
                        Effort: <span className="font-medium text-slate-600 capitalize">{issue.effort}</span>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

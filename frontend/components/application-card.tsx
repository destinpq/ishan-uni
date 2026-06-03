'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ApplicationCardProps {
  application: {
    id: string
    universityName: string
    universityWebsite: string
    status: string
    appliedDate: string
    deadline: string
    submissionDate?: string
    decisionDate?: string
    scholarshipInfo?: string
  }
  statuses: Array<{ value: string; label: string; color: string }>
  onDelete: () => void
}

export default function ApplicationCard({
  application,
  statuses,
  onDelete,
}: ApplicationCardProps) {
  const statusInfo = statuses.find((s) => s.value === application.status)
  const deadlineDate = new Date(application.deadline)
  const daysUntilDeadline = Math.ceil(
    (deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="border border-border rounded-lg p-6 bg-card hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground">
                {application.universityName}
              </h3>
              <p className="text-sm text-muted-foreground">
                Applied: {new Date(application.appliedDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase mb-1">
                Status
              </p>
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  statusInfo?.color || 'bg-gray-100 text-gray-900'
                }`}
              >
                {statusInfo?.label}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase mb-1">
                Deadline
              </p>
              <p className="text-sm font-semibold">
                {deadlineDate.toLocaleDateString()}
              </p>
              {daysUntilDeadline >= 0 && (
                <p className="text-xs text-muted-foreground">
                  {daysUntilDeadline} days left
                </p>
              )}
            </div>

            {application.submissionDate && (
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase mb-1">
                  Submitted
                </p>
                <p className="text-sm font-semibold">
                  {new Date(application.submissionDate).toLocaleDateString()}
                </p>
              </div>
            )}

            {application.decisionDate && (
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase mb-1">
                  Decision
                </p>
                <p className="text-sm font-semibold">
                  {new Date(application.decisionDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {application.scholarshipInfo && (
            <div className="p-3 bg-primary/10 rounded-lg mb-4">
              <p className="text-xs text-muted-foreground font-medium uppercase mb-1">
                Scholarship Info
              </p>
              <p className="text-sm text-foreground">{application.scholarshipInfo}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
        <a
          href={application.universityWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button
            variant="outline"
            className="w-full border-border text-primary hover:bg-primary/10"
          >
            Visit Website
          </Button>
        </a>
        <Link href={`/dashboard/applications/${application.id}/edit`} className="flex-1">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Edit
          </Button>
        </Link>
        <Button
          onClick={onDelete}
          variant="outline"
          className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

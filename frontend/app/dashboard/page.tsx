'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { applicationsApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import ApplicationCard from '@/components/application-card'

interface Application {
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

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const data = await applicationsApi.getAll()
      setApplications(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load applications'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return
    }

    try {
      await applicationsApi.delete(id)
      setApplications(applications.filter((app) => app.id !== id))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete application'
      )
    }
  }

  const statuses = [
    { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-900' },
    {
      value: 'under_review',
      label: 'Under Review',
      color: 'bg-yellow-100 text-yellow-900',
    },
    {
      value: 'accepted',
      label: 'Accepted',
      color: 'bg-green-100 text-green-900',
    },
    {
      value: 'rejected',
      label: 'Rejected',
      color: 'bg-red-100 text-red-900',
    },
    {
      value: 'waitlisted',
      label: 'Waitlisted',
      color: 'bg-orange-100 text-orange-900',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            My Applications
          </h1>
          <p className="text-muted-foreground mt-1">
            Track all your university applications in one place
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/universities">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Add Application
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        </div>
      ) : applications.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
          <p className="text-muted-foreground mb-6">
            Start by browsing universities and creating your first application.
          </p>
          <Link href="/dashboard/universities">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Browse Universities
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              statuses={statuses}
              onDelete={() => handleDelete(application.id)}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4">
        {statuses.map((status) => (
          <div
            key={status.value}
            className={`p-3 rounded-lg text-center text-sm font-medium ${status.color}`}
          >
            <div className="font-semibold">
              {applications.filter((a) => a.status === status.value).length}
            </div>
            <div className="text-xs opacity-75">{status.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

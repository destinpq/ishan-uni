'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { applicationsApi, universitiesApi } from '@/lib/api'

interface University {
  id: string
  name: string
  website: string
}

export default function NewApplicationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const universityId = searchParams.get('universityId')

  const [university, setUniversity] = useState<University | null>(null)
  const [loading, setLoading] = useState(!!universityId)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    universityName: '',
    universityWebsite: '',
    status: 'applied',
    appliedDate: new Date().toISOString().split('T')[0],
    deadline: '',
    submissionDate: '',
    decisionDate: '',
    scholarshipInfo: '',
  })

  useEffect(() => {
    if (universityId) {
      fetchUniversity(universityId)
    }
  }, [universityId])

  const fetchUniversity = async (id: string) => {
    try {
      const uni = await universitiesApi.getById(id)
      setUniversity(uni)
      setFormData((prev) => ({
        ...prev,
        universityName: uni.name,
        universityWebsite: uni.website,
      }))
    } catch (err) {
      setError('Failed to load university')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await applicationsApi.create(formData)
      router.push('/dashboard')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create application'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="outline" className="mb-4">
            ← Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create Application</h1>
        <p className="text-muted-foreground mt-2">
          Add a new university application to track your progress
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-lg p-6 border border-border">
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="universityName" className="block text-sm font-medium mb-2">
              University Name *
            </label>
            <input
              type="text"
              id="universityName"
              name="universityName"
              value={formData.universityName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Harvard University"
            />
          </div>

          <div>
            <label htmlFor="universityWebsite" className="block text-sm font-medium mb-2">
              Website *
            </label>
            <input
              type="url"
              id="universityWebsite"
              name="universityWebsite"
              value={formData.universityWebsite}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="applied">Applied</option>
              <option value="under_review">Under Review</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="waitlisted">Waitlisted</option>
            </select>
          </div>

          <div>
            <label htmlFor="appliedDate" className="block text-sm font-medium mb-2">
              Applied Date *
            </label>
            <input
              type="date"
              id="appliedDate"
              name="appliedDate"
              value={formData.appliedDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium mb-2">
              Application Deadline *
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="submissionDate" className="block text-sm font-medium mb-2">
              Submission Date
            </label>
            <input
              type="date"
              id="submissionDate"
              name="submissionDate"
              value={formData.submissionDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label htmlFor="decisionDate" className="block text-sm font-medium mb-2">
            Decision Date
          </label>
          <input
            type="date"
            id="decisionDate"
            name="decisionDate"
            value={formData.decisionDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="scholarshipInfo" className="block text-sm font-medium mb-2">
            Scholarship Information
          </label>
          <textarea
            id="scholarshipInfo"
            name="scholarshipInfo"
            value={formData.scholarshipInfo}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="E.g., Available scholarships, funding status, etc."
          />
        </div>

        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {submitting ? 'Creating...' : 'Create Application'}
          </Button>
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}

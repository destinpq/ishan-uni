'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { universitiesApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import UniversityCard from '@/components/university-card'

interface Program {
  name: string
  url: string
}

interface University {
  id: string
  name: string
  website: string
  country: string
  description?: string
  logo?: string
  programs?: Program[]
}

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUniversities()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUniversities(search)
  }

  const fetchUniversities = async (searchTerm?: string) => {
    try {
      setLoading(true)
      setError('')
      const query = searchTerm?.trim() || undefined
      const data = await universitiesApi.getAll(undefined, query)
      setUniversities(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load universities'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Browse Universities
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore and apply to universities worldwide
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">Back to Applications</Button>
        </Link>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-4 items-stretch"
      >
        <div className="flex-1 w-full">
          <input
            type="search"
            placeholder="Search by name, country, or program (e.g. AI in USA)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <Button type="submit" disabled={loading} className="px-8 py-3 h-auto">
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">
            Searching universities with AI — this can take a few seconds...
          </p>
        </div>
      )}

      {loading && universities.length === 0 ? null : universities.length ===
        0 ? (
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No universities found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria.
          </p>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${
            loading ? 'opacity-50 pointer-events-none' : 'opacity-100'
          }`}
        >
          {universities.map((university) => (
            <UniversityCard key={university.id} university={university} />
          ))}
        </div>
      )}

      <div className="text-center pt-8 border-t border-border">
        <p className="text-muted-foreground mb-4">
          Showing {universities.length}{' '}
          {universities.length === 1 ? 'university' : 'universities'}
        </p>
      </div>
    </div>
  )
}

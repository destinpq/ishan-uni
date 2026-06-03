'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Program {
  name: string
  url: string
}

interface UniversityCardProps {
  university: {
    id: string
    name: string
    website: string
    country: string
    description?: string
    logo?: string
    programs?: Program[]
  }
}

export default function UniversityCard({ university }: UniversityCardProps) {
  return (
    <div className="border border-border rounded-lg p-6 bg-card hover:shadow-lg transition-shadow flex flex-col">
      {university.logo && (
        <div className="mb-4 h-20 flex items-center justify-center bg-secondary rounded-lg">
          <img
            src={university.logo}
            alt={university.name}
            className="max-h-16 max-w-full object-contain"
          />
        </div>
      )}

      <div className="flex-1">
        <h3 className="text-lg font-bold text-foreground mb-1">
          {university.name}
        </h3>
        <p className="text-sm text-primary font-semibold mb-3">
          {university.country}
        </p>
        {university.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {university.description}
          </p>
        )}

        {university.programs && university.programs.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Courses
            </p>
            <ul className="space-y-1">
              {university.programs.map((program, idx) => (
                <li key={idx} className="text-sm">
                  {program.url ? (
                    <a
                      href={program.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {program.name}
                    </a>
                  ) : (
                    <span className="text-foreground">{program.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 pt-4">
        <a
          href={university.website}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button
            variant="outline"
            className="w-full border-border text-primary hover:bg-primary/10"
          >
            Visit Website
          </Button>
        </a>
        <Link
          href={`/dashboard/applications/new?universityId=${university.id}`}
          className="w-full"
        >
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Apply Now
          </Button>
        </Link>
      </div>
    </div>
  )
}

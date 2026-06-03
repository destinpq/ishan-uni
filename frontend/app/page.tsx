import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <nav className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">UniTrack</div>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="space-y-8 text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-balance">
            Track Your <span className="text-primary">University Applications</span> Globally
          </h1>
          <p className="text-xl text-muted-foreground text-balance">
            Manage all your international university applications in one place. Track deadlines,
            submission dates, and decision notifications effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8">
                Get Started Free
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="text-base px-8">
                Learn More
              </Button>
            </a>
          </div>
        </div>

        <div id="features" className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-lg border border-border bg-card/50 hover:border-primary/50 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Easy Application Management</h3>
            <p className="text-muted-foreground">
              Create, edit, and organize all your university applications. Track every detail
              from submission to decision.
            </p>
          </div>

          <div className="p-8 rounded-lg border border-border bg-card/50 hover:border-primary/50 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Global University Hub</h3>
            <p className="text-muted-foreground">
              Browse and access thousands of universities worldwide. Direct links to official
              admission websites and portals.
            </p>
          </div>

          <div className="p-8 rounded-lg border border-border bg-card/50 hover:border-primary/50 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Tracking</h3>
            <p className="text-muted-foreground">
              Track application status, deadlines, submissions, decisions, and scholarship
              information all in one dashboard.
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 md:p-12 text-center mb-20">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            UniTrack provides everything students need to manage their international university
            applications efficiently:
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
            <div className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>Track application deadlines and never miss one</span>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>Monitor submission and decision dates</span>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>Store scholarship and funding information</span>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>Quick access to university websites</span>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>Secure account with email authentication</span>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>Track application status at a glance</span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Start Your Journey?</h2>
          <p className="text-muted-foreground text-lg">
            Create your account today and take control of your university applications.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8">
              Get Started Now
            </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t border-border/50 bg-card/50 backdrop-blur mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 text-center text-muted-foreground">
          <p>&copy; 2024 UniTrack. Helping students apply to universities worldwide.</p>
        </div>
      </footer>
    </div>
  )
}

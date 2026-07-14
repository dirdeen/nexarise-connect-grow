import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="/#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Platform
          </a>
          <a
            href="/#stats"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Demo Metrics
          </a>
          <a
            href="/#stories"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Stories
          </a>
          <a
            href="/#partners"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Partnership
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-secondary hover:bg-accent sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              Sierra Leone's platform for workforce, employment, mentorship and career growth.
            </p>
          </div>
          <FooterCol
            title="Platform"
            links={[
              ["Find Jobs", "/jobs"],
              ["Hire Talent", "/employer/dashboard"],
              ["Workforce Program", "/workforce/dashboard"],
              ["Mentorship", "/mentorship/dashboard"],
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              ["About", "/#features"],
              ["Partnership", "/#partners"],
              ["Demo Guide", "/#stats"],
              ["Contact", "/#partners"],
            ]}
          />
          <FooterCol
            title="Resources"
            links={[
              ["Help Center", "/#features"],
              ["Community", "/#stories"],
              ["Privacy", "/#partners"],
              ["Terms", "/#partners"],
            ]}
          />
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} NexaRise. Freetown, Sierra Leone.</p>
          <p>Built for the future of work in West Africa.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <ul className="mt-4 space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="text-sm text-muted-foreground hover:text-primary">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

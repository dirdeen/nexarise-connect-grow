import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/$role/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — NexaRise" }] }),
  component: PlaceholderDashboard,
});

const roleMeta: Record<string, { title: string; tagline: string; accent: string }> = {
  "job-seeker": {
    title: "Career Platform",
    tagline: "Your personalized job feed, applications and career growth tools will live here.",
    accent: "from-primary to-primary-glow",
  },
  workforce: {
    title: "Verified Workforce",
    tagline: "Bookings, verification status and earnings for drivers, keke riders, cleaners and office assistants.",
    accent: "from-secondary to-primary",
  },
  employer: {
    title: "Employer Portal",
    tagline: "Post roles, manage candidates and request verified workforce members.",
    accent: "from-secondary to-secondary",
  },
  mentor: {
    title: "Mentorship & Training",
    tagline: "Mentor matches, training programs and partner resources will appear here.",
    accent: "from-primary-glow to-secondary",
  },
};

function PlaceholderDashboard() {
  const { role } = Route.useParams();
  const meta = roleMeta[role] ?? {
    title: "Dashboard",
    tagline: "This experience is coming soon.",
    accent: "from-primary to-secondary",
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <Link to="/choose-path" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            ← Change path
          </Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <div className={`grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br ${meta.accent} text-4xl shadow-glow`}>
          🚀
        </div>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
          Coming in Sprint 2
        </span>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-secondary sm:text-5xl">
          {meta.title}
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">{meta.tagline}</p>

        <div className="mt-10 grid w-full gap-4 sm:grid-cols-3">
          {["Overview", "Activity", "Settings"].map((n) => (
            <div key={n} className="rounded-2xl border border-dashed border-border bg-card/60 p-6 text-left shadow-card">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{n}</div>
              <div className="mt-2 h-2 w-3/4 rounded-full bg-muted" />
              <div className="mt-2 h-2 w-1/2 rounded-full bg-muted" />
            </div>
          ))}
        </div>

        <Link
          to="/choose-path"
          className="mt-12 inline-flex items-center rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-glow"
        >
          Explore other paths
        </Link>
      </main>
    </div>
  );
}

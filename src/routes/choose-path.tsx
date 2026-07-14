import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/choose-path")({
  head: () => ({ meta: [{ title: "Choose your path — NexaRise" }] }),
  component: ChoosePathPage,
});

type Path = {
  title: string;
  description: string;
  bullets?: string[];
  cta: string;
  to: string;
  icon: string;
  accent: string;
};

const paths: Path[] = [
  {
    title: "Career Platform",
    description: "Search professional jobs and build your career.",
    cta: "Continue",
    to: "/job-seeker/dashboard",
    icon: "💼",
    accent: "from-primary to-primary-glow",
  },
  {
    title: "Verified Workforce",
    description: "Join the trusted network of skilled workers.",
    bullets: ["Drivers", "Keke Riders", "Office Assistants", "Professional Cleaners"],
    cta: "Join Workforce",
    to: "/workforce/dashboard",
    icon: "🛠️",
    accent: "from-secondary to-primary",
  },
  {
    title: "Employer",
    description: "Recruit talent or request verified workforce.",
    cta: "Employer Portal",
    to: "/employer/dashboard",
    icon: "🏢",
    accent: "from-secondary to-secondary",
  },
  {
    title: "Mentorship & Training",
    description: "Connect with mentors and training partners.",
    cta: "Continue",
    to: "/mentor/dashboard",
    icon: "🎓",
    accent: "from-primary-glow to-secondary",
  },
];

function ChoosePathPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Sign out
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-secondary">
            Step 1 of 2
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-secondary sm:text-5xl">
            Choose your path
          </h1>
          <p className="mt-4 text-muted-foreground">
            Pick the experience that fits you today. You can switch or add another path later.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {paths.map((p) => (
            <article
              key={p.title}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
            >
              <div
                className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${p.accent} text-3xl shadow-glow`}
              >
                {p.icon}
              </div>
              <h2 className="mt-6 font-display text-xl font-bold text-secondary">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>

              {p.bullets && (
                <ul className="mt-4 space-y-1.5">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => navigate({ to: p.to })}
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground transition-all group-hover:bg-gradient-primary group-hover:shadow-glow"
              >
                {p.cta} →
              </button>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

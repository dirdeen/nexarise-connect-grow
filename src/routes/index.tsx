import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import heroImg from "@/assets/hero-illustration.jpg";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const stats = [
  { label: "Job Seekers", value: "12,400+" },
  { label: "Verified Workforce", value: "3,800+" },
  { label: "Partner Employers", value: "520+" },
  { label: "Mentors Onboarded", value: "180+" },
];

const companies = ["Orange SL", "Africell", "Rokel Bank", "Sierra Rutile", "Bluecrest", "IPAM", "UNDP", "Splash"];

const stories = [
  {
    name: "Aminata K.",
    role: "Junior Developer at Orange SL",
    quote: "NexaRise matched me with a mentor and a job in three weeks. I finally have a career path.",
  },
  {
    name: "Mohamed S.",
    role: "Verified Keke Rider, Freetown",
    quote: "The Workforce Program verified my ID and now I get steady bookings through trusted employers.",
  },
  {
    name: "Fatmata B.",
    role: "HR Lead, Bluecrest",
    quote: "We hired four cleaners and two office assistants — all pre-vetted. It saved us weeks of screening.",
  },
];

const partners = ["IPAM", "Limkokwing SL", "Fourah Bay College", "Freetown Polytechnic", "GIZ", "British Council"];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-subtle">
        <div className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(circle_at_20%_20%,color-mix(in_oklab,var(--primary)_20%,transparent),transparent_50%),radial-gradient(circle_at_80%_60%,color-mix(in_oklab,var(--secondary)_18%,transparent),transparent_55%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Sprint 1 · Now live in Sierra Leone
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-secondary sm:text-5xl lg:text-6xl">
              Connecting{" "}
              <span className="text-gradient-primary">Talent</span>
              <br className="hidden sm:block" /> with Opportunity.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              NexaRise brings <strong className="text-foreground">Job Seekers</strong>,{" "}
              <strong className="text-foreground">Employers</strong>,{" "}
              <strong className="text-foreground">Mentors</strong> and{" "}
              <strong className="text-foreground">Verified Workforce Members</strong> together on one trusted platform — built for Sierra Leone's economy.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
              >
                Find Jobs →
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-transform hover:scale-[1.02]"
              >
                Join Workforce Program
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border-2 border-secondary/20 bg-card px-6 py-3 text-sm font-semibold text-secondary hover:border-primary hover:text-primary"
              >
                Hire Talent
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex -space-x-2">
                {["bg-primary", "bg-secondary", "bg-primary-glow", "bg-accent"].map((c, i) => (
                  <div key={i} className={`h-8 w-8 rounded-full border-2 border-background ${c}`} />
                ))}
              </div>
              <span>Trusted by <strong className="text-foreground">12,400+</strong> Sierra Leoneans</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-primary opacity-20 blur-3xl" />
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elegant">
              <img
                src={heroImg}
                alt="Sierra Leone professionals connecting through NexaRise"
                width={1400}
                height={1200}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-y border-border bg-secondary">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-bold text-white sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-white/70">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
            One platform. Four pathways to rise.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Whether you're building a career, hiring a team, or mentoring the next generation — NexaRise has a home for you.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Career Platform", d: "Search professional jobs, apply in one click, and track your growth.", icon: "💼" },
            { t: "Verified Workforce", d: "Drivers, Keke riders, cleaners and office assistants — pre-vetted.", icon: "🛠️" },
            { t: "Employer Portal", d: "Post roles, source talent and request verified workforce quickly.", icon: "🏢" },
            { t: "Mentorship & Training", d: "Connect with mentors and accredited training partners.", icon: "🎓" },
          ].map((f) => (
            <div key={f.t} className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-2xl shadow-glow">
                {f.icon}
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-secondary">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted companies */}
      <section className="bg-surface py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Trusted by leading employers across Sierra Leone
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
            {companies.map((c) => (
              <div key={c} className="grid h-14 place-items-center rounded-lg bg-background text-sm font-semibold text-muted-foreground shadow-card">
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success stories */}
      <section id="stories" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-secondary sm:text-4xl">Success stories</h2>
          <p className="mt-4 text-muted-foreground">Real Sierra Leoneans. Real careers unlocked.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {stories.map((s) => (
            <figure key={s.name} className="rounded-2xl border border-border bg-card p-8 shadow-card">
              <div className="text-primary text-4xl leading-none">"</div>
              <blockquote className="mt-2 text-base text-foreground">{s.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary font-semibold text-white">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-secondary">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Training partners */}
      <section id="partners" className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-secondary sm:text-3xl">Training partners</h2>
            <p className="mt-3 text-sm text-muted-foreground">Accredited institutions powering skill-building on NexaRise.</p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {partners.map((p) => (
              <span key={p} className="rounded-full border border-border bg-background px-5 py-2 text-sm font-medium text-secondary shadow-card">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 shadow-elegant sm:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Your next opportunity starts here.
            </h2>
            <p className="mt-3 text-white/80">Create your free NexaRise account and choose your path in under two minutes.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-secondary hover:bg-white/90">
                Create free account
              </Link>
              <Link to="/login" className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

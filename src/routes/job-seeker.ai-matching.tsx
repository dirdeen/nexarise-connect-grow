import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, Briefcase, Loader2, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { runJobSeekerAiTool, type AiJobMatch } from "@/lib/ai";

export const Route = createFileRoute("/job-seeker/ai-matching")({
  head: () => ({ meta: [{ title: "AI Job Matching - NexaRise" }] }),
  component: AiJobMatchingPage,
});

function AiJobMatchingPage() {
  const [matches, setMatches] = useState<AiJobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  async function calculateMatches() {
    setLoading(true);
    setError("");
    setWarning("");

    try {
      const response = await runJobSeekerAiTool("job-matching");
      setMatches(response.matches ?? []);
      setWarning(response.warning ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to calculate job matches.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-0">
        <section className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            AI Job Matching
          </span>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="font-display text-3xl font-bold sm:text-4xl">
                Match your profile to active jobs
              </h1>
              <p className="mt-2 max-w-2xl text-white/80">
                Compare your skills, education, location and experience against live NexaRise job
                posts.
              </p>
            </div>
            <button
              type="button"
              onClick={calculateMatches}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-secondary shadow-glow hover:bg-white/95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? "Matching..." : "Run matching"}
            </button>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-6 flex gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-semibold text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {warning && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
            {warning}
          </div>
        )}

        <div className="mt-8 grid gap-4">
          {matches.map((match) => (
            <article
              key={match.jobId}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-semibold text-secondary">
                      {match.title}
                    </h2>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {Math.round(match.score)}% match
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {match.company}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {match.location}
                    </span>
                    <span>{match.category}</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {match.explanation}
                  </p>
                </div>
                <Link
                  to="/jobs/$jobId"
                  params={{ jobId: match.jobId }}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-white shadow-glow"
                >
                  View job
                </Link>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Score label="Skills" value={match.skillsScore} />
                <Score label="Qualification" value={match.qualificationScore} />
                <Score label="Experience" value={match.experienceScore} />
                <Score label="Location" value={match.locationScore} />
                <Score label="Category" value={match.categoryScore} />
              </div>
            </article>
          ))}
        </div>

        {!loading && matches.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-card">
            <Sparkles className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-3 font-display text-xl font-semibold text-secondary">
              Run matching to see recommended jobs
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete your profile first for stronger recommendations.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-accent p-3">
      <div className="flex items-center justify-between text-xs font-semibold text-secondary">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
        <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

import { AlertCircle, Copy, Loader2, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";

import { AppShell } from "@/components/AppShell";
import { runJobSeekerAiTool, type AiToolAction } from "@/lib/ai";

type JobSeekerAiToolProps = {
  badge: string;
  title: string;
  description: string;
  action: AiToolAction;
  promptLabel: string;
  promptPlaceholder: string;
  buttonLabel: string;
  helper: string;
  quickLinks?: Array<{ label: string; to: string }>;
};

export function JobSeekerAiTool({
  badge,
  title,
  description,
  action,
  promptLabel,
  promptPlaceholder,
  buttonLabel,
  helper,
  quickLinks = [],
}: JobSeekerAiToolProps) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [warning, setWarning] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setWarning("");
    setResult("");

    try {
      const response = await runJobSeekerAiTool(action, { prompt });
      setResult(response.content ?? "");
      setWarning(response.warning ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete this AI request.");
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result || typeof navigator === "undefined") return;
    await navigator.clipboard.writeText(result);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-0">
        <section className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            {badge}
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-white/80">{description}</p>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-border bg-card p-6 shadow-card"
          >
            {error && (
              <div
                role="alert"
                className="mb-4 flex gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <label className="block text-sm font-semibold text-secondary" htmlFor="ai-prompt">
              {promptLabel}
            </label>
            <textarea
              id="ai-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={promptPlaceholder}
              className="mt-3 min-h-48 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-2 text-xs text-muted-foreground">{helper}</p>
            <button
              type="submit"
              disabled={loading}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? "Generating..." : buttonLabel}
            </button>
          </form>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold text-secondary">Career context</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              NexaRise combines your profile, skills, education and work history with the details
              you add here.
            </p>
            <div className="mt-5 space-y-2">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.to}
                  className="block rounded-xl border border-border px-3 py-2 text-sm font-semibold text-secondary hover:border-primary/40"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </aside>
        </div>

        {(result || warning) && (
          <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-secondary">AI output</h2>
                {warning && <p className="mt-1 text-sm text-amber-700">{warning}</p>}
              </div>
              {result && (
                <button
                  type="button"
                  onClick={copyResult}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-secondary hover:border-primary/40"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </button>
              )}
            </div>
            {result && (
              <div className="mt-5 whitespace-pre-wrap rounded-2xl bg-accent p-5 text-sm leading-7 text-foreground">
                {result}
              </div>
            )}
          </section>
        )}
      </div>
    </AppShell>
  );
}

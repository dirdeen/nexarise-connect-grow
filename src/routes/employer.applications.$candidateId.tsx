import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Download, ExternalLink, Mail, Phone } from "lucide-react";
import { useState } from "react";

import { EmployerShell } from "@/components/EmployerShell";
import { fetchEmployerApplications, getApplicationCvDownloadUrl } from "@/lib/production";

export const Route = createFileRoute("/employer/applications/$candidateId")({
  head: () => ({ meta: [{ title: "Candidate Profile — NexaRise" }] }),
  loader: async ({ params }) => {
    const candidates = await fetchEmployerApplications();
    const candidate = candidates.find((item) => item.id === params.candidateId);
    if (!candidate) throw notFound();
    return { candidate };
  },
  component: CandidateProfilePage,
});

function CandidateProfilePage() {
  const { candidate } = Route.useLoaderData();
  const [downloadStatus, setDownloadStatus] = useState("");

  async function downloadCv() {
    setDownloadStatus("Preparing CV download...");
    try {
      const url = await getApplicationCvDownloadUrl(candidate.cvFile);
      window.open(url, "_blank", "noopener,noreferrer");
      setDownloadStatus("CV download opened in a new tab.");
    } catch (err) {
      setDownloadStatus(err instanceof Error ? err.message : "Unable to download CV.");
    }
  }

  return (
    <EmployerShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-0">
        <Link
          to="/employer/applications"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to applications
        </Link>

        <section className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                {candidate.status}
              </span>
              <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{candidate.name}</h1>
              <p className="mt-2 text-white/80">
                {candidate.role} · {candidate.location} · Applied {candidate.appliedDate}
              </p>
            </div>
            <button
              type="button"
              onClick={downloadCv}
              disabled={!candidate.cvFile || candidate.cvFile === "No CV uploaded"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-secondary shadow-glow"
            >
              <Download className="h-4 w-4" />
              Download CV
            </button>
          </div>
          {downloadStatus && <p className="mt-4 text-sm text-white/80">{downloadStatus}</p>}
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <Card title="Profile summary">
              <p className="text-sm leading-relaxed text-foreground/85">{candidate.summary}</p>
            </Card>
            <Card title="Resume">
              <div className="rounded-xl border border-dashed border-border bg-background p-5">
                <div className="text-sm font-semibold text-secondary">{candidate.cvFile}</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  CV preview includes work history, education and certifications.
                </p>
              </div>
            </Card>
            <Card title="Work experience">
              {candidate.workHistory.length ? (
                <ul className="space-y-2">
                  {candidate.workHistory.map((item) => (
                    <li key={item} className="text-sm text-foreground/85">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No work experience added yet.</p>
              )}
            </Card>
            <Card title="Certifications">
              {candidate.certifications.length ? (
                <div className="flex flex-wrap gap-2">
                  {candidate.certifications.map((certification) => (
                    <span
                      key={certification}
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-secondary"
                    >
                      {certification}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No certifications added yet.</p>
              )}
            </Card>
          </div>

          <aside className="space-y-6">
            <Card title="Contact information">
              <div className="space-y-3 text-sm">
                <a
                  href={`mailto:${candidate.email}`}
                  className="flex items-center gap-2 text-secondary hover:text-primary"
                >
                  <Mail className="h-4 w-4" />
                  {candidate.email}
                </a>
                <a
                  href={`tel:${candidate.phone}`}
                  className="flex items-center gap-2 text-secondary hover:text-primary"
                >
                  <Phone className="h-4 w-4" />
                  {candidate.phone}
                </a>
                {candidate.portfolio ? (
                  <a
                    href={candidate.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-secondary hover:text-primary"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Portfolio
                  </a>
                ) : (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <ExternalLink className="h-4 w-4" />
                    No portfolio provided
                  </span>
                )}
              </div>
            </Card>
            <Card title="Skills">
              {candidate.skills.length ? (
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No skills added yet.</p>
              )}
            </Card>
            <Card title="Education">
              <p className="text-sm text-foreground/85">{candidate.education}</p>
            </Card>
          </aside>
        </div>
      </div>
    </EmployerShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h2 className="font-display text-lg font-semibold text-secondary">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

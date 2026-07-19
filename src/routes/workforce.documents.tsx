import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Upload } from "lucide-react";
import { useEffect, useState } from "react";

import { WorkforceShell } from "@/components/WorkforceShell";
import { fetchWorkforceDocuments, type WorkforceDocument } from "@/lib/workforce";

export const Route = createFileRoute("/workforce/documents")({
  head: () => ({ meta: [{ title: "Workforce Documents - NexaRise" }] }),
  component: WorkforceDocumentsPage,
});

function WorkforceDocumentsPage() {
  const [documents, setDocuments] = useState<WorkforceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchWorkforceDocuments()
      .then((rows) => {
        if (active) setDocuments(rows);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Unable to load documents.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <WorkforceShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-0">
        <section className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <FileText className="h-3.5 w-3.5" />
            Documents
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Workforce documents</h1>
          <p className="mt-2 max-w-2xl text-white/80">
            Review the identity and credential documents uploaded to your worker profile.
          </p>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            {error}
          </div>
        )}

        <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-secondary">Uploaded files</h2>
              <p className="text-sm text-muted-foreground">
                Upload new documents from your workforce profile page.
              </p>
            </div>
            <Link
              to="/workforce/profile"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground"
            >
              <Upload className="h-4 w-4" />
              Upload document
            </Link>
          </div>

          <div className="mt-5 grid gap-4">
            {loading &&
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-20 animate-pulse rounded-xl bg-accent" />
              ))}
            {!loading &&
              documents.map((document) => (
                <article key={document.id} className="rounded-xl bg-accent p-4">
                  <div className="font-display text-base font-semibold text-secondary">
                    {document.documentType}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{document.fileName}</p>
                  <p className="mt-2 text-xs font-semibold text-primary">
                    Uploaded {document.createdAt}
                  </p>
                </article>
              ))}
            {!loading && documents.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-background p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No workforce documents uploaded yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </WorkforceShell>
  );
}

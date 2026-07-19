import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, FileCheck2, FileX2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/AdminShell";
import {
  fetchVerificationQueue,
  updateVerificationStatus,
  type VerificationQueueItem,
} from "@/lib/production";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/verification")({
  head: () => ({ meta: [{ title: "Verification Management - NexaRise Admin" }] }),
  component: VerificationManagementPage,
});

function VerificationManagementPage() {
  const [items, setItems] = useState<VerificationQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pending = items.filter((item) => item.status === "Pending").length;

  useEffect(() => {
    let active = true;

    async function loadItems(showLoading = true) {
      if (showLoading) setLoading(true);
      setError("");
      try {
        const rows = await fetchVerificationQueue();
        if (active) setItems(rows);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load verification records.");
        }
      } finally {
        if (active && showLoading) setLoading(false);
      }
    }

    void loadItems();
    const channel = supabase
      ?.channel("admin-verification-profiles")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        void loadItems(false);
      })
      .subscribe();

    return () => {
      active = false;
      if (channel && supabase) void supabase.removeChannel(channel);
    };
  }, []);

  async function updateVerification(id: string, status: VerificationQueueItem["status"]) {
    setError("");
    try {
      await updateVerificationStatus(id, status);
      setItems((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update verification status.");
    }
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        <section className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            Verification Management
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Review platform participant documents
          </h1>
          <p className="mt-2 max-w-2xl text-white/80">
            Verify employers, workforce members and mentors, then approve or reject submitted
            documents.
          </p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Pending review", pending],
            ["Approved", items.filter((item) => item.status === "Approved").length],
            ["Rejected", items.filter((item) => item.status === "Rejected").length],
          ].map(([label, value]) => (
            <div
              key={label as string}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label as string}
              </div>
              <div className="mt-3 font-display text-3xl font-bold text-secondary">{value}</div>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-4">
          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
            >
              {error}
            </div>
          )}
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-secondary">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-semibold text-secondary">
                        {item.name}
                      </h2>
                      <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-secondary">
                        {item.type}
                      </span>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.document} · submitted {item.submitted}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateVerification(item.id, "Approved")}
                    className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground"
                  >
                    <FileCheck2 className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => updateVerification(item.id, "Rejected")}
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-secondary hover:border-primary/40"
                  >
                    <FileX2 className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            </article>
          ))}
          {loading && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              Loading verification records...
            </div>
          )}
          {!loading && items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              No verification records are available yet.
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-secondary">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Verification checklist
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              "Employer registration and contact match",
              "Workforce ID, licence or certificate validated",
              "Mentor experience and certification reviewed",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-accent p-4 text-sm font-semibold text-secondary"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

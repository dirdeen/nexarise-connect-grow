import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/AdminShell";
import { fetchAdminAnalytics, type AdminAnalyticsData } from "@/lib/production";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Reports & Analytics - NexaRise Admin" }] }),
  component: ReportsAnalyticsPage,
});

function ReportsAnalyticsPage() {
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAnalytics() {
      setLoading(true);
      setError("");
      try {
        const analytics = await fetchAdminAnalytics();
        if (active) setData(analytics);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to load analytics.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadAnalytics();
    return () => {
      active = false;
    };
  }, []);

  const cards = data?.cards ?? [];
  const hiringSeries = data?.hiringSeries ?? [];
  const revenueSeries = data?.revenueSeries ?? [];

  function exportCsv() {
    const rows = [
      ["Metric", "Value", "Helper"],
      ...cards.map((item) => [item.label, item.value, item.helper]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    downloadTextFile("nexarise-admin-report.csv", csv, "text/csv");
  }

  function exportPdf() {
    window.print();
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-semibold text-primary">Super Admin</span>
            <h1 className="mt-2 font-display text-3xl font-bold text-secondary">
              Reports and analytics
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Track jobs posted, applications, hiring statistics, workforce requests and mentorship.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ExportButton label="Export CSV" icon={Download} onClick={exportCsv} />
            <ExportButton label="Print / Save PDF" icon={FileText} onClick={exportPdf} />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            {error}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {cards.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {item.label}
              </div>
              <div className="mt-3 font-display text-3xl font-bold text-secondary">
                {loading ? "..." : item.value}
              </div>
              <div className="mt-1 text-sm font-semibold text-primary">{item.helper}</div>
            </div>
          ))}
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <Chart
            title="Revenue graph"
            data={revenueSeries}
            suffix="NLe"
            empty="Revenue tracking is not connected yet."
          />
          <Chart
            title="Hiring funnel"
            data={hiringSeries}
            suffix=""
            empty="No hiring activity has been recorded yet."
          />
        </div>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-xl font-semibold text-secondary">Report exports</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              "Jobs and application activity",
              "Workforce request conversion",
              "Mentorship engagement statistics",
            ].map((item) => (
              <div key={item} className="rounded-xl bg-accent p-4">
                <div className="text-sm font-semibold text-secondary">{item}</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Export current admin report data for review.
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function Chart({
  title,
  data,
  suffix,
  empty,
}: {
  title: string;
  data: Array<{ label: string; value: number }>;
  suffix: string;
  empty: string;
}) {
  const max = Math.max(1, ...data.map((item) => item.value));

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h2 className="font-display text-xl font-semibold text-secondary">{title}</h2>
      {data.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-8 text-center text-sm text-muted-foreground">
          {empty}
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {data.map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-secondary">{item.label}</span>
                <span className="text-muted-foreground">
                  {suffix} {item.value.toLocaleString()}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-primary"
                  style={{ width: `${Math.max(8, (item.value / max) * 100)}%` }}
                  aria-label={`${item.label} ${item.value}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ExportButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: typeof Download;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-secondary hover:border-primary/40"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

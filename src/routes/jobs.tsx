import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { JobCard } from "@/components/JobCard";
import { fetchJobs, type Job } from "@/lib/jobs";
import { Search, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Search Jobs — NexaRise" }] }),
  component: JobSearchPage,
});

const LOCATIONS = ["All locations", "Freetown", "Bo", "Makeni", "Lunsar", "Kenema"];
const CATEGORIES = [
  "All categories",
  "Engineering",
  "Finance",
  "Marketing",
  "Operations",
  "Product",
  "Retail",
  "Data & Analytics",
  "Public Sector",
  "Development",
  "Health & Safety",
];
const TYPES = ["All types", "Full-time", "Part-time", "Contract", "Internship"];
const EXPERIENCE = ["Any experience", "2+ years", "3+ years", "4+ years", "5+ years"];
const SALARY = [
  { label: "Any salary", min: 0 },
  { label: "NLe 8,000+", min: 8000 },
  { label: "NLe 12,000+", min: 12000 },
  { label: "NLe 18,000+", min: 18000 },
];
const SORTS = ["Most recent", "Highest salary", "Company A-Z"] as const;

function JobSearchPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [query, setQuery] = useState("");
  const [loc, setLoc] = useState(LOCATIONS[0]);
  const [cat, setCat] = useState(CATEGORIES[0]);
  const [type, setType] = useState(TYPES[0]);
  const [exp, setExp] = useState(EXPERIENCE[0]);
  const [sal, setSal] = useState(SALARY[0].label);
  const [sort, setSort] = useState<(typeof SORTS)[number]>(SORTS[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchJobs()
      .then((items) => {
        if (active) setJobs(items);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Unable to load jobs.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const results = useMemo(() => {
    const salMin = SALARY.find((s) => s.label === sal)?.min ?? 0;
    const filtered = jobs.filter((j) => {
      if (query && !`${j.title} ${j.company}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (loc !== LOCATIONS[0] && j.location !== loc) return false;
      if (cat !== CATEGORIES[0] && j.category !== cat) return false;
      if (type !== TYPES[0] && j.type !== type) return false;
      if (exp !== EXPERIENCE[0] && j.experience !== exp) return false;
      if (j.salaryMin < salMin) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "Highest salary") return b.salaryMin - a.salaryMin;
      if (sort === "Company A-Z") return a.company.localeCompare(b.company);
      return a.postedDays - b.postedDays;
    });
  }, [jobs, query, loc, cat, type, exp, sal, sort]);

  function clearFilters() {
    setQuery("");
    setLoc(LOCATIONS[0]);
    setCat(CATEGORIES[0]);
    setType(TYPES[0]);
    setExp(EXPERIENCE[0]);
    setSal(SALARY[0].label);
    setSort(SORTS[0]);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Find your next role in Sierra Leone
          </h1>
          <p className="mt-2 max-w-xl text-white/80">
            {jobs.length}+ live openings from Sierra Leone employers.
          </p>
          <label className="mt-6 flex items-center gap-2 rounded-2xl bg-white p-2 shadow-glow">
            <span className="sr-only">Search jobs</span>
            <Search className="ml-2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, company or keyword"
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-foreground outline-none"
            />
            <button
              type="button"
              onClick={() => setQuery(query.trim())}
              className="rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
            >
              Search
            </button>
          </label>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </div>
            <Filter label="Location" value={loc} onChange={setLoc} options={LOCATIONS} />
            <Filter label="Job Category" value={cat} onChange={setCat} options={CATEGORIES} />
            <Filter label="Job Type" value={type} onChange={setType} options={TYPES} />
            <Filter
              label="Salary Range"
              value={sal}
              onChange={setSal}
              options={SALARY.map((s) => s.label)}
            />
            <Filter label="Experience" value={exp} onChange={setExp} options={EXPERIENCE} />
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-secondary hover:border-primary/40"
            >
              Clear filters
            </button>
          </aside>

          <section>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{results.length}</span> jobs found
              </p>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                Sort
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
                  className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {SORTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4">
              {error && (
                <div
                  role="alert"
                  className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-sm font-medium text-destructive"
                >
                  {error}
                </div>
              )}
              {loading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid animate-pulse gap-4 rounded-2xl border border-border bg-card p-5 shadow-card sm:grid-cols-[auto_1fr_auto]"
                    aria-label="Loading job results"
                  >
                    <div className="h-14 w-14 rounded-xl bg-muted" />
                    <div className="space-y-3">
                      <div className="h-4 w-2/3 rounded bg-muted" />
                      <div className="h-3 w-1/3 rounded bg-muted" />
                      <div className="h-3 w-4/5 rounded bg-muted" />
                    </div>
                    <div className="h-9 w-20 rounded-lg bg-muted" />
                  </div>
                ))}
              {!loading && results.map((job) => <JobCard key={job.id} job={job} />)}
              {!loading && !error && results.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-accent text-secondary">
                    <Search className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No jobs match your filters. Try adjusting them.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground"
                  >
                    Reset search
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="mt-5">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

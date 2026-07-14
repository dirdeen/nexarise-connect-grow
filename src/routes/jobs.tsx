import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, CompanyLogo } from "@/components/AppShell";
import { JOBS } from "@/lib/jobs";
import { Search, MapPin, Clock, Wallet, Bookmark, SlidersHorizontal } from "lucide-react";

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

function JobSearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loc, setLoc] = useState(LOCATIONS[0]);
  const [cat, setCat] = useState(CATEGORIES[0]);
  const [type, setType] = useState(TYPES[0]);
  const [exp, setExp] = useState(EXPERIENCE[0]);
  const [sal, setSal] = useState(SALARY[0].label);

  const results = useMemo(() => {
    const salMin = SALARY.find((s) => s.label === sal)?.min ?? 0;
    return JOBS.filter((j) => {
      if (query && !`${j.title} ${j.company}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (loc !== LOCATIONS[0] && j.location !== loc) return false;
      if (cat !== CATEGORIES[0] && j.category !== cat) return false;
      if (type !== TYPES[0] && j.type !== type) return false;
      if (exp !== EXPERIENCE[0] && j.experience !== exp) return false;
      if (j.salaryMin < salMin) return false;
      return true;
    });
  }, [query, loc, cat, type, exp, sal]);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Find your next role in Sierra Leone
          </h1>
          <p className="mt-2 max-w-xl text-white/80">
            {JOBS.length}+ live openings from Sierra Leone's leading employers.
          </p>
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-white p-2 shadow-glow">
            <Search className="ml-2 h-5 w-5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, company or keyword"
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-foreground outline-none"
            />
            <button className="rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow">
              Search
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </div>
            <Filter label="Location" value={loc} onChange={setLoc} options={LOCATIONS} />
            <Filter label="Job Category" value={cat} onChange={setCat} options={CATEGORIES} />
            <Filter
              label="Salary Range"
              value={sal}
              onChange={setSal}
              options={SALARY.map((s) => s.label)}
            />
            <Filter label="Experience" value={exp} onChange={setExp} options={EXPERIENCE} />
            <Filter label="Employment Type" value={type} onChange={setType} options={TYPES} />
          </aside>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{results.length}</span> jobs found
              </p>
              <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground">
                <option>Sort: Most recent</option>
                <option>Sort: Highest salary</option>
              </select>
            </div>

            <div className="grid gap-4">
              {results.map((job) => (
                <article
                  key={job.id}
                  onClick={() => navigate({ to: "/jobs/$jobId", params: { jobId: job.id } })}
                  className="group grid cursor-pointer gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant sm:grid-cols-[auto_1fr_auto]"
                >
                  <CompanyLogo name={job.company} color={job.logoColor} size={56} />
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold text-secondary group-hover:text-primary">
                      {job.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Wallet className="h-3.5 w-3.5" />
                        {job.salary}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {job.type}
                      </span>
                      <span>Posted {job.postedDays}d ago</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary"
                      aria-label="Save"
                    >
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate({ to: "/jobs/$jobId/apply", params: { jobId: job.id } });
                      }}
                      className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-glow"
                    >
                      Apply
                    </button>
                  </div>
                </article>
              ))}
              {results.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    No jobs match your filters. Try adjusting them.
                  </p>
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

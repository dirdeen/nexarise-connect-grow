import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { MentorCard } from "@/components/MentorCard";
import { MentorshipShell } from "@/components/MentorshipShell";
import { MENTOR_INDUSTRIES, MENTORS, type MentorIndustry } from "@/lib/mentorship";

export const Route = createFileRoute("/mentorship/mentors")({
  head: () => ({ meta: [{ title: "Mentor Directory - NexaRise" }] }),
  component: MentorDirectory,
});

const SKILLS = [
  "All skills",
  "Product strategy",
  "Interview coaching",
  "Business planning",
  "CV review",
  "Policy research",
];
const EXPERIENCE = ["Any experience", "7+ years", "8+ years", "10+ years", "12+ years"];

function MentorDirectory() {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState<MentorIndustry | "All industries">("All industries");
  const [skill, setSkill] = useState(SKILLS[0]);
  const [experience, setExperience] = useState(EXPERIENCE[0]);

  const mentors = useMemo(() => {
    const years = experience === EXPERIENCE[0] ? 0 : Number.parseInt(experience, 10);

    return MENTORS.filter((mentor) => {
      if (
        query &&
        !`${mentor.name} ${mentor.title} ${mentor.company} ${mentor.skills.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ) {
        return false;
      }
      if (industry !== "All industries" && mentor.industry !== industry) return false;
      if (skill !== SKILLS[0] && !mentor.skills.includes(skill)) return false;
      if (years > 0 && Number.parseInt(mentor.experience, 10) < years) return false;
      return true;
    });
  }, [experience, industry, query, skill]);

  return (
    <MentorshipShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        <section className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Mentor directory</h1>
          <p className="mt-2 max-w-xl text-white/80">
            Search verified mentors by industry, skill and experience.
          </p>
          <label className="mt-6 flex items-center gap-2 rounded-2xl bg-white p-2 shadow-glow">
            <span className="sr-only">Search mentors</span>
            <Search className="ml-2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by mentor, company or skill"
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-foreground outline-none"
            />
          </label>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </div>
            <Filter
              label="Industry"
              value={industry}
              options={MENTOR_INDUSTRIES}
              onChange={(value) => setIndustry(value as MentorIndustry | "All industries")}
            />
            <Filter label="Skills" value={skill} options={SKILLS} onChange={setSkill} />
            <Filter
              label="Experience"
              value={experience}
              options={EXPERIENCE}
              onChange={setExperience}
            />
          </aside>

          <section>
            <div className="mb-4 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{mentors.length}</span> mentors found
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {mentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
            {mentors.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                <p className="text-sm text-muted-foreground">
                  No mentors match these filters. Try widening your search.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </MentorshipShell>
  );
}

function Filter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-5 block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-input mt-1.5"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  CalendarCheck,
  CheckCircle2,
  Inbox,
  PlusCircle,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import { MentorshipShell, MentorshipStat } from "@/components/MentorshipShell";
import {
  CONVERSATIONS,
  fetchCurrentMentorProfile,
  fetchMentorshipPrograms,
  MENTEES,
  NOTIFICATIONS,
  SESSIONS,
  type MentorProfileRecord,
  type MentorshipProgram,
} from "@/lib/mentorship";
import { getCurrentProfile, type Profile } from "@/lib/production";

export const Route = createFileRoute("/mentorship/dashboard")({
  head: () => ({ meta: [{ title: "Mentor Dashboard - NexaRise" }] }),
  component: MentorDashboard,
});

function MentorDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mentorProfile, setMentorProfile] = useState<MentorProfileRecord | null>(null);
  const [programs, setPrograms] = useState<MentorshipProgram[]>([]);
  const activeMentees = MENTEES.filter((mentee) => mentee.status === "Active");
  const pendingRequests = MENTEES.filter((mentee) => mentee.status === "Pending");
  const upcomingSessions = SESSIONS.filter((session) => session.status === "Upcoming");
  const unreadMessages = CONVERSATIONS.filter((conversation) => !conversation.read).length;

  useEffect(() => {
    let active = true;
    Promise.all([getCurrentProfile(), fetchCurrentMentorProfile(), fetchMentorshipPrograms()])
      .then(([currentProfile, currentMentorProfile, currentPrograms]) => {
        if (!active) return;
        setProfile(currentProfile);
        setMentorProfile(currentMentorProfile);
        setPrograms(currentPrograms);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <MentorshipShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        <section className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            Mentor Dashboard
          </span>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="font-display text-3xl font-bold sm:text-4xl">
                Welcome back, {profile?.full_name ?? "Mentor"}
              </h1>
              <p className="mt-2 max-w-2xl text-white/80">
                Manage your profile, mentorship programs, requests, sessions and messages from one
                mentor workspace.
              </p>
            </div>
            <Link
              to="/mentorship/programs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-secondary shadow-glow hover:bg-white/95"
            >
              <PlusCircle className="h-4 w-4" />
              Post program
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MentorshipStat label="Programs" value={`${programs.length}`} helper="created by you" />
          <MentorshipStat
            label="Pending requests"
            value={`${pendingRequests.length}`}
            helper="needs review"
          />
          <MentorshipStat
            label="Upcoming sessions"
            value={`${upcomingSessions.length}`}
            helper="this week"
          />
          <MentorshipStat label="Messages" value={`${unreadMessages}`} helper="unread" />
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-secondary">
                  Active mentees
                </h2>
                <p className="text-sm text-muted-foreground">
                  Current mentorship relationships and next steps.
                </p>
              </div>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-5 grid gap-4">
              {activeMentees.length ? (
                activeMentees.map((mentee) => (
                  <article key={mentee.id} className="rounded-xl bg-accent p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-base font-semibold text-secondary">
                          {mentee.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">{mentee.focus}</p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        {mentee.status}
                      </span>
                    </div>
                    <div className="mt-3 text-xs font-semibold text-secondary">
                      Next: {mentee.nextStep}
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-background p-5 text-sm text-muted-foreground">
                  No active mentee relationships yet.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-secondary">
              Profile completion
            </h2>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="font-semibold text-secondary">
                {profileCompletion(mentorProfile)}%
              </span>
              <span className="text-muted-foreground">Mentor profile</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-primary"
                style={{ width: `${profileCompletion(mentorProfile)}%` }}
              />
            </div>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                ["Biography", Boolean(mentorProfile?.biography)],
                ["Skills", Boolean(mentorProfile?.skills.length)],
                ["Availability", Boolean(mentorProfile?.availability)],
                ["Certifications", Boolean(mentorProfile?.certifications.length)],
              ].map(([label, done]) => (
                <li key={label as string} className="flex items-center gap-2">
                  <CheckCircle2
                    className={`h-4 w-4 ${done ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <span className={done ? "text-foreground" : "text-muted-foreground"}>
                    {label as string}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <Panel
            title="Pending requests"
            icon={UserPlus}
            items={pendingRequests.map((mentee) => `${mentee.name}: ${mentee.focus}`)}
            to="/mentorship/request"
          />
          <Panel
            title="Upcoming sessions"
            icon={CalendarCheck}
            items={upcomingSessions.map(
              (session) => `${session.date}, ${session.time}: ${session.topic}`,
            )}
            to="/mentorship/sessions"
          />
          <Panel
            title="Notifications"
            icon={Bell}
            items={NOTIFICATIONS.slice(0, 3).map((notification) => notification.message)}
            to="/mentorship/notifications"
          />
        </div>
      </div>
    </MentorshipShell>
  );
}

function profileCompletion(profile: MentorProfileRecord | null) {
  const values = [
    profile?.full_name,
    profile?.phone,
    profile?.location,
    profile?.headline,
    profile?.biography,
    profile?.industry,
    profile?.skills.length ? "skills" : "",
    profile?.availability,
    profile?.years_of_experience ? "experience" : "",
  ];
  return Math.round((values.filter(Boolean).length / values.length) * 100);
}

function Panel({
  title,
  icon: Icon,
  items,
  to,
}: {
  title: string;
  icon: typeof Bell;
  items: string[];
  to: "/mentorship/request" | "/mentorship/sessions" | "/mentorship/notifications";
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-secondary">{title}</h2>
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item} className="rounded-xl bg-accent p-3">
              {item}
            </li>
          ))
        ) : (
          <li className="rounded-xl border border-dashed border-border p-3">
            No records available yet.
          </li>
        )}
      </ul>
      <Link to={to} className="mt-4 inline-flex text-sm font-semibold text-primary">
        View all
      </Link>
    </section>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Paperclip, Send } from "lucide-react";

import { MentorshipShell } from "@/components/MentorshipShell";
import { CONVERSATIONS, findConversation } from "@/lib/mentorship";

export const Route = createFileRoute("/mentorship/messages")({
  validateSearch: (search: Record<string, unknown>) => ({
    conversation:
      typeof search.conversation === "string" ? search.conversation : CONVERSATIONS[0].id,
  }),
  head: () => ({ meta: [{ title: "Mentorship Messages - NexaRise" }] }),
  component: MessagesPage,
});

function MessagesPage() {
  const { conversation: conversationId } = Route.useSearch();
  const conversation = findConversation(conversationId) ?? CONVERSATIONS[0];

  return (
    <MentorshipShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="mb-8">
          <span className="text-sm font-semibold text-primary">Mentorship</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-secondary">Messages</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review mentorship conversations, attachments and read status.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <h2 className="font-display text-lg font-semibold text-secondary">Inbox</h2>
            <div className="mt-4 space-y-2">
              {CONVERSATIONS.map((item) => (
                <Link
                  key={item.id}
                  to="/mentorship/messages"
                  search={{ conversation: item.id }}
                  className={`block rounded-xl p-4 ${
                    item.id === conversation.id ? "bg-accent text-secondary" : "hover:bg-accent/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-display text-sm font-semibold text-secondary">
                      {item.participant}
                    </div>
                    {!item.read && (
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-label="Unread" />
                    )}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{item.role}</div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {item.lastMessage}
                  </p>
                </Link>
              ))}
            </div>
          </aside>

          <section className="rounded-2xl border border-border bg-card shadow-card">
            <div className="border-b border-border p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-semibold text-secondary">
                    {conversation.participant}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{conversation.role}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-secondary">
                  <Paperclip className="h-3.5 w-3.5" />
                  {conversation.attachments} attachments
                </span>
              </div>
            </div>

            <div className="space-y-4 p-5">
              {conversation.messages.map((message) => (
                <div
                  key={`${message.time}-${message.body}`}
                  className={`flex ${message.from === "mentor" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm ${
                      message.from === "mentor"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-accent text-secondary"
                    }`}
                  >
                    <p>{message.body}</p>
                    <div className="mt-2 text-[11px] opacity-75">
                      {message.time} · {message.read ? "Read" : "Unread"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-5">
              <label className="flex items-center gap-2 rounded-2xl border border-border bg-background p-2">
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-secondary"
                  aria-label="Attach file"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none"
                  placeholder="Write a message"
                  aria-label="Write a message"
                />
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-secondary-foreground"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </label>
            </div>
          </section>
        </div>
      </div>
    </MentorshipShell>
  );
}

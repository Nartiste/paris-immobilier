"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, X, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { Commune } from "@/lib/types";
import { track } from "@/lib/analytics";
import { scoreToColor } from "@/lib/scoring";

type Msg = { role: "user" | "assistant"; content: string };

type ConciergeReply = {
  intro?: string;
  recommendations?: { insee: string; nom: string; score_match: number; raison: string }[];
  follow_up?: string;
};

const SUGGESTIONS = [
  "Budget 350k€, 1h max de Paris, école pour 2 enfants",
  "Locataire, télétravail 3j/semaine, près d'une gare RER",
  "Investissement locatif, rendement >5%, hors IDF",
  "Quitter Paris pour la nature, train direct disponible",
];

type Props = {
  communes: Commune[];
  onPickCommune: (insee: string) => void;
};

export default function Concierge({ communes, onPickCommune }: Props) {
  const { conciergeOpen, setConciergeOpen } = useAppStore();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamBuf, setStreamBuf] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamBuf]);

  if (!conciergeOpen) return null;

  const send = async (text: string) => {
    if (!text.trim() || streaming) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setDraft("");
    setStreaming(true);
    setStreamBuf("");
    track("concierge_message", { length: text.length });

    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "Erreur" }));
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: JSON.stringify({
              intro: "",
              follow_up: err.error ?? "Erreur, réessayez.",
            }),
          },
        ]);
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const evt = JSON.parse(line.slice(6));
            if (evt.delta) {
              acc += evt.delta;
              setStreamBuf(acc);
            }
          } catch {
            // ignore
          }
        }
      }

      setMessages((m) => [...m, { role: "assistant", content: acc }]);
      setStreamBuf("");
      track("concierge_recommendation", { length: acc.length });
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: JSON.stringify({
            follow_up: "Erreur réseau, réessayez.",
          }),
        },
      ]);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-3 sm:p-6">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={() => setConciergeOpen(false)}
      />
      <div className="relative flex h-full max-h-[640px] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-100 bg-gradient-to-r from-violet-50 to-white px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-neutral-900">Concierge IA</div>
              <div className="text-[10px] text-neutral-500">Décrivez votre projet</div>
            </div>
          </div>
          <button
            onClick={() => setConciergeOpen(false)}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && !streaming && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-700">
                Salut ! Décrivez votre projet : budget, temps de trajet vers Paris,
                situation familiale… je vous propose les communes les plus adaptées
                en quelques secondes.
              </p>
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                  Exemples
                </p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="block w-full rounded-md border border-neutral-200 px-2.5 py-1.5 text-left text-xs text-neutral-700 hover:border-violet-300 hover:bg-violet-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <ChatBubble
              key={i}
              role={m.role}
              content={m.content}
              communes={communes}
              onPickCommune={onPickCommune}
            />
          ))}

          {streaming && streamBuf && (
            <ChatBubble
              role="assistant"
              content={streamBuf}
              partial
              communes={communes}
              onPickCommune={onPickCommune}
            />
          )}

          {streaming && !streamBuf && (
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Recherche dans 80+ communes…
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="border-t border-neutral-100 p-3"
        >
          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(draft);
                }
              }}
              rows={1}
              placeholder="Votre projet en une phrase…"
              className="flex-1 resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none"
              disabled={streaming}
            />
            <button
              type="submit"
              disabled={streaming || !draft.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white transition-colors hover:bg-violet-700 disabled:bg-neutral-300"
              aria-label="Envoyer"
            >
              {streaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mt-1 text-[9px] text-neutral-400">
            Propulsé par Claude. Les recommandations sont indicatives, vérifiez les données avant tout engagement.
          </p>
        </form>
      </div>
    </div>
  );
}

function ChatBubble({
  role,
  content,
  partial,
  communes,
  onPickCommune,
}: {
  role: "user" | "assistant";
  content: string;
  partial?: boolean;
  communes: Commune[];
  onPickCommune: (insee: string) => void;
}) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-neutral-900 px-3 py-2 text-sm text-white">
          {content}
        </div>
      </div>
    );
  }

  // Strip optional markdown code fences (```json ... ``` or ``` ... ```)
  // that the LLM may add even though the prompt says not to.
  const cleaned = content
    .replace(/^\s*```(?:json)?\s*\n?/i, "")
    .replace(/\n?\s*```\s*$/i, "")
    .trim();

  // Try to parse as JSON ConciergeReply
  let parsed: ConciergeReply | null = null;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Could be partial JSON during streaming — try to salvage intro
    const introMatch = cleaned.match(/"intro":\s*"([^"]*)/);
    const followMatch = cleaned.match(/"follow_up":\s*"([^"]*)/);
    if (introMatch || followMatch) {
      parsed = {
        intro: introMatch?.[1],
        follow_up: followMatch?.[1],
      };
    }
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] space-y-2">
        {parsed?.intro && (
          <div className="rounded-2xl rounded-bl-sm bg-violet-50 px-3 py-2 text-sm text-neutral-800">
            {parsed.intro}
            {partial && <span className="ml-1 inline-block h-3 w-1 animate-pulse bg-violet-400" />}
          </div>
        )}

        {parsed?.recommendations?.map((r) => {
          const c = communes.find((x) => x.code_insee === r.insee);
          const color = scoreToColor(r.score_match);
          return (
            <button
              key={r.insee}
              onClick={() => onPickCommune(r.insee)}
              className="flex w-full items-start gap-3 rounded-xl border border-neutral-200 bg-white p-3 text-left transition-colors hover:border-violet-300 hover:bg-violet-50/50"
            >
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold tabular-nums text-white"
                style={{ backgroundColor: color }}
              >
                {r.score_match}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-neutral-900">
                    {r.nom}
                  </span>
                  {c && (
                    <span className="text-[10px] text-neutral-500">
                      {c.code_postal} · {c.temps_trajet_paris_min} min
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-600">{r.raison}</p>
              </div>
            </button>
          );
        })}

        {parsed?.follow_up && (
          <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-3 py-2 text-xs italic text-neutral-600">
            {parsed.follow_up}
          </div>
        )}

        {!parsed && !partial && (
          <div className="rounded-2xl rounded-bl-sm bg-violet-50 px-3 py-2 text-sm text-neutral-800">
            {content}
          </div>
        )}
      </div>
    </div>
  );
}

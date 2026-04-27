"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { track } from "@/lib/analytics";

export default function EarlyAccessForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    track("premium_signup_intent", { email_domain: email.split("@")[1] ?? "" });
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "pricing_page" }),
      });
      const data = await res.json();
      if (res.ok) {
        setState("ok");
      } else {
        setErrMsg(data.error ?? "Erreur");
        setState("err");
      }
    } catch {
      setErrMsg("Erreur réseau");
      setState("err");
    }
  };

  if (state === "ok") {
    return (
      <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        <Check className="h-4 w-4" />
        Inscription confirmée. On vous prévient dès l'ouverture du Premium.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="vous@email.com"
        className="w-full max-w-xs rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
        disabled={state === "loading"}
      />
      <button
        type="submit"
        disabled={state === "loading" || !email}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:bg-neutral-300"
      >
        {state === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Envoi…
          </>
        ) : (
          "Réserver mon accès"
        )}
      </button>
      {state === "err" && (
        <p className="text-xs text-red-600">{errMsg}</p>
      )}
    </form>
  );
}

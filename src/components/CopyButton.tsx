import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyText } from "@/lib/export";

export function CopyButton({ text, label = "Copy", className = "" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        if (await copyText(text)) {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        }
      }}
      className={`btn-ghost text-xs ${className}`}
    >
      {done ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {done ? "Copied" : label}
    </button>
  );
}
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-danger mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-3">Something went wrong</h2>
        <p className="text-muted mb-6">{error.message || "An unexpected error occurred"}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-glow transition-all"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-border text-muted hover:text-white transition-all"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

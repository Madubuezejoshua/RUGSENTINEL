import Link from "next/link";
import { Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <Shield className="w-16 h-16 text-accent mx-auto mb-6" />
        <h1 className="text-4xl font-black text-white mb-3">404</h1>
        <p className="text-muted mb-6">Page not found</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-glow transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

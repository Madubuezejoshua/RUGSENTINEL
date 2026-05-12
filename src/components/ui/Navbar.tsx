"use client";

import Link from "next/link";
import { Shield, Activity, Clock, Github } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Shield className="w-7 h-7 text-accent group-hover:text-accent-glow transition-colors" />
              <div className="absolute inset-0 bg-accent/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-white">Rug</span>
              <span className="text-accent">Sentinel</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/scan"
              className="flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors"
            >
              <Activity className="w-4 h-4" />
              Scan Token
            </Link>
            <Link
              href="/history"
              className="flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors"
            >
              <Clock className="w-4 h-4" />
              History
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-safe/10 border border-safe/20">
              <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
              <span className="text-xs text-safe font-medium">Live</span>
            </div>
            <a
              href="https://github.com/joshuamxt01/RUGSENTINEL"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-muted hover:text-white hover:bg-surface transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

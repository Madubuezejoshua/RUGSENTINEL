"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Activity, Clock, Github, BarChart2 } from "lucide-react";

export default function Navbar() {
  const path = usePathname();
  const isLanding = path === "/";

  if (isLanding) return null; // landing has its own nav

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: "rgba(15,16,16,0.92)",
        borderColor: "var(--dash-border, #252828)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ background: "#c8f135" }}
          >
            <Shield className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">
            Rug<span style={{ color: "#c8f135" }}>Sentinel</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { href: "/", label: "Home" },
            { href: "/how-it-works", label: "How It Works" },
            { href: "/features", label: "Features" },
            { href: "/scan", label: "Scan" },
            { href: "/results", label: "Results" },
            { href: "/history", label: "History" },
          ].map(l => {
            const active = path === l.href || (l.href !== "/" && path.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: active ? "rgba(200,241,53,0.1)" : "transparent",
                  color: active ? "#c8f135" : "#6b7070",
                  border: active ? "1px solid rgba(200,241,53,0.2)" : "1px solid transparent",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
            Live
          </div>
          <a
            href="https://github.com/Madubuezejoshua/RUGSENTINEL"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg transition-all"
            style={{ color: "#6b7070" }}
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </nav>
  );
}

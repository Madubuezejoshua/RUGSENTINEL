# RugSentinel 🛡️

> Detect rug pulls before they happen

RugSentinel is a full-stack Web3 security analytics platform that analyzes any ERC-20 token smart contract and generates a real-time rug-pull risk score using blockchain data, market data, and AI explanations.

## Features

- **Real-Time Analysis** — Pulls live data from Alchemy, Moralis, Etherscan, and CoinMarketCap
- **Deterministic Risk Engine** — 6-factor scoring system starting at 100, deducting for each red flag
- **AI Explanations** — Groq LLaMA3 explains risks in plain English
- **Modern Dashboard** — Bloomberg-terminal-inspired dark UI
- **Scan History** — All results stored in Supabase

## Risk Factors

| Factor | Deduction |
|--------|-----------|
| Top wallet holds >50% supply | -35 pts |
| Low/unstable liquidity | -25 pts |
| Contract not verified | -20 pts |
| Ownership not renounced | -15 pts |
| Token age < 7 days | -10 pts |
| Abnormal trading volume | -10 pts |

## Risk Levels

- **70-100** → SAFE (green)
- **40-69** → MEDIUM (yellow)
- **0-39** → HIGH RISK (red)

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Next.js API Routes
- **Blockchain**: Alchemy API, Moralis API, Etherscan API
- **Market Data**: CoinMarketCap API
- **AI**: Groq (LLaMA3-8b)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in your API keys
3. Run the Supabase schema from `supabase/schema.sql`
4. Install dependencies: `npm install`
5. Run dev server: `npm run dev`

## Deployment

Deploy to Vercel:
```bash
vercel --prod
```

Add all environment variables from `.env.local` to your Vercel project settings.

## Disclaimer

RugSentinel is for informational purposes only. Not financial advice. Always do your own research before investing in any cryptocurrency.

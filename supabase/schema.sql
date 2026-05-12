-- RugSentinel Database Schema
-- Run this in your Supabase SQL editor

-- Scan history table
CREATE TABLE IF NOT EXISTS scan_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token_address TEXT NOT NULL,
  token_name TEXT,
  token_symbol TEXT,
  risk_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('SAFE', 'MEDIUM', 'HIGH')),
  ai_explanation TEXT,
  token_data JSONB,
  risk_factors JSONB,
  analyzed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_scan_history_token_address ON scan_history(token_address);
CREATE INDEX IF NOT EXISTS idx_scan_history_analyzed_at ON scan_history(analyzed_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_history_risk_level ON scan_history(risk_level);

-- Enable Row Level Security
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anyone can view scan history)
CREATE POLICY "Allow public read" ON scan_history
  FOR SELECT USING (true);

-- Allow service role to insert (backend only)
CREATE POLICY "Allow service role insert" ON scan_history
  FOR INSERT WITH CHECK (true);

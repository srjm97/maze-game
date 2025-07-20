import React, { useEffect, useState } from 'react';
import { SAMPLE_HIGH_SCORES } from '../../constants/sampleScores';

interface HighScore {
  user_email: string;
  score: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

type ScoreGame = 'maze' | 'tiles';

async function fetchTopScores(game: ScoreGame): Promise<HighScore[]> {
  const url = `/score/top10?game_name=${encodeURIComponent(game)}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Failed to load scores (${res.status})`);
  const data = await res.json();
  return Array.isArray(data?.top_10_scores) ? data.top_10_scores : [];
}

export function HighScoresSidenav({ open, onClose }: Props) {
  const [game, setGame] = useState<ScoreGame>('maze');
  const [scores, setScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Load scores when panel opens or game changes
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const s = await fetchTopScores(game);
        if (!cancelled) setScores(SAMPLE_HIGH_SCORES[game] || s);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? 'Error loading scores');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, game]);

  return (
    <aside
      className={`hs-sidenav ${open ? 'open' : ''}`}
      aria-hidden={!open}
      aria-label="High scores side panel"
    >
      <div className="hs-sidenav-header">
        <h2>High Scores</h2>
        <button
          aria-label="Close high scores"
          className="hs-close-btn"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      {/* Game selector */}
      <div className="hs-game-tabs">
        {(['maze', 'tiles'] as ScoreGame[]).map((g) => (
          <button
            key={g}
            className={`hs-tab ${game === g ? 'active' : ''}`}
            onClick={() => setGame(g)}
          >
            {g === 'maze' ? 'Maze Game' : 'Memory Tiles'}
          </button>
        ))}
      </div>

      <div className="hs-scores-body">
        {loading ? (
          <div className="hs-loading">Loading…</div>
        ) : err ? (
          <div className="hs-error">{err}</div>
        ) : scores.length === 0 ? (
          <div className="hs-empty">No scores yet.</div>
        ) : (
          <ol className="hs-score-list">
            {scores.map((s, i) => (
              <li key={i} className="hs-score-item">
                <span className="hs-rank">{i + 1}.</span>
                <span className="hs-email">{s.user_email}</span>
                <span className="hs-score">{s.score}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </aside>
  );
}

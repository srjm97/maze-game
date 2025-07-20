// sampleScores.ts
export interface HighScore {
  user_email: string;
  score: number;
}

export type ScoreGame = 'maze' | 'tiles';

export const SAMPLE_HIGH_SCORES: Record<ScoreGame, HighScore[]> = {
  maze: [
    { user_email: 'lina@puzzlelab.io', score: 987 },
    { user_email: 'chris@example.com', score: 942 },
    { user_email: 'speedrunner@maze.gg', score: 901 },
    { user_email: 'raj.deep@playzone.in', score: 880 },
    { user_email: 'samuel@outlook.com', score: 845 },
    { user_email: 'avery.long.email.address+maze@testdomain.co.uk', score: 812 },
    { user_email: 'nadia@players.org', score: 799 },
    { user_email: 'lee@mazing.dev', score: 760 },
    { user_email: 'guest123@anonmail.com', score: 733 },
    { user_email: 'zoe@arcade.fun', score: 700 },
  ],
  tiles: [
    { user_email: 'brainbuff@neuroplay.ai', score: 1200 },
    { user_email: 'max@tilespro.com', score: 1188 },
    { user_email: 'maya@colorflip.net', score: 1175 },
    { user_email: 'charlie@matchit.gg', score: 1150 },
    { user_email: 'eric@fastclick.io', score: 1125 },
    { user_email: 'tina@eduplay.org', score: 1100 },
    { user_email: 'olivia@tilesfan.app', score: 1092 },
    { user_email: 'guest@anonmail.com', score: 1080 },
    { user_email: 'dev@test.dev', score: 1050 },
    { user_email: 'player@sample.com', score: 1000 },
  ],
};

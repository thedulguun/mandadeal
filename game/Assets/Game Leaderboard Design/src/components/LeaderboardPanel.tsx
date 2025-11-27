import { LeaderboardEntry } from "./LeaderboardEntry";
import { X } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "PLAYER NAME", flagPoints: 826 },
  { rank: 2, name: "PLAYER NAME", flagPoints: 756 },
  { rank: 3, name: "PLAYER NAME", flagPoints: 725 },
  { rank: 4, name: "PLAYER NAME", flagPoints: 675 },
  { rank: 5, name: "PLAYER NAME", flagPoints: 645 },
  { rank: 6, name: "PLAYER NAME", flagPoints: 505 },
  { rank: 7, name: "PLAYER NAME", flagPoints: 403 },
  { rank: 8, name: "PLAYER NAME", flagPoints: 304 },
  { rank: 9, name: "PLAYER NAME", flagPoints: 202 },
  { rank: 10, name: "PLAYER NAME", flagPoints: 105 },
];

export function LeaderboardPanel() {
  return (
    <div className="relative w-full max-w-4xl">
      {/* Header */}
      <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-blue-600 border-2 md:border-4 border-blue-400 rounded-lg px-4 py-2 md:px-8 md:py-3 shadow-lg">
          <h1 className="text-white tracking-wider uppercase text-sm md:text-base">Leaderboard</h1>
        </div>
      </div>

      {/* Close Button */}
      <button className="absolute -top-3 md:-top-4 -right-2 md:-right-4 z-20 bg-red-600 hover:bg-red-700 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg border-2 md:border-4 border-red-400 transition-colors">
        <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </button>

      {/* Main Panel */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 rounded-2xl md:rounded-3xl p-4 md:p-8 pt-8 md:pt-12 shadow-2xl border-2 md:border-4 border-blue-900 relative overflow-hidden">
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
        }}></div>

        {/* Leaderboard entries */}
        <div className="space-y-2 md:space-y-3 relative z-10">
          {leaderboardData.map((entry) => (
            <LeaderboardEntry
              key={entry.rank}
              rank={entry.rank}
              name={entry.name}
              flagPoints={entry.flagPoints}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
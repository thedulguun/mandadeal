import { User, Flag } from "lucide-react";

interface LeaderboardEntryProps {
  rank: number;
  name: string;
  flagPoints: number;
}

export function LeaderboardEntry({ rank, name, flagPoints }: LeaderboardEntryProps) {
  const getMedalIcon = () => {
    if (rank === 1) {
      return (
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-sm"></div>
          <div className="relative bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border-2 border-yellow-200 shadow-lg">
            <span className="text-yellow-900 text-sm md:text-base">1</span>
          </div>
          <div className="absolute -top-1 md:-top-2 left-1/2 -translate-x-1/2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="md:w-6 md:h-6">
              <path d="M8 2L9 8L8 2Z" fill="#DC2626" />
              <path d="M16 2L15 8L16 2Z" fill="#DC2626" />
              <rect x="8" y="1" width="2" height="8" fill="#DC2626" />
              <rect x="14" y="1" width="2" height="8" fill="#DC2626" />
            </svg>
          </div>
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="relative">
          <div className="absolute inset-0 bg-gray-300 rounded-full blur-sm"></div>
          <div className="relative bg-gradient-to-br from-gray-200 to-gray-400 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border-2 border-gray-100 shadow-lg">
            <span className="text-gray-700 text-sm md:text-base">2</span>
          </div>
          <div className="absolute -top-1 md:-top-2 left-1/2 -translate-x-1/2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="md:w-6 md:h-6">
              <path d="M8 2L9 8L8 2Z" fill="#DC2626" />
              <path d="M16 2L15 8L16 2Z" fill="#DC2626" />
              <rect x="8" y="1" width="2" height="8" fill="#DC2626" />
              <rect x="14" y="1" width="2" height="8" fill="#DC2626" />
            </svg>
          </div>
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="relative">
          <div className="absolute inset-0 bg-orange-400 rounded-full blur-sm"></div>
          <div className="relative bg-gradient-to-br from-orange-300 to-orange-600 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border-2 border-orange-200 shadow-lg">
            <span className="text-orange-900 text-sm md:text-base">3</span>
          </div>
          <div className="absolute -top-1 md:-top-2 left-1/2 -translate-x-1/2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="md:w-6 md:h-6">
              <path d="M8 2L9 8L8 2Z" fill="#DC2626" />
              <path d="M16 2L15 8L16 2Z" fill="#DC2626" />
              <rect x="8" y="1" width="2" height="8" fill="#DC2626" />
              <rect x="14" y="1" width="2" height="8" fill="#DC2626" />
            </svg>
          </div>
        </div>
      );
    }
    return (
      <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
        <span className="text-white text-sm md:text-base">{rank}</span>
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2 md:gap-4">
      {/* Rank/Medal */}
      <div className="flex-shrink-0 w-8 md:w-10">
        {getMedalIcon()}
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="bg-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg">
          <User className="w-6 h-6 md:w-8 md:h-8 text-gray-600" />
        </div>
      </div>

      {/* Info Panel */}
      <div className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg px-3 py-2 md:px-6 md:py-3 flex items-center justify-between shadow-lg border border-blue-500 md:border-2">
        {/* Player Name */}
        <span className="text-white tracking-wide uppercase text-xs md:text-base truncate mr-2">{name}</span>

        {/* Flag Points */}
        <div className="flex items-center gap-1 md:gap-2 bg-blue-800 rounded-lg px-2 py-1 md:px-4 border border-blue-600 md:border-2 flex-shrink-0">
          <Flag className="w-4 h-4 md:w-5 md:h-5 text-green-400 fill-green-400" />
          <span className="text-white text-xs md:text-base">{flagPoints}</span>
        </div>
      </div>
    </div>
  );
}
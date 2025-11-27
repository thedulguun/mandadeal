import { Heart, Droplet, Zap } from "lucide-react";

export function CharacterPanel() {
  return (
    <div className="bg-black/60 backdrop-blur-sm border border-slate-600/50 rounded-lg p-4 w-80">
      {/* Character Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-2xl">⚔️</span>
        </div>
        <div>
          <h3 className="text-white">Aria Stormborn</h3>
          <p className="text-slate-400 text-sm">Level 42 Warrior</p>
        </div>
      </div>

      {/* Health Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-red-400 text-sm">
            <Heart className="w-4 h-4" />
            <span>Health</span>
          </div>
          <span className="text-slate-300 text-sm">2,450 / 3,200</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all"
            style={{ width: '76.5%' }}
          />
        </div>
      </div>

      {/* Mana Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-blue-400 text-sm">
            <Droplet className="w-4 h-4" />
            <span>Mana</span>
          </div>
          <span className="text-slate-300 text-sm">1,180 / 1,500</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all"
            style={{ width: '78.6%' }}
          />
        </div>
      </div>

      {/* Stamina Bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-yellow-400 text-sm">
            <Zap className="w-4 h-4" />
            <span>Stamina</span>
          </div>
          <span className="text-slate-300 text-sm">95 / 100</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all"
            style={{ width: '95%' }}
          />
        </div>
      </div>

      {/* XP Bar */}
      <div className="mt-4 pt-4 border-t border-slate-600/50">
        <div className="flex items-center justify-between mb-1">
          <span className="text-purple-400 text-sm">Experience</span>
          <span className="text-slate-300 text-sm">8,420 / 10,000</span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
            style={{ width: '84.2%' }}
          />
        </div>
      </div>
    </div>
  );
}

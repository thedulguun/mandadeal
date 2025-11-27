import { useState } from "react";
import { CharacterPanel } from "./character-panel";
import { ActionBar } from "./action-bar";
import { QuestTracker } from "./quest-tracker";
import { MiniMap } from "./mini-map";
import { Inventory } from "./inventory";
import { Package } from "lucide-react";

export function GameUI() {
  const [showInventory, setShowInventory] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Game viewport background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900">
        <div className="flex items-center justify-center h-full text-slate-500">
          <p className="text-xl">Game Viewport</p>
        </div>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Left - Character Panel */}
        <div className="absolute top-4 left-4 pointer-events-auto">
          <CharacterPanel />
        </div>

        {/* Top Right - Mini Map */}
        <div className="absolute top-4 right-4 pointer-events-auto">
          <MiniMap />
        </div>

        {/* Middle Right - Quest Tracker */}
        <div className="absolute top-32 right-4 pointer-events-auto">
          <QuestTracker />
        </div>

        {/* Bottom - Action Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
          <ActionBar />
        </div>

        {/* Bottom Left - Resources */}
        <div className="absolute bottom-4 left-4 pointer-events-auto flex items-center gap-4">
          <div className="bg-black/60 backdrop-blur-sm border border-amber-500/30 rounded-lg px-4 py-2 flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-500 rounded-full" />
            <span className="text-amber-400">1,247</span>
          </div>
          <div className="bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-4 py-2 flex items-center gap-2">
            <div className="w-6 h-6 bg-cyan-500 rounded-full" />
            <span className="text-cyan-400">384</span>
          </div>
        </div>

        {/* Bottom Right - Inventory Button */}
        <div className="absolute bottom-4 right-4 pointer-events-auto">
          <button
            onClick={() => setShowInventory(!showInventory)}
            className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3 hover:bg-black/80 transition-colors"
          >
            <Package className="w-6 h-6 text-purple-400" />
          </button>
        </div>

        {/* Inventory Modal */}
        {showInventory && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto">
            <Inventory onClose={() => setShowInventory(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

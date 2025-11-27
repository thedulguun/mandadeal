import { MapPin, Users, Skull } from "lucide-react";

export function MiniMap() {
  return (
    <div className="bg-black/60 backdrop-blur-sm border border-slate-600/50 rounded-lg p-3">
      <div className="w-48 h-48 bg-slate-800/50 rounded relative overflow-hidden">
        {/* Map background pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(71, 85, 105, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(71, 85, 105, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px'
        }} />

        {/* Terrain features */}
        <div className="absolute top-8 left-12 w-16 h-16 bg-green-900/30 rounded-full" />
        <div className="absolute bottom-12 right-8 w-20 h-12 bg-blue-900/30 rounded" />
        <div className="absolute top-20 right-16 w-8 h-8 bg-slate-700/50 rounded-full" />

        {/* Player position */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
            <div className="absolute -inset-2 bg-blue-500/30 rounded-full animate-ping" />
          </div>
        </div>

        {/* Quest marker */}
        <div className="absolute top-16 right-12">
          <MapPin className="w-5 h-5 text-amber-400 drop-shadow-lg" />
        </div>

        {/* NPC marker */}
        <div className="absolute bottom-20 left-16">
          <Users className="w-4 h-4 text-green-400 drop-shadow-lg" />
        </div>

        {/* Enemy marker */}
        <div className="absolute top-32 left-24">
          <Skull className="w-4 h-4 text-red-400 drop-shadow-lg" />
        </div>

        {/* Compass */}
        <div className="absolute top-2 right-2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-xs text-white">
          N
        </div>
      </div>

      {/* Location name */}
      <div className="mt-2 text-center">
        <p className="text-slate-300 text-sm">Darkwood Forest</p>
      </div>
    </div>
  );
}

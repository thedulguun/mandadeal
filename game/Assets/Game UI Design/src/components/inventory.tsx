import { X, Sword, Shield, Sparkles, FlaskConical, Gem, Package, Shirt } from "lucide-react";

const inventoryItems = [
  { icon: Sword, name: "Dragon Slayer", rarity: "legendary", slot: 0 },
  { icon: Shield, name: "Guardian's Aegis", rarity: "epic", slot: 1 },
  { icon: Shirt, name: "Steel Armor", rarity: "rare", slot: 2 },
  { icon: FlaskConical, name: "Health Potion", rarity: "common", slot: 5, count: 12 },
  { icon: FlaskConical, name: "Mana Potion", rarity: "common", slot: 6, count: 8 },
  { icon: Gem, name: "Ruby", rarity: "rare", slot: 10, count: 3 },
  { icon: Sparkles, name: "Magic Essence", rarity: "epic", slot: 14 },
  { icon: Package, name: "Supply Crate", rarity: "common", slot: 18 },
];

const rarityColors = {
  legendary: "from-amber-500 to-orange-600 shadow-amber-500/50",
  epic: "from-purple-500 to-pink-600 shadow-purple-500/50",
  rare: "from-blue-500 to-cyan-600 shadow-blue-500/50",
  common: "from-slate-500 to-slate-600 shadow-slate-500/50",
};

interface InventoryProps {
  onClose: () => void;
}

export function Inventory({ onClose }: InventoryProps) {
  return (
    <div className="bg-black/80 backdrop-blur-md border border-slate-600/50 rounded-lg p-6 w-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-2xl">Inventory</h2>
          <p className="text-slate-400 text-sm">24 / 40 slots used</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-8 gap-2">
        {Array.from({ length: 40 }).map((_, index) => {
          const item = inventoryItems.find(i => i.slot === index);
          
          return (
            <div
              key={index}
              className={`
                aspect-square rounded-lg border-2 flex items-center justify-center
                transition-all hover:scale-105 cursor-pointer relative
                ${item 
                  ? `bg-gradient-to-br ${rarityColors[item.rarity as keyof typeof rarityColors]} border-white/20 shadow-lg` 
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }
              `}
            >
              {item && (
                <>
                  <item.icon className="w-8 h-8 text-white drop-shadow-lg" />
                  {item.count && item.count > 1 && (
                    <div className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-xs text-white">
                      {item.count}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-slate-600/50 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-slate-400 text-sm">Weight</p>
          <p className="text-white">142 / 250</p>
        </div>
        <div>
          <p className="text-slate-400 text-sm">Gold</p>
          <p className="text-amber-400">1,247</p>
        </div>
        <div>
          <p className="text-slate-400 text-sm">Gems</p>
          <p className="text-cyan-400">384</p>
        </div>
      </div>
    </div>
  );
}

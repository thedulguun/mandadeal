import { Wallet } from 'lucide-react';
import { ChestCard } from './ChestCard';
import type { ChestData } from '../App';

interface ChestShopProps {
  chests: ChestData[];
  coins: number;
  onOpenChest: (chest: ChestData) => void;
}

export function ChestShop({ chests, coins, onOpenChest }: ChestShopProps) {
  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      {/* Balance display - Top Right */}
      <div className="absolute top-8 right-8 flex items-center gap-3 bg-gradient-to-b from-amber-800 to-amber-900 px-8 py-4 rounded-full border-4 border-amber-700 shadow-2xl z-20">
        <Wallet className="w-8 h-8 text-yellow-400" />
        <span className="text-3xl text-amber-100">{coins}</span>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block relative">
          <h1 className="text-6xl text-amber-100 tracking-wider mb-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] px-8 py-4 relative">
            <span className="relative z-10">ЭРДЭНЭСИЙН ДЭЛГҮҮР</span>
            <div className="absolute inset-0 bg-gradient-to-b from-amber-800/40 to-amber-950/40 border-4 border-amber-700/60 rounded-lg -z-0 shadow-2xl"></div>
          </h1>
          {/* Decorative corners */}
          <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-amber-500"></div>
          <div className="absolute -top-3 -right-3 w-8 h-8 border-t-4 border-r-4 border-amber-500"></div>
          <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-4 border-l-4 border-amber-500"></div>
          <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-amber-500"></div>
        </div>
      </div>

      {/* Skin Chests Section */}
      <div className="mb-12">
        <div className="text-center mb-6">
          <h2 className="text-3xl text-amber-100 uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Арьсны Авдар
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {chests.slice(0, 3).map((chest, index) => (
            <ChestCard
              key={`skin-${chest.type}-${index}`}
              chest={chest}
              coins={coins}
              onOpen={onOpenChest}
            />
          ))}
        </div>
      </div>

      {/* Trail Chests Section */}
      <div className="mb-12">
        <div className="text-center mb-6">
          <h2 className="text-3xl text-amber-100 uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Мөрний Авдар
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {chests.slice(3, 6).map((chest, index) => (
            <ChestCard
              key={`trail-${chest.type}-${index}`}
              chest={chest}
              coins={coins}
              onOpen={onOpenChest}
            />
          ))}
        </div>
      </div>

      {/* Footer text */}
      <div className="text-center mt-12">
        <p className="text-amber-300/80 text-lg">Азаа ухаалгаар сонгоорой, зоригт адал явагч!</p>
      </div>
    </div>
  );
}

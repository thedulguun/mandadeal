import { useState } from 'react';
import { X, Sparkles, Flame, Zap, Star, Wind, Droplets, Circle, Square, Triangle, Heart, Shield, Sword, ShoppingBag, Plus } from 'lucide-react';

type TabType = 'trails' | 'skins';

interface Item {
  id: number;
  name: string;
  icon: any;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  equipped: boolean;
}

export function InventoryMenu() {
  const [activeTab, setActiveTab] = useState<TabType>('trails');
  const [trailItems, setTrailItems] = useState<Item[]>([]);

  const [skinItems, setSkinItems] = useState<Item[]>([]);

  const handleEquip = (itemId: number) => {
    if (activeTab === 'trails') {
      setTrailItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, equipped: true }
            : { ...item, equipped: false }
        )
      );
    } else {
      setSkinItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, equipped: true }
            : { ...item, equipped: false }
        )
      );
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-yellow-500 to-orange-500';
      case 'epic':
        return 'from-purple-500 to-pink-500';
      case 'rare':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const currentItems = activeTab === 'trails' ? trailItems : skinItems;

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Main inventory container with game-style border */}
      <div className="relative bg-gradient-to-b from-amber-950 to-stone-950 rounded-xl sm:rounded-2xl p-1 shadow-2xl">
        <div className="bg-gradient-to-b from-amber-950 to-neutral-950 rounded-lg sm:rounded-xl p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-950" />
              </div>
              <span className="text-yellow-400 tracking-wider text-sm sm:text-base">АГУУЛАХ</span>
            </div>
            <button className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-100" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('trails')}
              className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-all text-sm sm:text-base ${
                activeTab === 'trails'
                  ? 'bg-gradient-to-br from-yellow-500 to-yellow-700 text-yellow-950 shadow-lg shadow-yellow-900/50'
                  : 'bg-stone-800/50 text-stone-400 hover:bg-stone-800'
              }`}
            >
              ЭФФЭКТ
            </button>
            <button
              onClick={() => setActiveTab('skins')}
              className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-all text-sm sm:text-base ${
                activeTab === 'skins'
                  ? 'bg-gradient-to-br from-yellow-500 to-yellow-700 text-yellow-950 shadow-lg shadow-yellow-900/50'
                  : 'bg-stone-800/50 text-stone-400 hover:bg-stone-800'
              }`}
            >
              АРЬС
            </button>
          </div>

          {/* Item Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
            {currentItems.length === 0 ? (
              // Empty state - show empty slots
              <>
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-md sm:rounded-lg bg-amber-800/30 border-2 border-dashed border-amber-700/50 flex items-center justify-center"
                  >
                    <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600/50" />
                  </div>
                ))}
              </>
            ) : (
              currentItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleEquip(item.id)}
                    className={`relative aspect-square rounded-md sm:rounded-lg p-2 sm:p-3 transition-all hover:scale-105 ${
                      item.equipped
                        ? 'bg-gradient-to-br from-green-600 to-green-800 shadow-lg shadow-green-900/50'
                        : 'bg-amber-800/50 hover:bg-amber-800'
                    }`}
                  >
                    {/* Rarity border */}
                    <div className={`absolute inset-0 rounded-md sm:rounded-lg bg-gradient-to-br ${getRarityColor(item.rarity)} opacity-30`} />
                    
                    {/* Icon */}
                    <div className="relative flex items-center justify-center h-full">
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-100" />
                    </div>

                    {/* Equipped indicator */}
                    {item.equipped && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                      </div>
                    )}

                    {/* Rarity indicator */}
                    <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br ${getRarityColor(item.rarity)} shadow-md`} />
                  </button>
                );
              })
            )}
          </div>

          {/* Selected item display */}
          {currentItems.find(item => item.equipped) && (
            <div className="bg-amber-800/30 rounded-md sm:rounded-lg p-3 sm:p-4 border border-amber-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-amber-400 text-xs sm:text-sm">Тоноглосон:</div>
                  <div className="text-yellow-200 text-sm sm:text-base">{currentItems.find(item => item.equipped)?.name}</div>
                </div>
                <div className={`px-2 sm:px-3 py-1 rounded-full text-xs bg-gradient-to-r ${getRarityColor(currentItems.find(item => item.equipped)?.rarity || 'common')}`}>
                  {currentItems.find(item => item.equipped)?.rarity.toUpperCase()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

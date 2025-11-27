import { useState } from 'react';
import { Wallet, Lock } from 'lucide-react';
import type { ChestData } from '../App';
import commonChestImage from 'figma:asset/d08c2fef3e7573312fca36bfc960947689c680e1.png';
import rareChestImage from 'figma:asset/6a0926a45280e48f50157fb4492c180ec88c077d.png';
import epicChestImage from 'figma:asset/6e9612d5972b24aeb3adc9d64c3095ee085e662c.png';

interface ChestCardProps {
  chest: ChestData;
  coins: number;
  onOpen: (chest: ChestData) => void;
}

export function ChestCard({ chest, coins, onOpen }: ChestCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const canAfford = coins >= chest.price;

  const getChestImage = () => {
    switch (chest.type) {
      case 'common':
        return commonChestImage;
      case 'rare':
        return rareChestImage;
      case 'epic':
        return epicChestImage;
    }
  };

  const getRarityStyles = () => {
    switch (chest.type) {
      case 'common':
        return {
          gradient: 'from-stone-700 to-stone-900',
          border: 'border-stone-600',
          glow: 'shadow-stone-900/50',
          text: 'text-stone-300'
        };
      case 'rare':
        return {
          gradient: 'from-blue-700 to-blue-900',
          border: 'border-blue-500',
          glow: 'shadow-blue-500/50',
          text: 'text-blue-300'
        };
      case 'epic':
        return {
          gradient: 'from-purple-600 to-purple-900',
          border: 'border-purple-500',
          glow: 'shadow-purple-500/50',
          text: 'text-purple-300'
        };
    }
  };

  const styles = getRarityStyles();

  return (
    <div
      className={`relative transform transition-all duration-300 ${
        isHovered && canAfford ? 'scale-105 -translate-y-2' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card container */}
      <div
        className={`bg-gradient-to-b ${styles.gradient} rounded-lg border-4 ${styles.border} shadow-2xl ${
          isHovered && canAfford ? `shadow-xl ${styles.glow}` : ''
        } overflow-hidden relative`}
      >
        {/* Inner border decoration */}
        <div className="absolute inset-2 border-2 border-amber-900/30 rounded-md pointer-events-none"></div>

        {/* Card content */}
        <div className="p-6 relative z-10">
          {/* Title */}
          <div className="text-center mb-4">
            <h2 className={`text-2xl uppercase tracking-widest ${styles.text} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>
              {chest.name}
            </h2>
          </div>

          {/* Chest image */}
          <div className="relative mb-4 bg-amber-950/30 rounded-lg p-4 border-2 border-amber-900/50">
            <div className="w-full h-64 relative overflow-hidden flex items-center justify-center">
              <img
                src={getChestImage()}
                alt={chest.name}
                className="w-full h-full object-contain"
              />
            </div>
            {!canAfford && (
              <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                <Lock className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-amber-200 text-center mb-6 min-h-[3rem]">
            {chest.description}
          </p>

          {/* Price and button */}
          <button
            onClick={() => canAfford && onOpen(chest)}
            disabled={!canAfford}
            className={`w-full py-4 rounded-md border-4 transition-all duration-200 ${
              canAfford
                ? `bg-gradient-to-b from-amber-600 to-amber-800 border-amber-700 hover:from-amber-500 hover:to-amber-700 hover:border-amber-600 shadow-lg cursor-pointer active:scale-95`
                : 'bg-gray-700 border-gray-800 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <Wallet className={`w-6 h-6 ${canAfford ? 'text-yellow-300' : 'text-gray-400'}`} />
              <span className={`text-xl ${canAfford ? 'text-amber-100' : 'text-gray-300'}`}>
                {chest.price}
              </span>
            </div>
            <p className={`text-sm mt-1 uppercase tracking-wide ${canAfford ? 'text-amber-200' : 'text-gray-400'}`}>
              {canAfford ? 'Авдар Нээх' : 'Хүрэлцэхгүй Мөнгө'}
            </p>
          </button>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-amber-500/50"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-amber-500/50"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-amber-500/50"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-amber-500/50"></div>
      </div>
    </div>
  );
}

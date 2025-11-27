import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import type { ChestData } from '../App';
import commonChestImage from 'figma:asset/d08c2fef3e7573312fca36bfc960947689c680e1.png';
import rareChestImage from 'figma:asset/6a0926a45280e48f50157fb4492c180ec88c077d.png';
import epicChestImage from 'figma:asset/6e9612d5972b24aeb3adc9d64c3095ee085e662c.png';
import { motion } from 'motion/react';

interface OpenChestModalProps {
  chest: ChestData;
  onClose: () => void;
}

export function OpenChestModal({ chest, onClose }: OpenChestModalProps) {
  const [isOpening, setIsOpening] = useState(true);
  const [reward, setReward] = useState<string>('');

  useEffect(() => {
    // Simulate opening animation
    const timer = setTimeout(() => {
      setIsOpening(false);
      // Select a random reward
      const randomReward = chest.rewards[Math.floor(Math.random() * chest.rewards.length)];
      setReward(randomReward);
    }, 2000);

    return () => clearTimeout(timer);
  }, [chest]);

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

  const getRarityColor = () => {
    switch (chest.type) {
      case 'common':
        return 'text-stone-300';
      case 'rare':
        return 'text-blue-400';
      case 'epic':
        return 'text-purple-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="bg-gradient-to-b from-amber-800 to-amber-950 rounded-lg border-4 border-amber-700 max-w-md w-full p-8 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-300 hover:text-amber-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-amber-500"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-amber-500"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-amber-500"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-amber-500"></div>

        {isOpening ? (
          <div className="text-center">
            <h2 className="text-3xl text-amber-100 mb-6 uppercase tracking-wide">
              {chest.name} нээж байна...
            </h2>
            <div className="relative mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
                className="w-64 h-64 mx-auto bg-amber-950/30 rounded-lg p-4 border-2 border-amber-900/50 relative overflow-hidden flex items-center justify-center"
              >
                <img
                  src={getChestImage()}
                  alt={chest.name}
                  className="w-full h-full object-contain"
                />
              </motion.div>
              {/* Sparkles animation */}
              <motion.div
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkles className={`w-16 h-16 ${getRarityColor()}`} />
              </motion.div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl text-amber-100 mb-4 uppercase tracking-wide">
              Шагнал Авлаа!
            </h2>
            <div className="bg-amber-950/50 rounded-lg border-2 border-amber-900/50 p-8 mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Sparkles className={`w-16 h-16 mx-auto mb-4 ${getRarityColor()}`} />
                <p className={`text-2xl ${getRarityColor()} uppercase tracking-wide`}>
                  {reward}
                </p>
              </motion.div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-b from-amber-600 to-amber-800 border-4 border-amber-700 rounded-md text-amber-100 text-lg uppercase tracking-wide hover:from-amber-500 hover:to-amber-700 transition-all active:scale-95"
            >
              Цуглуулах
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

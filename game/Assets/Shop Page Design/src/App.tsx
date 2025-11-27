import { useState } from 'react';
import { ChestShop } from './components/ChestShop';
import { OpenChestModal } from './components/OpenChestModal';

export type ChestType = 'common' | 'rare' | 'epic';

export interface ChestData {
  type: ChestType;
  name: string;
  price: number;
  description: string;
  rewards: string[];
  color: string;
}

export default function App() {
  const [selectedChest, setSelectedChest] = useState<ChestData | null>(null);
  const [coins, setCoins] = useState(5000);

  const chests: ChestData[] = [
    // Skin Chests
    {
      type: 'common',
      name: 'Энгийн Арьсны Авдар',
      price: 100,
      description: 'Дүрийн үндсэн арьс',
      rewards: ['Энгийн Арьс: Дайчин', 'Энгийн Арьс: Илбэчин', 'Энгийн Арьс: Хулгайч'],
      color: '#8B7355'
    },
    {
      type: 'rare',
      name: 'Ховор Арьсны Авдар',
      price: 500,
      description: 'Өвөрмөц загвартай онцгой арьс',
      rewards: ['Ховор Арьс: Баатар', 'Ховор Арьс: Шидтэн', 'Ховор Арьс: Үхлийн Алга', 'Эпик Арьс Авах Боломж'],
      color: '#4A9FD8'
    },
    {
      type: 'epic',
      name: 'Эпик Арьсны Авдар',
      price: 2000,
      description: 'Хамгийн ховор, онцгой арьс',
      rewards: ['Эпик Арьс: Луу Алагч', 'Эпик Арьс: Ахлах Илбэчин', 'Эпик Арьс: Сүүдрийн Эзэн', 'Онцгой Хөдөлгөөнт Арьс'],
      color: '#FF6B35'
    },
    // Trail Chests
    {
      type: 'common',
      name: 'Энгийн Мөрний Авдар',
      price: 100,
      description: 'Дүрийн үндсэн мөрний эффект',
      rewards: ['Энгийн Мөр: Оч', 'Энгийн Мөр: Тоос', 'Энгийн Мөр: Навч'],
      color: '#8B7355'
    },
    {
      type: 'rare',
      name: 'Ховор Мөрний Авдар',
      price: 500,
      description: 'Тод өнгөт гайхалтай мөрний эффект',
      rewards: ['Ховор Мөр: Гал', 'Ховор Мөр: Мөс', 'Ховор Мөр: Аянга', 'Эпик Мөр Авах Боломж'],
      color: '#4A9FD8'
    },
    {
      type: 'epic',
      name: 'Эпик Мөрний Авдар',
      price: 2000,
      description: 'Хамгийн гайхалтай мөрний эффект',
      rewards: ['Эпик Мөр: Луугийн Амьсгал', 'Эпик Мөр: Оддын Бороо', 'Эпик Мөр: Сүүдрийн Эргэлт', 'Онцгой Хөдөлгөөнт Мөр'],
      color: '#FF6B35'
    }
  ];

  const handleOpenChest = (chest: ChestData) => {
    if (coins >= chest.price) {
      setCoins(coins - chest.price);
      setSelectedChest(chest);
    }
  };

  const handleCloseModal = () => {
    setSelectedChest(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 relative overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
      
      <ChestShop 
        chests={chests}
        coins={coins}
        onOpenChest={handleOpenChest}
      />

      {selectedChest && (
        <OpenChestModal 
          chest={selectedChest}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

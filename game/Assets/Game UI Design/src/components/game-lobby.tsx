import { Wallet, Settings, User, ShoppingCart, Gift, Package } from "lucide-react";
import backgroundImage from 'figma:asset/089595070998a3cb437e6dc3f2f161f16be25d54.png';

export function GameLobby() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image - 2D Game Style */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-repeat-x"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
      </div>

      {/* Main Container */}
      <div className="relative h-full flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
          {/* Left - Profile */}
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
              <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
            <div>
              <h3 className="text-white text-xs md:text-sm">Player123</h3>
            </div>
          </div>

          {/* Right - Settings */}
          <button className="w-10 h-10 md:w-14 md:h-14 bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
            <Settings className="w-5 h-5 md:w-7 md:h-7 text-white" />
          </button>
        </div>

        {/* Left Column - Wallet & Shop - Icons Only on Mobile */}
        <div className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 md:gap-3 z-10">
          {/* Wallet */}
          <button className="bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-xl p-2 md:px-4 md:py-2.5 flex items-center gap-2 shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-white/80 text-xs">Wallet</p>
              <p className="text-white">847</p>
            </div>
          </button>

          {/* Shop */}
          <button className="bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-xl p-2 md:px-4 md:py-2.5 flex items-center gap-2 shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <ShoppingCart className="w-4 h-4 text-gray-700" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-white/80 text-xs">Shop</p>
            </div>
          </button>
        </div>

        {/* Right Column - Event & Inventory - Icons Only on Mobile */}
        <div className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 md:gap-3 z-10">
          {/* Event */}
          <button className="bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-xl p-2 md:px-4 md:py-2.5 flex items-center gap-2 shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <Gift className="w-4 h-4 text-white" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-white/80 text-xs">Event</p>
            </div>
          </button>

          {/* Inventory */}
          <button className="bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-xl p-2 md:px-4 md:py-2.5 flex items-center gap-2 shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-white/80 text-xs">Inventory</p>
            </div>
          </button>
        </div>

        {/* Center - Character & Start Button */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {/* Prize Pool Text - Shiny & Bumpy */}
          <div className="mb-3 md:mb-4">
            <h1 className="shiny-text text-3xl md:text-5xl text-center tracking-wider">
              ШАГНАЛЫН САН
            </h1>
            <p className="shiny-text text-5xl md:text-7xl text-center mt-1 md:mt-2">
              9999
            </p>
          </div>

          {/* Rank & Flags - smaller and under prize pool */}
          <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-8">
            <div className="px-3 py-1.5 md:px-4 md:py-2">
              <p className="text-white text-xs text-center drop-shadow-lg">Rank: <span className="text-white">#127</span></p>
            </div>
            <div className="px-3 py-1.5 md:px-4 md:py-2">
              <p className="text-white text-xs text-center drop-shadow-lg">Flags: <span className="text-white">🚩 45</span></p>
            </div>
          </div>

          {/* Wolf Character - 2D Block Style */}
          <div className="relative mb-4 md:mb-6">
            {/* Shadow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 md:translate-y-8 w-24 md:w-32 h-4 md:h-6 bg-black/40 rounded-full blur-xl" />
            
            {/* 2D Block Wolf Icon */}
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <svg viewBox="0 0 128 128" className="w-full h-full drop-shadow-2xl">
                {/* Wolf body - dark gray */}
                <rect x="32" y="64" width="64" height="48" fill="#4a4a4a" />
                {/* Wolf head */}
                <rect x="40" y="40" width="48" height="32" fill="#5a5a5a" />
                {/* Ears */}
                <polygon points="40,40 40,24 48,40" fill="#3a3a3a" />
                <polygon points="88,40 88,24 80,40" fill="#3a3a3a" />
                {/* Eyes - glowing yellow */}
                <rect x="48" y="48" width="8" height="8" fill="#ffd700" />
                <rect x="72" y="48" width="8" height="8" fill="#ffd700" />
                {/* Eye shine */}
                <rect x="50" y="50" width="3" height="3" fill="#fff" />
                <rect x="74" y="50" width="3" height="3" fill="#fff" />
                {/* Snout */}
                <rect x="52" y="60" width="24" height="12" fill="#6a6a6a" />
                {/* Nose */}
                <rect x="60" y="64" width="8" height="6" fill="#2a2a2a" />
                {/* Chest - lighter */}
                <rect x="48" y="72" width="32" height="24" fill="#7a7a7a" />
                {/* Legs */}
                <rect x="40" y="96" width="12" height="16" fill="#4a4a4a" />
                <rect x="76" y="96" width="12" height="16" fill="#4a4a4a" />
                {/* Paws */}
                <rect x="40" y="108" width="12" height="4" fill="#3a3a3a" />
                <rect x="76" y="108" width="12" height="4" fill="#3a3a3a" />
              </svg>
            </div>
          </div>

          {/* Start Button */}
          <button className="group relative">
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
            
            {/* Button */}
            <div className="relative bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 px-12 py-3 md:px-20 md:py-5 rounded-full shadow-2xl transform group-hover:scale-110 transition-all">
              <span className="text-white text-xl md:text-3xl drop-shadow-lg">ЭХЛЭХ</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { InventoryMenu } from './components/InventoryMenu';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-950 flex items-center justify-center p-4">
      <InventoryMenu />
    </div>
  );
}

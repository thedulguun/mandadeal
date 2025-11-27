import { LeaderboardPanel } from "./components/LeaderboardPanel";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center p-4 md:p-8">
      <LeaderboardPanel />
    </div>
  );
}
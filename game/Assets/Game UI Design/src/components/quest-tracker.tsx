import { Scroll, ChevronDown } from "lucide-react";

const quests = [
  {
    title: "The Lost Artifact",
    objectives: [
      { text: "Find the Ancient Temple", completed: true },
      { text: "Defeat the Temple Guardian", completed: true },
      { text: "Retrieve the Crystal", completed: false },
    ],
  },
  {
    title: "Gathering Supplies",
    objectives: [
      { text: "Collect Moonflowers", progress: "8/10" },
      { text: "Hunt Shadow Wolves", progress: "3/5" },
    ],
  },
];

export function QuestTracker() {
  return (
    <div className="bg-black/60 backdrop-blur-sm border border-slate-600/50 rounded-lg p-4 w-80">
      <div className="flex items-center gap-2 mb-3">
        <Scroll className="w-5 h-5 text-amber-400" />
        <h3 className="text-amber-400">Active Quests</h3>
      </div>

      <div className="space-y-4">
        {quests.map((quest, qIndex) => (
          <div key={qIndex} className="border-b border-slate-600/50 last:border-0 pb-3 last:pb-0">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-white text-sm">{quest.title}</h4>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-1">
              {quest.objectives.map((objective, oIndex) => (
                <div key={oIndex} className="flex items-start gap-2 text-sm">
                  <div className={`w-4 h-4 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    objective.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-slate-500'
                  }`}>
                    {objective.completed && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between flex-1">
                    <span className={objective.completed ? 'text-slate-500 line-through' : 'text-slate-300'}>
                      {objective.text}
                    </span>
                    {objective.progress && (
                      <span className="text-slate-400 text-xs ml-2">{objective.progress}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

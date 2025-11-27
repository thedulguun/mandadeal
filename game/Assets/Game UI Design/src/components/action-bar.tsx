import { Sword, Shield, Flame, Wind, Snowflake, Sparkles, Target, Heart } from "lucide-react";

const skills = [
  { icon: Sword, color: "from-red-500 to-orange-500", key: "1", cooldown: 0 },
  { icon: Shield, color: "from-slate-400 to-slate-500", key: "2", cooldown: 0 },
  { icon: Flame, color: "from-orange-500 to-red-600", key: "3", cooldown: 3.5 },
  { icon: Wind, color: "from-cyan-400 to-blue-500", key: "4", cooldown: 0 },
  { icon: Snowflake, color: "from-blue-400 to-cyan-400", key: "5", cooldown: 8.2 },
  { icon: Sparkles, color: "from-purple-400 to-pink-500", key: "6", cooldown: 0 },
  { icon: Target, color: "from-yellow-400 to-orange-500", key: "7", cooldown: 0 },
  { icon: Heart, color: "from-pink-400 to-red-500", key: "8", cooldown: 15.0 },
];

export function ActionBar() {
  return (
    <div className="bg-black/60 backdrop-blur-sm border border-slate-600/50 rounded-lg p-3">
      <div className="flex gap-2">
        {skills.map((skill, index) => {
          const Icon = skill.icon;
          const isOnCooldown = skill.cooldown > 0;
          
          return (
            <div key={index} className="relative">
              <button
                className={`
                  w-14 h-14 rounded-lg flex items-center justify-center
                  transition-all hover:scale-105 active:scale-95
                  ${isOnCooldown ? 'opacity-50' : 'hover:brightness-110'}
                `}
                style={{
                  background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                }}
                disabled={isOnCooldown}
              >
                <div className={`bg-gradient-to-br ${skill.color} w-full h-full rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Cooldown overlay */}
                {isOnCooldown && (
                  <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">{skill.cooldown}s</span>
                  </div>
                )}
              </button>
              
              {/* Key binding */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-800 border border-slate-600 rounded flex items-center justify-center">
                <span className="text-slate-300 text-xs">{skill.key}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

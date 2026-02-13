import { ACHIEVEMENTS } from "../engine/achievements";

interface AchievementPanelProps {
  unlocked: string[];
}

export const AchievementPanel = ({ unlocked }: AchievementPanelProps): React.JSX.Element => (
  <section className="rounded-2xl border border-cyan-300/20 bg-[#070d22]/85 p-5">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="font-display text-2xl text-white">Achievements</h3>
      <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-bold text-[#04242a]">
        {unlocked.length}/{ACHIEVEMENTS.length}
      </span>
    </div>

    <div className="grid gap-2">
      {ACHIEVEMENTS.map((achievement) => {
        const isUnlocked = unlocked.includes(achievement.id);
        return (
          <article
            key={achievement.id}
            className={`rounded-lg border px-3 py-2 ${
              isUnlocked
                ? "border-cyan-200/60 bg-cyan-200/10"
                : "border-cyan-200/15 bg-[#0c1331]"
            }`}
          >
            <p className="font-semibold text-white">{achievement.title}</p>
            <p className="text-sm text-cyan-100/75">{achievement.description}</p>
          </article>
        );
      })}
    </div>
  </section>
);

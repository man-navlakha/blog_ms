import { AlertCircle, CheckCircle, TrendingUp } from "lucide-react";

export default function SEOScoreWidget({ score, tips }) {
  const scoreStatus =
    score >= 80 ? { color: "text-emerald-600", bg: "bg-emerald-500/10", icon: CheckCircle } : score >= 60 ? { color: "text-amber-500", bg: "bg-amber-500/10", icon: TrendingUp } : { color: "text-red-500", bg: "bg-red-500/10", icon: AlertCircle };

  const Icon = scoreStatus.icon;

  return (
    <aside className="glass-card p-6">
      <div className={`rounded-lg ${scoreStatus.bg} p-4`}>
        <div className="flex items-center gap-3">
          <Icon className={`h-6 w-6 ${scoreStatus.color}`} />
          <div>
            <p className="text-sm font-semibold text-foreground">SEO Score</p>
            <p className={`text-2xl font-bold ${scoreStatus.color}`}>{score}/100</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-foreground">Tips</h3>
        <ul className="mt-3 space-y-2">
          {(tips || []).length === 0 ? (
            <li className="text-sm text-muted-ink flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              This post is SEO-ready!
            </li>
          ) : (
            tips.map((tip) => (
              <li key={tip} className="text-sm text-muted-ink flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                {tip}
              </li>
            ))
          )}
        </ul>
      </div>
    </aside>
  );
}

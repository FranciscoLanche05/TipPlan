export default function BudgetDonut({ total, progress, categories }) {
  const r = 78, cx = 100, cy = 100;
  const C = 2 * Math.PI * r;
  let cum = 0;

  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%">
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#eee5d3" strokeWidth="20" />
        {categories.map((cat) => {
          const fullLen = (cat.pct / 100) * C;
          const len = fullLen * progress;
          const offset = -cum;
          cum += fullLen;
          return (
            <circle
              key={cat.id}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={cat.color}
              strokeWidth="20"
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={offset}
            />
          );
        })}
      </g>
      <text x={cx} y="94" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--text-primary)" opacity="0.6">
        TOTAL
      </text>
      <text x={cx} y="118" textAnchor="middle" fontSize="22" fontWeight="900" fill="var(--text-primary)">
        ${total.toLocaleString()}
      </text>
    </svg>
  );
}
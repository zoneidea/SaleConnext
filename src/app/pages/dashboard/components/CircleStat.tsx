import React from 'react'

type Props = {
  value: number | string
  label?: string
  percent?: number   // 0..100 (ความเต็มของวงแหวน)
  size?: number      // เส้นผ่านศูนย์กลาง
  stroke?: number    // ความหนาวงแหวน
}

export const CircleStat: React.FC<Props> = ({
  value,
  label,
  percent = 100,
  size = 140,
  stroke = 12,
}) => {
  const clamped = Math.max(0, Math.min(100, percent))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - clamped / 100)

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#fff" />
          </linearGradient>
        </defs>

        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#E4E6EF"
          strokeWidth={stroke}
          fill="none"
        />
        {/* progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      {/* ตัวเลขกลางวง */}
      <div className="position-absolute top-50 start-50 translate-middle text-center">
        <div className="fw-bolder" style={{ fontSize: 28 }}>{value}</div>
        {label && <div className="text-muted" style={{ marginTop: -4 }}>{label}</div>}
      </div>
    </div>
  )
}
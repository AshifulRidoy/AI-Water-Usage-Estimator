// Hero visualization for the "Eco-Modern Clarity" dashboard: a circular
// progress ring (gradient stroke) with a fluid wave fill inside, showing
// today's water usage against lifetime usage. Purely presentational — takes
// pre-computed percentages so it has no dependency on estimator/storage internals.
import type { ReactElement } from "react";
import { splitWaterValue } from "../shared/utils/visualization";

export interface CircularWaterGaugeProps {
  todayML: number;
  lifetimeML: number;
  /** 0..1, how full the ring should look relative to the visual daily-goal reference. */
  ringPercent: number;
}

const SIZE = 220;
const CENTER = SIZE / 2;
const RING_RADIUS = 92;
const RING_STROKE = 10;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// Wave fill geometry, inside the ring.
const WAVE_RADIUS = 74;
const WAVE_TOP = CENTER - WAVE_RADIUS;
const WAVE_BOTTOM = CENTER + WAVE_RADIUS;

function waveLevelY(percent: number): number {
  return WAVE_BOTTOM - percent * (WAVE_BOTTOM - WAVE_TOP);
}

export function CircularWaterGauge({
  todayML,
  lifetimeML,
  ringPercent,
}: CircularWaterGaugeProps): ReactElement {
  const today = splitWaterValue(todayML);
  const lifetime = splitWaterValue(lifetimeML);

  // Two overlapping wave bands: a taller, softer "lifetime" band behind a
  // shorter, more saturated "today" band — mirrors the layered wave look
  // from the reference design.
  const lifetimeRatio = lifetimeML > 0 ? Math.min(1, todayML / lifetimeML || 1) : 1;
  const lifetimeLevel = waveLevelY(Math.max(ringPercent, lifetimeRatio * ringPercent, 0.15));
  const todayLevel = waveLevelY(ringPercent);

  const clipId = "aiwe-gauge-wave-clip";
  const arcOffset = CIRCUMFERENCE * (1 - ringPercent);

  return (
    <div className="aiwe-gauge" style={{ width: SIZE, height: SIZE }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
        <defs>
          <linearGradient id="aiwe-gauge-ring-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="aiwe-gauge-wave-lifetime" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6ee7c7" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <linearGradient id="aiwe-gauge-wave-today" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <clipPath id={clipId}>
            <circle cx={CENTER} cy={CENTER} r={WAVE_RADIUS} />
          </clipPath>
        </defs>

        {/* Track (background ring) */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RING_RADIUS}
          fill="none"
          stroke="#e0f2fe"
          strokeWidth={RING_STROKE}
        />

        {/* Progress arc */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RING_RADIUS}
          fill="none"
          stroke="url(#aiwe-gauge-ring-gradient)"
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={arcOffset}
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
        />

        {/* Wave fill, clipped to the inner circle */}
        <g clipPath={`url(#${clipId})`}>
          <rect
            x={CENTER - WAVE_RADIUS}
            y={lifetimeLevel}
            width={WAVE_RADIUS * 2}
            height={WAVE_BOTTOM - lifetimeLevel + 4}
            fill="url(#aiwe-gauge-wave-lifetime)"
            opacity={0.55}
          />
          <rect
            x={CENTER - WAVE_RADIUS}
            y={todayLevel}
            width={WAVE_RADIUS * 2}
            height={WAVE_BOTTOM - todayLevel + 4}
            fill="url(#aiwe-gauge-wave-today)"
            opacity={0.85}
          />
        </g>
      </svg>

      <div className="aiwe-gauge-content">
        <div className="aiwe-gauge-value">
          {today.amount}
          <span className="aiwe-gauge-unit">{today.unit}</span>
        </div>
        <div className="aiwe-gauge-label">Water Used Today</div>

        <div className="aiwe-gauge-value aiwe-gauge-value-secondary">
          {lifetime.amount}
          <span className="aiwe-gauge-unit">{lifetime.unit}</span>
        </div>
        <div className="aiwe-gauge-label">Lifetime Water Used</div>
      </div>
    </div>
  );
}

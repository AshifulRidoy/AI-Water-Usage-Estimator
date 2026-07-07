import type { ReactElement } from "react";
import { useMemo } from "react";
import { HistoryList } from "../components/HistoryList";
import { UsageChart } from "../components/UsageChart";
import { useStatistics } from "../hooks/useStatistics";
import { formatCarbonG, formatEnergyWh, formatWaterML } from "../../shared/utils/format";
import { Spinner } from "../../ui/Spinner";
import { CircularWaterGauge } from "../../ui/CircularWaterGauge";
import { MetricCard } from "../../ui/MetricCard";
import { BoltIcon, ChatIcon, DropletIcon, LeafIcon } from "../../ui/icons";
import { computeFillPercent } from "../../shared/utils/visualization";
import { WATER_DAILY_GOAL_ML } from "../../shared/constants/visualization";

export function Dashboard(): ReactElement {
  const { statistics, loading, reset } = useStatistics();

  const averagePerPrompt = useMemo(() => {
    const { water, prompts } = statistics.lifetime;
    return prompts > 0 ? water / prompts : 0;
  }, [statistics.lifetime]);

  if (loading) {
    return (
      <div className="aiwe-dashboard-loading">
        <Spinner />
      </div>
    );
  }

  const ringPercent = computeFillPercent(statistics.today.water, WATER_DAILY_GOAL_ML);

  return (
    <div className="aiwe-dashboard">
      <header className="aiwe-dashboard-header">
        <h1>
          Water Usage
        </h1>
      </header>

      <section className="aiwe-hero-card">
        <h3 className="aiwe-hero-title">Water used in this converstation</h3>

        <CircularWaterGauge
          todayML={statistics.today.water}
          lifetimeML={statistics.lifetime.water}
          ringPercent={ringPercent}
        />

        <div className="aiwe-hero-footer">
          <span>
            Today: <strong>{formatWaterML(statistics.today.water)}</strong>
          </span>
          <span>
            Lifetime: <strong>{formatWaterML(statistics.lifetime.water)}</strong>
          </span>
        </div>
      </section>

      <div className="aiwe-metric-grid">
        <MetricCard
          icon={<ChatIcon />}
          label="Prompts Sent"
          value={String(statistics.lifetime.prompts)}
          accent="blue"
        />
        <MetricCard
          icon={<DropletIcon />}
          label="Avg Impact / Prompt"
          value={formatWaterML(averagePerPrompt)}
          accent="azure"
        />
        <MetricCard
          icon={<BoltIcon />}
          label="Energy Consumption"
          value={formatEnergyWh(statistics.lifetime.energy)}
          accent="azure"
        />
        <MetricCard
          icon={<LeafIcon />}
          label="Carbon Emissions"
          value={formatCarbonG(statistics.lifetime.carbon)}
          accent="mint"
        />
      </div>

      {statistics.history.length > 1 && (
        <section className="aiwe-trend-card">
          <h2 className="aiwe-trend-title">Usage Trend</h2>
          <UsageChart entries={statistics.history} />
        </section>
      )}

      <section className="aiwe-history-card">
        <h2 className="aiwe-trend-title">History</h2>
        <HistoryList entries={statistics.history} />
      </section>

      <div className="aiwe-dashboard-actions">
        <button className="aiwe-text-button" onClick={() => void reset()}>
          Reset stats
        </button>
        <a className="aiwe-text-button" href="options.html" target="_blank" rel="noreferrer">
          Settings
        </a>
      </div>

      <p className="aiwe-dashboard-disclaimer">
        Estimated, based on published research — not measured.
      </p>
    </div>
  );
}

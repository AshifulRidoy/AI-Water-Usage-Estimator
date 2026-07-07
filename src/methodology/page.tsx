import type { ReactElement } from "react";
import { ESTIMATION_VERSION, DEFAULT_CONFIG } from "../shared/constants/config";

export function MethodologyPage(): ReactElement {
  return (
    <div className="aiwe-methodology">
      <h1>Methodology</h1>
      <p>
        AI Water Usage Estimator does not measure real resource consumption from any AI
        provider — it estimates it, using token counts and published sustainability research.
        Every number shown in this extension is prefixed with "≈" to make that clear.
      </p>

      <h2>How the estimate works</h2>
      <p>
        Input and output tokens are counted for each response (using a provider tokenizer
        when available, or a character-based heuristic as a fallback). Token counts are
        converted to an estimated energy figure, and energy is converted to estimated water
        and carbon figures using configurable constants:
      </p>
      <ul>
        <li>
          Energy (Wh) = Total Tokens × {DEFAULT_CONFIG.ENERGY_PER_TOKEN} Wh/token
        </li>
        <li>Water (mL) = Energy × {DEFAULT_CONFIG.WATER_PER_WH} mL/Wh</li>
        <li>Carbon (g) = Energy × {DEFAULT_CONFIG.CARBON_PER_WH} gCO₂/Wh</li>
      </ul>

      <h2>Confidence levels</h2>
      <p>
        <strong>High</strong> — known provider, known tokenizer, known model.{" "}
        <strong>Medium</strong> — known provider and tokenizer, unknown model.{" "}
        <strong>Low</strong> — unknown provider, or a character-based heuristic was used
        instead of a real tokenizer.
      </p>

      <h2>Research references</h2>
      <p>
        Constants above are rough, conservative approximations informed by publicly available
        research on large-scale datacenter energy and water usage (e.g. reported PUE/WUE
        figures from major cloud providers and academic estimates of per-token inference
        cost). They are not vendor-specific measurements, since no AI provider currently
        publishes exact per-request energy or water figures.
      </p>

      <h2>Limitations</h2>
      <ul>
        <li>Actual energy/water/carbon cost varies by model, hardware, region, and load.</li>
        <li>Token counts are estimates, not exact provider-side counts, unless noted otherwise.</li>
        <li>Constants are global averages, not region- or datacenter-specific (yet).</li>
      </ul>

      <h2>Privacy</h2>
      <p>
        All calculations happen locally in your browser. No prompts, responses, or usage
        data are ever transmitted or uploaded anywhere.
      </p>

      <p style={{ color: "var(--aiwe-muted)", fontSize: 12 }}>
        Estimation engine version {ESTIMATION_VERSION}
      </p>
    </div>
  );
}

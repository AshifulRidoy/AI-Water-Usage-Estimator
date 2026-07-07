// Regression test for the infinite-badge bug: injecting a badge into a turn
// element must not change what getCleanText() reports for that element, and
// a MutationObserver watching the tree must not re-fire onSettled for a
// mutation caused solely by that injection.
import { describe, expect, it, vi } from "vitest";
import { getCleanText, observeUntilSettled } from "../../src/adapters/shared";
import { ensureBadgeContainer } from "../../src/content/injector";

function buildTurn(responseText: string): HTMLElement {
  const turn = document.createElement("div");
  turn.textContent = responseText;
  document.body.appendChild(turn);
  return turn;
}

describe("getCleanText", () => {
  it("ignores previously injected badge text", () => {
    const turn = buildTurn("Hello world");
    expect(getCleanText(turn)).toBe("Hello world");

    ensureBadgeContainer(turn, "resp-1");
    const container = turn.querySelector<HTMLElement>(".aiwe-badge-container");
    if (container) container.textContent = "\u{1F4A7} \u2248 0.7 mL";

    // The badge text must not leak into the "clean" reading of the turn.
    expect(getCleanText(turn)).toBe("Hello world");
  });
});

describe("observeUntilSettled (infinite-badge regression)", () => {
  it("does not re-fire onSettled for a mutation caused only by our own badge", async () => {
    vi.useFakeTimers();
    const turn = buildTurn("Hello world");
    const onSettled = vi.fn();

    const stop = observeUntilSettled(turn, onSettled, 50);
    await vi.advanceTimersByTimeAsync(60); // let the initial immediate call settle

    expect(onSettled).toHaveBeenCalledTimes(1);
    expect(onSettled).toHaveBeenLastCalledWith("Hello world");

    // Simulate the renderer injecting a badge, exactly as content/renderer.ts does.
    ensureBadgeContainer(turn, "resp-1");
    const container = turn.querySelector<HTMLElement>(".aiwe-badge-container");
    if (container) container.textContent = "\u{1F4A7} \u2248 0.7 mL";

    await vi.advanceTimersByTimeAsync(60);

    // Before the fix, this second mutation would re-trigger onSettled with
    // text that now includes the badge, causing a new "response" to be
    // detected forever. After the fix, it must not fire again.
    expect(onSettled).toHaveBeenCalledTimes(1);

    stop();
    vi.useRealTimers();
  });

  it("still fires onSettled for a genuine content change", async () => {
    vi.useFakeTimers();
    const turn = buildTurn("Hello world");
    const onSettled = vi.fn();

    const stop = observeUntilSettled(turn, onSettled, 50);
    await vi.advanceTimersByTimeAsync(60);
    expect(onSettled).toHaveBeenCalledTimes(1);

    turn.textContent = "Hello world, more streamed in";
    await vi.advanceTimersByTimeAsync(60);

    expect(onSettled).toHaveBeenCalledTimes(2);
    expect(onSettled).toHaveBeenLastCalledWith("Hello world, more streamed in");

    stop();
    vi.useRealTimers();
  });
});

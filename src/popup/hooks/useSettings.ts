import { useCallback, useEffect, useState } from "react";
import { sendExtensionMessage } from "../../shared/utils/messaging-client";
import { DEFAULT_SETTINGS } from "../../storage/settings";
import type { Settings } from "../../shared/types";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    sendExtensionMessage({ type: "GET_SETTINGS" }).then((response) => {
      if (cancelled) return;
      if (response.ok && response.data && "enabled" in response.data) {
        setSettings(response.data as Settings);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = useCallback(async (patch: Partial<Settings>) => {
    const response = await sendExtensionMessage({ type: "SET_SETTINGS", payload: patch });
    if (response.ok && response.data && "enabled" in response.data) {
      setSettings(response.data as Settings);
    }
  }, []);

  return { settings, loading, updateSettings };
}

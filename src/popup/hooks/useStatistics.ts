import { useCallback, useEffect, useState } from "react";
import { sendExtensionMessage } from "../../shared/utils/messaging-client";
import { getDefaultStatistics } from "../../storage/statistics";
import type { Statistics } from "../../shared/types";

export function useStatistics() {
  const [statistics, setStatistics] = useState<Statistics>(getDefaultStatistics());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const response = await sendExtensionMessage({ type: "GET_STATISTICS" });
    if (response.ok && response.data && "lifetime" in response.data) {
      setStatistics(response.data as Statistics);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const reset = useCallback(async () => {
    const response = await sendExtensionMessage({ type: "RESET_STATISTICS" });
    if (response.ok && response.data && "lifetime" in response.data) {
      setStatistics(response.data as Statistics);
    }
  }, []);

  return { statistics, loading, refresh, reset };
}

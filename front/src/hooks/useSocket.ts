import { useEffect, useCallback } from "react";
import { onSocketEvent, emitSocketEvent } from "../lib/socket";

export function useSocketEvent<T = any>(
  event: string,
  callback: (data: T) => void,
  deps: any[] = []
) {
  useEffect(() => {
    const cleanup = onSocketEvent<T>(event, callback);
    return cleanup;
  }, deps);
}

export function useSocketEmit() {
  return useCallback(<T = any>(event: string, data?: T) => {
    emitSocketEvent<T>(event, data);
  }, []);
}

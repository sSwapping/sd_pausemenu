import { useEffect } from "react";

type NuiEvent<T = unknown> = {
  type: string;
} & T;

export const useNuiEvent = <T = unknown>(
  eventName: string,
  callback: (data: T) => void,
) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent<NuiEvent<T>>) => {
      if (event.data?.type === eventName) {
        callback(event.data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [eventName, callback]);
};

import { useEffect, useRef } from "react";

export const useRenderCount = (componentName: string, debug = false) => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    if (debug) {
      console.log(`${componentName} rendered:`, renderCount.current);
    }
  });

  return renderCount.current;
};

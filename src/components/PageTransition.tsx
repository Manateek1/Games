import { useMemo } from "react";
import type { ReactNode } from "react";

interface PageTransitionProps {
  reducedMotion: boolean;
  children: ReactNode;
}

export const PageTransition = ({ reducedMotion, children }: PageTransitionProps): React.JSX.Element => {
  const className = useMemo(
    () => (reducedMotion ? "" : "animate-[pageEnter_260ms_cubic-bezier(0.2,0.8,0.2,1)]"),
    [reducedMotion],
  );

  return <div className={className}>{children}</div>;
};

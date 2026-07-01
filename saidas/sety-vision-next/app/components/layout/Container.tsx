import { type CSSProperties, type ReactNode } from "react";

/**
 * Contêiner universal — todas as seções usam este wrapper.
 * max-w-1280, margin auto, padding horizontal 32px desktop / 20px mobile.
 */
export function Container({
  children,
  style,
  className,
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        width: "100%",
        padding: "0 32px",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

import type { ReactNode } from "react";
import { Lines } from "./Lines";
interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  accent?: string;
  children?: ReactNode;
}
export function SectionHeading({
  eyebrow,
  title,
  accent,
  children,
}: SectionHeadingProps) {
  return (
    <div className="section-heading reveal">
      <div>
        <span className="eyebrow red">{eyebrow}</span>
        <h2>
          <Lines text={title} />
          {accent && (
            <>
              <br />
              <span>
                <Lines text={accent} />
              </span>
            </>
          )}
        </h2>
      </div>
      {children}
    </div>
  );
}

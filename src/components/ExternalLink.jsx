// src/components/ExternalLink.jsx
import { ArrowUpRight } from "lucide-react";

export default function ExternalLink({
  href,
  children,
  className = "",
  showArrow = true,
}) {
  if (!href) {
    return (
      <span
        aria-disabled="true"
        className={`${className} cursor-default opacity-60`}
      >
        {children}
        <span className="text-xs font-normal">Sắp cập nhật</span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      {showArrow && (
        <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
      )}
      <span className="sr-only"> (mở trong tab mới)</span>
    </a>
  );
}

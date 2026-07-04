import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

interface TruncatedTooltipProps {
  text: string;
  as?: ElementType;
  className?: string;
  wrapClassName?: string;
  prefix?: ReactNode;
}

export function Tooltip({
  text,
  as: Tag = "span",
  className = "",
  wrapClassName = "",
  prefix,
}: TruncatedTooltipProps) {
  const ref = useRef<HTMLElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setOverflows(el.scrollWidth > el.clientWidth);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  return (
    <div className={`group relative ${wrapClassName}`}>
      {prefix ? (
        <div className="flex min-w-0 items-center gap-1">
          {prefix}
          <Tag ref={ref} className={`truncate ${className}`}>
            {text}
          </Tag>
        </div>
      ) : (
        <Tag ref={ref} className={`block truncate ${className}`}>
          {text}
        </Tag>
      )}

      {overflows && (
        <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 hidden w-max max-w-[220px] rounded-lg bg-gray-700 px-3 py-1.5 text-xs leading-snug text-white shadow-md group-hover:block">
          {text}
          <span className="absolute left-3 top-full border-4 border-transparent border-t-gray-700" />
        </div>
      )}
    </div>
  );
}

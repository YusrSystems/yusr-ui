import { cn } from "../../../utils/cn";
import { TitleSeparator } from "../separators/titleSeparator";

type ColumnsConfig =
  | number
  | {
      base?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
    };

interface FieldsSectionProps {
  title?: string;
  children: React.ReactNode;
  columns?: ColumnsConfig;
  className?: string;
  gridClassName?: string;
}

function getGridClasses(columns?: ColumnsConfig) {
  if (!columns) return "";

  if (typeof columns === "number") {
    return "";
  }

  return cn({
    [`grid-cols-${columns.base}`]: columns.base,
    [`sm:grid-cols-${columns.sm}`]: columns.sm,
    [`md:grid-cols-${columns.md}`]: columns.md,
    [`lg:grid-cols-${columns.lg}`]: columns.lg,
    [`xl:grid-cols-${columns.xl}`]: columns.xl,
  });
}

function getGridStyle(columns?: ColumnsConfig): React.CSSProperties | undefined {
  if (typeof columns === "number") {
    return {
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    };
  }

  return undefined;
}

export function FieldsSection({
  title,
  children,
  columns = { base: 1, md: 2, lg: 3 },
  className,
  gridClassName,
}: FieldsSectionProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {title && <TitleSeparator title={title} />}

      <div
        className={cn(
          "grid gap-4",
          typeof columns !== "number" && getGridClasses(columns),
          gridClassName
        )}
        style={getGridStyle(columns)}
      >
        {children}
      </div>
    </div>
  );
}
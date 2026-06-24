import React, { ReactNode, memo } from "react";
import classNames from "classnames";

interface RowProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Row = memo(({ children, className, style }: RowProps) => {
  return (
    <div className={classNames("grid-row", className)} style={style}>
      {children}
    </div>
  );
});

Row.displayName = "Row";

interface ColumnProps {
  children: ReactNode;
  small?: number;
  medium?: number;
  large?: number;
  offsetOnSmall?: number;
  offsetOnMedium?: number;
  offsetOnLarge?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Column = memo(
  ({
    children,
    small,
    medium,
    large,
    offsetOnSmall,
    offsetOnMedium,
    offsetOnLarge,
    className,
    style,
  }: ColumnProps) => {
    const classes = classNames(
      "grid-column",
      small !== undefined && `small-${small}`,
      medium !== undefined && `medium-${medium}`,
      large !== undefined && `large-${large}`,
      offsetOnSmall !== undefined && `offset-small-${offsetOnSmall}`,
      offsetOnMedium !== undefined && `offset-medium-${offsetOnMedium}`,
      offsetOnLarge !== undefined && `offset-large-${offsetOnLarge}`,
      className,
    );

    return (
      <div className={classes} style={style}>
        {children}
      </div>
    );
  },
);

Column.displayName = "Column";

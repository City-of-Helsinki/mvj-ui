import React, { useRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { IconDrag } from "hds-react";
import classNames from "classnames";
import "./LeaseAreasPanel.scss";

type Props = {
  title: string;
  className?: string;
  children: ReactNode;
};

const LeaseAreasPanel = ({ title, className, children }: Props) => {
  const panelRef = useRef<HTMLDetailsElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    left: number;
    top: number;
    maxLeft: number;
    maxTop: number;
    moved: boolean;
  } | null>(null);

  const summaryProps: HTMLAttributes<HTMLElement> = {
    onPointerDown: (event) => {
      if (event.button !== 0 || !panelRef.current) return;
      const panel = panelRef.current;
      const container = panel.offsetParent as HTMLElement | null;
      if (!container) return;
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        left: panel.offsetLeft,
        top: panel.offsetTop,
        maxLeft: Math.max(0, container.clientWidth - panel.offsetWidth),
        maxTop: Math.max(0, container.clientHeight - panel.offsetHeight),
        moved: false,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
      event.stopPropagation();
    },
    onPointerMove: (event) => {
      const drag = dragRef.current;
      if (
        !drag ||
        drag.pointerId !== event.pointerId ||
        !event.currentTarget.hasPointerCapture(event.pointerId)
      )
        return;
      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;
      if (!drag.moved && Math.hypot(deltaX, deltaY) < 4) return;
      drag.moved = true;
      const panel = panelRef.current;
      if (!panel) return;
      panel.style.left = `${Math.max(0, Math.min(drag.maxLeft, drag.left + deltaX))}px`;
      panel.style.top = `${Math.max(0, Math.min(drag.maxTop, drag.top + deltaY))}px`;
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    },
    onPointerUp: (event) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId))
        event.currentTarget.releasePointerCapture(event.pointerId);
    },
    onPointerCancel: () => {
      dragRef.current = null;
    },
    onClick: (event) => {
      if (dragRef.current?.moved) event.preventDefault();
      dragRef.current = null;
    },
  };

  return (
    <details
      ref={panelRef}
      className={classNames("lease-areas-panel", className)}
      open
    >
      <summary {...summaryProps}>
        {title}
        <span
          className="lease-areas-panel__drag-handle"
          title="Siirrä paneelia"
          aria-hidden="true"
        >
          <IconDrag />
        </span>
      </summary>
      {children}
    </details>
  );
};

export default LeaseAreasPanel;

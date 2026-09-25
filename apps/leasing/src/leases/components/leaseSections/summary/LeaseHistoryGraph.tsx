import React, { useMemo } from "react";
import dagre, { Graph } from "@dagrejs/dagre";
import { formatDate, getLabelOfOption, isArchived } from "@/util/helpers";
import type { LeaseGraph, LeaseGraphNode } from "@/leases/leaseHistoryGraph";
import type { SelectListOption } from "@/types";

type Props = {
  graph: LeaseGraph;
  stateOptions: SelectListOption[];
};

const NODE_WIDTH = 120;
const NODE_HEIGHT = 82;
// Nodes snap to a grid of half the node size for a tidy, aligned layout.
const GRID_X = NODE_WIDTH / 6;
const GRID_Y = NODE_HEIGHT / 6;

const snap = (value: number, step: number): number =>
  Math.round(value / step) * step;

type Point = { x: number; y: number };

const ACTIVE_COLOR = "#0078c0";
const ARCHIVED_COLOR = "#b7b7b7";
const CURRENT_COLOR = "#000000";

// Colour comes from archival status; the current lease keeps a distinct marker.
const nodeColor = (node: LeaseGraphNode): string => {
  if (node.visual === "current") return CURRENT_COLOR;
  return isArchived({ end_date: node.endDate }) ? ARCHIVED_COLOR : ACTIVE_COLOR;
};

const formatRange = (node: LeaseGraphNode): string => {
  const start = node.startDate ? formatDate(node.startDate) : "";
  const end = node.endDate ? formatDate(node.endDate) : "";
  if (!start && !end) return "";
  return `${start} - ${end}`;
};

/**
 * PROTOTYPE — renders the lease history as a static top-down directed graph.
 * dagre computes the layout once; nodes are DOM cards (HDS-styleable later) and
 * edges are SVG paths (solid arrow = transfer, dashed = plain relation).
 */
const LeaseHistoryGraph = ({ graph, stateOptions }: Props) => {
  const layout = useMemo(() => {
    const g = new Graph();
    g.setGraph({
      // Bottom-up tree: the oldest root sits at the bottom and the history grows
      // upward, branching into successors. Layout edges are oriented by chronology
      // (older -> newer) so the newer lease always ranks higher, regardless of how
      // the underlying related_lease link happens to be stored.
      rankdir: "BT",
      nodesep: 24,
      ranksep: 55,
      marginx: 12,
      marginy: 12,
    });
    g.setDefaultEdgeLabel(() => ({}));

    // Start-date lookup, used to orient edges chronologically.
    const startById = new Map<number, string>();
    graph.nodes.forEach((node) => {
      startById.set(node.id, node.startDate ?? "0000-01-01");
      g.setNode(String(node.id), { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    // Orient each edge older -> newer so dagre ranks the newer node higher.
    // Falls back to the stored from -> to direction when dates tie or are absent.
    const layoutEdges = graph.edges.map((edge) => {
      const fromStart = startById.get(edge.from) ?? "0000-01-01";
      const toStart = startById.get(edge.to) ?? "0000-01-01";
      const olderIsFrom = fromStart <= toStart;
      const lower = olderIsFrom ? edge.from : edge.to; // chronologically older
      const upper = olderIsFrom ? edge.to : edge.from; // chronologically newer
      g.setEdge(String(lower), String(upper));
      return { edge, lower, upper };
    });

    dagre.layout(g);

    // Snap each node centre to the grid, then derive top-left for rendering.
    const centerById = new Map<number, { cx: number; cy: number }>();
    const positioned = graph.nodes.map((node) => {
      const { x, y } = g.node(String(node.id));
      const cx = snap(x, GRID_X);
      const cy = snap(y, GRID_Y);
      centerById.set(node.id, { cx, cy });
      return { node, x: cx - NODE_WIDTH / 2, y: cy - NODE_HEIGHT / 2 };
    });

    // Build straight, 45°-constrained edges between node borders (ignoring
    // dagre's spline points). `lower` is chronologically older, `upper` newer;
    // in the BT layout the newer node sits above, so the arrow points upward.
    const edges = layoutEdges.map(({ edge, lower, upper }) => {
      const from = centerById.get(lower);
      const to = centerById.get(upper);
      // `origin` is the chronologically older endpoint, used for edge colour.
      if (!from || !to) return { edge, points: [] as Point[], origin: lower };

      // Straight line from the top edge of the lower node to the bottom edge
      // of the upper node.
      const start: Point = { x: from.cx, y: from.cy - NODE_HEIGHT / 2 };
      const end: Point = { x: to.cx, y: to.cy + NODE_HEIGHT / 2 };
      return { edge, points: [start, end], origin: lower };
    });

    let { width = 0, height = 0 } = g.graph();
    // Grid snapping can nudge nodes slightly past the computed bounds.
    width = Math.max(width, ...positioned.map((p) => p.x + NODE_WIDTH + 12));
    height = Math.max(height, ...positioned.map((p) => p.y + NODE_HEIGHT + 12));
    return { positioned, edges, width, height };
  }, [graph]);

  if (!graph.nodes.length) return null;

  const archivedById = new Map<number, boolean>(
    graph.nodes.map((node) => [
      node.id,
      isArchived({ end_date: node.endDate }),
    ]),
  );

  const toPath = (points: Array<{ x: number; y: number }>): string =>
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div
      className="lease-history-graph"
      style={{ overflowX: "auto", maxWidth: "100%", paddingBottom: 4 }}
    >
      <div
        className="lease-history-graph__canvas"
        style={{
          position: "relative",
          width: layout.width,
          height: layout.height,
        }}
      >
        <svg
          className="lease-history-graph__edges"
          width={layout.width}
          height={layout.height}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <defs>
            <marker
              id="lease-graph-arrow-active"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={ACTIVE_COLOR} />
            </marker>
            <marker
              id="lease-graph-arrow-archived"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={ARCHIVED_COLOR} />
            </marker>
          </defs>
          {layout.edges.map(({ edge, points, origin }) => {
            const isTransfer = edge.type === "transfer";
            // Colour the edge by the archival status of its origin (older) lease.
            const originArchived = archivedById.get(origin) ?? false;
            const currentArchived = archivedById.get(edge.to) ?? false;
            const color = currentArchived ? ARCHIVED_COLOR : ACTIVE_COLOR;
            return (
              <path
                key={edge.id}
                d={toPath(points)}
                fill="none"
                stroke={color}
                strokeWidth={isTransfer ? 2 : 1.5}
                strokeDasharray={isTransfer ? undefined : "4 3"}
                markerEnd={
                  currentArchived
                    ? "url(#lease-graph-arrow-archived)"
                    : "url(#lease-graph-arrow-active)"
                }
              />
            );
          })}
        </svg>

        {layout.positioned.map(({ node, x, y }) => {
          const isCurrent = node.visual === "current";
          return (
            <div
              key={node.id}
              className="lease-history-graph__node"
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
                boxSizing: "border-box",
                border: `2px solid ${nodeColor(node)}`,
                borderRadius: 6,
                padding: "6px 8px",
                background: isCurrent ? "#000000" : "#ffffff",
                color: isCurrent ? "#ffffff" : "#1a1a1a",
                fontSize: 12,
                lineHeight: 1.25,
                overflow: "hidden",
                boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
              }}
              title={`${node.identifier} — ${getServiceUnitAbbreviation(node.serviceUnitName)}`}
            >
              <div style={{ fontWeight: 600 }}>{node.identifier}</div>
              <div>{getLabelOfOption(stateOptions, node.leaseState)}</div>
              <div style={{ opacity: 0.85 }}>
                {getServiceUnitAbbreviation(node.serviceUnitName)}
              </div>
              <div style={{ opacity: 0.7, fontSize: 11 }}>
                {formatRange(node)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

//this is really bad lol
const getServiceUnitAbbreviation = (name: string): string => {
  switch (name) {
    case "Maaomaisuuden kehittäminen ja tontit":
      return "MAKE";
    case "KuVa / Ulkoilupalvelut":
      return "KUVA";
    default:
      return name;
  }
};

export default LeaseHistoryGraph;

import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import useAreaNotesOverlay from "./useAreaNotesOverlay";
import { fetchAreaNoteList } from "@/areaNote/slice";

vi.mock("@/areaNote/selectors", () => ({
  getAreaNoteList: (state: any) => state.areaNotes,
}));
vi.mock("@/usersPermissions/selectors", () => ({
  getUsersPermissions: (state: any) => state.permissions,
}));
vi.mock("@/util/helpers", () => ({
  hasPermissions: (permissions: Array<string>, permission: string) =>
    permissions.includes(permission),
}));

const VIEW_AREANOTE = "view_areanote";

vi.mock("@/usersPermissions/enums", () => ({
  UsersPermissions: { VIEW_AREANOTE: "view_areanote" },
}));
vi.mock("@/areaNote/components/AreaNotesLayer", () => ({
  default: () => null,
}));

const dispatched: Array<unknown> = [];

const renderOverlay = (
  state: { areaNotes: Array<unknown>; permissions: Array<string> },
  options?: Parameters<typeof useAreaNotesOverlay>[0],
) => {
  const store = configureStore({
    reducer: (current = state) => current,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        () => (next) => (action) => {
          dispatched.push(action);
          return next(action);
        },
      ),
  });

  return renderHook(() => useAreaNotesOverlay(options), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
};

describe("useAreaNotesOverlay", () => {
  beforeEach(() => {
    dispatched.length = 0;
  });

  it("returns an unchecked overlay when the user may view area notes and there are notes", () => {
    const { result } = renderOverlay({
      areaNotes: [{ id: 1 }],
      permissions: [VIEW_AREANOTE],
    });

    expect(result.current).toMatchObject({
      checked: false,
      name: "Muistettavat ehdot",
    });
  });

  it("returns nothing without the view permission", () => {
    const { result } = renderOverlay({
      areaNotes: [{ id: 1 }],
      permissions: [],
    });

    expect(result.current).toBeUndefined();
  });

  it("returns nothing when there are no notes", () => {
    const { result } = renderOverlay({
      areaNotes: [],
      permissions: [VIEW_AREANOTE],
    });

    expect(result.current).toBeUndefined();
  });

  it("returns an overlay for an empty list when showWhenEmpty is set", () => {
    const { result } = renderOverlay(
      { areaNotes: [], permissions: [VIEW_AREANOTE] },
      { showWhenEmpty: true },
    );

    expect(result.current).toBeDefined();
  });

  it("still requires the permission when showWhenEmpty is set", () => {
    const { result } = renderOverlay(
      { areaNotes: [], permissions: [] },
      { showWhenEmpty: true },
    );

    expect(result.current).toBeUndefined();
  });

  it("fetches area notes on mount only when asked to and permitted", () => {
    renderOverlay(
      { areaNotes: [], permissions: [VIEW_AREANOTE] },
      { fetchOnMount: true },
    );
    expect(dispatched).toContainEqual(fetchAreaNoteList({}));

    dispatched.length = 0;
    renderOverlay({ areaNotes: [], permissions: [VIEW_AREANOTE] });
    expect(dispatched).not.toContainEqual(fetchAreaNoteList({}));

    dispatched.length = 0;
    renderOverlay({ areaNotes: [], permissions: [] }, { fetchOnMount: true });
    expect(dispatched).not.toContainEqual(fetchAreaNoteList({}));
  });

  it("keeps the same overlay object across re-renders with unchanged inputs", () => {
    const { result, rerender } = renderOverlay({
      areaNotes: [{ id: 1 }],
      permissions: [VIEW_AREANOTE],
    });
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });
});

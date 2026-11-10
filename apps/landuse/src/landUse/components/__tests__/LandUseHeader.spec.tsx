import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, expect, it, vi } from "vitest";
import LandUseHeader from "@/landUse/components/LandUseHeader";
import { getUserPermissions } from "@/landUse/api/landUseApi";
import { LanduseApiError } from "@/landUse/api/fetchClient";

const { mockLogout } = vi.hoisted(() => ({ mockLogout: vi.fn() }));

vi.mock("hds-react", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useAuthenticatedUser: () => ({ profile: { name: "Test User" } }),
  useOidcClient: () => ({ logout: mockLogout }),
}));

vi.mock("@/landUse/api/landUseApi", () => ({
  getUserPermissions: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

const openGroups = () => {
  render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: { queries: { retry: false } },
        })
      }
    >
      <LandUseHeader />
    </QueryClientProvider>,
  );
  expect(getUserPermissions).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Käyttäjävalikko" }));
};

it("uses the HDS avatar menu for groups and logout without extra navigation", async () => {
  vi.mocked(getUserPermissions).mockResolvedValue({
    groups: ["Land use editors", "Land use viewers"],
    permissions: [],
  });
  openGroups();

  expect(screen.getByRole("img", { name: "Helsinki" })).toBeDefined();
  expect(screen.getByText("TU")).toBeDefined();
  expect(await screen.findByText("Land use editors")).toBeDefined();
  expect(screen.getByText("Land use viewers")).toBeDefined();
  expect(screen.queryByRole("searchbox")).toBeNull();
  expect(screen.queryByRole("button", { name: "Valikko" })).toBeNull();
  expect(document.querySelector('a[href="https://hel.fi"]')).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Kirjaudu ulos" }));
  expect(mockLogout).toHaveBeenCalledTimes(1);
});

it("shows an empty state for users without groups", async () => {
  vi.mocked(getUserPermissions).mockResolvedValue({
    groups: [],
    permissions: [],
  });
  openGroups();
  expect(await screen.findByText("Ei käyttäjäryhmiä.")).toBeDefined();
});

it("shows an HDS error notification when loading fails", async () => {
  vi.mocked(getUserPermissions).mockRejectedValue(
    new LanduseApiError(500, { detail: "Groups unavailable" }),
  );
  openGroups();
  expect(await screen.findByText("Groups unavailable")).toBeDefined();
  expect(
    screen.getByText("Käyttäjäryhmien lataaminen epäonnistui"),
  ).toBeDefined();
});

it("shows a loading state while fetching groups", () => {
  vi.mocked(getUserPermissions).mockReturnValue(new Promise(() => {}));
  openGroups();
  expect(screen.getByRole("status").textContent).toBe("Ladataan...");
});

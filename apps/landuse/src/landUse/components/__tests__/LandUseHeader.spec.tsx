import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
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

const renderHeader = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <LandUseHeader />
    </QueryClientProvider>,
  );
  return client;
};

const openGroups = () => {
  renderHeader();
  expect(getUserPermissions).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: "Käyttäjävalikko" }));
};

it("switches between applications using full-page navigation links", () => {
  vi.mocked(getUserPermissions).mockReturnValue(new Promise(() => {}));
  renderHeader();
  const switcher = screen.getByRole("button", {
    name: "Maanvuokrausjärjestelmä",
  });
  const menu = document.getElementById("landuse-app-navigation")!;
  expect(switcher.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(switcher);
  expect(switcher.getAttribute("aria-expanded")).toBe("true");
  const landuseLink = menu.querySelector('a[href="/maankayttosopimukset"]');
  expect(landuseLink?.textContent).toContain("Maankäyttösopimukset");
  expect(landuseLink?.getAttribute("aria-current")).toBe("page");
  expect(
    screen.getByRole("link", { name: "Vuokraukset" }).getAttribute("href"),
  ).toBe("/vuokraukset");
  expect(getUserPermissions).toHaveBeenCalledTimes(1);
  fireEvent.click(switcher);
  expect(switcher.getAttribute("aria-expanded")).toBe("false");
});

it("loads permissions before opening the avatar menu and supports logout", async () => {
  vi.mocked(getUserPermissions).mockResolvedValue({
    groups: ["Land use editors", "Land use viewers"],
    permissions: [],
  });
  const client = renderHeader();
  const menuButton = screen.getByRole("button", { name: "Käyttäjävalikko" });
  expect(menuButton.getAttribute("aria-expanded")).toBe("false");
  await waitFor(() => {
    expect(client.getQueryState(["land-use", "user-permissions"])?.status).toBe(
      "success",
    );
  });
  expect(menuButton.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(menuButton);

  expect(screen.queryByRole("img", { name: "Helsinki" })).toBeNull();
  expect(screen.getByText("TU")).toBeDefined();
  expect(await screen.findByText("Land use editors")).toBeDefined();
  expect(screen.queryByRole("status")).toBeNull();
  expect(getUserPermissions).toHaveBeenCalledTimes(1);
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

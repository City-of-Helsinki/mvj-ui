import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter, useLocation, useNavigate } from "react-router";
import rootReducer from "@/root/rootReducer";
import { receiveAttributes, receiveMethods } from "@/leases/slice";
import { receiveUserServiceUnits } from "@/usersPermissions/slice";
import LeaseListPage from "./LeaseListPage";

vi.mock("@/leases/components/leaseSections/map/LeaseListMap", () => ({
  default: () => <div data-testid="lease-map" />,
}));
vi.mock("./search/Search", () => ({ default: () => null }));
vi.mock("./createLease/CreateLeaseModal", () => ({ default: () => null }));

// Stands in for everything outside the page that changes the url: browser
// history and plain links such as the side menu.
const LocationProbe = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <output data-testid="search">{location.search}</output>
      <button onClick={() => navigate(-1)}>history-back</button>
      <button onClick={() => navigate(1)}>history-forward</button>
      <button onClick={() => navigate("/?service_unit=1")}>
        plain-list-link
      </button>
    </>
  );
};

const renderPage = (url: string) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: false,
        serializableCheck: false,
        immutableCheck: false,
      }),
  });
  store.dispatch(receiveAttributes({}));
  store.dispatch(receiveMethods({ GET: true }));
  store.dispatch(receiveUserServiceUnits([{ id: 1, name: "Unit" }] as any));

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[url]}>
        <LeaseListPage />
        <LocationProbe />
      </MemoryRouter>
    </Provider>,
  );
};

const selectedTab = () =>
  screen
    .getAllByRole("tab")
    .find((tab) => tab.getAttribute("aria-selected") === "true")
    ?.textContent?.trim();

describe("LeaseListPage visualization", () => {
  afterEach(cleanup);

  it("shows the table when the url has no visualization", () => {
    renderPage("/?service_unit=1");

    expect(selectedTab()).toContain("Taulukko");
  });

  it("opens the map when the url has visualization=map", () => {
    renderPage("/?visualization=map&service_unit=1");

    expect(selectedTab()).toContain("Kartta");
  });

  it("still opens the map when the service unit has to be added to the url first", () => {
    renderPage("/?visualization=map");

    expect(selectedTab()).toContain("Kartta");
    expect(screen.getByTestId("search").textContent).toContain(
      "visualization=map",
    );
  });

  it("switches to the map and records it in the url when the map tab is clicked", () => {
    renderPage("/?service_unit=1");

    fireEvent.click(screen.getByRole("tab", { name: /Kartta/ }));

    expect(selectedTab()).toContain("Kartta");
    expect(screen.getByTestId("search").textContent).toContain(
      "visualization=map",
    );
  });

  it("switches back to the table and removes it from the url when the table tab is clicked", () => {
    renderPage("/?visualization=map&service_unit=1");

    fireEvent.click(screen.getByRole("tab", { name: /Taulukko/ }));

    expect(selectedTab()).toContain("Taulukko");
    expect(screen.getByTestId("search").textContent).not.toContain(
      "visualization",
    );
  });

  describe("map viewport parameters", () => {
    const mapUrl =
      "/?visualization=map&service_unit=1&zoom=9&in_bbox=24.7,60.1,25.3,60.3";
    const getSearch = () => screen.getByTestId("search").textContent;

    it("drops in_bbox and zoom when switching to the table", () => {
      renderPage(mapUrl);

      fireEvent.click(screen.getByRole("tab", { name: /Taulukko/ }));

      expect(getSearch()).not.toContain("in_bbox");
      expect(getSearch()).not.toContain("zoom");
      expect(getSearch()).not.toContain("visualization");
    });

    it("keeps the other filters when switching to the table", () => {
      renderPage(`${mapUrl}&search=abc&page=2`);

      fireEvent.click(screen.getByRole("tab", { name: /Taulukko/ }));

      expect(getSearch()).toContain("service_unit=1");
      expect(getSearch()).toContain("search=abc");
      expect(getSearch()).toContain("page=2");
    });

    it("keeps in_bbox and zoom while staying on the map", () => {
      renderPage(mapUrl);

      fireEvent.click(screen.getByRole("tab", { name: /Kartta/ }));

      expect(getSearch()).toContain("in_bbox=");
      expect(getSearch()).toContain("zoom=9");
    });

    it("does not bring them back when switching to the map again", () => {
      renderPage(mapUrl);
      fireEvent.click(screen.getByRole("tab", { name: /Taulukko/ }));

      fireEvent.click(screen.getByRole("tab", { name: /Kartta/ }));

      expect(getSearch()).toContain("visualization=map");
      expect(getSearch()).not.toContain("in_bbox");
      expect(getSearch()).not.toContain("zoom");
    });

    it("leaves the url alone when switching to the table from a plain table url", () => {
      renderPage("/?service_unit=1");

      fireEvent.click(screen.getByRole("tab", { name: /Taulukko/ }));

      expect(getSearch()).toBe("?service_unit=1");
    });
  });

  describe("when the url changes while the page is open", () => {
    it("shows the table again when going back from the map", () => {
      renderPage("/?service_unit=1");
      fireEvent.click(screen.getByRole("tab", { name: /Kartta/ }));

      fireEvent.click(screen.getByText("history-back"));

      expect(selectedTab()).toContain("Taulukko");
    });

    it("shows the map again when going forward", () => {
      renderPage("/?service_unit=1");
      fireEvent.click(screen.getByRole("tab", { name: /Kartta/ }));
      fireEvent.click(screen.getByText("history-back"));

      fireEvent.click(screen.getByText("history-forward"));

      expect(selectedTab()).toContain("Kartta");
    });

    it("shows the table when a plain list link is followed from the map", () => {
      renderPage("/?visualization=map&service_unit=1");

      fireEvent.click(screen.getByText("plain-list-link"));

      expect(selectedTab()).toContain("Taulukko");
    });

    it("keeps the tab element when the user picks a tab, so keyboard focus is not lost", () => {
      renderPage("/?service_unit=1");
      const mapTab = screen.getByRole("tab", { name: /Kartta/ });

      fireEvent.click(mapTab);

      expect(screen.getByRole("tab", { name: /Kartta/ })).toBe(mapTab);
    });

    it("leaves keyboard focus on the tab that was picked", () => {
      renderPage("/?service_unit=1");
      const mapTab = screen.getByRole("tab", { name: /Kartta/ });
      mapTab.focus();

      fireEvent.click(mapTab);

      expect(document.activeElement).toBe(
        screen.getByRole("tab", { name: /Kartta/ }),
      );
    });

    it("keeps following the url after a tab was picked by the user", () => {
      renderPage("/?service_unit=1");
      fireEvent.click(screen.getByRole("tab", { name: /Kartta/ }));
      fireEvent.click(screen.getByRole("tab", { name: /Taulukko/ }));
      fireEvent.click(screen.getByRole("tab", { name: /Kartta/ }));

      fireEvent.click(screen.getByText("history-back"));

      expect(selectedTab()).toContain("Taulukko");
      expect(screen.getByTestId("search").textContent).not.toContain(
        "visualization",
      );
    });
  });
});

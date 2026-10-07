import L from "leaflet";
import { SERVICE_MAP_URL } from "@/util/constants";

type AddressResult = {
  label: string;
  coordinates: [number, number];
};

type ServiceMapResponse = {
  results?: Array<{
    name?: { fi?: string };
    location?: { coordinates?: [number, number] };
  }>;
};

const searchAddresses = async (query: string): Promise<AddressResult[]> => {
  const params = new URLSearchParams({
    q: query,
    type: "address",
    municipality: "helsinki",
  });
  const response = await fetch(`${SERVICE_MAP_URL}/search/?${params}`);
  if (!response.ok)
    throw new Error(`Address search failed: ${response.status}`);
  const data = (await response.json()) as ServiceMapResponse;
  return (data.results ?? []).flatMap((address) => {
    const coordinates = address.location?.coordinates;
    return coordinates ? [{ label: address.name?.fi ?? "", coordinates }] : [];
  });
};

export default class LeafletAddressSearchControl extends L.Control {
  private container: HTMLDivElement | null = null;
  private placeholder: HTMLDivElement | null = null;
  private form: HTMLFormElement | null = null;
  private input: HTMLInputElement | null = null;
  private results: HTMLDivElement | null = null;
  private map: L.Map | null = null;
  private currentResults: AddressResult[] = [];
  private selectedIndex = -1;
  private requestId = 0;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  onAdd(map: L.Map): HTMLElement {
    this.map = map;
    this.container = L.DomUtil.create(
      "div",
      "leaflet-control leaflet-control-geosearch leaflet-geosearch-bar",
    );
    this.form = L.DomUtil.create("form", "", this.container);
    this.form.autocomplete = "off";
    this.input = L.DomUtil.create("input", "", this.form);
    this.input.type = "text";
    this.input.placeholder = "Hae osoitteella";
    this.input.setAttribute("aria-label", "Hae osoitteella");
    const resetButton = L.DomUtil.create("button", "reset", this.form);
    resetButton.type = "button";
    resetButton.textContent = "×";
    resetButton.setAttribute("aria-label", "Tyhjennä haku");
    this.results = L.DomUtil.create("div", "results", this.form);

    L.DomEvent.disableClickPropagation(this.container);
    L.DomEvent.on(this.form, "submit", (event) => {
      L.DomEvent.stop(event);
      void this.submit(map);
    });
    L.DomEvent.on(this.input, "input", () => this.scheduleAutocomplete());
    L.DomEvent.on(this.input, "keydown", (event) =>
      this.handleKeyDown(map, event),
    );
    L.DomEvent.on(this.input, "focus", () =>
      this.form?.classList.add("active"),
    );
    L.DomEvent.on(this.input, "blur", () =>
      this.form?.classList.remove("active"),
    );
    L.DomEvent.on(resetButton, "click", () => this.clearResults(true));
    map.getContainer().appendChild(this.container);
    this.placeholder = L.DomUtil.create(
      "div",
      "leaflet-address-search-placeholder",
    );
    return this.placeholder;
  }

  onRemove(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.requestId += 1;
    this.container?.remove();
    this.placeholder?.remove();
    this.container = null;
    this.placeholder = null;
    this.form = null;
    this.input = null;
    this.results = null;
    this.map = null;
    this.currentResults = [];
  }

  private scheduleAutocomplete(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.clearResults();
    const query = this.input?.value.trim() ?? "";
    if (!query) return;
    this.container?.classList.add("pending");
    this.debounceTimer = setTimeout(() => void this.autocomplete(query), 250);
  }

  private async autocomplete(query: string): Promise<void> {
    const requestId = ++this.requestId;
    try {
      const addresses = (await searchAddresses(query)).slice(0, 5);
      if (requestId === this.requestId) this.renderResults(addresses);
    } catch {
      if (requestId === this.requestId) {
        this.renderResults([]);
        this.container?.classList.add("error");
      }
    } finally {
      this.container?.classList.remove("pending");
    }
  }

  private async submit(map: L.Map): Promise<void> {
    const query = this.input?.value.trim() ?? "";
    if (!query) return;
    this.clearResults();
    this.container?.classList.add("pending");
    try {
      const [result] = await searchAddresses(query);
      if (!result) return;
      map.setView([result.coordinates[1], result.coordinates[0]], 9, {
        animate: true,
      });
      this.clearResults(true);
      this.form?.classList.remove("active");
    } catch {
      this.container?.classList.add("error");
    } finally {
      this.container?.classList.remove("pending");
    }
  }

  private handleKeyDown(map: L.Map, event: KeyboardEvent): void {
    const count = this.results?.children.length ?? 0;
    if (event.key === "Escape") {
      event.preventDefault();
      this.clearResults(true);
      this.form?.classList.remove("active");
    } else if (event.key === "ArrowDown" && count) {
      event.preventDefault();
      this.selectResult(this.selectedIndex + 1);
    } else if (event.key === "ArrowUp" && count) {
      event.preventDefault();
      this.selectResult(this.selectedIndex - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const result =
        this.selectedIndex >= 0
          ? this.currentResults[this.selectedIndex]
          : undefined;
      if (result) {
        this.selectAddress(result);
      } else {
        void this.submit(map);
      }
    }
  }

  private renderResults(addresses: AddressResult[]): void {
    if (!this.results) return;
    this.results.replaceChildren();
    this.selectedIndex = -1;
    this.currentResults = addresses;
    addresses.forEach(({ label }, resultIndex) => {
      const item = L.DomUtil.create("div", "", this.results!);
      item.dataset.label = label;
      item.textContent = label;
      L.DomEvent.on(item, "mousedown", (event) => {
        L.DomEvent.stop(event);
        this.selectAddress(this.currentResults[resultIndex]);
      });
    });
    this.results.classList.toggle("active", addresses.length > 0);
  }

  private selectResult(index: number): void {
    const count = this.results?.children.length ?? 0;
    if (!count) return;
    this.selectedIndex = (index + count) % count;
    Array.from(this.results!.children).forEach((item, itemIndex) => {
      item.classList.toggle("active", itemIndex === this.selectedIndex);
    });
    const selected = this.results!.children[this.selectedIndex] as HTMLElement;
    if (this.input && selected.dataset.label) {
      this.input.value = selected.dataset.label;
    }
  }

  private clearResults(clearInput = false): void {
    this.results?.replaceChildren();
    this.results?.classList.remove("active");
    this.selectedIndex = -1;
    this.currentResults = [];
    this.container?.classList.remove("error");
    if (clearInput && this.input) this.input.value = "";
  }

  private selectAddress(result: AddressResult): void {
    if (this.input) this.input.value = result.label;
    this.map?.setView([result.coordinates[1], result.coordinates[0]], 9, {
      animate: true,
    });
    this.clearResults(true);
    this.form?.classList.remove("active");
  }
}

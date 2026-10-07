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
  private resetButton: HTMLButtonElement | null = null;
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
    this.resetButton = L.DomUtil.create("button", "reset", this.form);
    this.resetButton.type = "button";
    this.resetButton.textContent = "×";
    this.resetButton.setAttribute("aria-label", "Tyhjennä haku");
    this.results = L.DomUtil.create("div", "results", this.form);

    L.DomEvent.disableClickPropagation(this.container);
    L.DomEvent.on(this.form, "submit", this.handleSubmit);
    L.DomEvent.on(this.input, "input", this.handleInput);
    L.DomEvent.on(this.input, "keydown", this.handleKeyDown);
    L.DomEvent.on(this.input, "focus", this.handleFocus);
    L.DomEvent.on(this.input, "blur", this.handleBlur);
    L.DomEvent.on(this.resetButton, "click", this.handleReset);
    L.DomEvent.on(this.results, "mousedown", this.handleResultMouseDown);
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
    if (this.form) {
      L.DomEvent.off(this.form, "submit", this.handleSubmit);
    }
    if (this.input) {
      L.DomEvent.off(this.input, "input", this.handleInput);
      L.DomEvent.off(this.input, "keydown", this.handleKeyDown);
      L.DomEvent.off(this.input, "focus", this.handleFocus);
      L.DomEvent.off(this.input, "blur", this.handleBlur);
    }
    if (this.resetButton) {
      L.DomEvent.off(this.resetButton, "click", this.handleReset);
    }
    if (this.results) {
      L.DomEvent.off(this.results, "mousedown", this.handleResultMouseDown);
    }
    this.container?.remove();
    this.placeholder?.remove();
    this.container = null;
    this.placeholder = null;
    this.form = null;
    this.input = null;
    this.results = null;
    this.resetButton = null;
    this.map = null;
    this.currentResults = [];
  }

  private readonly handleSubmit = (event: Event): void => {
    L.DomEvent.stop(event);
    void this.submit();
  };

  private readonly handleInput = (): void => this.scheduleAutocomplete();

  private readonly handleFocus = (): void => {
    this.form?.classList.add("active");
  };

  private readonly handleBlur = (): void => {
    this.form?.classList.remove("active");
  };

  private readonly handleReset = (): void => {
    this.cancelPendingSearch();
    this.clearResults(true);
  };

  private readonly handleResultMouseDown = (event: MouseEvent): void => {
    L.DomEvent.stop(event);
    const item = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-result-index]",
    );
    const resultIndex = Number(item?.dataset.resultIndex);
    const result = this.currentResults[resultIndex];
    if (result) {
      this.selectAddress(result);
    }
  };

  private scheduleAutocomplete(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = null;
    const requestId = ++this.requestId;
    this.clearResults();
    const query = this.input?.value.trim() ?? "";
    if (!query) {
      this.container?.classList.remove("pending");
      return;
    }
    this.container?.classList.add("pending");
    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = null;
      void this.autocomplete(query, requestId);
    }, 250);
  }

  private async autocomplete(query: string, requestId: number): Promise<void> {
    try {
      const addresses = (await searchAddresses(query)).slice(0, 5);
      if (requestId === this.requestId) this.renderResults(addresses);
    } catch {
      if (requestId === this.requestId) {
        this.renderResults([]);
        this.container?.classList.add("error");
      }
    } finally {
      if (requestId === this.requestId) {
        this.container?.classList.remove("pending");
      }
    }
  }

  private async submit(): Promise<void> {
    const query = this.input?.value.trim() ?? "";
    if (!query || !this.map) return;
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = null;
    const requestId = ++this.requestId;
    this.clearResults();
    this.container?.classList.add("pending");
    try {
      const [result] = await searchAddresses(query);
      if (requestId !== this.requestId || !result || !this.map) return;
      this.map.setView([result.coordinates[1], result.coordinates[0]], 9, {
        animate: true,
      });
      this.clearResults(true);
      this.form?.classList.remove("active");
    } catch {
      if (requestId === this.requestId) {
        this.container?.classList.add("error");
      }
    } finally {
      if (requestId === this.requestId) {
        this.container?.classList.remove("pending");
      }
    }
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    const count = this.results?.children.length ?? 0;
    if (event.key === "Escape") {
      event.preventDefault();
      this.cancelPendingSearch();
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
        void this.submit();
      }
    }
  };

  private renderResults(addresses: AddressResult[]): void {
    if (!this.results) return;
    this.results.replaceChildren();
    this.selectedIndex = -1;
    this.currentResults = addresses;
    addresses.forEach(({ label }, resultIndex) => {
      const item = L.DomUtil.create("div", "", this.results!);
      item.dataset.label = label;
      item.dataset.resultIndex = String(resultIndex);
      item.textContent = label;
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

  private cancelPendingSearch(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = null;
    this.requestId += 1;
    this.container?.classList.remove("pending");
  }

  private selectAddress(result: AddressResult): void {
    this.cancelPendingSearch();
    if (this.input) this.input.value = result.label;
    this.map?.setView([result.coordinates[1], result.coordinates[0]], 9, {
      animate: true,
    });
    this.clearResults(true);
    this.form?.classList.remove("active");
  }
}

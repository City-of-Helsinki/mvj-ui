import L from "leaflet";

type FullscreenDocument = Document & {
  fullscreenElement?: Element | null;
  exitFullscreen?: () => Promise<void>;
};

type FullscreenElement = HTMLElement & {
  requestFullscreen?: () => Promise<void>;
};

export default class LeafletFullscreenControl extends L.Control {
  private button: HTMLButtonElement | null = null;
  private map: L.Map | null = null;

  onAdd(map: L.Map): HTMLElement {
    this.map = map;
    const container = L.DomUtil.create("div", "leaflet-bar");
    this.button = L.DomUtil.create(
      "button",
      "leaflet-control-fullscreen",
      container,
    ) as HTMLButtonElement;
    this.button.type = "button";
    this.button.title = "Koko näytön tila";
    this.button.setAttribute("aria-label", "Koko näytön tila");
    this.button.textContent = "⛶";

    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.on(this.button, "click", this.handleClick);
    document.addEventListener("fullscreenchange", this.updateButton);
    this.updateButton();

    return container;
  }

  onRemove(): void {
    document.removeEventListener("fullscreenchange", this.updateButton);
    if (this.button) {
      L.DomEvent.off(this.button, "click", this.handleClick);
    }
    this.button = null;
    this.map = null;
  }

  private readonly updateButton = () => {
    const isFullscreen = Boolean(
      (document as FullscreenDocument).fullscreenElement,
    );
    if (this.button) {
      this.button.title = isFullscreen
        ? "Poistu koko näytön tilasta"
        : "Koko näytön tila";
      this.button.setAttribute(
        "aria-label",
        isFullscreen ? "Poistu koko näytön tilasta" : "Koko näytön tila",
      );
    }
  };

  private readonly handleClick = () => {
    if (this.map) {
      void this.toggleFullscreen(this.map);
    }
  };

  private async toggleFullscreen(map: L.Map): Promise<void> {
    const documentWithFullscreen = document as FullscreenDocument;
    if (documentWithFullscreen.fullscreenElement) {
      await documentWithFullscreen.exitFullscreen?.();
    } else {
      await (map.getContainer() as FullscreenElement).requestFullscreen?.();
    }
    map.invalidateSize();
  }
}

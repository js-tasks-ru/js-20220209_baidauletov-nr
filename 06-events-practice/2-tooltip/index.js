class Tooltip {
  static instance;
  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
  }

  initialize() {
    this.initEventListeners();
  }

  initEventListeners() {
    document.addEventListener("pointerover", this.pointerOver);
    document.addEventListener("pointerout", this.pointerOut);
  }

  pointerOver = (event) => {
    const node = event.target.closest("[data-tooltip]");

    if (node) {
      this.render(node.dataset.tooltip);
    }
  };

  pointerOut = (event) => {
    this.remove();
  };

  render(tooltipData) {
    const element = document.createElement("div");

    element.innerHTML = this.getTooltip(tooltipData);

    this.element = element;

    document.body.append(this.element);
  }

  getTooltip(data) {
    return `
      <div class="tooltip">
        ${data}
      </div>
    `;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  removeEventListeners() {
    document.removeEventListener("pointerover", this.pointerOver);
    document.removeEventListener("pointerout", this.pointerOut);
  }

  destroy() {
    this.removeEventListeners();
    this.remove();
    this.element = null;
  }
}

export default Tooltip;

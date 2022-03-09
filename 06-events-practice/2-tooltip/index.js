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
      document.addEventListener("pointermove", this.pointerMove);
    }
  };

  pointerMove = (event) => {
    const shift = 10;
    const left = event.clientX + shift;
    const top = event.clinetY + shift;

    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  };

  pointerOut = (event) => {
    this.remove();
    document.removeEventListener("pointermove", this.pointerMove);
  };

  render(tooltipData) {
    const element = document.createElement("div");

    element.innerHTML = this.getTooltip(tooltipData);

    this.element = element.firstElementChild;

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
    document.removeEventListener("pointermove", this.pointerMove);
  }

  destroy() {
    this.removeEventListeners();
    this.remove();
    this.element = null;
  }
}

export default Tooltip;

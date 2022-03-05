import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru";

export default class ColumnChart {
  subElements;
  element;

  chartHeight = 50;

  constructor({
    data = {},
    label = "",
    link = "",
    value = "",
    url = "",
    range = {
      from: new Date(),
      to: new Date(),
    },
    formatHeading = (data) => data,
  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = formatHeading(value);
    this.range = range;

    this.url = new URL(url, BACKEND_URL);

    this.render();
    this.update(this.range.from, this.range.to);
  }

  getTemplate() {
    return `
        <div class="column-chart"
          style=" --chart-height: ${this.chartHeight}"
        >
          <div class="column-chart__title">
            Total ${this.label}
              ${this.getLink()}
          </div>
          <div class="column-chart__container">
            <div class="column-chart__header" data-element="header">
              ${this.getValue()}
            </div>
            <div class="column-chart__chart" data-element="body">
              ${this.getColumns(this.data)}
            </div>
          </div>
        </div>
    `;
  }

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.getTemplate();

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);
  }

  getValue() {
    const result = this.value
      ? this.value
      : Object.values(this.data).reduce((accum, item) => accum + item, 0);

    return result;
  }

  getColumns(data) {
    const objData = Object.values(data);
    const maxValue = Math.max(...objData);
    const scale = this.chartHeight / maxValue;

    return Object.values(objData)
      .map((value) => {
        const percent = ((value / maxValue) * 100).toFixed(0);

        return `<div style="--value: ${Math.floor(value * scale)}" 
          data-tooltip="${percent}%"></div>
        `;
      })
      .join("");
  }

  getLink() {
    return this.link
      ? `<a class="column-chart__link" href="${this.link}">View all</a>`
      : "";
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  async fetchData(url) {
    return await fetchJson(url);
  }

  async update(from, to) {
    this.element.classList.add("column-chart_loading");

    let url = this.url;
    url.searchParams.set("from", from);
    url.searchParams.set("to", to);

    const data = await this.fetchData(url);

    if (Object.values(data).length) {
      this.subElements.body.innerHTML = this.getColumns(data);
    }

    this.element.classList.remove("column-chart_loading");
    this.data = data;

    return this.data;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}

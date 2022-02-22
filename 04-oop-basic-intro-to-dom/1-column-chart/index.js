export default class ColumnChart {
  chartHeight = 50;

  constructor(args) {
    const {
      data = [],
      label = "",
      link = "",
      value = "",
      formatHeading,
    } = args || {};

    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;

    if (formatHeading) {
      this.value = formatHeading(this.value);
    }

    this.render();
  }

  getTemplate() {
    return `
        <div class="column-chart 
          ${this.data.length === 0 ? "column-chart_loading" : ""}"
        >
          <div class="column-chart__title">
            Total ${this.label}
            <div class="column-chart__link">
              ${this.link}
            </div>
          </div>
          <div class="column-chart__container">
            <div class="column-chart__header">
              ${this.value}
            </div>
            <div class="column-chart__chart">
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
  }

  getColumns(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data
      .map((item) => {
        const percent = ((item / maxValue) * 100).toFixed(0);
        return `<div style="--value: ${Math.floor(item * scale)}" 
          data-tooltip="${percent}%"></div>
        `;
      })
      .join("");
  }

  update(data) {
    this.element.getElementsByClassName("column-chart__chart").innerHTML =
      this.getColumns(data);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

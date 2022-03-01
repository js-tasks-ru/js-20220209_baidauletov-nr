export default class SortableTable {
  subElements;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = [...headerConfig];
    this.data = [...data];

    this.render();
  }

  getTable() {
    return `
      <div class="sortable-table">
        ${this.getTableHeader()}
        <div data-element="body" class="sortable-table__body">
          ${this.getTableBody()}
        </div>
      </div>
    `;
  }

  getTableHeader() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerConfig.map((item) => this.getHeaderCell(item)).join("")}
      </div>
    `;
  }

  getHeaderCell({ id, title, sortable }) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        <span data-element="arrow" class=" 
          ${sortable ? "sortable-table__sort-arrow sort-arrow" : ""} 
        ">
        </span>
      </div>
    `;
  }

  getTableBody(data = this.data) {
    return `
        ${data
          .map((row) => {
            return `
              <div class="sortable-table__row">
                ${this.getTableRow(row)}
              </div>
            `;
          })
          .join("")}   
    `;
  }

  getTableRow(rowData) {
    const cells = this.headerConfig.map(({ id, template }) => {
      return {
        id,
        template,
      };
    });

    return cells
      .map(({ id, template }) => {
        return template
          ? template(rowData[id])
          : `<div class="sortable-table__cell">${rowData[id]}</div>`;
      })
      .join("");
  }

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.getTable();

    this.element = element;

    this.subElements = this.getSubElements(element);
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

  sort(field, order) {
    const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll(
      ".sortable-table__cell[data-id]"
    );
    const currentColumn = this.element.querySelector(
      `.sortable-table__cell[data-id="${field}"]`
    );

    allColumns.forEach((column) => {
      column.dataset.order = "";
    });

    currentColumn.dataset.order = order;

    this.subElements.body.innerHTML = this.getTableBody(sortedData);
  }

  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headerConfig.find((item) => item.id === field);
    const { sortType } = column;
    const directions = {
      asc: 1,
      desc: -1,
    };
    const direction = directions[order];
    const locales = ["ru", "en"];
    const options = {
      sensitivity: "variant",
      caseFirst: "upper",
    };

    return arr.sort((a, b) => {
      switch (sortType) {
        case "number":
          return direction * (a[field] - b[field]);
        case "string":
          return direction * a[field].localeCompare(b[field], locales, options);
        default:
          return direction * (a[field] - b[field]);
      }
    });
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

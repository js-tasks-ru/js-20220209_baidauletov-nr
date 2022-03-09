import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru";

export default class SortableTable {
  element;
  subElements = {};
  isSortLocally;
  start = 0;
  end = 30;
  loading = false;

  constructor(
    headersConfig = [],
    {
      url = "",
      isSortLocally,
      data = [],
      sorted = {
        id: headersConfig.find((item) => item.sortable).id,
        order: "asc",
      },
    } = {}
  ) {
    this.headerConfig = headersConfig;
    this.data = data;
    this.isSortLocally = isSortLocally;
    this.sorted = sorted;

    this.url = new URL(url, BACKEND_URL);

    this.render();
  }

  initEventListeners() {
    this.element.addEventListener("pointerdown", this.sortTableClick);
    window.addEventListener("scroll", this.windowScroll);
  }

  async render() {
    const element = document.createElement("div");

    element.innerHTML = this.getTable();

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);

    const data = await this.loadData(
      this.sorted.id,
      this.sorted.order,
      this.start,
      this.end
    );

    this.updateRows(data);

    this.initEventListeners();
  }

  getSubElements(element) {
    let result = {};
    const elements = element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  getTable() {
    return `
      <div class="sortable-table">
        ${this.getTableHeader()}
        ${this.getTableBody()}
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
        ${this.getHeaderArrow()}
      </div>
    `;
  }

  getHeaderArrow() {
    return `
      <span data-element="arrow" 
        class="sortable-table__sort-arrow"
      >
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  getTableBody(data = this.data) {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(data)}   
      </div>
    `;
  }

  getTableRows(data) {
    return `
    ${data
      .map((row) => {
        return `
              <a
                href="/products/${row.id})" 
                class="sortable-table__row"
              >
                ${this.getTableRow(row)}
              </a>
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

  getLoadingTemplate() {
    let loadingNode = document.createElement("div");
    loadingNode.classList.add("loading-line", "sortable-table__loading-line");
    loadingNode.dataset.element = "loading";

    return loadingNode;
  }

  async fetchData(url) {
    return await fetchJson(url);
  }

  windowScroll = async () => {
    const { id, order } = this.sorted;
    const clientHeight = document.documentElement.clientHeight;
    let windowRelativeBottom =
      document.documentElement.getBoundingClientRect().bottom;

    if (windowRelativeBottom < clientHeight + 100 && !this.loading) {
      this.loading = true;

      const data = await this.loadData(id, order, this.start, this.end);

      this.updateRows(data);

      this.loading = false;
    }
  };

  async loadData(id, order, start, end) {
    this.subElements = this.getSubElements(this.element);

    this.element.classList.add("loading-line", "sortable-table__loading-line");

    const shift = 30;
    this.start = this.end;
    this.end += shift;

    let url = this.url;

    url.searchParams.set("_sort", id);
    url.searchParams.set("_order", order);
    url.searchParams.set("_start", start);
    url.searchParams.set("_end", end);

    const response = await this.fetchData(url);

    // if (Object.values(data).length) {
    //   this.subElements.body.innerHTML = this.getTableRows(data);
    // }

    this.element.classList.remove(
      "loading-line",
      "sortable-table__loading-line"
    );

    this.data = response;

    return this.data;
  }

  sortTableClick = (event) => {
    const targetCell = event.target.closest(".sortable-table__cell");
    const id = targetCell.dataset.id;
    const sortable = targetCell.dataset.sortable;
    const order = targetCell.dataset.order === "desc" ? "asc" : "desc";

    if (sortable) {
      if (this.isSortLocally) {
        this.sortOnClient(id, order);
      } else {
        this.sortOnServer(id, order);
      }
    }
  };

  sortOnClient(id, order) {
    this.sort(id, order);
  }

  async sortOnServer(id, order) {
    this.start = 0;
    this.end = 30;

    const data = await this.loadData(id, order, this.start, this.end);

    this.subElements.body.innerHTML = this.getTableRows(data);
  }

  updateRows(data) {
    this.data = [...this.data, ...data];

    const newRows = this.getTableRows(data);
    const element = document.createElement("div");
    element.innerHTML = newRows;

    if (Object.values(data).length) {
      this.subElements.body.append(...element.childNodes);
    }

    console.log(this.data.length);
  }

  sort(id, order) {
    const sortedData = this.sortData(id, order);
    const allColumns = this.element.querySelectorAll(
      ".sortable-table__cell[data-id]"
    );
    const currentColumn = this.element.querySelector(
      `.sortable-table__cell[data-id="${id}"]`
    );

    allColumns.forEach((column) => {
      column.dataset.order = "";
    });

    currentColumn.dataset.order = order;

    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  sortData(id, order) {
    const arr = [...this.data];

    const column = this.headerConfig.find((item) => item.id === id);
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
          return direction * (a[id] - b[id]);
        case "string":
          return direction * a[id].localeCompare(b[id], locales, options);
        default:
          return direction * (a[id] - b[id]);
      }
    });
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    window.removeEventListener("scroll", this.windowScroll);
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}

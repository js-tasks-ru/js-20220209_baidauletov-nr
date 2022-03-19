export default class SortableList {
  element;
  placeholderElement = null;
  dragElement = null;

  constructor({ items = [] }) {
    this.items = items;

    this.render();
  }

  initEventListeners() {
    this.element.addEventListener("pointerdown", this.onListClick);
  }

  render() {
    const list = this.getList(this.items);
    const element = document.createElement("div");

    element.append(list);

    this.element = element.firstElementChild;

    this.initEventListeners();
  }

  getList(items = this.items) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<ul class="sortable-list"></ul>`;

    const list = wrapper.firstElementChild;

    items.map((item, index) => {
      item.classList.add("sortable-list__item");
      item.dataset.id = index;
      list.append(item);
    });

    return list;
  }

  onListClick = (event) => {
    const targetItem = event.target.closest(".sortable-list__item");
    const { offsetWidth, offsetHeight } = targetItem;

    if (event.target.closest("[data-delete-handle]")) {
      targetItem.remove();
      return;
    }

    this.placeholderElement = document.createElement("li");
    this.placeholderElement.className = "sortable-list__placeholder";
    this.placeholderElement.style.width = `${offsetWidth}px`;
    this.placeholderElement.style.height = `${offsetHeight}px`;

    this.dragElement = targetItem;
    this.dragElement.style.width = `${offsetWidth}px`;
    this.dragElement.style.height = `${offsetHeight}px`;
    this.dragElement.classList.add("sortable-list__item_dragging");

    this.dragElement.after(this.placeholderElement);

    this.element.append(this.dragElement);

    document.addEventListener("pointermove", this.onPointerMove);
    document.addEventListener("pointerup", this.onPointerUp);
  };

  onPointerMove = (event) => {
    const { clientX, clientY } = event;
    this.moveAt(clientX, clientY);

    const prevElem = this.placeholderElement.previousElementSibling;
    const nextElem = this.placeholderElement.nextElementSibling;

    const { top, bottom } = this.element.getBoundingClientRect();

    if (clientY < top) {
      return this.element.firstElementChild.before(this.placeholderElement);
    }

    if (clientY > bottom) {
      return this.element.lastElementChild.after(this.placeholderElement);
    }

    if (prevElem) {
      const { top, height } = prevElem.getBoundingClientRect();
      const middlePrevElem = top + height / 2;

      if (clientY < middlePrevElem) {
        return prevElem.before(this.placeholderElement);
      }
    }

    if (nextElem) {
      const { top, height } = nextElem.getBoundingClientRect();
      const middleNextElem = top + height / 2;

      if (clientY > middleNextElem) {
        return nextElem.after(this.placeholderElement);
      }
    }
  };

  moveAt(X, Y) {
    this.dragElement.style.left = X + "px";
    this.dragElement.style.top = Y + "px";
  }

  onPointerUp = (event) => {
    this.dragElement.classList.remove("sortable-list__item_dragging");
    this.dragElement.style.cssText = "";
    this.placeholderElement.replaceWith(this.dragElement);
    this.dragElement = null;

    this.removeEventListeners();
  };

  removeEventListeners() {
    document.removeEventListener("pointermove", this.onPointerMove);
    document.removeEventListener("pointerup", this.onPointerUp);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.placeholderElement = null;
    this.removeEventListeners();
  }
}

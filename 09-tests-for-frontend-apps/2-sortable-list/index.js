import BaseClass from "../../base-class/index.js";

export default class SortableList extends BaseClass {
  element = {};
  elementCoords = {};
  placeholder = {};
  placeholderCoords = {};
  dragging = {};
  draggingShift = 0;

  SHIFT_FROM_MOUSE = 5;
  controller = new AbortController();

  constructor({ items }) {
    super();
    this.items = items;
    this.render();
  }

  render() {
    this.placeholder = this.createElement(
      "<li class='sortable-list__item sortable-list__placeholder'></li>"
    );
    this.element = this.createElement("<ul class='sortable-list'></ul>");

    this.items.forEach((item) => {
      item.classList.add("sortable-list__item");
      this.element.append(item);
    });

    this.createListeners();
    return this.element;
  }

  createListeners() {
    this.element.addEventListener("pointerdown", this.onPointerDownHandler, {
      signal: this.controller.signal,
    });
  }

  onPointerDownHandler = (event) => {
    event.preventDefault();
    const { target } = event;

    if (Object.hasOwn(target.dataset, "grabHandle")) {
      this.dragging = target.closest(".sortable-list__item");
      this.elementCoords = this.element.getBoundingClientRect();
      this.draggingShift =
        event.clientY - this.dragging.getBoundingClientRect().top;

      document.addEventListener("pointerup", this.onPointerUpHandler, {
        signal: this.controller.signal,
      });
      document.addEventListener("pointermove", this.onPointerMoveHandler, {
        signal: this.controller.signal,
      });

      this.startDragging(this.dragging);
    }

    if (Object.hasOwn(target.dataset, "deleteHandle")) {
      this.deleteItem(target.closest(".sortable-list__item"));
    }
  };

  deleteItem(item) {
    this.items = this.items.filter((element) => element !== item);
    item.remove();
    this.dispatchToggleItems(this.items);
  }

  dispatchToggleItems(items) {
    this.element.dispatchEvent(
      new CustomEvent("sorting-list-toggle-items", {
        detail: items,
        bubbles: true,
      })
    );
  }

  onPointerMoveHandler = (event) => {
    const top = event.clientY - this.draggingShift;

    const isInParentRect =
      this.elementCoords.top < top &&
      this.elementCoords.bottom > top + this.placeholderCoords.height;

    if (isInParentRect) {
      this.dragging.style.top = `${top}px`;
    }
    if (event.clientY > this.elementCoords.bottom) {
      this.dragging.style.top = `${
        this.elementCoords.bottom - this.placeholderCoords.height
      }px`;
    }
    if (event.clientY < this.elementCoords.top) {
      this.dragging.style.top = `${this.elementCoords.top}px`;
    }

    this.testForSwitchingElements(top);
  };

  testForSwitchingElements(top) {
    const isHigherOfPlaceholder =
      top < this.placeholderCoords.top - this.placeholderCoords.height;
    const isLowerOfPlaceholder = top > this.placeholderCoords.bottom;

    if (isHigherOfPlaceholder && this.placeholder.previousSibling) {
      this.placeholder.previousSibling.before(this.placeholder);
      this.placeholderCoords = this.placeholder.getBoundingClientRect();
    }

    if (isLowerOfPlaceholder && this.placeholder.nextSibling) {
      this.placeholder.nextSibling.after(this.placeholder);
      this.placeholderCoords = this.placeholder.getBoundingClientRect();
    }
  }

  onPointerUpHandler = () => {
    this.stopDragging(this.dragging);
    this.dispatchToggleItems(this.items);

    document.removeEventListener("pointerup", this.onPointerUpHandler, {
      signal: this.controller.signal,
    });
    document.removeEventListener("pointermove", this.onPointerMoveHandler, {
      signal: this.controller.signal,
    });
  };

  stopDragging(item) {
    this.placeholder.replaceWith(item);
    item.style = "";
    item.classList.remove("sortable-list__item_dragging");
  }

  startDragging(item) {
    item.before(this.placeholder);
    this.placeholderCoords = this.placeholder.getBoundingClientRect();
    item.classList.add("sortable-list__item_dragging");
    item.style.width = `${this.placeholderCoords.width}px`;
    item.style.height = `${this.placeholderCoords.height}px`;
    item.style.top = `${this.placeholderCoords.top + this.SHIFT_FROM_MOUSE}px`;
  }

  destroy() {
    super.destroy();
    this.elementCoords = null;
    this.placeholder = null;
    this.placeholderCoords = null;
    this.dragging = null;
    this.controller.abort();
  }
}

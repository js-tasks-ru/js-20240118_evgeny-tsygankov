import { isAscOrderBy } from "./utils";

export default class SortableTable {
  #fieldName;
  #orderBy;
  #sortConfigs = {
    locales: ["ru-RU", "en-EN"],
    options: {
      caseFirst: "upper",
    },
  };
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  /* table rows - start */
  createCellTemplate(template, elementData) {
    if (template) {
      return template(elementData);
    }
    return `<div class = "sortable-table__cell">${elementData}</div>`;
  }

  creeateRowItemTemplate(dataElement) {
    return `
      <a href="/products/${dataElement.id}" class="sortable-table__row">
        ${this.headerConfig
          .map(({ template, id }) =>
            this.createCellTemplate(template, dataElement[id])
          )
          .join("")}
      </a>
    `;
  }

  addRows() {
    return this.data
      .map((dataElement) => this.creeateRowItemTemplate(dataElement))
      .join("");
  }
  /* table rows - end */

  /* table header - start */
  getOrderBy() {
    return this.#orderBy ? `data-order=${this.#orderBy}` : "";
  }

  getSortArrow(headerElementId) {
    if (this.#fieldName !== headerElementId) {
      return "";
    }
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  addHeaderRow() {
    return this.headerConfig
      .map(
        ({ id, sortable, title }) => `
        <div class="sortable-table__cell" data-id=${id} data-sortable=${Boolean(
          sortable
        )} ${this.getOrderBy()}
          <span>${title}</span>
          ${this.getSortArrow(id)}
        </div>
      `
      )
      .join("");
  }

  createHeaderTemplate() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
       ${this.addHeaderRow()} 
      </div>
    `;
  }
  /* table header - end */

  createBodyTemplate() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.addRows()}
      </div>
    `;
  }

  createLoadingTemplate() {
    return `
      <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <div>
          <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
        </div>
      </div>
    `;
  }

  createMainTemplate() {
    return (
      this.createHeaderTemplate() +
      this.createBodyTemplate() +
      this.createLoadingTemplate()
    );
  }

  /* sorting - start */
  numberCompare(itemA, itemB, { fieldName, orderBy }) {
    if (isAscOrderBy(orderBy)) {
      return itemA[fieldName] - itemB[fieldName];
    }
    return itemB[fieldName] - itemA[fieldName];
  }

  stringCompare(itemA, itemB, { fieldName, orderBy }) {
    if (isAscOrderBy(orderBy)) {
      return itemA[fieldName].localeCompare(
        itemB[fieldName],
        this.#sortConfigs.locales,
        this.#sortConfigs.options
      );
    }
    return itemB[fieldName].localeCompare(
      itemA[fieldName],
      this.#sortConfigs.locales,
      this.#sortConfigs.options
    );
  }

  getComparator(isNumber) {
    return isNumber ? this.numberCompare : this.stringCompare.bind(this);
  }

  sortData(fieldName, orderBy) {
    const isFieldNumber = typeof this.data[0][fieldName] === "number";

    return [...this.data].sort((a, b) =>
      this.getComparator(isFieldNumber)(a, b, { fieldName, orderBy })
    );
  }

  sort(fieldName, orderBy) {
    this.#fieldName = fieldName;
    this.#orderBy = orderBy;
    this.data = this.sortData(fieldName, orderBy);

    const { body, header } = this.subElements ?? {};
    if (body && header) {
      body.innerHTML = this.addRows();
      header.innerHTML = this.addHeaderRow();
    }
  }
  /* sorting - end */

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.createMainTemplate();
    const { firstElementChild } = element;

    firstElementChild.classList.add("sortable-table");
    this.element = firstElementChild;

    this.subElements = {
      body: element.querySelector(".sortable-table__body"),
      header: element.querySelector(".sortable-table__header"),
      loading: element.querySelector(".loading-line"),
      emptyPlaceholder: element.querySelector(
        ".sortable-table__empty-placeholder"
      ),
    };
  }

  remove() {
    this.#fieldName = null;
    this.#orderBy = null;
    this.element = null;
  }

  destroy() {
    this.remove();
  }
}

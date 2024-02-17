import SortableTable from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

const switchOrderByMap = {
  asc: "desc",
  desc: "asc",
};

export default class ExtendedSortableTable extends SortableTable {
  #isSortLocally;

  constructor(
    headersConfig,
    { data = [], sorted = {} } = {},
    isSortLocally = true
  ) {
    super(headersConfig, data);

    this.#isSortLocally = isSortLocally;

    super.sort(sorted?.id, sorted?.order);
    super.render();
    this.addListeners();
  }

  addListeners() {
    this.subElements.header.addEventListener(
      "pointerdown",
      this.handleCellClick
    );
  }

  removeListeners() {
    this.subElements.header.removeEventListener(
      "pointerdown",
      this.handleCellClick
    );
  }

  sortOnServer = () => {};

  sortOnClient = (clickedElement) => {
    const orderBy = clickedElement.getAttribute("data-order");

    orderBy &&
      super.sort(
        clickedElement.getAttribute("data-id"),
        switchOrderByMap[orderBy]
      );
  };

  handleCellClick = (event) => {
    const element = event.target.closest(".sortable-table__cell");

    if (element.getAttribute("data-sortable") === "true") {
      this.sort(element);
    }
  };

  sort(clickedElement) {
    return this.#isSortLocally
      ? this.sortOnClient(clickedElement)
      : this.sortOnServer();
  }

  destroy() {
    super.destroy();
    this.removeListeners();
  }
}

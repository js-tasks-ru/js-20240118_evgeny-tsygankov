import { getColumnProps } from "./utils";

export default class ColumnChart {
  chartHeight = 50;
  label;
  element;

  #data;
  #value;
  #link;

  /**
   * @param {{
   *  data: number[];
   *  label: string;
   *  value: number;
   * 	formatHeading?: (value: string) => string;
   * }} props
   */
  constructor(props = {}) {
    const {
      data = [],
      value = 0,
      label = "",
      link = "#",
      formatHeading = (value) => value,
    } = props;

    this.#data = data;
    this.label = label;
    this.#value = value;
    this.#link = link;
    this.formatHeading = formatHeading;

    this.render();
  }

  get chartHeight() {
    return this.chartHeight;
  }

  get label() {
    return this.label;
  }

  createLinkTempalate() {
    return this.#link
      ? `<a href="${this.#link}" class="column-chart__link">View all</a>`
      : "";
  }

  createChartTemplate() {
    if (!this.#data.length) {
      return null;
    }

    return getColumnProps(this.#data, this.chartHeight)
      .map(
        ({ value, percent }) =>
          `<div style="--value: ${value}" data-tooltip=${percent}></div>`
      )
      .join("");
  }

  createTitleTemplate() {
    return `
      <div class="column-chart__title">
        ${this.label}
        ${this.createLinkTempalate()}
      </div>
    `;
  }

  createCharConnetTemplate() {
    const formattedHeader = this.formatHeading(this.#value);

    return `
      <div data-element="header" class="column-chart__header">${formattedHeader}</div>
        <div data-element="body" class="column-chart__chart">
          ${this.createChartTemplate()}
        </div>
      </div>
    `;
  }

  createMainTemplate() {
    return `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
          ${this.createTitleTemplate()}
          <div class="column-chart__container">
            ${this.createCharConnetTemplate()}
          </div>
      </div>
    `;
  }

  /**
   * @returns {void}
   */
  render() {
    const element = document.createElement("div");
    element.innerHTML = this.createMainTemplate();
    const { firstElementChild } = element;

    if (!this.#data.length) {
      firstElementChild.classList.add("column-chart_loading");
    }
    this.element = firstElementChild;
  }

  /**
   * @param {number[]} updatedDate
   * @returns {void}
   */
  update(updatedDate) {
    this.#data = updatedDate;
    this.element.innerHTML = this.createChartTemplate();
  }

  /**
   * @returns {void}
   */
  remove() {
    this.element && this.element.remove();
  }

  /**
   * @returns {void}
   */
  destroy() {
    this.remove();
    this.element = null;
  }
}

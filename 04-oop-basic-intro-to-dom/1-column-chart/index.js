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

  creteChartTemplate() {
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
          ${this.creteChartTemplate()}
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
    this.element.innerHTML = this.creteChartTemplate();
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

/* 
  utils
  не получилось вынести в отдельный файл, проект не собирается для отображения в браузере
*/
/**
 * @param {number[]} data
 * @param {number} chartHeight
 * @returns {Array<{ percent: string; value: string }>}
 */
export function getColumnProps(data, chartHeight) {
  const maxValue = Math.max(...data);
  const scale = chartHeight / maxValue;
  const getStringPercent = (numberValue) =>
    ((numberValue / maxValue) * 100).toFixed(0) + "%";

  return data.map((numberItem) => ({
    percent: getStringPercent(numberItem),
    value: String(Math.floor(numberItem * scale)),
  }));
}

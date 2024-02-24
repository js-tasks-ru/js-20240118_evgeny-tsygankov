const ONE_HUNDRED_PCT = 100;

export default class DoubleSlider {
  #leftPercentValue = 100;
  #rightPercentValue = 200;

  formatValue;
  min;
  max;
  selected;

  subElements = {};

  constructor(config) {
    this.formatValue = config?.formatValue;
    this.min = config?.min ?? 100;
    this.max = config?.max ?? 200;

    this.selected = config?.selected ?? { from: this.min, to: this.max };
    this.#leftPercentValue = this.normalizeEdge(this.selected.from);
    this.#rightPercentValue = this.normalizeEdge(this.selected.to);

    this.createElement();
    this.selectSubElements();
    this.createEventListeners();
    this.render();
  }

  normalizeValue(currentValue, min, max) {
    return Math.max(min, Math.min(max, currentValue));
  }
  normalizeEdge(edge) {
    return ((edge - this.min) / (this.max - this.min)) * ONE_HUNDRED_PCT;
  }
  convertValue(value) {
    return this.min + ((this.max - this.min) * value) / ONE_HUNDRED_PCT;
  }

  createTemplate = () => {
    return `
        <span data-element="from">
          ${this.formatValue ? this.formatValue(this.min) : this.min}
        </span>
        <div class="range-slider__inner">
          <span class="range-slider__progress"></span>
          <span class="range-slider__thumb-left"></span>
          <span class="range-slider__thumb-right"></span>
        </div>
        <span data-element="to">
          ${this.formatValue ? this.formatValue(this.max) : this.max}
        </span>
      `;
  };

  createElement = () => {
    this.element = document.createElement("div");
    this.element.className = `range-slider`;
    this.element.innerHTML = this.createTemplate();
  };

  selectSubElements() {
    this.subElements = {
      slider: this.element.querySelector(".range-slider__inner"),
      thumbLeft: this.element.querySelector(".range-slider__thumb-left"),
      thumbRight: this.element.querySelector(".range-slider__thumb-right"),
      leftPercentValueLimit: this.element.querySelector(
        'span[data-element="from"]'
      ),
      rightValueLimit: this.element.querySelector('span[data-element="to"]'),
    };
  }

  createEventListeners = () => {
    this.subElements.slider.addEventListener("pointerdown", this.onPointerDown);
  };

  destroyEventListeners = () => {
    this.subElements.slider.removeEventListener(
      "pointerdown",
      this.onPointerDown
    );
    document.removeEventListener("pointerup", this.onPointerUp);
    document.removeEventListener("pointermove", this.onPointerMove);
  };

  onPointerMove = (event) => {
    const sliderRect = this.subElements.slider.getBoundingClientRect();

    const clickX = event.clientX;
    const sliderLeftX = sliderRect.left;
    const sliderRightX = sliderLeftX + sliderRect.width;

    const normalaziedClickX = this.normalizeValue(
      clickX,
      sliderLeftX,
      sliderRightX
    );

    const percent = normalaziedClickX
      ? ((normalaziedClickX - sliderLeftX) / (sliderRightX - sliderLeftX)) *
        ONE_HUNDRED_PCT
      : 0;

    const leftPercent = this.normalizeEdge(this.selected.from);
    const rightPercentValue = this.normalizeEdge(this.selected.to);

    if (this.isLeftSlider) {
      this.#leftPercentValue = this.normalizeValue(
        percent,
        0,
        rightPercentValue
      );
    } else {
      this.#rightPercentValue = this.normalizeValue(
        percent,
        leftPercent,
        ONE_HUNDRED_PCT
      );
    }

    if (this.isLeftSlider) {
      this.selected.from = this.convertValue(this.#leftPercentValue);
    } else {
      this.selected.to = this.convertValue(this.#rightPercentValue);
    }
    this.render();
  };

  onPointerUp = () => {
    this.element.dispatchEvent(
      new CustomEvent("range-select", {
        detail: this.selected,
        bubbles: true,
      })
    );

    document.removeEventListener("pointerup", this.onPointerUp);
    document.removeEventListener("pointermove", this.onPointerMove);
  };

  onPointerDown = (event) => {
    this.isLeftSlider = event.target.classList.contains(
      "range-slider__thumb-left"
    );

    document.addEventListener("pointerup", this.onPointerUp);
    document.addEventListener("pointermove", this.onPointerMove);
  };

  render() {
    const progressElement = this.element.querySelector(
      ".range-slider__progress"
    );

    this.subElements.thumbRight.style.right =
      ONE_HUNDRED_PCT - this.#rightPercentValue + "%";
    this.subElements.thumbLeft.style.left = this.#leftPercentValue + "%";

    progressElement.style.left = this.#leftPercentValue + "%";
    progressElement.style.right =
      ONE_HUNDRED_PCT - this.#rightPercentValue + "%";

    this.subElements.leftPercentValueLimit.innerHTML = this.formatValue
      ? this.formatValue(Math.round(this.selected.from))
      : Math.round(this.selected.from);

    this.subElements.rightValueLimit.innerHTML = this.formatValue
      ? this.formatValue(Math.round(this.selected.to))
      : Math.round(this.selected.to);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.destroyEventListeners();
    this.remove();
    this.#rightPercentValue = null;
    this.#leftPercentValue = null;
  }
}

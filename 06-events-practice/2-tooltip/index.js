class Tooltip {
  static #onlyInstance;

  constructor() {
    if (!Tooltip.#onlyInstance) {
      Tooltip.#onlyInstance = this;
    }
    return Tooltip.#onlyInstance;
  }

  /** @param {this} instance */
  getEvents(instance) {
    const { element, render } = instance;

    return {
      pointerover: {
        event: "pointerover",
        handler: ({ target }) => {
          const element = target.closest("[data-tooltip]");
          element && render(element.getAttribute("data-tooltip"));
        },
      },

      pointermove: {
        event: "pointermove",
        handler: ({ pageX, pageY }) => {
          if (element) {
            element.style.left = `${pageX + 8}px`;
            element.style.top = `${pageY + 12}px`;
          }
        },
      },

      pointerout: {
        event: "pointerout",
        handler: () => element.remove(),
      },
    };
  }

  /** @param {'addEventListener' | 'removeEventListener'} method */
  handleListeneres(method = "addEventListener") {
    const events = this.getEvents(this);
    Object.keys(events).forEach((event) => {
      document[method](event, events[event].handler);
    });
  }

  initialize() {
    this.element = this.createElement();
    this.handleListeneres();
  }

  createElement = () => {
    const element = document.createElement("div");
    element.style.position = "absolute";
    element.className = `tooltip`;
    return element;
  };

  render = (content) => {
    this.element.textContent = content;
    document.body.append(this.element);
  };

  remove() {
    this.element = null;
    this.handleListeneres("removeEventListener");
  }

  destroy() {
    this.remove();
  }
}

export default Tooltip;

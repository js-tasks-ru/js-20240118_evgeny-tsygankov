const DEFAULT_DURATION = 2000;
/**
 * Enum for types.
 * @readonly
 * @enum {string}
 */
const ENotificationTypes = {
  /** @type {"success"} */
  SUCCESS: "success",
  /** @type {"error"} */
  ERROR: "error",
};

export default class NotificationMessage {
  /** @type {typeof NotificationMessage | null} */
  static #lastInstance = null;

  #message;
  #duration;
  #type;
  #timer;

  element;

  /**
   * @param {string} message
   * @param {{ duration: number; type: typeof ENotificationTypes }}
   */
  constructor(
    message,
    { duration = DEFAULT_DURATION, type = ENotificationTypes.SUCCESS } = {}
  ) {
    this.#message = message;
    this.#duration = duration;
    this.#type = type;

    this.render();
  }

  get duration() {
    return this.#duration;
  }

  convertMsToSeconds(msNumberValue) {
    return msNumberValue / 1000;
  }

  setNotificationStyle() {
    return `
			--value:${`${this.convertMsToSeconds(this.duration)} s`}"
		`;
  }

  setNotificationClassName() {
    return `"notification ${this.#type}"`;
  }

  createTemplate() {
    return `
      <div class=${this.setNotificationClassName()} style=${this.setNotificationStyle()}>
          <div class="timer"></div>
          <div class="inner-wrapper">
              <div class="notification-header">Notification</div>
              <div class="notification-body">
                ${this.#message}
              </div>
          </div>
      </div>
    `;
  }

  /**
   * @returns {void}
   */
  render() {
    const element = document.createElement("div");
    element.innerHTML = this.createTemplate();
    this.element = element.firstElementChild;
  }

  /**
   * @returns {void}
   */
  show(targetElement = document.body) {
    if (NotificationMessage.#lastInstance) {
      NotificationMessage.#lastInstance.remove();
    }

    NotificationMessage.#lastInstance = this;
    targetElement.append(this.element);

    this.#timer = setTimeout(() => {
      this.remove();
    }, this.#duration);
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
    this.#timer && clearTimeout(this.#timer);
  }
}

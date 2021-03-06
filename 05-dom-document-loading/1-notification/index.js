export default class NotificationMessage {
  static stateNotification = null;

  constructor(message = "", { duration = 0, type = "success" } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  getNotification() {
    return `
      <div class="notification
        ${this.type === "success" ? "success" : "error"}
      ">
        <div class="inner-wrapper">
          <div class="notification-header">
          </div>
          <div class="notification-body">
            ${this.message}
            ${this.setTimer()}
          </div>  
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.getNotification();

    this.element = element.firstElementChild;
  }

  show(node = document.body) {
    if (NotificationMessage.stateNotification) {
      NotificationMessage.stateNotification.remove();
    }

    this.timer = setTimeout(() => this.destroy(), this.duration);

    node.append(this.element);

    NotificationMessage.stateNotification = this;
  }

  setTimer() {
    return `
      <div class="timer" style="--value: ${this.duration / 1000}s">
      </div>
    `;
  }

  remove() {
    this.element.remove();
    clearTimeout(this.timer);
  }

  destroy() {
    this.remove();
    NotificationMessage.stateNotification = null;
  }
}

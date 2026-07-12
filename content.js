class MyCursor {
  #IMAGE_URL = {
    CURSOR_DEFAULT: "images/cursor/cursor-default.png",
    CURSOR_POINTER: "images/cursor/cursor-pointer.png",
  };

  #CLASS_NAME = {
    CURSOR: "my-cursor",
    CURSOR_DEFAULT: "my-cursor-default",
    CURSOR_POINTER: "my-cursor-pointer",
    CURSOR_IDLE: "my-cursor-idle",
    CURSOR_HOVERING: "my-cursor-hovering",
    CURSOR_HIDDEN: "my-cursor-hidden",
  };

  constructor() {
    this.settingsApp = new Settings();
    this.cursor = {};
  }

  #firstMove;
  #idleTimer;

  async init() {
    this.settings = await this.settingsApp.load();
    this.#addEventListeners();

    this.cursor = {
      default: this.#createCursor(this.#IMAGE_URL.CURSOR_DEFAULT, this.#CLASS_NAME.CURSOR_DEFAULT),
      pointer: this.#createCursor(this.#IMAGE_URL.CURSOR_POINTER, this.#CLASS_NAME.CURSOR_POINTER),
    };

    this.#firstMove = true;
    this.#reflectSettings();
  }

  #addEventListeners() {
    document.addEventListener("mousemove", (e) => this.#onMouseMove(e));
    document.addEventListener("mouseleave", (e) => this.#onMouseLeave(e));
    document.addEventListener("mouseenter", (e) => this.#onMouseEnter(e));
  }

  #createCursor(url, cls) {
    const img = document.createElement("img");
    img.className = `${this.#CLASS_NAME.CURSOR} ${cls} ${this.#CLASS_NAME.CURSOR_HIDDEN}`;
    img.src = chrome.runtime.getURL(url);
    img.width = 0;
    img.height = 0;
    document.body.appendChild(img);
    return img;
  }

  #onMouseMove(e) {
    const { clientX: x, clientY: y } = e;

    Object.values(this.cursor).forEach((el) => {
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.classList.remove(this.#CLASS_NAME.CURSOR_IDLE);
      if (this.#firstMove) el.classList.remove(this.#CLASS_NAME.CURSOR_HIDDEN);
    });

    if (this.#firstMove) this.#firstMove = false;

    this.#resetIdleTimer();
    this.#switchActiveCursor(e.target);
  }

  #resetIdleTimer() {
    clearTimeout(this.#idleTimer);
    this.#idleTimer = setTimeout(() => {
      Object.values(this.cursor).forEach((el) => {
        el.classList.add(this.#CLASS_NAME.CURSOR_IDLE);
      });
    }, this.settings.idleTime);
  }

  #switchActiveCursor(target) {
    if (this.#isPointerTarget(target)) {
      Object.values(this.cursor).forEach((el) => {
        el.classList.add(this.#CLASS_NAME.CURSOR_HOVERING);
      });
    } else {
      Object.values(this.cursor).forEach((el) => {
        el.classList.remove(this.#CLASS_NAME.CURSOR_HOVERING);
      });
    }
  }

  #isPointerTarget(el) {
    if (!el || el == document) return false;
    const tag = el.tagName?.toLowerCase();
    if (["a", "button"].includes(tag)) return true;
    if (el.getAttribute("role") === "button") return true;
    return window.getComputedStyle(el).cursor === "pointer";
  }

  #onMouseLeave() {
    Object.values(this.cursor).forEach((el) => {
      el.classList.add(this.#CLASS_NAME.CURSOR_HIDDEN);
    });
  }

  #onMouseEnter(e) {
    this.#onMouseMove(e);
    Object.values(this.cursor).forEach((el) => {
      el.classList.remove(this.#CLASS_NAME.CURSOR_HIDDEN);
    });
  }

  #reflectSettings() {
    Object.values(this.cursor).forEach((el) => {
      el.width = this.settings.cursorSize;
      el.height = this.settings.cursorSize;
      el.style.width = `${this.settings.cursorSize}px`;
      el.style.height = `${this.settings.cursorSize}px`;
      el.style.transform = `translate(${this.settings.offsetX}px, ${this.settings.offsetY}px)`;
      el.style.transformOrigin = `calc(50% + ${this.settings.offsetX}px) calc(50% + ${this.settings.offsetY}px)`;
      el.style.opacity = this.settings.opacity;
      el.style.rotate = `${this.settings.rotation}deg`;
      el.style.setProperty("--rotation-speed", `${this.settings.rotationSpeed}ms`);
      el.style.setProperty("--initial-rotate", `${this.settings.rotation}deg`);
    });
  }
}

const myCursor = new MyCursor();
myCursor.init();

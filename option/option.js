class Option {
  constructor() {
    this.settingsApp = new Settings();

    this.saveStatus = document.getElementById("saveStatus");
    this.settingsForm = document.getElementById("settingsForm");
    this.cursorDefault = document.getElementById("cursorDefault");
    this.resetButton = document.getElementById("resetButton");

    this.settingsForm.addEventListener("input", () => this.#inputSettings());
    this.settingsForm.addEventListener("change", () => this.#changeSettings());
    this.resetButton.addEventListener("click", () => this.#resetSettings());

    for (const el of this.settingsForm.elements) {
      if (el.tagName.toLowerCase() === "input" && el.type === "number") {
        el.addEventListener("focus", (e) => e.target.select());
      }
    }
  }

  async init() {
    this.settings = await this.settingsApp.load();
    this.#setSettingsInput();
    this.#reflectPreview();
  }

  #setSettingsInput() {
    for (const [key, value] of Object.entries(this.settings)) this.settingsForm.elements[key].value = value;
  }

  #reflectPreview() {
    this.cursorDefault.width = this.settings.cursorSize;
    this.cursorDefault.height = this.settings.cursorSize;
    this.cursorDefault.style.transform = `translate(${this.settings.offsetX}px, ${this.settings.offsetY}px)`;
    this.cursorDefault.style.transformOrigin = `calc(50% + ${this.settings.offsetX}px) calc(50% + ${this.settings.offsetY}px)`;
    this.cursorDefault.style.opacity = this.settings.opacity;
    this.cursorDefault.style.rotate = `${this.settings.rotation}deg`;
  }

  #inputSettings() {
    this.saveStatus.classList.add("saving");
  }

  #changeSettings() {
    this.settings = Object.fromEntries(new FormData(this.settingsForm));
    this.settingsApp.save(this.settings);
    this.#reflectPreview();
    this.saveStatus.classList.remove("saving");
  }

  #resetSettings() {
    if (!confirm("設定を初期化しますか？")) return;
    this.settingsApp.reset();
    location.reload();
  }
}

const optionApp = new Option();
optionApp.init();

class Settings {
  static DEFAULTS = {
    cursorSize: 32,
    idleTime: 3000,
    rotationSpeed: 1500,
    offsetX: 3,
    offsetY: 3,
    rotation: -10,
    opacity: 1,
  };

  async save(settings) {
    await chrome.storage.local.set(settings);
  }

  async load() {
    const stored = await chrome.storage.local.get(Object.keys(Settings.DEFAULTS));
    const settings = { ...Settings.DEFAULTS, ...stored };
    this.save(settings);
    return settings;
  }

  async reset() {
    await this.save(Settings.DEFAULTS);
  }
}

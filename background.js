chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "myCursorOpenSettings",
    title: "MyCursor設定",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "myCursorOpenSettings") {
    chrome.runtime.openOptionsPage();
  }
});

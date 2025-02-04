
const tldLocales = {
  'com.au': 'Australia',
  'com.br': 'Brazil',
}

chrome.runtime.onInstalled.addListener(async () => {
  for (let [tld, locale] of Object.entries(tldLocales)) {
    chrome.contextMenus.create({
      id: tld,
      title: locale,
      type: 'normal',
      contexts: ['all'],
    });
  }
});

// Open a new search tab when the user clicks a context menu
chrome.contextMenus.onClicked.addListener((item, tab) => {
  const tld = item.menuItemId;
  const url = new URL(`https://google.${tld}/search`);
  url.searchParams.set('q', item.selectionText);
  chrome.tabs.create({ url: url.href, index: tab.index + 1 });
});

// Add or removes the locale from context menu
// when the user checks or unchecks the locale in the popup
chrome.storage.onChanged.addListener(({ enabledTlds }) => {
  if (typeof enabledTlds === 'undefined') return;

  const allTlds = Object.keys(tldLocales);
  const currentTlds = new Set(enabledTlds.newValue);
  const oldTlds = new Set(enabledTlds.oldValue ?? allTlds);
  const changes = allTlds.map((tld) => ({
    tld,
    added: currentTlds.has(tld) && !oldTlds.has(tld),
    removed: !currentTlds.has(tld) && oldTlds.has(tld)
  }));

  for (const { tld, added, removed } of changes) {
    if (added) {
      chrome.contextMenus.create({
        id: tld,
        title: tldLocales[tld],
        type: 'normal',
        contexts: ['selection']
      });
    } else if (removed) {
      chrome.contextMenus.remove(tld);
    }
  }
});
// Loads dashboard JSON data and exposes on window.__DASH_DATA__
(async () => {
  try {
    const res = await fetch('data/dados.json');
    const json = await res.json();
    window.__DASH_DATA__ = json;
  } catch (e) {
    console.error('Failed to load dashboard data', e);
  }
})();

let store = {};

export default {
  setItem: (key, value) => { store[key] = value.toString(); },
  getItem(key) {
    return store[key] || null;
  },
  removeItem: (key) => {
    delete store[key];
  },
  clear() {
    store = {};
  }
};
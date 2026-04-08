const storage = {
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: (key, defaultValue = null) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch {
      localStorage.removeItem(key);
      return defaultValue;
    }
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
};

export default storage;

var Auth = {
  KEYS: {
    USERS: "users",
    AUTH: "authUser",
  },

  readJSON: function (key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw);
      } else {
        return fallback;
      }
    } catch (e) {
      return fallback;
    }
  },

  getUsers: function () {
    return this.readJSON(this.KEYS.USERS, []);
  },
  setUsers: function (arr) {
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(arr));
  },

  getAuthUser: function () {
    return this.readJSON(this.KEYS.AUTH, null);
  },
  setAuthUser: function (user) {
    localStorage.setItem(this.KEYS.AUTH, JSON.stringify(user));
  },
  clearAuthUser: function () {
    localStorage.removeItem(this.KEYS.AUTH);
  },

  isValidEmail: function (email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  },
};

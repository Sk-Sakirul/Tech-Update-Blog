import conf from "../conf/conf";

const request = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(`${conf.apiBaseUrl}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch {
    throw new Error("Unable to reach the server. Please try again.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

class AuthService {
  async createAccount({ email, password, name }) {
    const data = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });

    return data.user;
  }

  async login({ email, password }) {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    return data.user;
  }

  async getCurrentUser() {
    try {
      const data = await request("/auth/me");
      return data.user;
    } catch (_error) {
      return null;
    }
  }

  async logout() {
    return request("/auth/logout", {
      method: "POST",
    });
  }

  async updateCurrentUser(data) {
    const response = await request("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    return response.user;
  }
}

const authService = new AuthService();

export default authService;

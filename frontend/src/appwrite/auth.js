import conf from "../conf/conf";

// ─── Session hint ────────────────────────────────────────────────────────────
// We store a lightweight flag in localStorage so we can skip the /api/auth/me
// call (and its noisy 401) when we already know there is no active session.
const SESSION_KEY = "__session";

const setSessionHint = () => localStorage.setItem(SESSION_KEY, "1");
const clearSessionHint = () => localStorage.removeItem(SESSION_KEY);
const hasSessionHint = () => localStorage.getItem(SESSION_KEY) === "1";

// ─── Core request handler ─────────────────────────────────────────────────────
const request = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(`${conf.apiBaseUrl}${path}`, {
      credentials: "include", // required for httpOnly cookies
      headers: {
        ...(options.body instanceof FormData
          ? {} // ❗ let the browser set multipart boundary automatically
          : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch {
    throw new Error("Unable to reach the server. Please try again.");
  }

  const data = await response.json().catch(() => ({}));

  // 401 → treat as "not logged in", not a hard error
  if (response.status === 401) {
    return { success: false, user: null, message: "Unauthorized" };
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return { success: true, ...data };
};

// ─── Auth service ─────────────────────────────────────────────────────────────
class AuthService {
  // ✅ Register
  async createAccount({ email, password, name }) {
    const res = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.success) throw new Error(res.message);

    setSessionHint(); // mark session as active
    return res.user;
  }

  // ✅ Login
  async login({ email, password }) {
    const res = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!res.success) throw new Error(res.message);

    setSessionHint(); // mark session as active
    return res.user;
  }

  // ✅ Get current user
  // Skips the network call entirely when localStorage says there is no session
  // → eliminates the 401 console warning on every page load for logged-out users
  async getCurrentUser() {
    if (!hasSessionHint()) {
      // No session hint → user was never logged in (or explicitly logged out)
      return { user: null, error: null };
    }

    const res = await request("/auth/me");

    if (!res.success) {
      // Cookie expired / invalidated on the server side
      clearSessionHint();
      return { user: null, error: null };
    }

    return { user: res.user, error: null };
  }

  // ✅ Logout
  async logout() {
    clearSessionHint(); // clear immediately so getCurrentUser is skipped next load
    try {
      await request("/auth/logout", { method: "POST" });
      return { success: true };
    } catch {
      return { success: false };
    }
  }

  // ✅ Update profile
  async updateCurrentUser(data) {
    const res = await request("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (!res.success) throw new Error(res.message);

    return res.user;
  }
}

const authService = new AuthService();

export default authService;

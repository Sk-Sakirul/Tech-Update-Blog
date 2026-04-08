import conf from "../conf/conf";

const request = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(`${conf.apiBaseUrl}${path}`, {
      credentials: "include",
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

class Service {
  async createPost({ title, content, featuredImage, status }) {
    const data = await request("/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        featuredImage,
        status,
      }),
    });

    return data.post;
  }

  async getPost(slug) {
    const data = await request(`/posts/${slug}`);
    return data.post;
  }

  async getPosts() {
    return request("/posts");
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    const data = await request(`/posts/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        featuredImage,
        status,
      }),
    });

    return data.post;
  }

  async deletePost(slug) {
    await request(`/posts/${slug}`, {
      method: "DELETE",
    });
    return true;
  }

  getFilePreview(file) {
    if (!file) {
      return null;
    }

    if (typeof file === "object" && file.url) {
      return file.url;
    }

    return `${conf.apiBaseUrl}/uploads/${file}/preview`;
  }

  async uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const data = await request("/uploads", {
      method: "POST",
      body: formData,
    });

    return data.file;
  }

  async deleteFile(fileId) {
    await request(`/uploads/${fileId}`, {
      method: "DELETE",
    });

    return true;
  }
}

const dbService = new Service();
export default dbService;

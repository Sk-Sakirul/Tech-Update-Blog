const normalizeBaseUrl = (value) => String(value || "/api").replace(/\/+$/, "")

const conf = {
    apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL),
    tinyMCEreactApi: import.meta.env.VITE_TINYMCE_REACT_API_KEY || "",
}

export default conf

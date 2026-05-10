// ===== KMAC Tech — API Config =====

const API_BASE_URL = "INJECTED_BY_ENV_MIDDLEWARE";

async function fetchAPI(endpoint, options = {}) {
  const { silent = false, headers = {}, ...fetchOptions } = options;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (!silent) {
      console.error(`[API Fetch Error] ${endpoint}:`, error);
    }
    throw error;
  }
}

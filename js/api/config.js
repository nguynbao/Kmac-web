// ===== KMAC Tech — API Config =====

const API_BASE_URL = "INJECTED_BY_ENV_MIDDLEWARE";

async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[API Fetch Error] ${endpoint}:`, error);
    throw error;
  }
}

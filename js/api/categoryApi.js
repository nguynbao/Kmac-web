// ===== KMAC Tech — Category API =====

const categoryApi = {
  // Lấy danh sách danh mục
  async getCategories(options = {}) {
    return fetchAPI(`/categories`, options);
  },

  // Lấy chi tiết 1 danh mục theo slug hoặc ID
  async getCategory(slugOrId) {
    return fetchAPI(`/categories/${slugOrId}`);
  }
};

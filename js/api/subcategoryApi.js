// ===== KMAC Tech — Subcategory API =====

const subcategoryApi = {
  // Lấy danh sách subcategory
  async getSubcategories(options = {}) {
    let url = `/subcategories`;
    if (options.categoryId) {
      url += `?categoryId=${options.categoryId}`;
    }
    return fetchAPI(url, options);
  },

  // Lấy chi tiết 1 subcategory theo slug hoặc ID
  async getSubcategory(slugOrId) {
    return fetchAPI(`/subcategories/${slugOrId}`);
  }
};

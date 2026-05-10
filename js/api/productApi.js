// ===== KMAC Tech — Product API =====

const productApi = {
  // Lấy danh sách sản phẩm (có hỗ trợ filter qua params)
  async getProducts(params = '') {
    return fetchAPI(`/products${params}`);
  },

  // Lấy chi tiết 1 sản phẩm
  async getProductById(id) {
    return fetchAPI(`/products/${id}`);
  },

  // Lấy sản phẩm nổi bật / best seller
  async getBestSellers() {
    return fetchAPI(`/products?sort=bestseller&limit=6`);
  }
};

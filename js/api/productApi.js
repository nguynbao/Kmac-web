// ===== KMAC Tech — Product API =====

const productApi = {
  // Lấy danh sách sản phẩm (có hỗ trợ filter qua params)
  async getProducts(params = '') {
    return fetchAPI(`/products${params}`);
  },

  // Lấy chi tiết 1 sản phẩm theo ID hoặc slug
  async getProductById(id) {
    return fetchAPI(`/products/${id}`);
  },

  // Lấy sản phẩm nổi bật / best seller
  async getBestSellers() {
    return fetchAPI(`/products?sort=bestseller&limit=6`);
  },

  // Lấy danh sách reviews của 1 sản phẩm
  async getReviews(productId) {
    return fetchAPI(`/products/${productId}/reviews`);
  },

  // Lấy sản phẩm liên quan
  async getRelated(productId) {
    return fetchAPI(`/products/${productId}/related`);
  }
};


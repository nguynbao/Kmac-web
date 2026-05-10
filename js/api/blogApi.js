// ===== KMAC Tech — Blog API =====

const blogApi = {
  // Lấy danh sách bài viết blog
  async getPosts(params = '') {
    return fetchAPI(`/posts${params}`);
  },

  // Lấy bài viết nổi bật
  async getFeaturedPost() {
    return fetchAPI('/posts/featured');
  },

  // Lấy chi tiết bài viết theo slug
  async getPostBySlug(slug) {
    return fetchAPI(`/posts/${slug}`);
  }
};

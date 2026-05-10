// ===== KMAC Tech — Shared Data Store =====

let PRODUCTS = [];
let CATEGORIES = [];

function normalizeApiList(response) {
  return response && Array.isArray(response.data) ? response.data : response;
}

function normalizeCategoryFromProduct(product) {
  const category = product.categoryId || product.category || "cases";
  if (category && typeof category === "object") {
    return {
      id: category._id || category.id || category.slug,
      slug: category.slug || category._id || category.id,
      name: category.name || category.slug || category._id || category.id,
    };
  }
  return {
    id: category,
    slug: category,
    name: category,
  };
}

function getProductCategorySlug(product) {
  const category = normalizeCategoryFromProduct(product);
  return category.slug || "cases";
}

function deriveCategoriesFromProducts(products) {
  const categoriesBySlug = new Map();
  products.forEach((product) => {
    const category = normalizeCategoryFromProduct(product);
    if (category.slug && !categoriesBySlug.has(category.slug)) {
      categoriesBySlug.set(category.slug, category);
    }
  });
  return [...categoriesBySlug.values()];
}

function normalizeProduct(product) {
  return {
    ...product,
    id: product._id || product.id,
    name:
      typeof product.name === "object"
        ? product.name.vn || product.name.en || ""
        : product.name || "",
    price: product.price || product.regularPrice || product.salePrice || 0,
    oldPrice: product.oldPrice || null,
    img:
      product.images && product.images.length > 0 && product.images[0].url
        ? product.images[0].url
        : "assets/product-macbook-case",
    category: getProductCategorySlug(product),
    colors: product.colors || [],
    sizes: product.sizes || [],
    rating: product.rating || product.ratingAverage || 0,
    reviews: product.reviews || product.reviewCount || 0,
  };
}

/* ===== KMAC Tech — App Bootstrap ===== */

async function loadProductsFromApi() {
  if (typeof productApi === "undefined") return [];

  try {
    const res = await productApi.getProducts();
    const rawProducts = normalizeApiList(res);
    if (rawProducts && Array.isArray(rawProducts) && rawProducts.length > 0) {
      PRODUCTS = rawProducts.map(normalizeProduct);
      return rawProducts;
    }
    return [];
  } catch (err) {
    console.error("Lỗi tải API Products, sử dụng dữ liệu mẫu:", err);
    return [];
  }
}

async function loadCategoriesFromApi(rawProducts) {
  if (typeof categoryApi !== "undefined") {
    try {
      const resCat = await categoryApi.getCategories({ silent: true });
      const serverCategories = normalizeApiList(resCat);
      if (serverCategories && Array.isArray(serverCategories)) {
        CATEGORIES = serverCategories;
      }
    } catch (err) {
      console.warn(
        "Không tải được API Categories, tạo danh mục từ products:",
        err,
      );
    }
  }

  if ((!CATEGORIES || CATEGORIES.length === 0) && rawProducts.length > 0) {
    CATEGORIES = deriveCategoriesFromProducts(rawProducts);
  }
}

function initSharedUi() {
  updateCartCount();
  initHeaderScroll();
  initMobileMenu();
  initSearch();
  initScrollAnimations();
}

document.addEventListener("DOMContentLoaded", async () => {
  const rawProducts = await loadProductsFromApi();
  await loadCategoriesFromApi(rawProducts);

  window.dispatchEvent(new Event("KmacDataLoaded"));
  initSharedUi();
});

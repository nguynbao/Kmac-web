/* ===== Product Detail JS v2.0 ===== */
/* Map API: getProductById + getProductReviews + getRelatedProducts */

window.addEventListener('KmacDataLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  let product = null;
  let reviews = [];
  let related = [];

  // ===== 1. Fetch product từ API theo ID/slug =====
  try {
    if (productId && typeof productApi !== 'undefined') {
      const res = await productApi.getProductById(productId);
      if (res && (res.data || res._id)) {
        const raw = res.data || res;
        product = mapProduct(raw);
      }
    }
  } catch (err) {
    console.warn('[ProductDetail] Không fetch được từ API, thử lấy từ danh sách PRODUCTS:', err);
  }

  // Fallback: lấy từ mảng PRODUCTS đã load sẵn
  if (!product && PRODUCTS.length > 0) {
    product = PRODUCTS.find(p => String(p.id) === String(productId)) || PRODUCTS[0];
  }

  if (!product) {
    document.getElementById('productLayout').innerHTML = '<p style="padding:40px;text-align:center;color:var(--text-sec)">Không tìm thấy sản phẩm.</p>';
    return;
  }

  // ===== 2. Fetch reviews từ API =====
  try {
    if (typeof productApi !== 'undefined') {
      const resR = await productApi.getReviews(productId || product.id);
      const raw = resR.data || resR;
      if (Array.isArray(raw)) reviews = raw;
    }
  } catch (err) {
    console.warn('[ProductDetail] Không lấy được reviews:', err);
  }

  // ===== 3. Fetch related products từ API =====
  try {
    if (typeof productApi !== 'undefined') {
      const resRel = await productApi.getRelated(productId || product.id);
      const raw = resRel.data || resRel;
      if (Array.isArray(raw)) related = raw.map(mapProduct);
    }
  } catch (err) {
    // Fallback từ PRODUCTS
    related = PRODUCTS.filter(p => String(p.id) !== String(product.id)).slice(0, 4);
  }

  // ===== Render tất cả =====
  renderDetail(product, reviews, related);
});

// ===== Ánh xạ dữ liệu từ API về chuẩn Frontend =====
function mapProduct(p) {
  return {
    ...p,
    id: p._id || p.id,
    name: typeof p.name === 'object' ? (p.name.vn || p.name.en || '') : (p.name || ''),
    description: typeof p.description === 'object' ? (p.description.vn || p.description.en || '') : (p.description || ''),
    price: p.price || p.regularPrice || p.salePrice || 0,
    oldPrice: p.oldPrice || null,
    img: p.images && p.images.length > 0 && p.images[0].url ? p.images[0].url : null,
    images: p.images || [],
    rating: p.ratingAverage || p.rating || 0,
    reviews: p.reviewCount || p.reviews || 0,
    badge: p.badge || null,
    colors: p.colors || [],
    sizes: p.sizes || [],
    slug: p.slug || '',
    stockQuantity: p.stockQuantity ?? null,
    category: p.categoryId?.slug || p.categoryId || p.category || '',
  };
}

// ===== Render chi tiết sản phẩm =====
function renderDetail(product, reviews, related) {
  const rating = product.rating || 0;
  const reviewCount = product.reviews || 0;

  // --- SEO ---
  document.title = `${product.name} — KMAC Tech`;
  if (document.getElementById('breadcrumbName')) {
    document.getElementById('breadcrumbName').textContent = product.name;
  }

  // Schema.org
  const schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.img || '',
    "description": product.description || "Premium accessory from KMAC Tech.",
    "brand": { "@type": "Brand", "name": "KMAC Tech" },
    "offers": {
      "@type": "Offer",
      "price": toFiniteNumber(product.price).toFixed(2),
      "priceCurrency": "VND",
      "availability": product.stockQuantity !== 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(rating > 0 && { "aggregateRating": { "@type": "AggregateRating", "ratingValue": rating.toString(), "reviewCount": reviewCount.toString() } })
  });
  document.head.appendChild(schema);

  // OG tags
  const setMeta = (prop, content) => {
    let tag = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`);
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute(prop.startsWith('og:') ? 'property' : 'name', prop); document.head.appendChild(tag); }
    tag.setAttribute('content', content);
  };
  setMeta('og:title', `${product.name} — KMAC Tech`);
  setMeta('og:image', product.img || '');
  setMeta('og:description', product.description || `${formatPrice(product.price)} — Phụ kiện chính hãng KMAC Tech.`);

  // --- Gallery (hỗ trợ nhiều ảnh từ API) ---
  const allImages = product.images && product.images.length > 0
    ? product.images.map(img => img.url || img)
    : (product.img ? [product.img] : ['assets/product-macbook-case.webp']);

  const mainImgSrc = allImages[0];
  const thumbsHTML = allImages.map((url, i) =>
    `<button class="${i === 0 ? 'active' : ''}" onclick="selectThumbUrl(this,'${url}')" aria-label="View image ${i + 1}">
      <img src="${url}" alt="${product.name} - view ${i + 1}" width="72" height="72" loading="lazy">
    </button>`
  ).join('');

  // Badge HTML
  const badgeMap = {
    'best seller': '<span class="badge badge-best">Best Seller</span>',
    'best':        '<span class="badge badge-best">Best Seller</span>',
    'new':         '<span class="badge badge-new">New Arrival</span>',
    'sale':        '<span class="badge badge-sale">Sale</span>',
    'hot':         '<span class="badge badge-sale">Hot</span>',
    'limited':     '<span class="badge badge-new">Limited</span>',
  };
  const badgeHTML = product.badge ? (badgeMap[product.badge.toLowerCase()] || `<span class="badge badge-new">${product.badge}</span>`) : '';

  // --- Layout HTML ---
  document.getElementById('productLayout').innerHTML = `
    <div class="gallery">
      <div class="gallery-main">
        <img src="${mainImgSrc}" alt="${product.name}" id="mainImg" width="600" height="600">
      </div>
      <div class="gallery-thumbs">${thumbsHTML}</div>
    </div>
    <div class="product-info-detail">
      <h1>${product.name}</h1>
      <div class="product-meta">
        ${rating > 0 ? `<div class="product-rating"><span class="stars" style="color:#FFC107">${renderStars(rating)}</span> <span>${formatReviewCount(reviewCount)}</span></div>` : ''}
        ${badgeHTML}
      </div>
      <div class="product-detail-price">
        ${formatPrice(product.price)}
        ${product.oldPrice ? `<span class="old-price" style="font-size:1.1rem">${formatPrice(product.oldPrice)}</span>` : ''}
      </div>
      <p class="product-description">${product.description || 'Phụ kiện chất lượng cao, thiết kế tinh tế từ KMAC Tech. Bảo hành 30 ngày đổi trả.'}</p>

      ${product.colors && product.colors.length ? `<div class="variant-group"><label>Màu sắc: <strong id="selectedColor">${product.colors[0]}</strong></label><div class="color-swatches">${product.colors.map((c, i) => `<button class="color-swatch${i === 0 ? ' active' : ''}" style="background:${getColorHex(c)}" title="${c}" aria-label="Color: ${c}" onclick="selectColor(this,'${c}')"></button>`).join('')}</div></div>` : ''}

      ${product.sizes && product.sizes.length ? `<div class="variant-group"><label>Kích thước / Model</label><div class="size-options">${product.sizes.map((s, i) => `<button class="size-option${i === 0 ? ' active' : ''}" onclick="selectSize(this)" aria-label="Size: ${s}">${s}</button>`).join('')}</div></div>` : ''}

      ${product.stockQuantity === 0
        ? `<div style="color:#ef4444;font-weight:600;margin-bottom:16px;">⚠️ Tạm hết hàng</div>`
        : `<div class="variant-group"><label for="qtyInput">Số lượng</label>
           <div class="quantity-selector">
             <button onclick="changeQty(-1)" aria-label="Decrease quantity">−</button>
             <input type="number" value="1" min="1" max="${product.stockQuantity || 99}" id="qtyInput" aria-label="Quantity">
             <button onclick="changeQty(1)" aria-label="Increase quantity">+</button>
           </div></div>
           <button class="btn btn-primary add-to-cart-btn" onclick="addToCart('${product.id}', parseInt(document.getElementById('qtyInput').value))" id="addToCartBtn">🛒 Thêm vào giỏ hàng</button>`
      }

      <div class="accordion" style="margin-top:32px;">
        <div class="accordion-item open">
          <button class="accordion-header" onclick="toggleAccordion(this)" aria-expanded="true">Mô tả sản phẩm</button>
          <div class="accordion-body"><div class="accordion-body-inner"><p>${product.description || 'Chưa có mô tả.'}</p></div></div>
        </div>
        <div class="accordion-item">
          <button class="accordion-header" onclick="toggleAccordion(this)" aria-expanded="false">Vận chuyển & Đổi trả</button>
          <div class="accordion-body"><div class="accordion-body-inner"><ul>
            <li>🚚 Giao hàng toàn quốc 2–5 ngày làm việc</li>
            <li>⚡ Giao nhanh trong ngày cho HCM & HN</li>
            <li>↩️ Đổi trả miễn phí trong 30 ngày</li>
            <li>📦 Đóng gói cẩn thận, có hộp quà tặng</li>
          </ul></div></div>
        </div>
      </div>
    </div>`;

  // --- Reviews ---
  const ratingFixed = toFiniteNumber(rating).toFixed(1);
  document.getElementById('reviewsSummary').innerHTML = `
    <div class="reviews-avg">
      <div class="big-num">${ratingFixed}</div>
      <div class="stars" style="color:#FFC107;font-size:1.2rem;">${renderStars(rating)}</div>
      <div style="color:var(--text-sec);font-size:.85rem;margin-top:4px;">${formatReviewCount(reviewCount)}</div>
    </div>
    <div class="review-bars">
      ${[5,4,3,2,1].map(star => `
        <div class="review-bar"><span>${star}★</span><div class="bar"><div class="bar-fill" style="width:${star === Math.round(rating) ? 70 : star > Math.round(rating) ? 10 : 20}%"></div></div></div>
      `).join('')}
    </div>`;

  if (reviews.length > 0) {
    document.getElementById('reviewsList').innerHTML = reviews.map(r => {
      const rName = r.userId?.name || r.name || 'Ẩn danh';
      const rDate = r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : '';
      const rRating = r.rating || 5;
      const rText = r.body || r.text || '';
      return `
        <div class="review-card">
          <div class="review-header">
            <div><span class="reviewer">${rName}</span> <span class="badge badge-new" style="font-size:.65rem;">✓ Verified</span></div>
            <span class="review-date">${rDate}</span>
          </div>
          <div class="stars" style="color:#FFC107;margin-bottom:8px;">${renderStars(rRating)}</div>
          <p class="review-text">${rText}</p>
        </div>`;
    }).join('');
  } else {
    document.getElementById('reviewsList').innerHTML = '<p style="color:var(--text-sec);padding:20px 0">Chưa có đánh giá nào.</p>';
  }

  // --- Related products ---
  if (document.getElementById('relatedGrid')) {
    document.getElementById('relatedGrid').innerHTML = related.length > 0
      ? related.map(p => renderProductCard(p)).join('')
      : '';
  }
}

// ===== UI Helpers =====
function selectThumbUrl(btn, url) {
  btn.closest('.gallery-thumbs').querySelectorAll('button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const mainImg = document.getElementById('mainImg');
  if (mainImg) mainImg.src = url;
}
// Legacy support
function selectThumb(btn, basePath) {
  selectThumbUrl(btn, imgSrc(basePath));
}
function selectColor(btn, name) {
  btn.closest('.color-swatches').querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
  btn.classList.add('active');
  const el = document.getElementById('selectedColor');
  if (el) el.textContent = name;
}
function selectSize(btn) {
  btn.closest('.size-options').querySelectorAll('.size-option').forEach(s => s.classList.remove('active'));
  btn.classList.add('active');
}
function changeQty(delta) {
  const inp = document.getElementById('qtyInput');
  inp.value = Math.max(1, Math.min(parseInt(inp.max) || 99, parseInt(inp.value) + delta));
}
function toggleAccordion(btn) {
  const item = btn.closest('.accordion-item');
  const isOpen = item.classList.contains('open');
  item.classList.toggle('open');
  btn.setAttribute('aria-expanded', !isOpen);
}

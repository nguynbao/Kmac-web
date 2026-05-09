/* ===== Shop Page JS v2.0 ===== */
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const prefilterCat = params.get('cat');
  if (prefilterCat) {
    const cb = document.querySelector(`.filter-cat[value="${prefilterCat}"]`);
    if (cb) cb.checked = true;
  }
  document.querySelectorAll('.filter-cat, .filter-price, .filter-rating').forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });
  applyFilters();
});

function applyFilters() {
  let filtered = [...PRODUCTS];
  const cats = [...document.querySelectorAll('.filter-cat:checked')].map(c => c.value);
  if (cats.length) filtered = filtered.filter(p => cats.includes(p.category));
  const prices = [...document.querySelectorAll('.filter-price:checked')].map(c => c.value);
  if (prices.length) {
    filtered = filtered.filter(p => prices.some(range => {
      const [min, max] = range.split('-').map(Number);
      return p.price >= min && p.price <= max;
    }));
  }
  const ratings = [...document.querySelectorAll('.filter-rating:checked')].map(c => Number(c.value));
  if (ratings.length) {
    const minRating = Math.min(...ratings);
    filtered = filtered.filter(p => p.rating >= minRating);
  }
  const sort = document.getElementById('sortSelect').value;
  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'newest') filtered.sort((a, b) => b.id - a.id);
  else filtered.sort((a, b) => b.reviews - a.reviews);

  const grid = document.getElementById('productsGrid');
  grid.innerHTML = filtered.length
    ? filtered.map(p => renderProductCard(p)).join('')
    : '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-sec)"><p style="font-size:1.2rem">No products found 😅</p><p>Try adjusting your filters</p></div>';
  document.getElementById('resultCount').textContent = `${filtered.length} Product${filtered.length !== 1 ? 's' : ''}`;
}

function clearFilters() {
  document.querySelectorAll('.filter-cat, .filter-price, .filter-rating').forEach(cb => cb.checked = false);
  document.getElementById('sortSelect').value = 'best';
  applyFilters();
}

function openQuickView(productId) {
  const p = PRODUCTS.find(pr => pr.id === productId);
  if (!p) return;
  const modal = document.getElementById('quickViewModal');
  document.getElementById('quickViewContent').innerHTML = `
    <div style="background:var(--blue-light);border-radius:var(--radius);display:flex;align-items:center;justify-content:center;padding:24px;aspect-ratio:1;">
      <picture><source srcset="${p.img}.webp" type="image/webp"><img src="${p.img}.png" alt="${p.name}" width="400" height="400" style="width:85%;height:85%;object-fit:contain;"></picture>
    </div>
    <div>
      <h2 style="font-size:1.3rem;margin-bottom:8px;">${p.name}</h2>
      <div class="product-rating" style="margin-bottom:12px;"><span class="stars">${renderStars(p.rating)}</span> (${p.reviews} reviews)</div>
      <div style="font-size:1.4rem;font-weight:800;color:var(--blue-text);margin-bottom:16px;">$${p.price.toFixed(2)}${p.oldPrice ? ' <span class="old-price">$' + p.oldPrice.toFixed(2) + '</span>' : ''}</div>
      ${p.colors.length ? '<div style="margin-bottom:16px;"><label style="font-weight:600;font-size:.85rem;display:block;margin-bottom:8px;">Color</label><div class="color-swatches">' + p.colors.map((c, i) => `<button class="color-swatch${i === 0 ? ' active' : ''}" style="background:${getColorHex(c)}" title="${c}" aria-label="Color: ${c}" onclick="this.parentElement.querySelectorAll('.color-swatch').forEach(s=>s.classList.remove('active'));this.classList.add('active')"></button>`).join('') + '</div></div>' : ''}
      <button class="btn btn-primary" style="width:100%;" onclick="addToCart(${p.id});closeQuickView();">Add to Cart</button>
      <a href="product.html?id=${p.id}" class="btn btn-outline" style="width:100%;margin-top:8px;">View Full Details →</a>
    </div>`;
  modal.classList.add('open');
}

function closeQuickView() {
  document.getElementById('quickViewModal').classList.remove('open');
}

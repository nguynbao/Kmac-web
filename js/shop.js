/* ===== Shop Page JS v2.0 ===== */
window.addEventListener('KmacDataLoaded', () => {
  // Render dynamic category filters from API
  const catContainer = document.getElementById('categoryFilterOptions');
  if (catContainer) {
    if (CATEGORIES && CATEGORIES.length > 0) {
      catContainer.innerHTML = CATEGORIES.map(cat => {
        const slug = cat.slug || (cat._id || cat.id);
        const name = typeof cat.name === 'object' ? (cat.name.vn || cat.name.en || slug) : (cat.name || slug);
        
        let html = `<div class="category-filter-group" style="margin-bottom: 12px;">
          <label style="font-weight: 700; display: block; margin-bottom: 4px;">
            <input type="checkbox" value="${slug}" class="filter-cat"> ${name}
          </label>`;
        
        if (cat.children && cat.children.length > 0) {
          html += `<div class="subcategory-filters" style="padding-left: 20px; display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">`;
          html += cat.children.map(sub => {
            const subSlug = sub.slug || (sub._id || sub.id);
            const subName = typeof sub.name === 'object' ? (sub.name.vn || sub.name.en || subSlug) : (sub.name || subSlug);
            return `<label style="font-size: 0.9rem; font-weight: 400; color: var(--text-sec);">
              <input type="checkbox" value="${subSlug}" class="filter-cat" data-parent="${slug}"> ${subName}
            </label>`;
          }).join('');
          html += `</div>`;
        }
        
        html += `</div>`;
        return html;
      }).join('');
    } else {
      catContainer.innerHTML = '<div style="color:var(--text-sec);font-size:.85rem;padding:8px 0">Chưa có danh mục</div>';
    }
  }

  const params = new URLSearchParams(window.location.search);
  const prefilterCat = params.get('cat');
  if (prefilterCat) {
    const cb = document.querySelector(`.filter-cat[value="${prefilterCat}"]`);
    if (cb) cb.checked = true;
  }
  
  document.querySelectorAll('.filter-cat').forEach(cb => {
    cb.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.querySelectorAll('.filter-cat').forEach(other => {
          if (other !== e.target) other.checked = false;
        });
      }
      applyFilters();
    });
  });

  document.querySelectorAll('.filter-price, .filter-rating').forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });
  
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) sortSelect.addEventListener('change', applyFilters);

  applyFilters();
});

function applyFilters() {
  let filtered = [...PRODUCTS];
  
  // Collect checked categories
  const checkedCats = [...document.querySelectorAll('.filter-cat:checked')];
  let cats = checkedCats.map(c => c.value);
  
  // If a parent category is checked, automatically include all its subcategories in the filter
  checkedCats.forEach(cb => {
    if (!cb.dataset.parent) {
      // It's a parent category, find its subcategories
      const parentGroup = cb.closest('.category-filter-group');
      if (parentGroup) {
        const subCbs = parentGroup.querySelectorAll('.filter-cat[data-parent]');
        subCbs.forEach(subCb => {
          if (!cats.includes(subCb.value)) cats.push(subCb.value);
        });
      }
    }
  });

  if (cats.length) {
    filtered = filtered.filter(p => cats.includes(p.category) || cats.includes(p.subcategory));
  }
  
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
    filtered = filtered.filter(p => (p.rating || p.ratingAverage || 0) >= minRating);
  }
  
  const sortSelect = document.getElementById('sortSelect');
  const sort = sortSelect ? sortSelect.value : 'best';
  
  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'newest') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  else filtered.sort((a, b) => (b.reviews || b.reviewCount || 0) - (a.reviews || a.reviewCount || 0));

  const grid = document.getElementById('productsGrid');
  if (grid) {
    grid.innerHTML = filtered.length
      ? filtered.map(p => renderProductCard(p)).join('')
      : '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-sec)"><p style="font-size:1.2rem">No products found 😅</p><p>Try adjusting your filters</p></div>';
  }
  
  const resultCount = document.getElementById('resultCount');
  if (resultCount) resultCount.textContent = formatProductCount(filtered.length);
}

function clearFilters() {
  document.querySelectorAll('.filter-cat, .filter-price, .filter-rating').forEach(cb => cb.checked = false);
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) sortSelect.value = 'best';
  applyFilters();
}

function openQuickView(productId) {
  const p = PRODUCTS.find(pr => String(pr.id) === String(productId));
  if (!p) return;
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  document.getElementById('quickViewContent').innerHTML = `
    <div style="background:var(--blue-light);border-radius:var(--radius);display:flex;align-items:center;justify-content:center;padding:24px;aspect-ratio:1;">
      <img src="${p.img}" alt="${p.name}" width="400" height="400" style="width:85%;height:85%;object-fit:contain;">
    </div>
    <div>
      <h2 style="font-size:1.3rem;margin-bottom:8px;">${p.name}</h2>
      <div class="product-rating" style="margin-bottom:12px;"><span class="stars">${renderStars(p.rating || p.ratingAverage || 0)}</span> (${formatReviewCount(p.reviews || p.reviewCount || 0)})</div>
      <div style="font-size:1.4rem;font-weight:800;color:var(--blue-text);margin-bottom:16px;">${formatPrice(p.price)}${p.oldPrice ? ' <span class="old-price">' + formatPrice(p.oldPrice) + '</span>' : ''}</div>
      ${p.colors && p.colors.length ? '<div style="margin-bottom:16px;"><label style="font-weight:600;font-size:.85rem;display:block;margin-bottom:8px;">Color</label><div class="color-swatches">' + p.colors.map((c, i) => `<button class="color-swatch${i === 0 ? ' active' : ''}" style="background:${getColorHex(c)}" title="${c}" aria-label="Color: ${c}" onclick="this.parentElement.querySelectorAll('.color-swatch').forEach(s=>s.classList.remove('active'));this.classList.add('active')"></button>`).join('') + '</div></div>' : ''}
      <button class="btn btn-primary" style="width:100%;" onclick="addToCart('${p.id}');closeQuickView();">Add to Cart</button>
      <a href="${pageUrl(`product.html?id=${p.id}`)}" class="btn btn-outline" style="width:100%;margin-top:8px;">View Full Details →</a>
    </div>`;
  modal.classList.add('open');
}

function closeQuickView() {
  const modal = document.getElementById('quickViewModal');
  if (modal) modal.classList.remove('open');
}

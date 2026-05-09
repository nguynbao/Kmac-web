/* ===== Product Detail JS v2.0 ===== */
/* Uses shared getColorHex() from main.js, WebP images via <picture> */

const SAMPLE_REVIEWS = [
  { name: 'Sarah M.', date: 'Apr 28, 2026', rating: 5, text: 'Absolutely love this! The quality is amazing and it fits my MacBook perfectly. The color is even more beautiful in person. Highly recommend! 💙', verified: true },
  { name: 'James K.', date: 'Apr 15, 2026', rating: 5, text: 'Great build quality and the packaging was really cute. Shipped fast and arrived in perfect condition. Will definitely buy more from KMAC Tech.', verified: true },
  { name: 'Emily R.', date: 'Mar 30, 2026', rating: 4, text: 'Really nice product, looks exactly like the photos. Only giving 4 stars because I wish there were more color options. Otherwise perfect!', verified: true },
  { name: 'Mike T.', date: 'Mar 12, 2026', rating: 5, text: 'This is my third purchase from KMAC Tech and they never disappoint. Premium quality at a fair price. The customer service is also top-notch!', verified: true },
];

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id')) || 1;
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];

  // Dynamic SEO
  document.title = `${product.name} — KMAC Tech`;
  document.getElementById('breadcrumbName').textContent = product.name;

  // Inject JSON-LD Product schema
  const schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": `https://kmactech.com/${product.img}.webp`,
    "description": "Premium quality accessory designed for your everyday tech. Made with durable, eco-friendly materials.",
    "brand": { "@type": "Brand", "name": "KMAC Tech" },
    "offers": {
      "@type": "Offer",
      "price": product.price.toFixed(2),
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "KMAC Tech" }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating.toString(),
      "reviewCount": product.reviews.toString()
    }
  });
  document.head.appendChild(schema);

  // Update OG tags dynamically
  const setMeta = (prop, content) => {
    let tag = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`);
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute(prop.startsWith('og:') ? 'property' : 'name', prop); document.head.appendChild(tag); }
    tag.setAttribute('content', content);
  };
  setMeta('og:title', `${product.name} — KMAC Tech`);
  setMeta('og:image', `https://kmactech.com/${product.img}.webp`);
  setMeta('og:description', `$${product.price.toFixed(2)} — Premium quality accessory from KMAC Tech.`);

  // Build layout with WebP images
  document.getElementById('productLayout').innerHTML = `
    <div class="gallery">
      <div class="gallery-main">
        <picture>
          <source srcset="${assetUrl(product.img + '.webp')}" type="image/webp">
          <img src="${assetUrl(product.img + '.png')}" alt="${product.name}" id="mainImg" width="600" height="600">
        </picture>
      </div>
      <div class="gallery-thumbs">
        <button class="active" onclick="selectThumb(this,'${product.img}')" aria-label="View image 1"><picture><source srcset="${assetUrl(product.img + '.webp')}" type="image/webp"><img src="${assetUrl(product.img + '.png')}" alt="View 1" width="72" height="72"></picture></button>
        <button onclick="selectThumb(this,'${product.img}')" aria-label="View image 2"><picture><source srcset="${assetUrl(product.img + '.webp')}" type="image/webp"><img src="${assetUrl(product.img + '.png')}" alt="View 2" width="72" height="72"></picture></button>
        <button onclick="selectThumb(this,'${product.img}')" aria-label="View image 3"><picture><source srcset="${assetUrl(product.img + '.webp')}" type="image/webp"><img src="${assetUrl(product.img + '.png')}" alt="View 3" width="72" height="72"></picture></button>
      </div>
    </div>
    <div class="product-info-detail">
      <h1>${product.name}</h1>
      <div class="product-meta">
        <div class="product-rating"><span class="stars" style="color:#FFC107">${renderStars(product.rating)}</span> <span>${product.reviews} reviews</span></div>
        ${product.badge === 'best' ? '<span class="badge badge-best">Best Seller</span>' : ''}
        ${product.badge === 'new' ? '<span class="badge badge-new">New Arrival</span>' : ''}
      </div>
      <div class="product-detail-price">$${product.price.toFixed(2)} ${product.oldPrice ? '<span class="old-price" style="font-size:1.1rem">$' + product.oldPrice.toFixed(2) + '</span>' : ''}</div>
      <p class="product-description">Premium quality accessory designed for your everyday tech. Made with durable, eco-friendly materials that protect your device while looking stylish. Every KMAC Tech product comes with our 30-day happiness guarantee.</p>

      ${product.colors.length ? `<div class="variant-group"><label>Color: <strong id="selectedColor">${product.colors[0]}</strong></label><div class="color-swatches">${product.colors.map((c, i) => `<button class="color-swatch${i === 0 ? ' active' : ''}" style="background:${getColorHex(c)}" title="${c}" aria-label="Color: ${c}" onclick="selectColor(this,'${c}')"></button>`).join('')}</div></div>` : ''}

      ${product.sizes.length ? `<div class="variant-group"><label>Size / Model</label><div class="size-options">${product.sizes.map((s, i) => `<button class="size-option${i === 0 ? ' active' : ''}" onclick="selectSize(this)" aria-label="Size: ${s}">${s}</button>`).join('')}</div></div>` : ''}

      <div class="variant-group"><label for="qtyInput">Quantity</label>
      <div class="quantity-selector">
        <button onclick="changeQty(-1)" aria-label="Decrease quantity">−</button>
        <input type="number" value="1" min="1" max="10" id="qtyInput" aria-label="Quantity">
        <button onclick="changeQty(1)" aria-label="Increase quantity">+</button>
      </div></div>

      <button class="btn btn-primary add-to-cart-btn" onclick="addToCart(${product.id}, parseInt(document.getElementById('qtyInput').value))" id="addToCartBtn">🛒 Add to Cart</button>

      <div class="accordion" style="margin-top:32px;">
        <div class="accordion-item open">
          <button class="accordion-header" onclick="toggleAccordion(this)" aria-expanded="true">Description</button>
          <div class="accordion-body"><div class="accordion-body-inner"><ul>
            <li>Premium quality materials for maximum protection</li>
            <li>Precise cutouts for all ports and buttons</li>
            <li>Slim profile — adds minimal bulk to your device</li>
            <li>Scratch-resistant, easy to clean surface</li>
            <li>Available in multiple colors and sizes</li>
          </ul></div></div>
        </div>
        <div class="accordion-item">
          <button class="accordion-header" onclick="toggleAccordion(this)" aria-expanded="false">Specifications</button>
          <div class="accordion-body"><div class="accordion-body-inner"><ul>
            <li>Material: Polycarbonate / Premium fabric</li>
            <li>Weight: Ultra-lightweight design</li>
            <li>Compatibility: See size options above</li>
            <li>Package: Product + microfiber cloth + KMAC sticker</li>
          </ul></div></div>
        </div>
        <div class="accordion-item">
          <button class="accordion-header" onclick="toggleAccordion(this)" aria-expanded="false">Shipping & Returns</button>
          <div class="accordion-body"><div class="accordion-body-inner"><ul>
            <li>🚚 Free standard shipping across the US (3-5 business days)</li>
            <li>⚡ Express shipping available ($9.99, 1-2 business days)</li>
            <li>↩️ 30-day hassle-free returns</li>
            <li>📦 All orders ship from our US warehouse</li>
          </ul></div></div>
        </div>
      </div>
    </div>`;

  // Reviews
  document.getElementById('reviewsSummary').innerHTML = `
    <div class="reviews-avg"><div class="big-num">${product.rating}.0</div><div class="stars" style="color:#FFC107;font-size:1.2rem;">${renderStars(product.rating)}</div><div style="color:var(--text-sec);font-size:.85rem;margin-top:4px;">${product.reviews} reviews</div></div>
    <div class="review-bars">
      <div class="review-bar"><span>5★</span><div class="bar"><div class="bar-fill" style="width:78%"></div></div><span>78%</span></div>
      <div class="review-bar"><span>4★</span><div class="bar"><div class="bar-fill" style="width:15%"></div></div><span>15%</span></div>
      <div class="review-bar"><span>3★</span><div class="bar"><div class="bar-fill" style="width:5%"></div></div><span>5%</span></div>
      <div class="review-bar"><span>2★</span><div class="bar"><div class="bar-fill" style="width:1%"></div></div><span>1%</span></div>
      <div class="review-bar"><span>1★</span><div class="bar"><div class="bar-fill" style="width:1%"></div></div><span>1%</span></div>
    </div>`;

  document.getElementById('reviewsList').innerHTML = SAMPLE_REVIEWS.map(r => `
    <div class="review-card">
      <div class="review-header"><div><span class="reviewer">${r.name}</span>${r.verified ? ' <span class="badge badge-new" style="font-size:.65rem;">✓ Verified</span>' : ''}</div><span class="review-date">${r.date}</span></div>
      <div class="stars" style="color:#FFC107;margin-bottom:8px;">${renderStars(r.rating)}</div>
      <p class="review-text">${r.text}</p>
    </div>`).join('');

  // Related products
  const related = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);
  document.getElementById('relatedGrid').innerHTML = related.map(p => renderProductCard(p)).join('');
});

function selectThumb(btn, basePath) {
  btn.closest('.gallery-thumbs').querySelectorAll('button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const mainPicture = document.querySelector('.gallery-main picture');
  if (mainPicture) {
    mainPicture.querySelector('source').srcset = assetUrl(basePath + '.webp');
    mainPicture.querySelector('img').src = assetUrl(basePath + '.png');
  }
}
function selectColor(btn, name) {
  btn.closest('.color-swatches').querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('selectedColor').textContent = name;
}
function selectSize(btn) {
  btn.closest('.size-options').querySelectorAll('.size-option').forEach(s => s.classList.remove('active'));
  btn.classList.add('active');
}
function changeQty(delta) {
  const inp = document.getElementById('qtyInput');
  inp.value = Math.max(1, Math.min(10, parseInt(inp.value) + delta));
}
function toggleAccordion(btn) {
  const item = btn.closest('.accordion-item');
  const isOpen = item.classList.contains('open');
  item.classList.toggle('open');
  btn.setAttribute('aria-expanded', !isOpen);
}

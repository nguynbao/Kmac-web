// ===== KMAC Tech — Product Render Helpers =====

function renderStars(rating) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function renderProductCard(product) {
  let badgeHTML = "";
  if (product.badge === "best") {
    badgeHTML = '<span class="badge badge-best">Best Seller</span>';
  } else if (product.badge === "new") {
    badgeHTML = '<span class="badge badge-new">New</span>';
  } else if (product.badge === "sale") {
    badgeHTML =
      '<span class="badge badge-sale">-' +
      Math.round((1 - product.price / product.oldPrice) * 100) +
      "%</span>";
  }

  const priceHTML = product.oldPrice
    ? `$${product.price.toFixed(2)} <span class="old-price">$${product.oldPrice.toFixed(2)}</span>`
    : `$${product.price.toFixed(2)}`;

  return `<a href="${pageUrl(`product.html?id=${product.id}`)}" class="product-card">
    <div class="product-img">
      ${badgeHTML ? '<div class="product-badges">' + badgeHTML + "</div>" : ""}
      ${imgPicture(product.img, product.name)}
    </div>
    <div class="product-info">
      <div class="product-rating"><span class="stars">${renderStars(product.rating)}</span> (${product.reviews})</div>
      <h3 class="product-name">${product.name}</h3>
      <div class="product-price">${priceHTML}</div>
      <div class="product-actions"><button class="btn btn-cart" onclick="event.preventDefault();addToCart('${product.id}')">Add to Cart</button></div>
    </div>
  </a>`;
}

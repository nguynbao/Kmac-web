# BA Backend Specification - KMAC Tech

## 1. Tong quan

KMAC Tech la website thuong mai dien tu ban phu kien cong nghe, tap trung vao MacBook, laptop gaming, iPhone case, sac, cap, hub USB-C va cac phu kien setup. Du an hien co ban frontend tinh bang HTML/CSS/JavaScript va mot theme WordPress/WooCommerce. File nay mo ta cac chuc nang hien co/ky vong de team Backend co the thiet ke API, database va business logic.

## 2. Muc tieu Backend

- Cung cap API cho frontend hien tai hoac frontend moi.
- Quan ly san pham, danh muc, ton kho, gia, bien the, hinh anh.
- Ho tro gio hang, ma giam gia, checkout va tao don hang that.
- Quan ly khach hang, dia chi giao hang, trang thai don hang.
- Tich hop thanh toan, email xac nhan va van chuyen.
- Ho tro song ngu EN/VN cho noi dung can hien thi.
- Cung cap admin APIs de quan tri san pham, coupon, don hang va blog.

## 3. Pham vi hien co trong Frontend

Frontend hien co cac trang:

- `index.html`: trang chu, hero, danh muc, san pham ban chay, newsletter.
- `pages/shop.html`: danh sach san pham, loc theo danh muc/gia/rating, sap xep, quick view.
- `pages/product.html`: chi tiet san pham, review, san pham lien quan.
- `pages/cart.html`: gio hang, tang/giam so luong, xoa san pham, coupon, upsell.
- `pages/checkout.html`: thong tin lien he, dia chi giao hang, chon shipping, chon payment, dat hang demo.
- `pages/blog.html`: blog, bai viet noi bat, danh sach bai viet.
- `pages/404.html`: trang loi.
- `pages/thankyou-demo.html`: trang cam on demo.

Hien tai du lieu san pham va gio hang dang nam o frontend:

- Product demo: `js/main.js`, bien `PRODUCTS`.
- Cart: `localStorage` key `kmac_cart`.
- Coupon: `localStorage` key `kmac_coupon`.
- Language: `localStorage` key `kmac_lang`.

Backend can thay the cac logic demo nay bang API that.

## 4. Vai tro nguoi dung

### Guest

- Xem trang chu, shop, chi tiet san pham, blog.
- Tim kiem san pham.
- Them san pham vao gio.
- Ap dung coupon.
- Checkout khong can dang nhap.
- Dang ky newsletter.

### Customer

- Dang ky/dang nhap.
- Quan ly thong tin ca nhan va dia chi.
- Xem lich su don hang.
- Theo doi trang thai don hang.
- Viet review san pham da mua.

### Admin

- Quan ly san pham, danh muc, bien the, anh, ton kho.
- Quan ly coupon.
- Quan ly don hang va cap nhat trang thai.
- Quan ly blog.
- Quan ly review.
- Xem bao cao co ban.

## 5. Module chuc nang

## 5.1 Product Catalog

### Mo ta

He thong quan ly danh sach san pham phu kien cong nghe. Frontend hien can cac thong tin: ten, gia, gia cu, anh, danh muc, badge, rating, review count, mau sac, size/compatibility.

### Du lieu de xuat

- `id`
- `sku`
- `name`
- `slug`
- `short_description`
- `description`
- `regular_price`
- `sale_price`
- `currency`
- `category_id`
- `tags`
- `images`
- `stock_quantity`
- `stock_status`
- `rating_average`
- `review_count`
- `badge`: `best`, `new`, `sale`, hoac `null`
- `attributes`: color, size, compatibility, material
- `status`: draft/published/archived
- `created_at`, `updated_at`

### Yeu cau Backend

- API lay danh sach san pham co pagination.
- API lay chi tiet san pham theo `id` hoac `slug`.
- Ho tro loc theo category, price range, rating, badge, search keyword.
- Ho tro sort theo bestseller, newest, price asc, price desc, rating.
- Ho tro san pham lien quan dua tren category/tags.
- Ho tro anh WebP/PNG hoac tra ve danh sach image URLs theo kich thuoc.

### API de xuat

```http
GET /api/products
GET /api/products/{id-or-slug}
GET /api/products/{id}/related
POST /api/admin/products
PUT /api/admin/products/{id}
DELETE /api/admin/products/{id}
```

## 5.2 Category

### Mo ta

Shop hien co cac nhom san pham:

- MacBook cases
- Sleeves & bags
- Gaming gear
- Chargers & cables
- iPhone cases
- MacBook skins
- USB-C hubs/adapters

### Yeu cau Backend

- Quan ly category cha/con.
- Category co slug de dung cho URL/filter.
- Tra ve so luong san pham theo category.
- Ho tro song ngu ten va mo ta category.

### API de xuat

```http
GET /api/categories
GET /api/categories/{slug}
POST /api/admin/categories
PUT /api/admin/categories/{id}
DELETE /api/admin/categories/{id}
```

## 5.3 Search

### Mo ta

Frontend hien co search overlay tim san pham theo ten hoac category.

### Yeu cau Backend

- Tim kiem theo keyword trong ten, SKU, category, tag.
- Tra ve ket qua goi y nhanh cho search overlay.
- Ho tro debounce tu frontend, BE can response nhe va nhanh.
- Co the them full-text search khi data lon.

### API de xuat

```http
GET /api/search/products?q=keyboard&limit=8
```

## 5.4 Cart

### Mo ta

Cart hien luu localStorage. Backend can ho tro cart server-side cho user da dang nhap va guest cart bang session/cart token.

### Yeu cau Backend

- Tao cart cho guest va customer.
- Them san pham vao cart.
- Cap nhat so luong.
- Xoa item.
- Lay tong tien tam tinh.
- Validate ton kho va gia moi nhat.
- Ap dung/bo coupon.
- Merge guest cart vao customer cart sau khi login.

### API de xuat

```http
POST /api/cart
GET /api/cart/{cart_id}
POST /api/cart/{cart_id}/items
PATCH /api/cart/{cart_id}/items/{item_id}
DELETE /api/cart/{cart_id}/items/{item_id}
POST /api/cart/{cart_id}/coupon
DELETE /api/cart/{cart_id}/coupon
POST /api/cart/merge
```

## 5.5 Coupon/Promotion

### Mo ta

Frontend hien co coupon demo:

- `KMAC10`: giam 10%.
- `WELCOME5`: giam 5 USD.

### Yeu cau Backend

- Coupon co code, type percent/fixed, value.
- Co ngay bat dau/ket thuc.
- Co gioi han so lan dung.
- Co dieu kien subtotal toi thieu.
- Co gioi han category/product neu can.
- Co the gan cho user moi hoac tat ca user.
- Validate coupon khi apply cart va khi checkout.

### API de xuat

```http
POST /api/coupons/validate
POST /api/admin/coupons
PUT /api/admin/coupons/{id}
DELETE /api/admin/coupons/{id}
```

## 5.6 Checkout

### Mo ta

Checkout hien la demo gom 4 buoc:

1. Contact information
2. Shipping address
3. Shipping method
4. Payment

### Yeu cau Backend

- Validate cart truoc khi checkout.
- Validate thong tin khach hang va dia chi.
- Tinh shipping fee.
- Tinh subtotal, discount, shipping, tax neu co, grand total.
- Tao pending order.
- Goi payment provider.
- Cap nhat order theo ket qua thanh toan.
- Gui email xac nhan.
- Giam ton kho sau khi order duoc xac nhan.

### API de xuat

```http
POST /api/checkout/quote
POST /api/checkout
POST /api/checkout/payment-intent
POST /api/payment/webhook
```

## 5.7 Payment

### Mo ta

Frontend hien hien thi 3 phuong thuc:

- Card
- PayPal
- Apple Pay

### Yeu cau Backend

- Tich hop payment gateway, de xuat Stripe cho card va Apple Pay.
- PayPal co the tich hop rieng neu can.
- Khong luu card number/CVC tren server.
- Webhook xu ly ket qua thanh toan.
- Idempotency key de tranh tao don/tru tien nhieu lan.

### Trang thai payment de xuat

- `pending`
- `authorized`
- `paid`
- `failed`
- `refunded`
- `partially_refunded`

## 5.8 Order Management

### Mo ta

Don hang that can thay cho man hinh success demo.

### Du lieu de xuat

- `order_id`
- `order_number`
- `customer_id`
- `guest_email`
- `items`
- `shipping_address`
- `billing_address`
- `shipping_method`
- `subtotal`
- `discount_total`
- `shipping_total`
- `tax_total`
- `grand_total`
- `coupon_code`
- `payment_status`
- `order_status`
- `customer_note`
- `created_at`, `updated_at`

### Trang thai order de xuat

- `pending_payment`
- `processing`
- `paid`
- `packed`
- `shipped`
- `completed`
- `cancelled`
- `refunded`

### API de xuat

```http
GET /api/orders/{order_number}
GET /api/me/orders
GET /api/me/orders/{order_id}
GET /api/admin/orders
PATCH /api/admin/orders/{order_id}/status
POST /api/admin/orders/{order_id}/refund
```

## 5.9 Shipping

### Mo ta

Frontend hien co:

- Standard Shipping: free, 3-5 business days.
- Express Shipping: 9.99 USD, 1-2 business days.

### Yeu cau Backend

- API tinh phi ship theo dia chi/cart.
- Cau hinh shipping method.
- Ho tro mien phi ship theo dieu kien neu can.
- Luu tracking number va carrier khi order shipped.

### API de xuat

```http
GET /api/shipping/methods
POST /api/shipping/quote
PATCH /api/admin/orders/{order_id}/tracking
```

## 5.10 Customer Account

### Mo ta

Frontend chua co UI account, nhung BE nen chuan bi de mo rong.

### Yeu cau Backend

- Dang ky, dang nhap, dang xuat.
- Forgot/reset password.
- Quan ly profile.
- Quan ly dia chi.
- Lich su don hang.
- Guest checkout van duoc ho tro.

### API de xuat

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET /api/me
PATCH /api/me
GET /api/me/addresses
POST /api/me/addresses
PUT /api/me/addresses/{id}
DELETE /api/me/addresses/{id}
```

## 5.11 Review/Rating

### Mo ta

Trang product hien co khu vuc customer reviews. Data dang demo.

### Yeu cau Backend

- Lay review theo product.
- Chi customer da mua san pham moi duoc review, neu business yeu cau.
- Admin co the approve/hide review.
- Tinh rating average va review count.

### API de xuat

```http
GET /api/products/{id}/reviews
POST /api/products/{id}/reviews
PATCH /api/admin/reviews/{id}/status
DELETE /api/admin/reviews/{id}
```

## 5.12 Blog/CMS

### Mo ta

Blog hien la HTML tinh voi featured post va latest articles.

### Yeu cau Backend

- Quan ly bai viet, category, tag, author.
- Featured post.
- Slug SEO.
- Meta title/description/OG image.
- Trang thai draft/published.
- Ho tro song ngu EN/VN neu can.

### API de xuat

```http
GET /api/posts
GET /api/posts/{slug}
GET /api/posts/featured
POST /api/admin/posts
PUT /api/admin/posts/{id}
DELETE /api/admin/posts/{id}
```

## 5.13 Newsletter

### Mo ta

Trang chu va blog co form subscribe newsletter, hien dang chi show toast.

### Yeu cau Backend

- Luu email dang ky.
- Validate email.
- Chong spam co ban.
- Khong duplicate email.
- Luu source: homepage/blog/footer.
- Co the tich hop Mailchimp/Klaviyo sau.

### API de xuat

```http
POST /api/newsletter/subscribe
GET /api/admin/newsletter/subscribers
DELETE /api/admin/newsletter/subscribers/{id}
```

## 5.14 Internationalization EN/VN

### Mo ta

Frontend hien dung `js/i18n.js`. WordPress theme co server-side lang cookie/session.

### Yeu cau Backend

- API chap nhan header/query lang: `en` hoac `vn`.
- Noi dung product/category/blog co the co field song ngu.
- Email order can gui theo ngon ngu khach chon.
- Luu ngon ngu tren order: `order_language`.

### De xuat response

```json
{
  "id": 1,
  "name": {
    "en": "MacBook Pro 14 Crystal Clear Case",
    "vn": "Op trong suot MacBook Pro 14"
  }
}
```

Hoac Backend co the resolve san text theo `Accept-Language`:

```http
Accept-Language: vi
```

## 5.15 Admin

### Yeu cau Backend

- Admin login rieng hoac dung role-based access control.
- CRUD product/category/blog/coupon.
- Xem va cap nhat order.
- Quan ly review.
- Upload anh.
- Export order/customer/newsletter CSV.

### Role de xuat

- `admin`: full access.
- `manager`: quan ly product/order.
- `editor`: quan ly blog.
- `support`: xem order/customer, cap nhat note/tracking.

## 6. Database de xuat

### Bang chinh

- `users`
- `customer_profiles`
- `addresses`
- `categories`
- `products`
- `product_images`
- `product_attributes`
- `product_variants`
- `inventory_transactions`
- `carts`
- `cart_items`
- `coupons`
- `coupon_redemptions`
- `orders`
- `order_items`
- `payments`
- `shipments`
- `reviews`
- `posts`
- `post_categories`
- `newsletter_subscribers`
- `audit_logs`

## 7. Quy tac nghiep vu

- Gia va ton kho phai validate lai khi checkout, khong tin gia tu frontend.
- Coupon phai validate lai khi tao order.
- Mot cart item nen unique theo `product_id + variant_id`.
- Neu stock khong du, checkout phai fail voi message ro rang.
- Payment webhook phai idempotent.
- Order chi tru ton kho khi payment thanh cong hoac khi order vao trang thai duoc cau hinh.
- Email xac nhan gui sau khi order tao thanh cong/payment thanh cong tuy flow.
- Guest order phai tra ve `order_number` va email de khach tra cuu.
- Admin action quan trong nen ghi `audit_logs`.

## 8. Bao mat

- Hash password bang bcrypt/argon2.
- JWT/session token co expiry.
- RBAC cho admin APIs.
- Rate limit login, coupon validate, newsletter subscribe.
- Validate/sanitize input.
- Khong luu thong tin the thanh toan nhay cam.
- Webhook payment can verify signature.
- CORS chi cho phep domain frontend.
- API admin can require HTTPS.

## 9. SEO va tracking

Backend/CMS nen ho tro cac field:

- `meta_title`
- `meta_description`
- `og_title`
- `og_description`
- `og_image`
- `canonical_url`
- `schema_json`

E-commerce tracking nen chuan bi event:

- view_item
- add_to_cart
- begin_checkout
- purchase
- apply_coupon
- newsletter_subscribe

## 10. Acceptance Criteria theo module

### Product

- FE lay duoc danh sach san pham tu API thay cho `PRODUCTS`.
- Filter, sort, search tra ket qua dung.
- Chi tiet san pham co anh, gia, attribute, rating, related products.

### Cart

- Guest them/xoa/cap nhat san pham trong cart.
- Cart tinh subtotal/discount/shipping/total dung.
- Coupon hop le duoc ap dung, coupon sai bi tu choi.

### Checkout

- Khach tao don hang thanh cong voi cart hop le.
- He thong validate dia chi, email, stock va coupon.
- Payment thanh cong cap nhat order sang paid/processing.
- Payment fail khong tao don paid va khong tru ton kho.

### Order

- Customer xem duoc don hang cua minh.
- Guest tra cuu don bang order number va email.
- Admin cap nhat trang thai don va tracking.

### Newsletter

- Email hop le duoc luu.
- Email trung khong tao duplicate.

### Blog

- FE lay duoc featured post va danh sach latest posts tu API.
- Bai viet co slug va meta SEO.

## 11. De xuat uu tien phat trien BE

### Phase 1 - MVP e-commerce

1. Product/category APIs.
2. Search/filter/sort.
3. Cart APIs.
4. Coupon validation.
5. Checkout tao order COD/demo payment.
6. Admin CRUD product/order co ban.

### Phase 2 - Payment va customer

1. Stripe payment intent va webhook.
2. Customer account.
3. Order history.
4. Email confirmation.
5. Shipping tracking.

### Phase 3 - CMS va marketing

1. Blog CMS.
2. Newsletter integration.
3. Review system.
4. Promotion nang cao.
5. Reporting dashboard.

## 12. Mapping Frontend hien tai sang Backend

| Frontend hien tai | Backend can lam |
| --- | --- |
| `PRODUCTS` trong `js/main.js` | `GET /api/products` va database products |
| Search local tren array | `GET /api/search/products` |
| Filter local trong `shop.js` | Query API voi params category, price, rating, sort |
| Cart trong `localStorage` | Server-side cart voi cart token/session |
| Coupon hardcode `KMAC10`, `WELCOME5` | Coupon table va validation API |
| Checkout demo | Tao order + payment + email |
| Blog hardcode HTML | CMS posts API |
| Newsletter show toast | Newsletter subscribe API |
| i18n client-side | Lang-aware API va email theo ngon ngu |

## 13. Cau hoi can confirm voi Product Owner

- Website se dung backend custom hay WordPress/WooCommerce la backend chinh?
- Co bat buoc dang nhap moi checkout khong, hay guest checkout la mac dinh?
- Payment gateway uu tien: Stripe, PayPal, hay WooCommerce payment plugins?
- Thi truong chi US hay co them Viet Nam/quoc te?
- Co can tax calculation theo state cua US khong?
- Inventory co quan ly theo variant/mau/size khong?
- Blog se quan ly trong CMS nao?
- Admin dashboard dung custom hay WordPress Admin?
- Co can tich hop email marketing nhu Mailchimp/Klaviyo khong?

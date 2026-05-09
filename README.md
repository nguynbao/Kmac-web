# KMAC Tech

KMAC Tech là dự án website thương mại điện tử cho phụ kiện MacBook, laptop gaming và phụ kiện công nghệ. Repository này gồm hai phần:

- Bản HTML/CSS/JavaScript tĩnh để preview nhanh hoặc deploy lên static hosting.
- Bản WordPress/WooCommerce theme trong `wordpress-theme/kmac-tech-theme`.

## Tính năng chính

- Trang chủ giới thiệu thương hiệu, danh mục, sản phẩm bán chạy và newsletter.
- Trang shop với bộ lọc danh mục, khoảng giá, rating, sắp xếp và quick view.
- Trang chi tiết sản phẩm, sản phẩm liên quan và review demo.
- Giỏ hàng dùng `localStorage`, có mã giảm giá `KMAC10` và `WELCOME5`.
- Checkout demo với chọn phương thức giao hàng, thanh toán và xác nhận đơn hàng giả lập.
- Blog tĩnh với bài nổi bật và danh sách bài viết.
- Hỗ trợ song ngữ EN/VN bằng `data-i18n` và `localStorage`.
- Tối ưu SEO cơ bản: meta description, Open Graph, Twitter Card và JSON-LD.
- Responsive layout, skip navigation, focus state và các cải thiện accessibility cơ bản.
- Hỗ trợ ảnh WebP kèm PNG fallback.

## Cấu trúc dự án

```text
.
├── index.html                 # Trang chủ bản tĩnh
├── pages/
│   ├── shop.html              # Danh sách sản phẩm
│   ├── product.html           # Chi tiết sản phẩm
│   ├── cart.html              # Giỏ hàng
│   ├── checkout.html          # Checkout demo
│   ├── blog.html              # Blog
│   ├── 404.html               # Trang lỗi
│   └── thankyou-demo.html     # Trang cảm ơn demo
├── css/
│   ├── styles.css             # Design system và layout chính
│   └── pages.css              # Style theo từng trang
├── js/
│   ├── main.js                # Product data, cart, coupon, search, utilities
│   ├── i18n.js                # Bản dịch EN/VN
│   ├── shop.js                # Filter, sort, quick view
│   ├── product.js             # Render trang chi tiết sản phẩm
│   ├── cart.js                # Render giỏ hàng
│   └── checkout.js            # Checkout demo
├── assets/                    # Ảnh sản phẩm và hero
├── wordpress-theme/
│   └── kmac-tech-theme/       # WordPress/WooCommerce theme chính
├── wp-theme/                  # Bản theme/phần import WooCommerce cũ hoặc phụ trợ
│   └── products-import.csv    # CSV mẫu để import sản phẩm WooCommerce
├── kmac-tech-theme.zip        # Gói theme đã nén
└── start-server.bat           # Script chạy server local trên Windows
```

## Chạy bản HTML tĩnh

Cách nhanh nhất là mở trực tiếp `index.html` trong trình duyệt. Tuy nhiên, nên chạy local server để tránh lỗi đường dẫn hoặc chính sách trình duyệt.

### macOS/Linux

```bash
python3 -m http.server 3000
```

Sau đó mở:

```text
http://localhost:3000
```

### Windows

Chạy file:

```text
start-server.bat
```

Server mặc định chạy tại:

```text
http://localhost:3000
```

## Dữ liệu sản phẩm bản tĩnh

Dữ liệu sản phẩm demo nằm trong biến `PRODUCTS` tại:

```text
js/main.js
```

Khi thêm hoặc sửa sản phẩm, cần cập nhật các trường chính:

- `id`: ID duy nhất.
- `name`: tên sản phẩm.
- `price`, `oldPrice`: giá hiện tại và giá cũ nếu có.
- `img`: đường dẫn ảnh không có phần mở rộng, ví dụ `assets/product-keyboard`.
- `category`: một trong các nhóm đang dùng như `cases`, `sleeves`, `gaming`, `chargers`.
- `badge`, `rating`, `reviews`, `colors`, `sizes`.

Ảnh nên có đủ hai định dạng:

```text
assets/product-name.webp
assets/product-name.png
```

## Giỏ hàng và checkout

Bản tĩnh không kết nối backend thanh toán thật. Giỏ hàng, coupon và trạng thái ngôn ngữ được lưu trong trình duyệt bằng `localStorage`.

Các key chính:

- `kmac_cart`: danh sách sản phẩm trong giỏ.
- `kmac_coupon`: mã giảm giá đang áp dụng.
- `kmac_lang`: ngôn ngữ hiện tại.

Coupon demo:

- `KMAC10`: giảm 10%.
- `WELCOME5`: giảm 5 USD.

## Song ngữ EN/VN

Hệ thống dịch nằm trong:

```text
js/i18n.js
```

HTML dùng thuộc tính `data-i18n`, ví dụ:

```html
<a href="shop.html" data-i18n="nav.shop">Shop</a>
```

Khi thêm text mới cần:

1. Thêm key vào cả hai object `en` và `vn` trong `js/i18n.js`.
2. Gắn `data-i18n="key"` vào phần tử HTML.

## WordPress/WooCommerce theme

Theme chính nằm tại:

```text
wordpress-theme/kmac-tech-theme
```

Thông tin theme:

- Text domain: `kmac-tech`
- Yêu cầu WordPress: 6.4+
- Tested up to: 6.7
- Yêu cầu PHP: 8.2+
- WooCommerce ready

Các file quan trọng:

- `style.css`: header metadata của theme.
- `functions.php`: setup theme, enqueue asset, tối ưu WooCommerce/WP, bảo mật, song ngữ server-side.
- `front-page.php`, `page.php`, `single.php`, `archive.php`, `404.php`: template chính.
- `css/kmac-design-system.css`, `css/pages.css`: CSS cho theme.
- `template-parts/`: component dùng lại.
- `woocommerce/`: override template WooCommerce.

### Cài theme WordPress

1. Copy thư mục `wordpress-theme/kmac-tech-theme` vào `wp-content/themes/`.
2. Vào WordPress Admin > Appearance > Themes.
3. Activate `KMAC Tech Theme`.
4. Cài và kích hoạt WooCommerce nếu cần chức năng shop thật.
5. Import sản phẩm từ `wp-theme/products-import.csv` nếu muốn dùng dữ liệu mẫu.

## Ghi chú triển khai

- Bản HTML tĩnh phù hợp để demo UI, kiểm thử flow và deploy lên static hosting.
- Checkout tĩnh chỉ là mô phỏng, không xử lý thanh toán hoặc lưu đơn thật.
- Với production e-commerce, nên dùng bản WordPress/WooCommerce hoặc kết nối backend thanh toán riêng.
- Các URL SEO hiện đang dùng domain mẫu `https://kmactech.com`; cần đổi nếu deploy lên domain khác.
- Không nên chỉnh style WordPress trực tiếp trong `wordpress-theme/kmac-tech-theme/style.css`; file này chỉ chứa theme header. Style nên nằm trong `css/kmac-design-system.css` và `css/pages.css`.

## Kiểm tra nhanh sau khi sửa

- Mở `index.html`, `pages/shop.html`, `pages/product.html?id=1`, `pages/cart.html`, `pages/checkout.html`, `pages/blog.html`.
- Thử đổi ngôn ngữ EN/VN.
- Thêm sản phẩm vào giỏ và kiểm tra cart count.
- Áp dụng coupon `KMAC10` hoặc `WELCOME5`.
- Kiểm tra responsive trên mobile.
- Với WordPress, kiểm tra theme không lỗi khi WooCommerce chưa active và hoạt động đúng khi WooCommerce active.

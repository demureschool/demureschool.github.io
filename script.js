// ====== KONFIGURASI TOKO ======
// Ganti nomor ini dengan nomor WhatsApp toko (format: kode negara tanpa + atau 0 di depan)
const WHATSAPP_NUMBER = "6283134681596";

// Ganti dengan gambar kode QRIS asli toko kamu. Taruh file gambarnya di folder img/
// lalu sesuaikan nama filenya di bawah ini. Satu kode QR yang sama dipakai untuk semua pesanan
// (persis seperti QRIS statis yang biasa ditempel di kasir toko).
const QRIS_IMAGE = "img/qris.jpg";

// ====== KONFIGURASI SUPABASE ======
// 1. Buat project gratis di https://supabase.com
// 2. Jalankan file supabase-setup.sql (dikirim terpisah) lewat SQL Editor di project itu
// 3. Ambil Project URL & anon public key dari Settings -> API, lalu tempel di bawah ini
const SUPABASE_URL = "GANTI_DENGAN_PROJECT_URL_SUPABASE_KAMU";
const SUPABASE_ANON_KEY = "GANTI_DENGAN_ANON_PUBLIC_KEY_SUPABASE_KAMU";

const supabaseReady = !SUPABASE_URL.startsWith("GANTI_") && !SUPABASE_ANON_KEY.startsWith("GANTI_");
const supabase = supabaseReady
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

if(!supabaseReady){
  console.warn("Supabase belum dikonfigurasi — situs memakai data contoh (fallback) di script.js. Isi SUPABASE_URL dan SUPABASE_ANON_KEY untuk menyambungkan ke database sungguhan.");
}

// ====== KONFIGURASI UKURAN FOTO ======
// Atur besar-kecil foto kukis di sini (dalam pixel). Tidak perlu ubah CSS.
const IMAGE_SIZES = {
  menuCard: 145,    // foto di setiap kartu menu
  cartItem: 48,    // foto di daftar keranjang
  heroLarge: 220,  // foto besar di hero (kiri atas)
  heroMedium: 150, // foto sedang di hero (kanan bawah)
  heroSmall: 100   // foto kecil di hero (kiri bawah)
};

// ====== DATA PRODUK ======
// Ini data CADANGAN (fallback) — cuma dipakai kalau Supabase belum dikonfigurasi
// atau gagal diakses, supaya tampilan situs tidak kosong sama sekali.
// Begitu Supabase aktif, data asli produk & rating diambil dari tabel "products".
const FALLBACK_PRODUCTS = [
  {
    id: "Coffe",
    name: "Coffe Butter Crunch",
    desc: "Rasa kopi yang kuat, pekat, dan sedikit pahit-manis, cocok untuk penikmat kopi yang menyukai aroma roasted yang khas.",
    price: 10000,
    img: "img/coffe.jpg",
    avg: 4.8, count: 214
  },
  {
    id: "Matcha",
    name: "Matcha Butter Crunch",
    desc: "Perpaduan rasa teh hijau khas Jepang yang kaya, sedikit pahit, dan wangi (earthy), berpadu manis dan gurihnya adonan kue.",
    price: 10000,
    img: "img/matcha.jpg",
    avg: 4.7, count: 158
  },
  {
    id: "Moccakies",
    name: "Moccakies Butter Crunch",
    desc: "Kombinasi sempurna antara aroma kopi mocca yang harum dengan manisnya cokelat, menciptakan rasa yang klasik dan seimbang.",
    price: 10000,
    img: "img/moccakies.jpg",
    avg: 4.6, count: 96
  },
  {
    id: "Peanut",
    name: "Peanut Butter Crunch",
    desc: "Sensasi gurih dan manis yang intens dari selai kacang (peanut butter), memberikan rasa khas yang renyah sekaligus lembut di mulut..",
    price: 10000,
    img: "img/peanut.jpg",
    avg: 4.5, count: 132
  },
  {
    id: "Red velvet",
    name: "Red Velvet Butter Crunch",
    desc: "Memiliki warna merah yang cantik dengan cita rasa cokelat tipis, gurih khas butter, dan kelezatan yang elegan.",
    price: 10000,
    img: "img/red-velvet.jpg",
    avg: 4.9, count: 271
  },
  {
    id: "Taro",
    name: "Taro Butter Crunch",
    desc: "Manis nan unik dari talas (taro) yang creamy, menghadirkan aroma wangi yang lembut serta warna ungu yang menarik perhatian.",
    price: 10000,
    img: "img/taro.jpg",
    avg: 4.6, count: 118
  }
];

const FALLBACK_REVIEWS = [
  { name: "Nadia P.", role: "Pelanggan tetap", rating: 5, quote: "Red Velvet Butter Crunch-nya juara. Sudah langganan tiap Jumat buat cemilan kantor." },
  { name: "Raka S.", role: "Pesan untuk acara kantor", rating: 5, quote: "Dipesan 100 pcs untuk gathering, semua rapi dan datang tepat waktu. Rasanya juga konsisten." },
  { name: "Bunga A.", role: "Pelanggan baru", rating: 4, quote: "Matcha Butter Crunch-nya enak, nggak terlalu manis. Bakal coba varian lain minggu depan." },
  { name: "Dimas F.", role: "Penikmat kopi", rating: 5, quote: "Coffee Butter Crunch beneran berasa kopinya, bukan cuma nama doang. Cocok banget buat teman kerja." },
  { name: "Sari W.", role: "Ibu rumah tangga", rating: 5, quote: "Taro Butter Crunch warnanya cantik, anak-anak di rumah suka banget sama rasanya yang creamy." },
  { name: "Fajar T.", role: "Pelanggan kantoran", rating: 4, quote: "Peanut Butter Crunch gurihnya pas, nggak eneg. Selalu jadi stok cemilan meja kerja." },
  { name: "Intan K.", role: "Food blogger", rating: 5, quote: "Tekstur Moccakies-nya renyah di luar, lembut di dalam. Aroma mocca-nya juga kerasa banget." },
  { name: "Yoga P.", role: "Pelanggan sejak awal buka", rating: 5, quote: "Dari dulu langganan di sini, rasanya konsisten dan pengirimannya selalu tepat waktu." }
];

// Diisi saat halaman dimuat lewat loadProducts()/loadReviews() (dari Supabase kalau aktif, atau fallback di atas)
let PRODUCTS = [];
let REVIEWS = [];

// ====== AMBIL DATA DARI SUPABASE ======
async function loadProducts(){
  if(!supabaseReady) return FALLBACK_PRODUCTS;
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, img, avg, count, desc:description")
    .order("id");
  if(error || !data || data.length === 0){
    console.error("Gagal memuat produk dari Supabase, pakai data cadangan.", error);
    return FALLBACK_PRODUCTS;
  }
  return data;
}

async function loadReviews(){
  if(!supabaseReady) return FALLBACK_REVIEWS;
  const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
  if(error || !data || data.length === 0){
    console.error("Gagal memuat ulasan dari Supabase, pakai data cadangan.", error);
    return FALLBACK_REVIEWS;
  }
  return data;
}

// Metode pembayaran untuk checkout via web.
// CATATAN: ini simulasi statis untuk keperluan belajar — nomor VA/e-wallet dibuat
// otomatis di browser, belum terhubung ke payment gateway sungguhan. QRIS pakai
// gambar kode QR asli toko (lihat QRIS_IMAGE di atas), bukan hasil generate.
const PAYMENT_TIME_LIMIT_MINUTES = 15; // batas waktu pembayaran

const PAYMENT_METHODS = [
  { id: "bca", name: "Transfer BCA", icon: "🏦", type: "transfer", numberLabel: "Nomor Virtual Account BCA", prefix: "8810" },
  { id: "bri", name: "Transfer BRI", icon: "🏦", type: "transfer", numberLabel: "Nomor Virtual Account BRI", prefix: "8820" },
  { id: "gopay", name: "GoPay", icon: "📱", type: "transfer", numberLabel: "Nomor GoPay Merchant", prefix: "0895" },
  { id: "dana", name: "DANA", icon: "💳", type: "transfer", numberLabel: "Nomor DANA Merchant", prefix: "0896" },
  { id: "qris", name: "QRIS", icon: "🔳", type: "qris" },
  { id: "cod", name: "Bayar di tempat (COD)", icon: "💵", type: "cod" }
];

// ====== STATE ======
let cart = []; // { id, qty }

// ====== HELPERS ======
function formatRupiah(num){
  return "Rp " + num.toLocaleString("id-ID");
}

function getProduct(id){
  return PRODUCTS.find(p => p.id === id);
}

function cookiePips(avg){
  // render 5 pip icons, filled according to rounded average
  const rounded = Math.round(avg);
  let html = "";
  for(let i=1; i<=5; i++){
    html += `<span class="pip ${i <= rounded ? "filled" : ""}">🍪</span>`;
  }
  return html;
}

// ====== RENDER: MENU ======
function renderMenu(){
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = PRODUCTS.map(p => {
    return `
    <article class="menu-card" data-id="${p.id}">
      <img class="cookie-img" src="${p.img}" alt="Foto ${p.name}" loading="lazy" style="width:${IMAGE_SIZES.menuCard}px; height:${IMAGE_SIZES.menuCard}px;">
      <h3>${p.name}</h3>
      <p class="desc">${p.desc}</p>
      <div class="rating-row">
        <div class="rating-cookies">${cookiePips(p.avg)}</div>
        <span>${p.avg.toFixed(1)} (${p.count})</span>
      </div>
      <div class="rate-widget" data-id="${p.id}">
        ${[1,2,3,4,5].map(n => `<button type="button" data-value="${n}" aria-label="Beri rating ${n} dari 5">🍪</button>`).join("")}
      </div>
      <div class="price-row">
        <span class="price">${formatRupiah(p.price)}</span>
      </div>
      <div class="qty-row">
        <div class="qty-stepper">
          <button type="button" class="qty-minus" aria-label="Kurangi jumlah yang akan ditambahkan">−</button>
          <span class="qty-display">1</span>
          <button type="button" class="qty-plus" aria-label="Tambah jumlah yang akan ditambahkan">+</button>
        </div>
        <button type="button" class="add-btn">Tambah</button>
      </div>
    </article>`;
  }).join("");

  // "pending" = berapa pcs yang akan dimasukkan ke keranjang saat tombol Tambah ditekan
  grid.querySelectorAll(".menu-card").forEach(card => {
    let pending = 1;
    const display = card.querySelector(".qty-display");

    card.querySelector(".qty-plus").addEventListener("click", () => {
      pending += 1;
      display.textContent = pending;
    });
    card.querySelector(".qty-minus").addEventListener("click", () => {
      pending = Math.max(1, pending - 1);
      display.textContent = pending;
    });
    card.querySelector(".add-btn").addEventListener("click", () => {
      addToCart(card.dataset.id, pending);
      pending = 1;
      display.textContent = pending;
    });

    // rating widget
    const rateWidget = card.querySelector(".rate-widget");
    rateWidget.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        if(rateWidget.classList.contains("rated")) return;
        const value = Number(btn.dataset.value);
        rateProduct(card.dataset.id, value);
        rateWidget.classList.add("rated");
        showToast("Terima kasih atas rating kamu!");
      });
    });
  });
}

async function rateProduct(id, value){
  const p = getProduct(id);
  if(!p) return;

  if(supabaseReady){
    const { error } = await supabase.rpc("rate_product", { p_id: id, p_rating: value });
    if(error){
      console.error("Gagal mengirim rating ke Supabase.", error);
      showToast("Gagal mengirim rating, coba lagi nanti");
      return;
    }
    const { data } = await supabase.from("products").select("avg,count").eq("id", id).single();
    if(data){ p.avg = data.avg; p.count = data.count; }
  } else {
    // mode fallback: dihitung di memori browser saja, tidak permanen
    p.avg = ((p.avg * p.count) + value) / (p.count + 1);
    p.count += 1;
  }
  renderMenu();
}

// ====== RENDER: REVIEWS (marquee berjalan otomatis) ======
function renderReviews(){
  const track = document.getElementById("reviewsGrid");
  const cardHtml = REVIEWS.map(r => `
    <div class="review-card">
      <div class="rating-cookies">${cookiePips(r.rating)}</div>
      <p class="quote">“${r.quote}”</p>
      <p class="name">${r.name}</p>
      <p class="role">${r.role}</p>
    </div>
  `).join("");

  // konten digandakan 2x supaya animasi geser bisa loop mulus tanpa terlihat "patah"
  track.innerHTML = cardHtml + cardHtml;

  // makin banyak ulasan, makin lama durasinya, supaya kecepatan geser tetap terasa sama
  const duration = REVIEWS.length * 5;
  track.style.animationDuration = `${duration}s`;
  track.style.animationIterationCount = "infinite";
}

// ====== CART ======
function addToCart(id, qty){
  const existing = cart.find(c => c.id === id);
  if(existing){ existing.qty += qty; }
  else{ cart.push({ id, qty }); }
  renderMenu();
  renderCart();
  showToast(`${getProduct(id).name} ditambahkan ke keranjang`);
}

function changeCartQty(id, delta){
  const item = cart.find(c => c.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){ cart = cart.filter(c => c.id !== id); }
  renderCart();
  renderMenu();
}

function removeFromCart(id){
  cart = cart.filter(c => c.id !== id);
  renderCart();
  renderMenu();
}

function cartTotal(){
  return cart.reduce((sum, c) => sum + getProduct(c.id).price * c.qty, 0);
}

function renderCart(){
  const container = document.getElementById("cartItems");
  const emptyMsg = document.getElementById("cartEmptyMsg");
  const totalEl = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const webCheckoutBtn = document.getElementById("webCheckoutBtn");
  const countEl = document.getElementById("cartCount");

  const totalQty = cart.reduce((s, c) => s + c.qty, 0);
  countEl.textContent = totalQty;

  if(cart.length === 0){
    container.innerHTML = "";
    container.appendChild(emptyMsg);
    checkoutBtn.disabled = true;
    webCheckoutBtn.disabled = true;
  } else {
    checkoutBtn.disabled = false;
    webCheckoutBtn.disabled = false;
    container.innerHTML = cart.map(c => {
      const p = getProduct(c.id);
      return `
      <div class="cart-item" data-id="${p.id}">
        <img class="cookie-img" src="${p.img}" alt="Foto ${p.name}" loading="lazy" style="width:${IMAGE_SIZES.cartItem}px; height:${IMAGE_SIZES.cartItem}px;">
        <div class="cart-item-info">
          <div class="name">${p.name}</div>
          <div class="unit-price">${formatRupiah(p.price)} / pcs</div>
          <button type="button" class="cart-item-remove">Hapus</button>
        </div>
        <div class="qty-stepper">
          <button type="button" class="cart-minus" aria-label="Kurangi">−</button>
          <span>${c.qty}</span>
          <button type="button" class="cart-plus" aria-label="Tambah">+</button>
        </div>
      </div>`;
    }).join("");

    container.querySelectorAll(".cart-item").forEach(row => {
      const id = row.dataset.id;
      row.querySelector(".cart-plus").addEventListener("click", () => changeCartQty(id, 1));
      row.querySelector(".cart-minus").addEventListener("click", () => changeCartQty(id, -1));
      row.querySelector(".cart-item-remove").addEventListener("click", () => removeFromCart(id));
    });
  }

  totalEl.textContent = formatRupiah(cartTotal());
}

// ====== CHECKOUT VIA WHATSAPP ======
function buildOrderMessage(){
  const lines = ["Halo DEMURE. Cookies, saya mau pesan:", ""];
  cart.forEach(c => {
    const p = getProduct(c.id);
    lines.push(`- ${p.name} x${c.qty} = ${formatRupiah(p.price * c.qty)}`);
  });
  lines.push("");
  lines.push(`Total: ${formatRupiah(cartTotal())}`);
  lines.push("");
  lines.push("Mohon info untuk pembayaran dan pengiriman/pengambilan. Terima kasih!");
  return lines.join("\n");
}

function checkoutViaWhatsApp(){
  if(cart.length === 0) return;
  const message = encodeURIComponent(buildOrderMessage());
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, "_blank", "noopener");
}

// ====== CHECKOUT VIA WEB (simulasi statis, belum ada payment gateway sungguhan) ======
let currentOrder = null;       // { number, method, total }
let paymentDeadline = null;    // timestamp (ms) batas akhir bayar
let paymentTimerInterval = null;

function renderPaymentMethods(){
  const grid = document.getElementById("paymentGrid");
  grid.innerHTML = PAYMENT_METHODS.map((m, i) => `
    <label class="payment-option">
      <input type="radio" name="paymentMethod" value="${m.id}" ${i === 0 ? "checked" : ""}>
      <span class="icon">${m.icon}</span>
      <span>${m.name}</span>
    </label>
  `).join("");
}

function renderCheckoutSummary(){
  const el = document.getElementById("checkoutSummary");
  const rows = cart.map(c => {
    const p = getProduct(c.id);
    return `<div class="checkout-summary-row"><span>${p.name} x${c.qty}</span><span>${formatRupiah(p.price * c.qty)}</span></div>`;
  }).join("");
  el.innerHTML = rows + `<div class="checkout-summary-total"><span>Total</span><span>${formatRupiah(cartTotal())}</span></div>`;
}

function generateOrderNumber(){
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DEMURE-${rand}`;
}

// Nomor VA / e-wallet tujuan dibuat acak per pesanan, cuma untuk simulasi.
function generateAccountNumber(prefix){
  let digits = "";
  for(let i = 0; i < 8; i++){ digits += Math.floor(Math.random() * 10); }
  return `${prefix} ${digits.slice(0,4)} ${digits.slice(4)}`;
}

function openWebCheckout(){
  if(cart.length === 0) return;
  renderCheckoutSummary();
  renderPaymentMethods();
  showCheckoutView("checkoutFormView");
  document.getElementById("checkoutForm").reset();
  const modal = document.getElementById("webCheckoutModal");
  modal.hidden = false;
  // allow the browser to register the element before animating in
  requestAnimationFrame(() => {
    modal.classList.add("open");
    document.getElementById("webCheckoutOverlay").classList.add("active");
  });
}

function closeWebCheckout(){
  stopPaymentTimer();
  const modal = document.getElementById("webCheckoutModal");
  modal.classList.remove("open");
  document.getElementById("webCheckoutOverlay").classList.remove("active");
  setTimeout(() => { modal.hidden = true; }, 200);
}

function showCheckoutView(idToShow){
  ["checkoutFormView", "checkoutPaymentView", "checkoutSuccessView"].forEach(id => {
    document.getElementById(id).hidden = (id !== idToShow);
  });
}

function handleCheckoutSubmit(event){
  event.preventDefault();
  const form = event.target;
  if(!form.reportValidity()) return;

  const selected = form.querySelector('input[name="paymentMethod"]:checked');
  const method = PAYMENT_METHODS.find(m => m.id === selected.value);
  const orderNumber = generateOrderNumber();
  currentOrder = {
    number: orderNumber,
    method,
    total: cartTotal(),
    customer: {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim()
    },
    items: cart.map(c => {
      const p = getProduct(c.id);
      return { id: p.id, name: p.name, qty: c.qty, price: p.price };
    })
  };

  if(method.type === "cod"){
    // COD dibayar langsung saat kukis diterima, tidak perlu proses pembayaran online
    finishOrder(`Siapkan uang pas ${formatRupiah(currentOrder.total)} saat kukis diantar/diambil.`, "menunggu pembayaran (COD)");
    return;
  }

  renderPaymentView(method, orderNumber, currentOrder.total);
  showCheckoutView("checkoutPaymentView");
  startPaymentTimer(PAYMENT_TIME_LIMIT_MINUTES);
}

function renderPaymentView(method, orderNumber, total){
  document.getElementById("paymentMethodTitle").textContent = `Bayar dengan ${method.name}`;
  document.getElementById("paymentOrderNumber").textContent = orderNumber;
  document.getElementById("paymentExpiredNote").hidden = true;

  const panel = document.getElementById("paymentPanel");

  if(method.type === "qris"){
    // QRIS statis: satu gambar kode QR asli toko dipakai untuk semua pesanan
    panel.innerHTML = `
      <div class="qris-box">
        <img class="qris-img" src="${QRIS_IMAGE}" alt="Kode QRIS pembayaran DEMURE. Cookies">
        <p class="qris-amount">${formatRupiah(total)}</p>
        <p class="qris-hint">Pindai dengan aplikasi e-wallet/mobile banking, lalu klik tombol di bawah setelah pembayaran berhasil.</p>
      </div>
      <button type="button" class="btn btn-primary btn-block" id="markPaidBtn">Saya sudah bayar</button>`;

    document.getElementById("markPaidBtn").addEventListener("click", () => {
      if(!paymentExpired()) completePayment();
    });
  } else {
    const vaNumber = generateAccountNumber(method.prefix);
    panel.innerHTML = `
      <div class="va-box">
        <div class="va-row"><span>${method.numberLabel}</span></div>
        <div class="va-number-row">
          <strong id="vaNumber">${vaNumber}</strong>
          <button type="button" class="copy-btn" id="copyVaBtn">Salin</button>
        </div>
        <div class="va-row"><span>Jumlah transfer</span><strong>${formatRupiah(total)}</strong></div>
        <p class="va-note">Transfer tepat sesuai jumlah di atas, lalu klik tombol di bawah.</p>
      </div>
      <button type="button" class="btn btn-primary btn-block" id="markPaidBtn">Saya sudah bayar</button>`;

    document.getElementById("copyVaBtn").addEventListener("click", () => {
      navigator.clipboard?.writeText(vaNumber.replace(/\s/g, ""));
      showToast("Nomor disalin");
    });
    document.getElementById("markPaidBtn").addEventListener("click", () => {
      if(!paymentExpired()) completePayment();
    });
  }
}

function startPaymentTimer(minutes){
  stopPaymentTimer();
  paymentDeadline = Date.now() + minutes * 60 * 1000;
  updatePaymentTimerDisplay();
  paymentTimerInterval = setInterval(updatePaymentTimerDisplay, 1000);
}

function stopPaymentTimer(){
  if(paymentTimerInterval){ clearInterval(paymentTimerInterval); paymentTimerInterval = null; }
}

function paymentExpired(){
  return paymentDeadline !== null && Date.now() >= paymentDeadline;
}

function updatePaymentTimerDisplay(){
  const timerEl = document.getElementById("paymentTimer");
  const remaining = paymentDeadline - Date.now();

  if(remaining <= 0){
    stopPaymentTimer();
    timerEl.textContent = "00:00";
    onPaymentExpired();
    return;
  }

  const totalSeconds = Math.ceil(remaining / 1000);
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  timerEl.textContent = `${mm}:${ss}`;
}

function onPaymentExpired(){
  document.getElementById("paymentExpiredNote").hidden = false;
  const panel = document.getElementById("paymentPanel");
  panel.querySelectorAll("button, [role='button']").forEach(el => {
    el.setAttribute("aria-disabled", "true");
    el.style.pointerEvents = "none";
    el.style.opacity = "0.5";
  });
}

function completePayment(){
  stopPaymentTimer();
  const method = currentOrder.method;
  finishOrder(`${method.icon} Dibayar via ${method.name}. Pembayaran terverifikasi.`, "lunas");
}

function finishOrder(instructionText, paymentStatus){
  document.getElementById("orderNumber").textContent = currentOrder.number;
  document.getElementById("orderTotal").textContent = formatRupiah(currentOrder.total);
  document.getElementById("paymentInstructions").innerHTML = instructionText;

  showCheckoutView("checkoutSuccessView");
  saveOrderToDatabase(paymentStatus);

  // pesanan selesai: kosongkan keranjang
  cart = [];
  renderCart();
  renderMenu();
}

// Simpan pesanan ke tabel "orders" di Supabase. Kalau Supabase belum
// dikonfigurasi, pesanan cuma tampil di layar sukses dan tidak tersimpan permanen.
async function saveOrderToDatabase(paymentStatus){
  if(!supabaseReady) return;
  const { error } = await supabase.from("orders").insert({
    order_number: currentOrder.number,
    customer_name: currentOrder.customer.name,
    customer_phone: currentOrder.customer.phone,
    customer_address: currentOrder.customer.address,
    items: currentOrder.items,
    total: currentOrder.total,
    payment_method: currentOrder.method.name,
    status: paymentStatus
  });
  if(error) console.error("Gagal menyimpan pesanan ke Supabase.", error);
}

// ====== FORM: TULIS ULASAN ======
let reviewFormRating = 5;

function setupReviewForm(){
  const ratingBox = document.getElementById("reviewFormRating");
  if(!ratingBox) return;
  const buttons = [...ratingBox.querySelectorAll("button")];

  function updateButtons(){
    buttons.forEach(btn => {
      btn.classList.toggle("active", Number(btn.dataset.value) <= reviewFormRating);
    });
  }
  updateButtons();

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      reviewFormRating = Number(btn.dataset.value);
      updateButtons();
    });
  });

  document.getElementById("reviewForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    if(!form.reportValidity()) return;

    const newReview = {
      name: form.name.value.trim(),
      role: "Pelanggan",
      rating: reviewFormRating,
      quote: form.quote.value.trim()
    };

    if(supabaseReady){
      const { error } = await supabase.from("reviews").insert(newReview);
      if(error){
        console.error("Gagal mengirim ulasan ke Supabase.", error);
        showToast("Gagal mengirim ulasan, coba lagi nanti");
        return;
      }
    }

    // tampilkan langsung di marquee tanpa perlu reload
    REVIEWS.unshift(newReview);
    renderReviews();

    form.reset();
    reviewFormRating = 5;
    updateButtons();
    showToast("Terima kasih atas ulasanmu!");
  });
}

// ====== TOAST ======
let toastTimer = null;
function showToast(text){
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ====== CART DRAWER OPEN/CLOSE ======
function openCart(){
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("active");
}
function closeCart(){
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("active");
}

// ====== MOBILE NAV ======
function toggleNav(){
  document.getElementById("mainNav").classList.toggle("open");
}

// ====== UKURAN FOTO HERO ======
function applyHeroImageSizes(){
  const large = document.querySelector(".hero-visual .ck-lg");
  const medium = document.querySelector(".hero-visual .ck-md");
  const small = document.querySelector(".hero-visual .ck-sm");
  if(large){ large.style.width = IMAGE_SIZES.heroLarge + "px"; large.style.height = IMAGE_SIZES.heroLarge + "px"; }
  if(medium){ medium.style.width = IMAGE_SIZES.heroMedium + "px"; medium.style.height = IMAGE_SIZES.heroMedium + "px"; }
  if(small){ small.style.width = IMAGE_SIZES.heroSmall + "px"; small.style.height = IMAGE_SIZES.heroSmall + "px"; }
}

// ====== INIT ======
document.addEventListener("DOMContentLoaded", async () => {
  PRODUCTS = await loadProducts();
  REVIEWS = await loadReviews();

  renderMenu();
  renderReviews();
  renderCart();
  applyHeroImageSizes();
  setupReviewForm();

  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);
  document.getElementById("checkoutBtn").addEventListener("click", checkoutViaWhatsApp);
  document.getElementById("menuToggle").addEventListener("click", toggleNav);

  document.getElementById("webCheckoutBtn").addEventListener("click", () => {
    closeCart();
    openWebCheckout();
  });
  document.getElementById("webCheckoutClose").addEventListener("click", closeWebCheckout);
  document.getElementById("webCheckoutOverlay").addEventListener("click", closeWebCheckout);
  document.getElementById("checkoutForm").addEventListener("submit", handleCheckoutSubmit);
  document.getElementById("checkoutDoneBtn").addEventListener("click", closeWebCheckout);
  document.getElementById("paymentBackBtn").addEventListener("click", () => {
    stopPaymentTimer();
    showCheckoutView("checkoutFormView");
  });

  document.querySelectorAll(".main-nav a").forEach(link => {
    link.addEventListener("click", () => document.getElementById("mainNav").classList.remove("open"));
  });

  const waLocationBtn = document.getElementById("waLocationBtn");
  waLocationBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Halo DEMURE. Cookies, saya mau tanya-tanya soal pesanan.")}`;

  const waFooterBtn = document.getElementById("waFooterBtn");
  waFooterBtn.href = `https://wa.me/${WHATSAPP_NUMBER}`;
});// ====== KONFIGURASI TOKO ======
// Ganti nomor ini dengan nomor WhatsApp toko (format: kode negara tanpa + atau 0 di depan)
const WHATSAPP_NUMBER = "6283134681596";

// Ganti dengan gambar kode QRIS asli toko kamu. Taruh file gambarnya di folder img/
// lalu sesuaikan nama filenya di bawah ini. Satu kode QR yang sama dipakai untuk semua pesanan
// (persis seperti QRIS statis yang biasa ditempel di kasir toko).
const QRIS_IMAGE = "img/qris.jpg";

// ====== KONFIGURASI UKURAN FOTO ======
// Atur besar-kecil foto kukis di sini (dalam pixel). Tidak perlu ubah CSS.
const IMAGE_SIZES = {
  menuCard: 145,    // foto di setiap kartu menu
  cartItem: 48,    // foto di daftar keranjang
  heroLarge: 220,  // foto besar di hero (kiri atas)
  heroMedium: 150, // foto sedang di hero (kanan bawah)
  heroSmall: 100   // foto kecil di hero (kiri bawah)
};

// ====== DATA PRODUK ======
// avg & count = data rating awal (seed). Rating baru dari pengunjung akan
// dihitung ulang di memori browser (tidak tersimpan permanen setelah reload).
// Untuk toko sungguhan, ganti nilai "img" dengan URL foto produk kamu sendiri.
const PRODUCTS = [
  {
    id: "Coffe",
    name: "Coffe Butter Crunch",
    desc: "Rasa kopi yang kuat, pekat, dan sedikit pahit-manis, cocok untuk penikmat kopi yang menyukai aroma roasted yang khas.",
    price: 10000,
    img: "img/coffe.jpg",
    avg: 4.8, count: 214
  },
  {
    id: "Matcha",
    name: "Matcha Butter Crunch",
    desc: "Perpaduan rasa teh hijau khas Jepang yang kaya, sedikit pahit, dan wangi (earthy), berpadu manis dan gurihnya adonan kue.",
    price: 10000,
    img: "img/matcha.jpg",
    avg: 4.7, count: 158
  },
  {
    id: "Moccakies",
    name: "Moccakies Butter Crunch",
    desc: "Kombinasi sempurna antara aroma kopi mocca yang harum dengan manisnya cokelat, menciptakan rasa yang klasik dan seimbang.",
    price: 10000,
    img: "img/moccakies.jpg",
    avg: 4.6, count: 96
  },
  {
    id: "Peanut",
    name: "Peanut Butter Crunch",
    desc: "Sensasi gurih dan manis yang intens dari selai kacang (peanut butter), memberikan rasa khas yang renyah sekaligus lembut di mulut..",
    price: 10000,
    img: "img/peanut.jpg",
    avg: 4.5, count: 132
  },
  {
    id: "Red velvet",
    name: "Red Velvet Butter Crunch",
    desc: "Memiliki warna merah yang cantik dengan cita rasa cokelat tipis, gurih khas butter, dan kelezatan yang elegan.",
    price: 10000,
    img: "img/red-velvet.jpg",
    avg: 4.9, count: 271
  },
  {
    id: "Taro",
    name: "Taro Butter Crunch",
    desc: "Manis nan unik dari talas (taro) yang creamy, menghadirkan aroma wangi yang lembut serta warna ungu yang menarik perhatian.",
    price: 10000,
    img: "img/taro.jpg",
    avg: 4.6, count: 118
  }
];

const REVIEWS = [
  { name: "Nadia P.", role: "Pelanggan tetap", rating: 5, quote: "Red Velvet Butter Crunch-nya juara. Sudah langganan tiap Jumat buat cemilan kantor." },
  { name: "Raka S.", role: "Pesan untuk acara kantor", rating: 5, quote: "Dipesan 100 pcs untuk gathering, semua rapi dan datang tepat waktu. Rasanya juga konsisten." },
  { name: "Bunga A.", role: "Pelanggan baru", rating: 4, quote: "Matcha Butter Crunch-nya enak, nggak terlalu manis. Bakal coba varian lain minggu depan." },
  { name: "Dimas F.", role: "Penikmat kopi", rating: 5, quote: "Coffee Butter Crunch beneran berasa kopinya, bukan cuma nama doang. Cocok banget buat teman kerja." },
  { name: "Sari W.", role: "Ibu rumah tangga", rating: 5, quote: "Taro Butter Crunch warnanya cantik, anak-anak di rumah suka banget sama rasanya yang creamy." },
  { name: "Fajar T.", role: "Pelanggan kantoran", rating: 4, quote: "Peanut Butter Crunch gurihnya pas, nggak eneg. Selalu jadi stok cemilan meja kerja." },
  { name: "Intan K.", role: "Food blogger", rating: 5, quote: "Tekstur Moccakies-nya renyah di luar, lembut di dalam. Aroma mocca-nya juga kerasa banget." },
  { name: "Yoga P.", role: "Pelanggan sejak awal buka", rating: 5, quote: "Dari dulu langganan di sini, rasanya konsisten dan pengirimannya selalu tepat waktu." }
];

// Metode pembayaran untuk checkout via web.
// CATATAN: ini simulasi statis untuk keperluan belajar — nomor VA/e-wallet dibuat
// otomatis di browser, belum terhubung ke payment gateway sungguhan. QRIS pakai
// gambar kode QR asli toko (lihat QRIS_IMAGE di atas), bukan hasil generate.
const PAYMENT_TIME_LIMIT_MINUTES = 15; // batas waktu pembayaran

const PAYMENT_METHODS = [
  { id: "bca", name: "Transfer BCA", icon: "🏦", type: "transfer", numberLabel: "Nomor Virtual Account BCA", prefix: "8810" },
  { id: "bri", name: "Transfer BRI", icon: "🏦", type: "transfer", numberLabel: "Nomor Virtual Account BRI", prefix: "8820" },
  { id: "gopay", name: "GoPay", icon: "📱", type: "transfer", numberLabel: "Nomor GoPay Merchant", prefix: "0895" },
  { id: "dana", name: "DANA", icon: "💳", type: "transfer", numberLabel: "Nomor DANA Merchant", prefix: "0896" },
  { id: "qris", name: "QRIS", icon: "🔳", type: "qris" },
  { id: "cod", name: "Bayar di tempat (COD)", icon: "💵", type: "cod" }
];

// ====== STATE ======
let cart = []; // { id, qty }

// ====== HELPERS ======
function formatRupiah(num){
  return "Rp " + num.toLocaleString("id-ID");
}

function getProduct(id){
  return PRODUCTS.find(p => p.id === id);
}

function cookiePips(avg){
  // render 5 pip icons, filled according to rounded average
  const rounded = Math.round(avg);
  let html = "";
  for(let i=1; i<=5; i++){
    html += `<span class="pip ${i <= rounded ? "filled" : ""}">🍪</span>`;
  }
  return html;
}

// ====== RENDER: MENU ======
function renderMenu(){
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = PRODUCTS.map(p => {
    return `
    <article class="menu-card" data-id="${p.id}">
      <img class="cookie-img" src="${p.img}" alt="Foto ${p.name}" loading="lazy" style="width:${IMAGE_SIZES.menuCard}px; height:${IMAGE_SIZES.menuCard}px;">
      <h3>${p.name}</h3>
      <p class="desc">${p.desc}</p>
      <div class="rating-row">
        <div class="rating-cookies">${cookiePips(p.avg)}</div>
        <span>${p.avg.toFixed(1)} (${p.count})</span>
      </div>
      <div class="rate-widget" data-id="${p.id}">
        ${[1,2,3,4,5].map(n => `<button type="button" data-value="${n}" aria-label="Beri rating ${n} dari 5">🍪</button>`).join("")}
      </div>
      <div class="price-row">
        <span class="price">${formatRupiah(p.price)}</span>
      </div>
      <div class="qty-row">
        <div class="qty-stepper">
          <button type="button" class="qty-minus" aria-label="Kurangi jumlah yang akan ditambahkan">−</button>
          <span class="qty-display">1</span>
          <button type="button" class="qty-plus" aria-label="Tambah jumlah yang akan ditambahkan">+</button>
        </div>
        <button type="button" class="add-btn">Tambah</button>
      </div>
    </article>`;
  }).join("");

  // "pending" = berapa pcs yang akan dimasukkan ke keranjang saat tombol Tambah ditekan
  grid.querySelectorAll(".menu-card").forEach(card => {
    let pending = 1;
    const display = card.querySelector(".qty-display");

    card.querySelector(".qty-plus").addEventListener("click", () => {
      pending += 1;
      display.textContent = pending;
    });
    card.querySelector(".qty-minus").addEventListener("click", () => {
      pending = Math.max(1, pending - 1);
      display.textContent = pending;
    });
    card.querySelector(".add-btn").addEventListener("click", () => {
      addToCart(card.dataset.id, pending);
      pending = 1;
      display.textContent = pending;
    });

    // rating widget
    const rateWidget = card.querySelector(".rate-widget");
    rateWidget.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        if(rateWidget.classList.contains("rated")) return;
        const value = Number(btn.dataset.value);
        rateProduct(card.dataset.id, value);
        rateWidget.classList.add("rated");
        showToast("Terima kasih atas rating kamu!");
      });
    });
  });
}

function rateProduct(id, value){
  const p = getProduct(id);
  if(!p) return;
  p.avg = ((p.avg * p.count) + value) / (p.count + 1);
  p.count += 1;
  renderMenu();
}

// ====== RENDER: REVIEWS (marquee berjalan otomatis) ======
function renderReviews(){
  const track = document.getElementById("reviewsGrid");
  const cardHtml = REVIEWS.map(r => `
    <div class="review-card">
      <div class="rating-cookies">${cookiePips(r.rating)}</div>
      <p class="quote">“${r.quote}”</p>
      <p class="name">${r.name}</p>
      <p class="role">${r.role}</p>
    </div>
  `).join("");

  // konten digandakan 2x supaya animasi geser bisa loop mulus tanpa terlihat "patah"
  track.innerHTML = cardHtml + cardHtml;

  // makin banyak ulasan, makin lama durasinya, supaya kecepatan geser tetap terasa sama
  const duration = REVIEWS.length * 5;
  track.style.animationDuration = `${duration}s`;
  track.style.animationIterationCount = "infinite";
}

// ====== CART ======
function addToCart(id, qty){
  const existing = cart.find(c => c.id === id);
  if(existing){ existing.qty += qty; }
  else{ cart.push({ id, qty }); }
  renderMenu();
  renderCart();
  showToast(`${getProduct(id).name} ditambahkan ke keranjang`);
}

function changeCartQty(id, delta){
  const item = cart.find(c => c.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){ cart = cart.filter(c => c.id !== id); }
  renderCart();
  renderMenu();
}

function removeFromCart(id){
  cart = cart.filter(c => c.id !== id);
  renderCart();
  renderMenu();
}

function cartTotal(){
  return cart.reduce((sum, c) => sum + getProduct(c.id).price * c.qty, 0);
}

function renderCart(){
  const container = document.getElementById("cartItems");
  const emptyMsg = document.getElementById("cartEmptyMsg");
  const totalEl = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const webCheckoutBtn = document.getElementById("webCheckoutBtn");
  const countEl = document.getElementById("cartCount");

  const totalQty = cart.reduce((s, c) => s + c.qty, 0);
  countEl.textContent = totalQty;

  if(cart.length === 0){
    container.innerHTML = "";
    container.appendChild(emptyMsg);
    checkoutBtn.disabled = true;
    webCheckoutBtn.disabled = true;
  } else {
    checkoutBtn.disabled = false;
    webCheckoutBtn.disabled = false;
    container.innerHTML = cart.map(c => {
      const p = getProduct(c.id);
      return `
      <div class="cart-item" data-id="${p.id}">
        <img class="cookie-img" src="${p.img}" alt="Foto ${p.name}" loading="lazy" style="width:${IMAGE_SIZES.cartItem}px; height:${IMAGE_SIZES.cartItem}px;">
        <div class="cart-item-info">
          <div class="name">${p.name}</div>
          <div class="unit-price">${formatRupiah(p.price)} / pcs</div>
          <button type="button" class="cart-item-remove">Hapus</button>
        </div>
        <div class="qty-stepper">
          <button type="button" class="cart-minus" aria-label="Kurangi">−</button>
          <span>${c.qty}</span>
          <button type="button" class="cart-plus" aria-label="Tambah">+</button>
        </div>
      </div>`;
    }).join("");

    container.querySelectorAll(".cart-item").forEach(row => {
      const id = row.dataset.id;
      row.querySelector(".cart-plus").addEventListener("click", () => changeCartQty(id, 1));
      row.querySelector(".cart-minus").addEventListener("click", () => changeCartQty(id, -1));
      row.querySelector(".cart-item-remove").addEventListener("click", () => removeFromCart(id));
    });
  }

  totalEl.textContent = formatRupiah(cartTotal());
}

// ====== CHECKOUT VIA WHATSAPP ======
function buildOrderMessage(){
  const lines = ["Halo DEMURE. Cookies, saya mau pesan:", ""];
  cart.forEach(c => {
    const p = getProduct(c.id);
    lines.push(`- ${p.name} x${c.qty} = ${formatRupiah(p.price * c.qty)}`);
  });
  lines.push("");
  lines.push(`Total: ${formatRupiah(cartTotal())}`);
  lines.push("");
  lines.push("Mohon info untuk pembayaran dan pengiriman/pengambilan. Terima kasih!");
  return lines.join("\n");
}

function checkoutViaWhatsApp(){
  if(cart.length === 0) return;
  const message = encodeURIComponent(buildOrderMessage());
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, "_blank", "noopener");
}

// ====== CHECKOUT VIA WEB (simulasi statis, belum ada payment gateway sungguhan) ======
let currentOrder = null;       // { number, method, total }
let paymentDeadline = null;    // timestamp (ms) batas akhir bayar
let paymentTimerInterval = null;

function renderPaymentMethods(){
  const grid = document.getElementById("paymentGrid");
  grid.innerHTML = PAYMENT_METHODS.map((m, i) => `
    <label class="payment-option">
      <input type="radio" name="paymentMethod" value="${m.id}" ${i === 0 ? "checked" : ""}>
      <span class="icon">${m.icon}</span>
      <span>${m.name}</span>
    </label>
  `).join("");
}

function renderCheckoutSummary(){
  const el = document.getElementById("checkoutSummary");
  const rows = cart.map(c => {
    const p = getProduct(c.id);
    return `<div class="checkout-summary-row"><span>${p.name} x${c.qty}</span><span>${formatRupiah(p.price * c.qty)}</span></div>`;
  }).join("");
  el.innerHTML = rows + `<div class="checkout-summary-total"><span>Total</span><span>${formatRupiah(cartTotal())}</span></div>`;
}

function generateOrderNumber(){
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DEMURE-${rand}`;
}

// Nomor VA / e-wallet tujuan dibuat acak per pesanan, cuma untuk simulasi.
function generateAccountNumber(prefix){
  let digits = "";
  for(let i = 0; i < 8; i++){ digits += Math.floor(Math.random() * 10); }
  return `${prefix} ${digits.slice(0,4)} ${digits.slice(4)}`;
}

function openWebCheckout(){
  if(cart.length === 0) return;
  renderCheckoutSummary();
  renderPaymentMethods();
  showCheckoutView("checkoutFormView");
  document.getElementById("checkoutForm").reset();
  const modal = document.getElementById("webCheckoutModal");
  modal.hidden = false;
  // allow the browser to register the element before animating in
  requestAnimationFrame(() => {
    modal.classList.add("open");
    document.getElementById("webCheckoutOverlay").classList.add("active");
  });
}

function closeWebCheckout(){
  stopPaymentTimer();
  const modal = document.getElementById("webCheckoutModal");
  modal.classList.remove("open");
  document.getElementById("webCheckoutOverlay").classList.remove("active");
  setTimeout(() => { modal.hidden = true; }, 200);
}

function showCheckoutView(idToShow){
  ["checkoutFormView", "checkoutPaymentView", "checkoutSuccessView"].forEach(id => {
    document.getElementById(id).hidden = (id !== idToShow);
  });
}

function handleCheckoutSubmit(event){
  event.preventDefault();
  const form = event.target;
  if(!form.reportValidity()) return;

  const selected = form.querySelector('input[name="paymentMethod"]:checked');
  const method = PAYMENT_METHODS.find(m => m.id === selected.value);
  const orderNumber = generateOrderNumber();
  currentOrder = { number: orderNumber, method, total: cartTotal() };

  if(method.type === "cod"){
    // COD dibayar langsung saat kukis diterima, tidak perlu proses pembayaran online
    finishOrder(`Siapkan uang pas ${formatRupiah(currentOrder.total)} saat kukis diantar/diambil.`);
    return;
  }

  renderPaymentView(method, orderNumber, currentOrder.total);
  showCheckoutView("checkoutPaymentView");
  startPaymentTimer(PAYMENT_TIME_LIMIT_MINUTES);
}

function renderPaymentView(method, orderNumber, total){
  document.getElementById("paymentMethodTitle").textContent = `Bayar dengan ${method.name}`;
  document.getElementById("paymentOrderNumber").textContent = orderNumber;
  document.getElementById("paymentExpiredNote").hidden = true;

  const panel = document.getElementById("paymentPanel");

  if(method.type === "qris"){
    // QRIS statis: satu gambar kode QR asli toko dipakai untuk semua pesanan
    panel.innerHTML = `
      <div class="qris-box">
        <img class="qris-img" src="${QRIS_IMAGE}" alt="Kode QRIS pembayaran DEMURE. Cookies">
        <p class="qris-amount">${formatRupiah(total)}</p>
        <p class="qris-hint">Pindai dengan aplikasi e-wallet/mobile banking, lalu klik tombol di bawah setelah pembayaran berhasil.</p>
      </div>
      <button type="button" class="btn btn-primary btn-block" id="markPaidBtn">Saya sudah bayar</button>`;

    document.getElementById("markPaidBtn").addEventListener("click", () => {
      if(!paymentExpired()) completePayment();
    });
  } else {
    const vaNumber = generateAccountNumber(method.prefix);
    panel.innerHTML = `
      <div class="va-box">
        <div class="va-row"><span>${method.numberLabel}</span></div>
        <div class="va-number-row">
          <strong id="vaNumber">${vaNumber}</strong>
          <button type="button" class="copy-btn" id="copyVaBtn">Salin</button>
        </div>
        <div class="va-row"><span>Jumlah transfer</span><strong>${formatRupiah(total)}</strong></div>
        <p class="va-note">Transfer tepat sesuai jumlah di atas, lalu klik tombol di bawah.</p>
      </div>
      <button type="button" class="btn btn-primary btn-block" id="markPaidBtn">Saya sudah bayar</button>`;

    document.getElementById("copyVaBtn").addEventListener("click", () => {
      navigator.clipboard?.writeText(vaNumber.replace(/\s/g, ""));
      showToast("Nomor disalin");
    });
    document.getElementById("markPaidBtn").addEventListener("click", () => {
      if(!paymentExpired()) completePayment();
    });
  }
}

function startPaymentTimer(minutes){
  stopPaymentTimer();
  paymentDeadline = Date.now() + minutes * 60 * 1000;
  updatePaymentTimerDisplay();
  paymentTimerInterval = setInterval(updatePaymentTimerDisplay, 1000);
}

function stopPaymentTimer(){
  if(paymentTimerInterval){ clearInterval(paymentTimerInterval); paymentTimerInterval = null; }
}

function paymentExpired(){
  return paymentDeadline !== null && Date.now() >= paymentDeadline;
}

function updatePaymentTimerDisplay(){
  const timerEl = document.getElementById("paymentTimer");
  const remaining = paymentDeadline - Date.now();

  if(remaining <= 0){
    stopPaymentTimer();
    timerEl.textContent = "00:00";
    onPaymentExpired();
    return;
  }

  const totalSeconds = Math.ceil(remaining / 1000);
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  timerEl.textContent = `${mm}:${ss}`;
}

function onPaymentExpired(){
  document.getElementById("paymentExpiredNote").hidden = false;
  const panel = document.getElementById("paymentPanel");
  panel.querySelectorAll("button, [role='button']").forEach(el => {
    el.setAttribute("aria-disabled", "true");
    el.style.pointerEvents = "none";
    el.style.opacity = "0.5";
  });
}

function completePayment(){
  stopPaymentTimer();
  const method = currentOrder.method;
  finishOrder(`${method.icon} Dibayar via ${method.name}. Pembayaran terverifikasi.`);
}

function finishOrder(instructionText){
  document.getElementById("orderNumber").textContent = currentOrder.number;
  document.getElementById("orderTotal").textContent = formatRupiah(currentOrder.total);
  document.getElementById("paymentInstructions").innerHTML = instructionText;

  showCheckoutView("checkoutSuccessView");

  // pesanan selesai: kosongkan keranjang
  cart = [];
  renderCart();
  renderMenu();
}

// ====== TOAST ======
let toastTimer = null;
function showToast(text){
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ====== CART DRAWER OPEN/CLOSE ======
function openCart(){
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("active");
}
function closeCart(){
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("active");
}

// ====== MOBILE NAV ======
function toggleNav(){
  document.getElementById("mainNav").classList.toggle("open");
}

// ====== UKURAN FOTO HERO ======
function applyHeroImageSizes(){
  const large = document.querySelector(".hero-visual .ck-lg");
  const medium = document.querySelector(".hero-visual .ck-md");
  const small = document.querySelector(".hero-visual .ck-sm");
  if(large){ large.style.width = IMAGE_SIZES.heroLarge + "px"; large.style.height = IMAGE_SIZES.heroLarge + "px"; }
  if(medium){ medium.style.width = IMAGE_SIZES.heroMedium + "px"; medium.style.height = IMAGE_SIZES.heroMedium + "px"; }
  if(small){ small.style.width = IMAGE_SIZES.heroSmall + "px"; small.style.height = IMAGE_SIZES.heroSmall + "px"; }
}

// ====== INIT ======
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  renderReviews();
  renderCart();
  applyHeroImageSizes();

  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);
  document.getElementById("checkoutBtn").addEventListener("click", checkoutViaWhatsApp);
  document.getElementById("menuToggle").addEventListener("click", toggleNav);

  document.getElementById("webCheckoutBtn").addEventListener("click", () => {
    closeCart();
    openWebCheckout();
  });
  document.getElementById("webCheckoutClose").addEventListener("click", closeWebCheckout);
  document.getElementById("webCheckoutOverlay").addEventListener("click", closeWebCheckout);
  document.getElementById("checkoutForm").addEventListener("submit", handleCheckoutSubmit);
  document.getElementById("checkoutDoneBtn").addEventListener("click", closeWebCheckout);
  document.getElementById("paymentBackBtn").addEventListener("click", () => {
    stopPaymentTimer();
    showCheckoutView("checkoutFormView");
  });

  document.querySelectorAll(".main-nav a").forEach(link => {
    link.addEventListener("click", () => document.getElementById("mainNav").classList.remove("open"));
  });

  const waLocationBtn = document.getElementById("waLocationBtn");
  waLocationBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Halo DEMURE. Cookies, saya mau tanya-tanya soal pesanan.")}`;

  const waFooterBtn = document.getElementById("waFooterBtn");
  waFooterBtn.href = `https://wa.me/${WHATSAPP_NUMBER}`;
});

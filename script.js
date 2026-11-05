/* =========================================================
   SHOP SETTINGS — edit everything in this block.
   Prices left as null show "Price TBC" until filled in.
   ========================================================= */
const SHOP = {
  name: "Alvin Barbers",
  currency: "£",
  slotMinutes: 30, // gap between bookable times
  bookAheadDays: 14,
  studentDiscount: null, // % off for uni students, e.g. 20. null shows "TBC"
};

const SERVICES = [
  { id: "cut",        name: "Haircut",              duration: 30, price: null, description: "[Description]", popular: true },
  { id: "fade",       name: "Skin Fade",            duration: 45, price: null, description: "[Description]" },
  { id: "cut-beard",  name: "Haircut & Beard",      duration: 60, price: null, description: "[Description]" },
  { id: "beard",      name: "Beard Trim",           duration: 20, price: null, description: "[Description]" },
  { id: "shave",      name: "Hot Towel Shave",      duration: 30, price: null, description: "[Description]" },
  { id: "kids",       name: "Kids Cut (under 12)",  duration: 30, price: null, description: "[Description]" },
];

const BARBERS = ["Any barber", "[Barber 1]", "[Barber 2]"];

// Add an image path for each haircut, e.g. { title: "Mid Fade", image: "images/mid-fade.jpg" }
const GALLERY = [
  { title: "[Haircut name]", image: null },
  { title: "[Haircut name]", image: null },
  { title: "[Haircut name]", image: null },
  { title: "[Haircut name]", image: null },
  { title: "[Haircut name]", image: null },
  { title: "[Haircut name]", image: null },
];

// Google reviews. These are SAMPLE placeholders so the layout can be seen —
// replace them with real reviews copied from the shop's Google profile before going live.
const GOOGLE = {
  rating: null,      // e.g. 4.9
  reviewCount: null, // e.g. 120
  url: "#",          // link to the shop's Google reviews page
};

const REVIEWS = [
  { name: "[Customer name]", rating: 5, text: "Amazing haircut, best fade I've had in Bristol.", when: "[Date]" },
  { name: "[Customer name]", rating: 5, text: "Great service and trim. Friendly staff and in and out quickly.", when: "[Date]" },
  { name: "[Customer name]", rating: 5, text: "Really easy to book online and the cut was spot on.", when: "[Date]" },
  { name: "[Customer name]", rating: 5, text: "Brilliant beard trim and hot towel shave. Will be back.", when: "[Date]" },
  { name: "[Customer name]", rating: 5, text: "Student discount is a big help and the cut was excellent.", when: "[Date]" },
  { name: "[Customer name]", rating: 5, text: "Great atmosphere, really took their time to get it right.", when: "[Date]" },
];

// Opening hours, Sunday first. Use null for closed days. 24h "HH:MM".
const HOURS = [
  null,                                // Sunday
  { open: "09:00", close: "18:00" },   // Monday
  { open: "09:00", close: "18:00" },   // Tuesday
  { open: "09:00", close: "18:00" },   // Wednesday
  { open: "09:00", close: "20:00" },   // Thursday
  { open: "09:00", close: "20:00" },   // Friday
  { open: "08:00", close: "17:00" },   // Saturday
];

/* ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const escapeHTML = (str) => str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const formatPrice =(p) => (p == null ? null : `${SHOP.currency}${Number(p).toFixed(p % 1 ? 2 : 0)}`);
const priceHTML = (p) => (p == null ? `<span class="price tbc">Price TBC</span>` : `<span class="price">${formatPrice(p)}</span>`);

/* ----- Static content ----- */
$$("[data-shop-name]").forEach((el) => (el.textContent = SHOP.name));
document.title = SHOP.name;
$("#year").textContent = new Date().getFullYear();

$("#serviceGrid").innerHTML = SERVICES.map((s, i) => `
  <button class="service-card reveal" style="--d:${i * 0.07}s" data-service="${s.id}">
    ${s.popular ? `<span class="badge">Popular</span>` : ""}
    <div class="service-top"><h3>${s.name}</h3>${priceHTML(s.price)}</div>
    <p class="service-meta">${s.duration} min</p>
    <p class="muted">${s.description}</p>
    <span class="service-cta">Book this <i>→</i></span>
  </button>`).join("");

$("#galleryGrid").innerHTML = GALLERY.map((g, i) => g.image
  ? `<figure class="gallery-item reveal" style="--d:${(i % 3) * 0.1}s"><img src="${g.image}" alt="${g.title}" loading="lazy"><figcaption>${g.title}</figcaption></figure>`
  : `<figure class="gallery-item placeholder reveal" style="--d:${(i % 3) * 0.1}s"><span>Image coming soon</span><figcaption>${g.title}</figcaption></figure>`
).join("");

$("#ratingScore").textContent = GOOGLE.rating ?? "[Rating]";
$("#ratingCount").textContent = `Based on ${GOOGLE.reviewCount ?? "[number of]"} Google reviews`;
$("#googleReviewsLink").href = GOOGLE.url;

const reviewCard = (r) => `
  <figure class="review">
    <div class="review-stars" aria-label="${r.rating} out of 5 stars">${"★".repeat(r.rating)}<span>${"★".repeat(5 - r.rating)}</span></div>
    <blockquote>“${escapeHTML(r.text)}”</blockquote>
    <figcaption>
      <span class="avatar" aria-hidden="true">${escapeHTML(r.name.replace(/[^A-Za-z]/g, "").charAt(0) || "?")}</span>
      <span><strong>${escapeHTML(r.name)}</strong><small>${escapeHTML(r.when)} · Google</small></span>
    </figcaption>
  </figure>`;
// Cards are listed twice so the scrolling loop is seamless; the copy is hidden from screen readers.
$("#reviewsTrack").innerHTML = `<div class="reviews-set">${REVIEWS.map(reviewCard).join("")}</div>`
  + `<div class="reviews-set" aria-hidden="true">${REVIEWS.map(reviewCard).join("")}</div>`;

const todayIdx = new Date().getDay();
$("#hoursTable").innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => `
  <tr class="${d === todayIdx ? "today" : ""}"><td>${DAYS[d]}</td><td>${HOURS[d] ? `${HOURS[d].open} – ${HOURS[d].close}` : "Closed"}</td></tr>`).join("");

/* ----- Nav & scroll animations ----- */
const nav = $("#nav");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 30), { passive: true });

const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");
menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("open");
  navLinks.classList.toggle("open");
});
$$("a", navLinks).forEach((a) => a.addEventListener("click", () => {
  menuToggle.classList.remove("open");
  navLinks.classList.remove("open");
}));

const scissors = $("#scissors");
scissors.addEventListener("click", () => {
  scissors.classList.remove("spin");
  void scissors.offsetWidth; // restart the animation on every tap
  scissors.classList.add("spin");
});
$("svg", scissors).addEventListener("animationend", (e) => e.target.tagName === "svg" && scissors.classList.remove("spin"));

const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
}), { threshold: 0.15 });
$$(".reveal").forEach((el) => io.observe(el));

/* =========================================================
   Booking flow
   ========================================================= */
const modal = $("#bookingModal");
const form = $("#bookingForm");
const nextBtn = $("#nextBtn");
const backBtn = $("#backBtn");
const TOTAL_STEPS = 4;

let step = 1;
let booking = {};

function resetBooking() {
  booking = { service: null, barber: BARBERS[0], date: null, time: null };
  form.reset();
}

function openBooking(serviceId) {
  resetBooking();
  renderServiceOptions();
  renderBarbers();
  renderDates();
  if (serviceId) {
    booking.service = SERVICES.find((s) => s.id === serviceId);
    renderServiceOptions();
    goTo(2);
  } else {
    goTo(1);
  }
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeBooking() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.addEventListener("click", (e) => {
  const card = e.target.closest("[data-service]");
  if (card) return openBooking(card.dataset.service);
  if (e.target.closest("[data-book]")) return openBooking();
  if (e.target.closest("[data-close]")) closeBooking();
});
document.addEventListener("keydown", (e) => e.key === "Escape" && modal.classList.contains("open") && closeBooking());

function goTo(n) {
  const back = n < step;
  step = n;
  $$(".step-pane").forEach((p) => {
    const active = Number(p.dataset.step) === n;
    p.classList.toggle("active", active);
    p.classList.toggle("back", active && back);
  });
  $$("#progress span").forEach((s, i) => {
    s.classList.toggle("active", i + 1 === n);
    s.classList.toggle("done", i + 1 < n);
  });
  $("#progress").classList.toggle("hidden", n > TOTAL_STEPS);
  $("#modalActions").classList.toggle("hidden", n > TOTAL_STEPS);
  backBtn.style.visibility = n === 1 ? "hidden" : "visible";
  nextBtn.textContent = n === TOTAL_STEPS ? "Confirm booking" : "Continue";
  if (n === TOTAL_STEPS) renderSummary();
  updateNext();
  $(".modal-panel").scrollTop = 0;
}

function updateNext() {
  const ok = {
    1: !!booking.service,
    2: !!(booking.date && booking.time),
    3: true, // validated on click so errors can be shown
    4: true,
  }[step];
  nextBtn.disabled = !ok;
}

/* Step 1 — services */
function renderServiceOptions() {
  $("#serviceOptions").innerHTML = SERVICES.map((s) => `
    <label class="option ${booking.service?.id === s.id ? "selected" : ""}">
      <input type="radio" name="service" value="${s.id}" ${booking.service?.id === s.id ? "checked" : ""}>
      <span><strong>${s.name}</strong><small>${s.duration} min</small></span>
      ${priceHTML(s.price)}
    </label>`).join("");
}
$("#serviceOptions").addEventListener("change", (e) => {
  booking.service = SERVICES.find((s) => s.id === e.target.value);
  booking.time = null;
  renderServiceOptions();
  updateNext();
  setTimeout(() => goTo(2), 250); // one tap moves on
});

/* Step 2 — barber, date & time */
function renderBarbers() {
  $("#barberChips").innerHTML = BARBERS.map((b) =>
    `<button type="button" class="chip ${b === booking.barber ? "selected" : ""}" data-barber="${b}">${b}</button>`).join("");
}
$("#barberChips").addEventListener("click", (e) => {
  const b = e.target.closest("[data-barber]");
  if (!b) return;
  booking.barber = b.dataset.barber;
  booking.time = null;
  renderBarbers();
  renderTimes();
});

const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function renderDates() {
  const days = [];
  for (let i = 0; i < SHOP.bookAheadDays; i++) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  if (!booking.date) {
    const first = days.find((d) => HOURS[d.getDay()] && timesFor(d).some((t) => t.free));
    booking.date = first ? dateKey(first) : null;
  }
  $("#dateStrip").innerHTML = days.map((d) => {
    const key = dateKey(d);
    const closed = !HOURS[d.getDay()];
    return `<button type="button" class="date ${key === booking.date ? "selected" : ""}" data-date="${key}" ${closed ? "disabled" : ""}>
      <small>${DAYS[d.getDay()].slice(0, 3)}</small><b>${d.getDate()}</b><small>${d.toLocaleString("en", { month: "short" })}</small>
    </button>`;
  }).join("");
  renderTimes();
}
$("#dateStrip").addEventListener("click", (e) => {
  const b = e.target.closest("[data-date]");
  if (!b || b.disabled) return;
  booking.date = b.dataset.date;
  booking.time = null;
  $$(".date", $("#dateStrip")).forEach((x) => x.classList.toggle("selected", x === b));
  renderTimes();
});

const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
const toHHMM = (min) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/* TODO: replace with real availability from your booking backend.
   For now some slots are marked as taken (consistently per date/barber) so the UI can be seen working. */
function isTaken(key, time) {
  let h = 0;
  for (const c of key + time + booking.barber) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 4 === 0;
}

function timesFor(date) {
  const hours = HOURS[date.getDay()];
  if (!hours) return [];
  const length = booking.service?.duration ?? SHOP.slotMinutes;
  const now = new Date();
  const isToday = dateKey(date) === dateKey(now);
  const out = [];
  for (let m = toMin(hours.open); m + length <= toMin(hours.close); m += SHOP.slotMinutes) {
    const t = toHHMM(m);
    const past = isToday && m <= now.getHours() * 60 + now.getMinutes();
    out.push({ time: t, free: !past && !isTaken(dateKey(date), t) });
  }
  return out;
}

function renderTimes() {
  const grid = $("#timeGrid");
  if (!booking.date) { grid.innerHTML = `<p class="muted">No dates available.</p>`; return updateNext(); }
  const slots = timesFor(new Date(booking.date + "T12:00:00"));
  grid.innerHTML = slots.length && slots.some((s) => s.free)
    ? slots.map((s) => `<button type="button" class="time ${s.time === booking.time ? "selected" : ""}" data-time="${s.time}" ${s.free ? "" : "disabled"}>${s.time}</button>`).join("")
    : `<p class="muted">Fully booked — try another day.</p>`;
  updateNext();
}
$("#timeGrid").addEventListener("click", (e) => {
  const b = e.target.closest("[data-time]");
  if (!b || b.disabled) return;
  booking.time = b.dataset.time;
  $$(".time", $("#timeGrid")).forEach((x) => x.classList.toggle("selected", x === b));
  updateNext();
});

/* Step 3 — details */
function validateDetails() {
  let ok = true;
  ["fName", "fPhone", "fEmail"].forEach((id) => {
    const input = $("#" + id);
    const field = input.closest(".field");
    const valid = input.value.trim() && input.checkValidity();
    field.classList.remove("error");
    if (!valid) { void field.offsetWidth; field.classList.add("error"); ok = false; }
  });
  if (!ok) $(".field.error input").focus();
  return ok;
}

/* Step 4 — summary & payment */
const prettyDate = (key) => new Date(key + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

function renderSummary() {
  const s = booking.service;
  const rows = [
    ["Service", s.name],
    ["Barber", booking.barber],
    ["Date", prettyDate(booking.date)],
    ["Time", `${booking.time} (${s.duration} min)`],
    ["Name", $("#fName").value.trim()],
  ];
  const student = form.pay.value === "student";
  if (student) rows.push(["Student discount", SHOP.studentDiscount == null ? "TBC" : `−${SHOP.studentDiscount}%`]);
  const total = formatPrice(totalFor(s.price, form.pay.value)) ?? "TBC";
  $("#summary").innerHTML = rows.map(([k, v]) => `<div class="summary-row"><span>${k}</span><span>${escapeHTML(v)}</span></div>`).join("")
    + `<div class="summary-row total"><span>Total</span><span>${total}</span></div>`;
}

function totalFor(price, pay) {
  if (price == null) return null;
  if (pay !== "student") return price;
  return SHOP.studentDiscount == null ? null : price * (1 - SHOP.studentDiscount / 100);
}

$$("input[name=pay]").forEach((r) => r.addEventListener("change", renderSummary));


/* TODO: connect a payment provider (e.g. Stripe Checkout or Square).
   This should send the booking to your server, which creates a checkout session
   and redirects the customer to the provider's secure payment page.
   Card details must never be collected directly on this site. */
async function startOnlinePayment(details) {
  console.info("Payment not connected yet — booking:", details);
  return new Promise((r) => setTimeout(r, 900));
}

/* TODO: send the booking to your booking backend / calendar. */
async function saveBooking(details) {
  console.info("Booking saved (demo):", details);
}

nextBtn.addEventListener("click", async () => {
  if (step === 3 && !validateDetails()) return;
  if (step < TOTAL_STEPS) return goTo(step + 1);

  const details = {
    ...booking,
    service: booking.service.name,
    price: booking.service.price,
    name: $("#fName").value.trim(),
    phone: $("#fPhone").value.trim(),
    email: $("#fEmail").value.trim(),
    notes: $("#fNotes").value.trim(),
    payment: form.pay.value,
    total: totalFor(booking.service.price, form.pay.value),
  };

  nextBtn.disabled = true;
  nextBtn.textContent = details.payment === "online" ? "Processing…" : "Booking…";
  if (details.payment === "online") await startOnlinePayment(details);
  await saveBooking(details);

  $("#doneText").innerHTML = `${escapeHTML(details.service)} with ${escapeHTML(details.barber)}<br>
    <strong>${prettyDate(details.date)} at ${details.time}</strong><br>
    A confirmation will be sent to ${escapeHTML(details.email)}.
    ${details.payment === "student" ? "<br><br>🎓 Please bring your valid student ID to get the student rate." : ""}`;
  goTo(5);
});

backBtn.addEventListener("click", () => step > 1 && goTo(step - 1));

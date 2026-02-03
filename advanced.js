const canvas = document.getElementById("matrix-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars =
  "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) {
  drops[i] = Math.random() * -100;
}

function drawMatrix() {
  ctx.fillStyle = "rgba(5, 5, 5, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00f3ff";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawMatrix, 33);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const state = {
  price: null,
  discount: null,
  history: JSON.parse(localStorage.getItem("calcHistory") || "[]")
};

function validatePrice(el) {
  const val = el.value;
  const err = document.getElementById("priceError");
  const slider = document.getElementById("priceSlider");

  if (val === "") {
    el.classList.remove("error", "success");
    err.classList.remove("show");
    state.price = null;
    return;
  }

  const num = parseFloat(val);
  if (isNaN(num)) {
    el.classList.add("error");
    el.classList.remove("success");
    err.textContent = "⚠ The price should be a number";
    err.classList.add("show");
    state.price = null;
    createParticles(el, "error");
  } else if (num <= 0) {
    el.classList.add("error");
    el.classList.remove("success");
    err.textContent = "⚠ The price should be greater than 0";
    err.classList.add("show");
    state.price = null;
    createParticles(el, "error");
  } else {
    el.classList.remove("error");
    el.classList.add("success");
    err.classList.remove("show");
    state.price = num;
    slider.value = Math.min(num, 1000);
  }
}

function validateDiscount(el) {
  const val = el.value;
  const err = document.getElementById("discountError");
  const slider = document.getElementById("discountSlider");

  if (val === "") {
    el.classList.remove("error", "success");
    err.classList.remove("show");
    state.discount = null;
    return;
  }

  const num = parseFloat(val);
  if (isNaN(num)) {
    el.classList.add("error");
    el.classList.remove("success");
    err.textContent = "⚠ The discount should be a number";
    err.classList.add("show");
    state.discount = null;
    createParticles(el, "error");
  } else if (num < 0 || num > 100) {
    el.classList.add("error");
    el.classList.remove("success");
    err.textContent = "⚠ The discount should be between 0 and 100";
    err.classList.add("show");
    state.discount = null;
    createParticles(el, "error");
  } else {
    el.classList.remove("error");
    el.classList.add("success");
    err.classList.remove("show");
    state.discount = num;
    slider.value = num;
  }
}

function syncPrice(slider) {
  const input = document.getElementById("priceInput");
  input.value = slider.value;
  validatePrice(input);
}

function syncDiscount(slider) {
  const input = document.getElementById("discountInput");
  input.value = slider.value;
  validateDiscount(input);
}

function createParticles(target, type) {
  const rect = target.getBoundingClientRect();
  const container = document.getElementById("particles");

  for (let i = 0; i < 10; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * rect.width + "px";
    p.style.top = rect.height / 2 + "px";
    p.style.background = type === "error" ? "#ff0040" : "#00ff88";
    p.style.animationDelay = i * 0.1 + "s";
    container.appendChild(p);

    setTimeout(() => p.remove(), 1000);
  }
}

function execute() {
  const priceEl = document.getElementById("priceInput");
  const discEl = document.getElementById("discountInput");

  validatePrice(priceEl);
  validateDiscount(discEl);

  if (state.price === null || state.discount === null) {
    priceEl.classList.add("shake");
    discEl.classList.add("shake");
    setTimeout(() => {
      priceEl.classList.remove("shake");
      discEl.classList.remove("shake");
    }, 500);
    return;
  }

  const final = state.price - (state.price * state.discount) / 100;

  animateValue(final);
  visualize(state.discount);
  addToHistory(state.price, state.discount, final);

  const btn = document.querySelector(".calc-btn");
  createParticles(btn, "success");

  const card = document.getElementById("calcCard");
  card.style.transform = "scale(1.02)";
  setTimeout(() => (card.style.transform = "scale(1)"), 200);
}

function animateValue(target) {
  const box = document.getElementById("resultBox");
  const el = document.getElementById("resultValue");
  box.classList.add("show");

  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = "$" + current.toFixed(2);
  }, 20);
}

function visualize(discount) {
  const vis = document.getElementById("visualizer");
  vis.innerHTML = "";
  vis.classList.add("show");

  const bars = 20;
  const activeBars = Math.floor((discount / 100) * bars);

  for (let i = 0; i < bars; i++) {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = "20%";
    bar.style.opacity = i < activeBars ? "1" : "0.2";
    vis.appendChild(bar);

    setTimeout(() => {
      bar.style.height = i < activeBars ? "100%" : "20%";
    }, i * 30);
  }
}

function addToHistory(price, discount, final) {
  const entry = {
    price,
    discount,
    final,
    timestamp: new Date().toISOString()
  };
  state.history.unshift(entry);
  if (state.history.length > 10) state.history.pop();
  localStorage.setItem("calcHistory", JSON.stringify(state.history));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = state.history
    .map(
      (h) => `
                <div class="history-item">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--neon-cyan)">$${h.price}</span>
                        <span style="color: var(--neon-pink)">${
                          h.discount
                        }%</span>
                    </div>
                    <div style="font-size: 1.2rem; color: #00ff88; font-weight: bold;">
                        = $${h.final.toFixed(2)}
                    </div>
                    <div style="font-size: 0.7rem; opacity: 0.5; margin-top: 0.5rem;">
                        ${new Date(h.timestamp).toLocaleTimeString()}
                    </div>
                </div>
            `
    )
    .join("");
}

function toggleHistory() {
  document.getElementById("historyPanel").classList.toggle("open");
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") execute();
  if (e.key === "h" && e.ctrlKey) {
    e.preventDefault();
    toggleHistory();
  }
});

document.getElementById("calcCard").addEventListener("mousemove", (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = (y - centerY) / 20;
  const rotateY = (centerX - x) / 20;

  e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

document.getElementById("calcCard").addEventListener("mouseleave", (e) => {
  e.currentTarget.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
});

renderHistory();

const style = document.createElement("style");
style.textContent = `
            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
document.head.appendChild(style);

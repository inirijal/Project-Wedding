// ── Ambil nama tamu dari URL parameter ──
function getGuestName() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("to");
  return name ? decodeURIComponent(name) : "Tamu Undangan";
}

// ── Set nama tamu di semua elemen yang membutuhkan ──
function setGuestName() {
  const name = getGuestName();
  document.querySelectorAll(".guest-name").forEach((el) => {
    el.textContent = name;
  });
}

// ── Fungsi global — bisa dipanggil dari onclick di HTML ──
function bukaUndangan() {
  const cover = document.getElementById("cover");
  const mainContent = document.getElementById("main-content");

  cover.classList.add("hide");
  mainContent.classList.add("show");
  playMusic();

  setTimeout(() => {
    cover.style.display = "none";
  }, 900);
}

// ── Buka undangan saat tombol diklik ──
function initOpenButton() {
  const btn = document.getElementById("btn-open");
  if (!btn) return;
  btn.addEventListener("click", bukaUndangan);
}

// ── Countdown Timer ──
function initCountdown() {
  // Tanggal pernikahan: 27 Agustus 2032
  const weddingDate = new Date("2032-08-27T08:00:00");

  function update() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById("cd-days").textContent = "00";
      document.getElementById("cd-hours").textContent = "00";
      document.getElementById("cd-minutes").textContent = "00";
      document.getElementById("cd-seconds").textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("cd-days").textContent = String(days).padStart(
      2,
      "0",
    );
    document.getElementById("cd-hours").textContent = String(hours).padStart(
      2,
      "0",
    );
    document.getElementById("cd-minutes").textContent = String(
      minutes,
    ).padStart(2, "0");
    document.getElementById("cd-seconds").textContent = String(
      seconds,
    ).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// ── Reveal on Scroll (Intersection Observer) ──
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// ── Music Player ──
let audio = null;
let isPlaying = false;

function playMusic() {
  if (!audio) {
    // Gunakan URL audio bebas royalti — ganti dengan link lagu pilihan
    audio = new Audio("Lagu.mp3");
    audio.loop = true;
    audio.volume = 0.4;
  }
  audio.play().catch(() => {});
  isPlaying = true;
  updateMusicBtn();
}

function toggleMusic() {
  if (!audio) {
    playMusic();
    return;
  }
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play();
    isPlaying = true;
  }
  updateMusicBtn();
}

function updateMusicBtn() {
  const btn = document.getElementById("music-btn");
  if (!btn) return;
  if (isPlaying) {
    btn.innerHTML = "&#9646;&#9646;"; // pause icon
    btn.classList.add("playing");
    btn.title = "Pause Musik";
  } else {
    btn.innerHTML = "&#9654;"; // play icon
    btn.classList.remove("playing");
    btn.title = "Play Musik";
  }
}

function initMusicBtn() {
  const btn = document.getElementById("music-btn");
  if (btn) btn.addEventListener("click", toggleMusic);
}

// ── RSVP & Ucapan Form ──
let wishes = [
  {
    name: "Budi Santoso",
    attend: "Hadir",
    message:
      "Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Selamat menempuh hidup baru! 🌹",
  },
  {
    name: "Siti Rahayu",
    attend: "Hadir",
    message: `Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fi khair. Aamiin 💍`,
  },
  {
    name: "Ahmad Fauzi",
    attend: "Tidak Hadir",
    message:
      "Maaf tidak bisa hadir, semoga pernikahan kalian langgeng dan penuh keberkahan selalu.",
  },
];

function renderWishes() {
  const list = document.getElementById("wishes-list");
  if (!list) return;

  list.innerHTML = "";
  wishes.forEach((w) => {
    const card = document.createElement("div");
    card.className = "wish-card";
    card.innerHTML = `
      <div class="wish-name">${escapeHtml(w.name)}</div>
      <div class="wish-attend">${w.attend === "Hadir" ? "✓ Akan Hadir" : "✗ Tidak Hadir"}</div>
      <div class="wish-text">"${escapeHtml(w.message)}"</div>
    `;
    list.appendChild(card);
  });
}

function initRsvpForm() {
  const form = document.getElementById("rsvp-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("f-name").value.trim();
    const attend =
      document.querySelector('input[name="attend"]:checked')?.value ||
      "Tidak diketahui";
    const guests = document.getElementById("f-guests").value;
    const message = document.getElementById("f-message").value.trim();

    if (!name || !message) {
      alert("Mohon isi nama dan ucapan terlebih dahulu.");
      return;
    }

    wishes.unshift({ name, attend, message });
    renderWishes();
    form.reset();

    // Feedback sukses
    const btn = form.querySelector(".btn-submit");
    btn.textContent = "Terima Kasih! ✓";
    btn.style.background = "var(--gold)";
    btn.style.color = "var(--dark)";
    setTimeout(() => {
      btn.textContent = "Kirim Ucapan";
      btn.style.background = "";
      btn.style.color = "";
    }, 3000);
  });
}

// ── Google Maps Link ──
function initMapsButtons() {
  document.querySelectorAll("[data-maps]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-maps")?.trim();
      if (!val) return;
      const targetUrl =
        val.startsWith("http://") || val.startsWith("https://")
          ? val
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(val)}`;
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    });
  });
}

// ── Copy to Clipboard (link undangan) ──
function initShareBtn() {
  const btn = document.getElementById("share-btn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      btn.textContent = "Link Tersalin! ✓";
      setTimeout(() => {
        btn.textContent = "Salin Link Undangan";
      }, 2500);
    } catch {
      prompt("Salin link undangan ini:", url);
    }
  });
}

// ── Helper: escape HTML ──
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── INIT SEMUA ──
document.addEventListener("DOMContentLoaded", () => {
  setGuestName();
  initOpenButton();
  initCountdown();
  initReveal();
  initMusicBtn();
  initRsvpForm();
  initMapsButtons();
  initShareBtn();
  renderWishes();
});

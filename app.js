(() => {
  "use strict";

  const data = window.NABAA_CONTENT;
  if (!data) return;

  document.querySelectorAll('[data-link="maps"]').forEach(link => {
    link.href = data.clinic.maps;
  });

  document.querySelectorAll('[data-link="waze"]').forEach(link => {
    link.href = data.clinic.waze;
  });

  const address = document.getElementById("address-text");
  if (address) address.textContent = data.clinic.address;

  const doctorGrid = document.getElementById("doctor-grid");
  data.doctors.forEach((doctor, index) => {
    const card = document.createElement("article");
    card.className = "doctor-card";

    const chips = doctor.days.map(day =>
      `<span class="day-chip ${doctor.scheduleType === "variable" ? "variable" : ""}">${day}</span>`
    ).join("");

    card.innerHTML = `
      <div class="doctor-photo-wrap">
        <img class="doctor-photo" src="${doctor.photo}" alt="صورة ${doctor.name}" loading="lazy">
      </div>
      <div class="doctor-info">
        <h3 class="doctor-name">${doctor.name}</h3>
        <p class="doctor-specialty">${doctor.specialty}</p>
      </div>
      <div class="schedule-block">
        <div class="schedule-label"><i class="fa-regular fa-calendar"></i> موعد الحضور</div>
        <div class="day-list">${chips}</div>
      </div>
    `;
    doctorGrid.appendChild(card);
  });

  const phoneList = document.getElementById("phone-list");
  data.phones.forEach(phone => {
    const item = document.createElement("div");
    item.className = "phone-item";
    item.innerHTML = `
      <a class="phone-call" href="tel:${phone.tel}" aria-label="الاتصال على ${phone.display}">
        <i class="fa-solid fa-phone"></i>
      </a>
      <a class="phone-number" href="tel:${phone.tel}">${phone.display}</a>
      <button class="copy-button" type="button" data-copy="${phone.display}">
        <i class="fa-regular fa-copy"></i> نسخ الرقم
      </button>
    `;
    phoneList.appendChild(item);
  });

  const socialList = document.getElementById("social-list");
  data.social.forEach(network => {
    const card = document.createElement("a");
    card.className = "social-card";
    card.dataset.network = network.name;
    card.href = network.url;
    card.target = "_blank";
    card.rel = "noopener";
    card.innerHTML = `
      <span class="social-icon"><i class="${network.icon}"></i></span>
      <span>
        <strong>${network.name}</strong>
        <small>${network.label}</small>
      </span>
    `;
    socialList.appendChild(card);
  });

  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  document.addEventListener("click", async event => {
    const button = event.target.closest("[data-copy]");
    if (!button) return;
    const value = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      showToast("تم نسخ الرقم");
    } catch {
      const input = document.createElement("textarea");
      input.value = value;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
      showToast("تم نسخ الرقم");
    }
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();

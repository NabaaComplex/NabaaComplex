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

  const serviceGrid = document.getElementById("service-grid");
  if (serviceGrid) {
    data.services.forEach((service, index) => {
      const card = document.createElement("article");
      card.className = "service-card";

      const listItems = service.items
        .map(item => `<li><i class="fa-solid fa-check" aria-hidden="true"></i><span>${item}</span></li>`)
        .join("");

      card.innerHTML = `
        <div class="service-card-head">
          <span class="service-icon" aria-hidden="true"><i class="${service.icon}"></i></span>
          <div>
            <span class="service-number">${String(index + 1).padStart(2, "0")}</span>
            <h3>${service.title}</h3>
          </div>
        </div>
        <p class="service-description">${service.description}</p>
        <div class="service-list-label">${service.listLabel || "تشمل الخدمات:"}</div>
        <ul class="service-list">${listItems}</ul>
      `;

      serviceGrid.appendChild(card);
    });
  }

  const phoneList = document.getElementById("phone-list");
  if (phoneList) {
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
  }

  const socialList = document.getElementById("social-list");
  if (socialList) {
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
  }

  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
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

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();

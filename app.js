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
      card.className = `service-card${service.featured ? " service-card-featured" : ""}`;

      const listItems = service.items
        .map(item => `<li><i class="fa-solid fa-check" aria-hidden="true"></i><span>${item}</span></li>`)
        .join("");

      const media = service.image
        ? `<figure class="service-card-media">
             <img src="${service.image}" alt="${service.imageAlt || service.title}" loading="lazy">
             <figcaption><i class="fa-solid fa-camera"></i> صورة حقيقية من مختبر المجمع</figcaption>
           </figure>`
        : "";

      const closing = service.closing
        ? `<p class="service-closing"><i class="fa-solid fa-link"></i><span>${service.closing}</span></p>`
        : "";

      card.innerHTML = `
        ${media}
        <div class="service-card-body">
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
          ${closing}
        </div>
      `;

      serviceGrid.appendChild(card);
    });
  }

  const galleryTrack = document.getElementById("gallery-track");
  if (galleryTrack && Array.isArray(data.gallery)) {
    data.gallery.forEach((photo, index) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-slide";
      figure.dataset.galleryIndex = String(index);
      figure.innerHTML = `
        <img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async">
        <figcaption>
          <span>${photo.caption}</span>
          <small>${String(index + 1).padStart(2, "0")} / ${String(data.gallery.length).padStart(2, "0")}</small>
        </figcaption>
      `;
      galleryTrack.appendChild(figure);
    });

    const slides = Array.from(galleryTrack.querySelectorAll(".gallery-slide"));
    const prevButton = document.getElementById("gallery-prev");
    const nextButton = document.getElementById("gallery-next");
    let galleryIndex = 0;

    const showGallerySlide = nextIndex => {
      galleryIndex = Math.max(0, Math.min(slides.length - 1, nextIndex));
      slides[galleryIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      if (prevButton) prevButton.disabled = galleryIndex === 0;
      if (nextButton) nextButton.disabled = galleryIndex === slides.length - 1;
    };

    prevButton?.addEventListener("click", () => showGallerySlide(galleryIndex - 1));
    nextButton?.addEventListener("click", () => showGallerySlide(galleryIndex + 1));

    galleryTrack.addEventListener("keydown", event => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showGallerySlide(galleryIndex - 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showGallerySlide(galleryIndex + 1);
      }
    });

    if (prevButton) prevButton.disabled = true;
    if (nextButton) nextButton.disabled = slides.length <= 1;
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

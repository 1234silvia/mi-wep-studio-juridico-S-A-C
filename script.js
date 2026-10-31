/* =========================================================
   STUDIO JURÍDICO DICONO S.A.C. — interacciones
   Edite WHATSAPP_NUMBER cuando tenga el número oficial.
   Formato internacional sin +, espacios ni guiones.
   Ejemplo de formato (no usar como número real): 519XXXXXXXX
   ========================================================= */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");
  const year = document.getElementById("current-year");
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const whatsappLink = document.getElementById("whatsapp-link");

  // Actualiza el año del pie de página automáticamente.
  if (year) year.textContent = new Date().getFullYear();

  // Sombra del encabezado al desplazarse.
  const updateHeader = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Menú móvil accesible: abre, cierra y actualiza atributos ARIA.
  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú de navegación");
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú de navegación" : "Cerrar menú de navegación");
      nav.classList.toggle("open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navLinks.forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", event => {
      if (nav.classList.contains("open") && !nav.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
      }
    });
  }

  // Animaciones de entrada suaves, con respeto a "reducir movimiento".
  const revealTargets = document.querySelectorAll(
    ".about-visual, .about-copy, .service-card, .benefits-list article, .gallery-item, .contact-form-wrap"
  );
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealTargets.forEach(item => item.classList.add("js-reveal"));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(item => observer.observe(item));
  }

  // WhatsApp: configure el número real antes de publicar.
  const WHATSAPP_NUMBER = "51927246788"; // Ejemplo de formato: 519XXXXXXXX (reemplazar por número oficial)
  const defaultMessage = "Hola, deseo información sobre los servicios de asesoría y consulta legal de DICONO.";
  if (whatsappLink) {
    if (WHATSAPP_NUMBER.trim()) {
      whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER.trim()}?text=${encodeURIComponent(defaultMessage)}`;
      whatsappLink.target = "_blank";
      whatsappLink.rel = "noopener noreferrer";
      whatsappLink.classList.remove("placeholder-link");
      whatsappLink.title = "Contactar por WhatsApp";
    } else {
      whatsappLink.href = "#contacto";
      whatsappLink.title = "Agregue el número oficial en script.js para activar WhatsApp";
      whatsappLink.addEventListener("click", event => {
        event.preventDefault();
        document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" });
        const status = document.getElementById("form-status");
        if (status) status.textContent = "El WhatsApp está pendiente de configuración. Puede completar los datos de contacto antes de publicar.";
      });
    }
  }

  // El formulario valida los campos y prepara un correo en el dispositivo.
  // No envía datos a un servidor. Para recibir mensajes automáticamente,
  // conecte un proveedor de formularios o un backend antes de publicar.
  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const nombre = String(data.get("nombre") || "").trim();
      const email = String(data.get("email") || "").trim();
      const tipo = String(data.get("tipo-consulta") || "No especificado").trim();
      const mensaje = String(data.get("mensaje") || "").trim();

      // No se abre un correo si todavía no se ha configurado el destinatario.
      const CONTACT_EMAIL = ""; // Agregue aquí el correo oficial, por ejemplo: contacto@dominio.pe
      if (!CONTACT_EMAIL) {
        formStatus.textContent = "Formulario validado. Para enviar mensajes, configure el correo oficial en script.js y conecte un servicio de envío. Por ahora, contacte al estudio por sus canales oficiales.";
        formStatus.style.color = "#805d25";
        return;
      }

      const subject = encodeURIComponent(`Consulta web DICONO — ${tipo}`);
      const body = encodeURIComponent(
        `Nombre: ${nombre}\nCorreo: ${email}\nTipo de consulta: ${tipo}\n\nMensaje:\n${mensaje}\n\nNota: el usuario inició el contacto desde la web de DICONO.`
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      formStatus.textContent = "Se abrirá su aplicación de correo para que pueda revisar y enviar el mensaje.";
    });
  }

  // Los enlaces sociales de marcador (#) no deben llevar al inicio de la página.
  document.querySelectorAll(".placeholder-link").forEach(link => {
    if (link !== whatsappLink && link.getAttribute("href") === "#") {
      link.addEventListener("click", event => {
        event.preventDefault();
        if (formStatus) {
          formStatus.textContent = "Este enlace está pendiente de configuración con la cuenta oficial.";
          document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  });
});

// ================================
// CONFIG
// ================================

// 👉 Numéro affiché (facultatif, info uniquement)
const PHONE_DISPLAY = "+33600000000";

// 👉 URL webhook (SMS / n8n / Zapier)
// Laisse vide si pas encore branché
const WEBHOOK_URL = ""; 


// ================================
// FORMULAIRE
// ================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("leadForm");
  const status = document.getElementById("formStatus");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Récupération des champs
    const name = form.querySelector("input[name='name']").value.trim();
    const phone = form.querySelector("input[name='phone']").value.trim();
    const message = form.querySelector("textarea[name='message']").value.trim();

    // Validation simple
    if (!name || !phone || !message) {
      showStatus("❌ Merci de remplir tous les champs.", "error");
      return;
    }

    if (!isValidPhone(phone)) {
      showStatus("❌ Numéro de téléphone invalide.", "error");
      return;
    }

    // Feedback immédiat (important Ads)
    showStatus("⏳ Envoi de votre demande…", "loading");

    // Données envoyées
    const payload = {
      nom: name,
      telephone: phone,
      message: message,
      departement: "66",
      source: "site_plombier_urgence_66",
      date: new Date().toISOString()
    };

    try {
      // Si webhook configuré
      if (WEBHOOK_URL) {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      // Conversion Google Ads formulaire
      if (typeof gtag === "function") {
        gtag("event", "conversion", {
          send_to: "AW-169744/CONVERSION_LABEL"
        });
      }

      // Succès
      showStatus("✅ Demande envoyée ! Nous vous rappelons rapidement.", "success");
      form.reset();

    } catch (err) {
      console.error(err);
      showStatus("❌ Erreur lors de l’envoi. Merci d’appeler directement.", "error");
    }
  });

  // ================================
  // HELPERS
  // ================================

  function showStatus(message, type) {
    status.innerText = message;
    status.className = "status " + type;
  }

  function isValidPhone(phone) {
    // Format FR simple
    return /^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/.test(phone);
  }
});

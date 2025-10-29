export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Méthode non autorisée" });
  }

  try {
    console.log("=== NOUVELLE REQUÊTE REÇUE ===");
    console.log("BODY REÇU :", JSON.stringify(req.body, null, 2));

    const payload = req.body || {};
    const formData = payload.data || payload;

    // 👇 On cherche maintenant "mail" au lieu de "email"
    const email =
      formData.mail ||
      formData["mail"] ||
      formData["Mail"] ||
      formData["email"] ||
      "";

    console.log("Email détecté :", email);

    if (!email) {
      console.warn("Aucun email trouvé dans la requête");
      return res.status(400).json({ ok: false, error: "Email requis" });
    }

    const body = {
      email,
      listIds: [Number(process.env.BREVO_LIST_ID)],
      updateEnabled: true,
    };

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Réponse Brevo :", data);

    if (!response.ok) {
      console.error("Erreur Brevo :", data);
      return res.status(response.status).json({ ok: false, error: data });
    }

    return res.status(200).json({ ok: true, message: "Email ajouté à Brevo", data });
  } catch (err) {
    console.error("Erreur serveur :", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
}

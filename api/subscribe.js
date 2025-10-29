export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Méthode non autorisée" });
  }

  try {
    // Webflow V2 → les données sont dans req.body.data
    const payload = req.body || {};
    const formData = payload.data || payload;

    // Cherche le champ email (quel que soit son nom)
    const email =
      formData.email ||
      formData["email"] ||
      formData["Email"] ||
      formData["email-address"] ||
      formData["Email Address"] ||
      "";

    if (!email) {
      return res.status(400).json({ ok: false, error: "Email requis" });
    }

    // Prépare la requête pour Brevo
    const body = {
      email,
      listIds: [Number(process.env.BREVO_LIST_ID)],
      updateEnabled: true, // crée ou met à jour le contact
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

    if (!response.ok) {
      console.error("Erreur Brevo :", data);
      return res.status(response.status).json({ ok: false, error: data });
    }

    return res.status(200).json({ ok: true, message: "Email ajouté à Brevo", data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
}

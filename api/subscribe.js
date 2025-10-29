export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Méthode non autorisée' });
  }

  try {
    const payload = req.body || {};
    const email = payload.email || payload.Email || "";
    const firstname = payload.firstName || payload.firstname || "";
    const lastname = payload.lastName || payload.lastname || "";

    if (!email) {
      return res.status(400).json({ ok: false, error: 'Email requis' });
    }

    const body = {
      email,
      attributes: {
        FIRSTNAME: firstname,
        LASTNAME: lastname
      },
      listIds: [Number(process.env.BREVO_LIST_ID)],
      updateEnabled: true
    };

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(400).json({ ok: false, error: data });
    }

    res.status(200).json({ ok: true, message: 'Contact ajouté à Brevo', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Erreur serveur' });
  }
}
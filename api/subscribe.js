export default async function handler(req, res) {
  console.log("=== DEBUG WEBFLOW ===");
  console.log("Méthode :", req.method);
  console.log("Body brut :", JSON.stringify(req.body, null, 2));

  return res.status(200).json({ ok: true, message: "Reçu pour debug" });
}

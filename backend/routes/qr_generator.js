const router = require("express").Router();
const QRCode = require("qrcode");


router.post("/", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required to generate QR code." });
  }

  try {
    const qrImage = await QRCode.toDataURL(text); 
    res.status(200).json({ qrCode: qrImage });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate QR code." });
  }
});

module.exports=router;

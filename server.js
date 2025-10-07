// Impor library yang dibutuhkan
const express = require("express");
const cors = require("cors");
const vision = require("@google-cloud/vision");

// Inisialisasi server
const app = express();
app.use(cors()); // Mengizinkan akses dari ekstensi Chrome
app.use(express.json()); // Mengizinkan server menerima data JSON

// Inisialisasi klien Google Vision AI
const client = new vision.ImageAnnotatorClient();

// Route utama untuk cek server berjalan
app.get("/", (req, res) => {
  res.send("Server AI untuk Adobe Stock Extension aktif! ✨");
});

// Route untuk menganalisis gambar
app.post("/analyze-image", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).send("Error: imageUrl tidak ditemukan.");
    }

    console.log(`Menganalisis gambar: ${imageUrl}`);

    // Meminta Google AI untuk mendeteksi label/keyword dari gambar
    const [result] = await client.labelDetection(imageUrl);
    const labels = result.labelAnnotations;

    // Ekstrak hanya nama keyword-nya saja
    const keywords = labels.map(label => label.description.toLowerCase());

    console.log("Keywords ditemukan:", keywords);

    // Kirim keywords kembali ke ekstensi
    res.json({ keywords: keywords });

  } catch (error) {
    console.error("Terjadi error di Google Vision API:", error);
    res.status(500).send("Error saat menganalisis gambar.");
  }
});

// Jalankan server
const listener = app.listen(process.env.PORT, () => {
  console.log("Server Anda berjalan di port " + listener.address().port);
});

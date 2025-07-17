const express = require("express");
const cors = require("cors"); // ✅ Import cors
const bodyParser = require("body-parser");
const escpos = require("escpos");
escpos.USB = require("escpos-usb");

const app = express();
app.use(cors()); // ✅ Enable CORS for all origins

app.use(bodyParser.json({ limit: "1mb" }));

app.post("/print", (req, res) => {
  const { data } = req.body;
  if (!data) return res.status(400).send("No data");

  const buffer = Buffer.from(data);
  const device = new escpos.USB();
  const printer = new escpos.Printer(device);

  device.open((err) => {
    if (err) {
      console.error("Printer error:", err);
      return res.status(500).send("Printer not found");
    }

    device.write(buffer, (err) => {
      if (err) {
        console.error("Write error:", err);
        return res.status(500).send("Failed to write to printer");
      }
      device.close();
      res.send("Printed");
    });
  });
});

app.listen(3001, () => {
  console.log("Printer server running on http://localhost:3001");
});

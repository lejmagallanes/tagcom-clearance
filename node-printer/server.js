const express = require("express");
const usb = require("usb");
const cors = require("cors");
const bodyParser = require("body-parser");
const escpos = require("escpos"); // escpos for compatibility if later you want text printing
escpos.USB = require("escpos-usb");

// Replace these IDs with your printer’s vendorId/productId
const TARGET_VENDOR_ID = 1046; // Example: 0x0416
const TARGET_PRODUCT_ID = 20497; // Example: 0x5001

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8000"],
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "1mb" }));

app.post("/print", (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).send("No data provided");
  }

  // Open the printer by Vendor ID and Product ID
  const printer = usb.findByIds(TARGET_VENDOR_ID, TARGET_PRODUCT_ID);
  if (!printer) {
    console.error("Printer not found");
    return res.status(404).send("Printer not found");
  }

  try {
    printer.open();
    const iface = printer.interfaces[0];
    iface.claim();

    const endpoint = iface.endpoints.find((ep) => ep.direction === "out");
    if (!endpoint) {
      console.error("No output endpoint found");
      return res.status(500).send("No output endpoint");
    }

    // If passed data is already an ESC/POS byte array
    let payload;
    if (Array.isArray(data)) {
      payload = Buffer.from(data);
    } else if (typeof data === "string") {
      payload = Buffer.from(data, "utf8");
    } else {
      return res.status(400).send("Invalid data format");
    }

    endpoint.transfer(payload, (err) => {
      if (err) {
        console.error("Print error:", err);
        res.status(500).send("Print error");
      } else {
        console.log("Print sent successfully!");
        res.json({ success: true });
      }

      // Always release after transfer
      iface.release(true, () => {
        printer.close();
      });
    });
  } catch (err) {
    console.error("Exception during print:", err);
    return res.status(500).send("Printer error");
  }
});

app.listen(3001, () => {
  console.log("Printer server running at http://localhost:3001");
});

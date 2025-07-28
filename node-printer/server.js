const express = require("express");
const usb = require("usb");
const fs = require("fs");

const cors = require("cors"); // ✅ Import cors
const bodyParser = require("body-parser");
const escpos = require("escpos");
escpos.USB = require("escpos-usb");

const TARGET_VENDOR_ID = 1046;
const TARGET_PRODUCT_ID = 20497;

const app = express();
app.use(cors()); // ✅ Enable CORS for all origins

app.use(bodyParser.json({ limit: "1mb" }));

app.post("/print", (req, res) => {
  const { data } = req.body;
  if (!data) return res.status(400).send("No data");

  let lastDevices = [];
  const devices = usb.getDeviceList();

  const deviceIds = devices.map(
    (d) => `${d.deviceDescriptor.idVendor}:${d.deviceDescriptor.idProduct}`
  );
  const lastDeviceIds = lastDevices.map(
    (d) => `${d.deviceDescriptor.idVendor}:${d.deviceDescriptor.idProduct}`
  );

  const attached = deviceIds.filter((id) => !lastDeviceIds.includes(id));
  const detached = lastDeviceIds.filter((id) => !deviceIds.includes(id));

  if (attached.length > 0) {
    console.log("Attached devices:", attached);

    const printer = devices.find(
      (d) =>
        d.deviceDescriptor.idVendor === TARGET_VENDOR_ID &&
        d.deviceDescriptor.idProduct === TARGET_PRODUCT_ID
    );
    console.log("attached");
    console.log(printer);

    if (printer && !printerWasConnected) {
      console.log("Thermal printer attached");
      printerWasConnected = true;
    } else if (!printer && printerWasConnected) {
      console.log("Thermal printer detached");
      printerWasConnected = false;
    }

    const escposTestPrint = data;
    console.log("receiptData: -------");
    console.log(escposTestPrint);

    printer.open();

    if (!printer) {
      console.log("Printer not found.");
      return;
    }

    const iface = printer.interfaces[0];
    iface.claim();

    const endpoint = iface.endpoints.find((ep) => ep.direction === "out");
    if (!endpoint) {
      console.log("No output endpoint found.");
      return;
    }

    endpoint.transfer(escposTestPrint, (err) => {
      if (err) {
        console.error("Print error:", err);
      } else {
        console.log("✅ Print sent successfully!");
      }

      try {
        iface.release(true, () => {
          printer.close();
        });
      } catch (cleanupErr) {
        printer.close();
        console.error("Error releasing interface:", cleanupErr);
      }
    });
  }

  if (detached.length > 0) {
    console.log("Detached devices:", detached);
  }

  lastDevices = devices;
});

app.listen(3001, () => {
  console.log("Printer server running on http://localhost:3001");
});

let printerWasConnected = false;

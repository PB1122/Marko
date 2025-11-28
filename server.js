const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// Hantera preflight (OPTIONS)
app.options('/api', (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(200);
});

// Proxy endpoint
app.all('/api', async (req, res) => {
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbwFY7LSM7CRaGy_ZuiSAJXg9CxRrArT43xotMa7rT3vE9tuHXuHpGOW_xRv1sJrcP2ozw/exec", {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined
    });

    const text = await response.text();

    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    res.status(response.status).send(text);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy error", details: err.message });
  }
});

// Servera dina HTML-filer
app.use(express.static(path.join(__dirname)));

app.listen(3000, () => console.log("Server körs på http://localhost:3000"));
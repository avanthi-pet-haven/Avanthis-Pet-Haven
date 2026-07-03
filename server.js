const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

function saveData(newData) {
    let data = [];

    if (fs.existsSync("data.json")) {
        const fileData = fs.readFileSync("data.json");
        data = JSON.parse(fileData);
    }

    data.push(newData);
    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

/* ROOT ROUTE - ADDED */
app.get("/", (req, res) => {
    res.send("Avanthis Pet Haven Backend Running Successfully!");
});

app.post("/submit-form", (req, res) => {
    const formData = req.body;
    console.log("Received Form Data:", formData);

    saveData({
        page: "Index",
        ...formData
    });

    res.json({ message: "Submitted Successfully!" });
});

app.post("/contact", (req, res) => {
    console.log("Contact Form:", req.body);

    saveData({
        page: "Contact",
        ...req.body
    });

    res.json({ message: "Message Sent Successfully!" });
});

app.post("/adopt", (req, res) => {
    console.log("Adoption Form:", req.body);

    saveData({
        page: "Adopt",
        ...req.body
    });

    res.json({ message: "Adoption Request Submitted Successfully!" });
});

app.get("/admin-data", (req, res) => {
    if (fs.existsSync("data.json")) {
        const fileData = fs.readFileSync("data.json");
        res.json(JSON.parse(fileData));
    } else {
        res.json([]);
    }
});

/* EDIT ROUTE */
app.put("/edit-data/:index", (req, res) => {
    const index = parseInt(req.params.index);
    const updatedData = req.body;

    if (fs.existsSync("data.json")) {
        let data = JSON.parse(fs.readFileSync("data.json"));

        data[index] = updatedData;

        fs.writeFileSync("data.json", JSON.stringify(data, null, 2));

        res.json({ message: "Updated successfully!" });
    } else {
        res.status(404).json({ message: "Data not found" });
    }
});

/* DELETE ROUTE */
app.delete("/delete-data/:index", (req, res) => {
    const index = parseInt(req.params.index);

    if (fs.existsSync("data.json")) {
        let data = JSON.parse(fs.readFileSync("data.json"));

        data.splice(index, 1);

        fs.writeFileSync("data.json", JSON.stringify(data, null, 2));

        res.json({ message: "Deleted successfully!" });
    } else {
        res.status(404).json({ message: "Data not found" });
    }
});

/* RENDER PORT FIX - CHANGED */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

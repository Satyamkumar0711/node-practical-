//url shortening service
//build a url shortning service using express and mongoose
//. post/shorturl accepts a long url and return a shortened url
//.get/shorted redirect to the original url and increment access count
//.patch/shorted Allow updating the long url or access count
const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
const Url = require("./models/Url");

const app = express();
app.use(express.json());

//DB Connection
mongoose.connect("mongodb://127.0.0.1:27017/urlshortener")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));


//POST-shorturl(Create short URL)
app.post("/shorturl", async (req, res) => {
    const { longUrl } = req.body;

    const shortId = shortid.generate();

    const newUrl = await Url.create({
        shortId,
        longUrl
    });

    res.json({
        shortUrl: `http://localhost:3000/${shortId}`
    });
});


//GET-shortId(Redirect + increment count)
app.get("/:shortId", async (req, res) => {
    const { shortId } = req.params;

    const url = await Url.findOne({ shortId });

    if (!url) return res.status(404).send("Not found");

    url.accessCount++;
    await url.save();

    res.redirect(url.longUrl);
});


//PATCH -shortId(Update URL or count)
app.patch("/:shortId", async (req, res) => {
    const { shortId } = req.params;
    const { longUrl, accessCount } = req.body;

    const updated = await Url.findOneAndUpdate(
        { shortId },
        { longUrl, accessCount },
        { new: true }
    );

    if (!updated) return res.status(404).send("Not found");

    res.json(updated);
});


// Server start
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
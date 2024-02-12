require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// list of original urls and corresponding shortened urls
let urlMappings = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

// parse form field inputs
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
	res.sendFile(process.cwd() + "/views/index.html");
});

// receive the url from the form field and shorten it
app.post("/api/shorturl", (req, res) => {
	//lets check the url for validity
	if (isValidUrl(req.body.url) === true) {
		const shortened = shortenURL(req.body.url);
		res.json({
			original_url: req.body.url,
			short_url: shortened,
		});
		return;
	}
	res.json({
		error: "invalid url",
	});
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
	res.json({ greeting: "hello API" });
});

app.get("/api/shorturl/:shortenedNumber", (req, res) => {
	const shortenedUrl = req.params.shortenedNumber;
	const originalUrl = urlMappings[shortenedUrl];

	if (originalUrl) {
		res.redirect(originalUrl);
		return;
	}

	res.status(404).json({ error: "URL not found" });
});

app.listen(port, function () {
	console.log(`Listening on port ${port}`);
});

// UTILITY FUNCTIONS

//shortening
function shortenURL(url) {
	urlMappings.push(url);
	console.table(urlMappings);
	return urlMappings.indexOf(url);
}

//validity check
function isValidUrl(url) {
	try {
		const newURL = new URL(url);
		if (newURL.protocol != "https:" && newURL.protocol != "http:") {
			return false;
		}
		return true;
	} catch (error) {
		return false;
	}
}

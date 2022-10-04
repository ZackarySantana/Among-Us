const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const path = require("path");
const app = express();

const dist_dir = path.join(__dirname, "dist");

const port = 4173;

app.use(compression());
app.use(helmet());

app.use("/", (req, res, next) => {
    res.set("Cache-control", "public, max-age=14400"); // 14400s = 60s/m * 60m/h * 4h
    res.set(
        "Content-Security-Policy",
        "default-src 'self' data:; style-src 'self' 'unsafe-inline';"
    );
    if (req.path === "/") {
        ++app.locals.page_views;
    }

    next();
});

app.use("/", express.static(dist_dir));

app.listen(port, () => {
    console.log(`Client is listening on port ${port}`);
});

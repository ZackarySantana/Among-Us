const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const path = require("path");
const app = express();

const dist_dir = path.join(__dirname, "dist");

const port = 4173;

app.use(compression());
app.use(helmet());

app.use(helmet.contentSecurityPolicy({
    directives: {
        "img-src": ["'self'", "data:", "blob:"],
        "connect-src": ["'self'", "ws:localhost:3000", "wss:localhost:3000", "http:localhost:3000", "https:localhost:3000"],
    }
}))

app.use("/", (_, res, next) => {
    res.set("Cache-control", "public, max-age=0"); // 14400s = 60s/m * 60m/h * 4h
    next();
});

app.use("/", express.static(dist_dir));

app.listen(port, () => {
    console.log(`Client is listening on port ${port}`);
});

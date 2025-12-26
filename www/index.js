'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5089;
const app = express();
// app.use(helmet())
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: ["'self'"],
//             scriptSrc: ["'self'", "https://cdn.talkjs.com"],
//         },
//     })
// )
// helmet.contentSecurityPolicy({
//     directives: {
//         defaultSrc: ["'self'"],
//         frameSrc: ["'self'", "https://chat.helloprint.com"],
//     }
// })
app.enable('trust proxy');
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: 1024102420, type: 'application/json' }));
app.use(express.static('public'));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log('Api listening on port', PORT));

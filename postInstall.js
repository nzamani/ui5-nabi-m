"use strict";

/* eslint-env es6,node */

const fs = require("fs-extra");
const { Console } = require("console");

var console = new Console({ stdout: process.stdout, stderr: process.stderr });

// blueimp-canvas-to-blob
fs.remove("./src/nabi/m/thirdparty/blueimp-canvas-to-blob").then(() => {
	fs.copySync("./node_modules/blueimp-canvas-to-blob/", "./src/nabi/m/thirdparty/blueimp-canvas-to-blob");
}).catch(err => {
  console.error(err);
});

// pdfjs - attention: this does not include a viever.html + it's the v2 api!
fs.remove("./src/nabi/m/thirdparty/pdfjs-dist").then(() => {
	fs.copySync("./node_modules/pdfjs-dist/", "./src/nabi/m/thirdparty/pdfjs-dist");
}).catch(err => {
  console.error(err);
});

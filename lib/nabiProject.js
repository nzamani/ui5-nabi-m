/* eslint-env es6, node */
/* eslint no-console: "off" */

"use strict";

const objectMerge = require("object-merge");
const multiparty = require("multiparty");			//https://www.npmjs.com/package/multiparty
const fs = require("fs");

module.exports = {

	readJSONSync : sPath => {
		try {
			let sFile = fs.readFileSync(sPath);
			return JSON.parse(sFile);
		} catch (err){
			return null;
		}
	},

	readConfig : function () {
		// derive correct config from ".user.nabi.json" + ".nabi.json" in project root
		const nabiDefaultConfig = fs.existsSync("defaults/.nabi.json") ? this.readJSONSync("defaults/.nabi.json") : {};
		const nabiProjectConfig = fs.existsSync(".nabi.json") ? this.readJSONSync(".nabi.json") : {};
		const nabiUserConfig = fs.existsSync(".user.nabi.json") ? this.readJSONSync(".user.nabi.json") : {};
		const nabiFinalCfg = objectMerge(nabiDefaultConfig, nabiProjectConfig, nabiUserConfig);
		// read sap deployment config file (only needed for sap nw abap deployment)
		const SAPDEPLOY_FILE_PATH = nabiFinalCfg.sapdeploy.configFile;
		let sapDeployConfig = fs.existsSync(SAPDEPLOY_FILE_PATH) ? this.readJSONSync(SAPDEPLOY_FILE_PATH) : {};

		// loop over systems and set credentials (user/password).
		// read NPL credentials from env for jenkins deployment (will be overridden by credentials file below)
		if (process.env.SAPDEPLOY_CREDENTIALS_USR && process.env.SAPDEPLOY_CREDENTIALS_PSW){
			/*
			Object.keys(sapDeployConfig).forEach(function(key) {
				sapDeployConfig[key].options.auth = {
					user: process.env.SAPDEPLOY_CREDENTIALS_USR,
					pwd: process.env.SAPDEPLOY_CREDENTIALS_PSW
				};
			});
			*/
			for (const [/*key,*/ value] of Object.entries(sapDeployConfig)) {
				value.options.auth = {
					user: process.env.SAPDEPLOY_CREDENTIALS_USR,
					pwd: process.env.SAPDEPLOY_CREDENTIALS_PSW
				};
			}
		}

		// read + merge credentials file for sap nw abap deployment
		const SAPDEPLOYUSER_FILE_PATH = nabiFinalCfg.sapdeploy.credentialsFile;
		const oCredentials = fs.existsSync(SAPDEPLOYUSER_FILE_PATH) ? this.readJSONSync(SAPDEPLOYUSER_FILE_PATH) : {};
		sapDeployConfig = objectMerge(sapDeployConfig, oCredentials);
		return {sapDeploy: sapDeployConfig, nabi: nabiFinalCfg};
	},

	handleHttpFileUpload : function(bSave, req, res, next) {
		var bError, count, aFiles, form;

		//var path = require("path");
		//var TMP_UPLOAD_PATH = path.join(__dirname, "tmp/uploads");
		//console.log("TMP_UPLOAD_PATH = " + TMP_UPLOAD_PATH);

		bError = false;
		count = 0;
		aFiles = [];

		// see https://github.com/pillarjs/multiparty for API
		form = new multiparty.Form({
			//uploadDir : TMP_UPLOAD_PATH,
			maxFilesSize : 1024 * 1024 * 15 // 15 MB
		});

		if (bSave) {
			// make sure to manually delete the files afterwards from!!!
			// suggestion: DO NOT USE THIS ON PROD because it exposes internal folder structures
			form.parse(req, function(err, fields, files) {
				if (err) {
					res.writeHead(err.status, {"Content-Type": "application/json;charset=utf-8"});
					res.end(JSON.stringify({errorCode: err.code}));
				} else {
					res.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
					res.end(JSON.stringify({fields: fields, files: files}));
				}
			});
		} else {
			//files are not saved to local disk :-)
			form.on("error", function(err) {
				console.error("Error parsing form: " + err.stack);
				bError = true;
			});

			form.on("part", function(part) {
				if (!part.filename) {
					// filename is not defined when this is a field and not a file
					//console.log("got field named " + part.name);
					part.resume();
				} else if (part.filename) {
					// filename is defined when this is a file
					count++;
					aFiles.push({
						headers : part.headers,
						fieldName: part.name,
						filename: part.filename,
						//byteOffset: part.byteOffset,
						byteCount: part.byteCount
					});
					// ignore file"s content here
					part.resume();
				}

				part.on("error", function(err) {
					console.error("Error parsing part: " + err.stack);
					bError = true;
				});
			});

			form.on("close", function() {
				console.log("Upload completed!");
				res.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
				res.end(
					JSON.stringify({
						success: bError === false,
						uploadedFiles: count,
						files : aFiles
					})
				);
			});
			// finally do the job for us
			form.parse(req);
		}
	},

	/**
	 * Rename JavaScript files, all others stay as they are. Examples:
	 * App.controller.js ==> App-dbg.controller.js
	 * Component.js ==> Component-dbg.js
	 *
	 * @param {string} dest the destination folder
	 * @param {string} src the filename
	 * @returns {string }the new file name for js files
	 */
	fileRename : function(dest, src) {
		let destFilename = "";
		if (src.endsWith(".controller.js")) {
			destFilename = dest + src.replace(/\.controller\.js$/, "-dbg.controller.js");
		} else if (src.endsWith(".js")) {
			destFilename = dest + src.replace(/\.js$/, "-dbg.js");
		} else {
			destFilename = dest + src;
		}
		console.log(src + " ==>" + destFilename + "(dest = " + dest + ", src = " + src + ")");
		return destFilename;
	}

};

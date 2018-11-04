/*global QUnit */
sap.ui.require([
	"nabi/m/ImageFileUploader",
	//do not add to parameter list:
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(ImageFileUploader) {
	"use strict";

	QUnit.module("nabi.m.ImageFileUploader");

	QUnit.test("Should always be successful - ImageFileUploader dummy QUnit test", function (assert) {
		assert.strictEqual(true, true);
	});
});

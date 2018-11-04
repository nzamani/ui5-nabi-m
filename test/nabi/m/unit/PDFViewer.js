/*global QUnit */
sap.ui.require([
	"nabi/m/PDFViewer",
	//do not add to parameter list:
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(PDFViewer) {
	"use strict";

	QUnit.module("nabi.m.PDFViewer");

	QUnit.test("Should instantiate the control with defaults", function (assert) {
		var oPDFViewer = new PDFViewer();
		assert.strictEqual(oPDFViewer.getHeight(), "100%");
		assert.strictEqual(oPDFViewer.getWidth(), "100%");
	});

});

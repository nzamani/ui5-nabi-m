sap.ui.define([
	"sap/ui/test/Opa5",
	"./arrangements/Arrangement",
	"./PDFViewerJourney"
], function (Opa5, Arrangement) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Arrangement(),
		viewNamespace: "test.nabi.m.samplecomp.allinone.view",	// every waitFor will append this namespace in front of your viewName
		autoWait: true
	});
});

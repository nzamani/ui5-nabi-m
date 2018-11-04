/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/Home",
	"./pages/PDFViewer",
], function (opaTest) {
		"use strict";

		QUnit.module("Load PDF File");

		opaTest("Should see a PDF loaded in the PDFViewer", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();

			//Actions
			When.onTheHomePage.iPressOnTheButtonWithId("goToPDFViewerBtn");

			// Assertions
			Then.onThePDFViewerPage.iShouldSeeAPdfFile();
			Then.iTeardownMyAppFrame();
		});

	}
);

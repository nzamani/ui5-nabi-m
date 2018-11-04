sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/I18NText",
	"sap/ui/test/matchers/BindingPath",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/Properties",
], function (Opa5, AggregationLengthEquals, I18NText, BindingPath, Press, EnterText, Properties) {
	"use strict";

	var sViewName = "PDFViewer";

	Opa5.createPageObjects({
		onThePDFViewerPage: {

			actions: { },

			assertions: {
				iShouldSeeAPdfFile: function (sName) {
					return this.waitFor({
						id: "myPdfViewerShowingTheOpenUI5Logo",
						viewName: sViewName,
						matchers: new Properties({
							source: "allinone/static/OpenUI5.pdf"
						}),
						success: function () {
							Opa5.assert.ok(true, "PDF file was displayed in the PDFViewer");
						},
						errorMessage: "No PDF found on the page"
					});
				}

			}
		}
	});

});

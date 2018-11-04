sap.ui.define([
	"test/nabi/m/samplecomp/allinone/controller/BaseController",
	"sap/ui/core/UIComponent"
], function(BaseController, UIComponent) {
	"use strict";

	return BaseController.extend("test.nabi.m.samplecomp.allinone.controller.Home", {

		onGoToImageFileUploader : function (){
			UIComponent.getRouterFor(this).navTo("imageFileUploader");
		},
		onGoToPDFViewer : function (){
			UIComponent.getRouterFor(this).navTo("pdfViewer");
		},
		onGoToPDF : function (){
			UIComponent.getRouterFor(this).navTo("pdf");
		}

	});
});

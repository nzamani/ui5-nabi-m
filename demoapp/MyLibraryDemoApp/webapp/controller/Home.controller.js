sap.ui.define([
	"nabi/demo/MyLibraryDemoApp/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("nabi.demo.MyLibraryDemoApp.controller.Home", {
		
		onGoToImageFileUploader : function (){
			sap.ui.core.UIComponent.getRouterFor(this).navTo("imageFileUploader");
		},
		onGoToPDFViewer : function (){
			sap.ui.core.UIComponent.getRouterFor(this).navTo("pdfViewer");
		}
		
	});
});
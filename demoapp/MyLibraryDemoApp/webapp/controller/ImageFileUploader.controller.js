sap.ui.define([
	"nabi/demo/MyLibraryDemoApp/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("nabi.demo.MyLibraryDemoApp.controller.ImageFileUploader", {
		onUploadComplete : function (oEvent) {
			var sMsg, sStatus = oEvent.getParameter("status");
			if (sStatus === 200) {
				sMsg = "Return Code: 200 "	;
				oEvent.getSource().setValue("");
			} else {
				sMsg = "Error Code: " + sStatus;
			}
			MessageToast.show(sMsg);
		}
	});
});
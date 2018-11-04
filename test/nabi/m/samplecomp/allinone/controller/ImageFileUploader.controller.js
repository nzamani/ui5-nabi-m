sap.ui.define([
	"test/nabi/m/samplecomp/allinone/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("test.nabi.m.samplecomp.allinone.controller.ImageFileUploader", {
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

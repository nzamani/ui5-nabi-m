sap.ui.getCore().attachInit(function () {
	"use strict";
	sap.ui.require([
		"sap/m/Shell",
		"sap/ui/core/ComponentContainer"
	], function (Shell, ComponentContainer) {
		new Shell({
			app : new ComponentContainer({
				height : "100%",
				name : "test.nabi.m.samplecomp.allinone",
				settings : {
					id : "allinone"
				}
			})
		}).placeAt("content");
	});

});

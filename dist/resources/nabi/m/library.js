/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library ui5lab.square.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/library'],
	function(jQuery, library1) {
	"use strict";


	/**
	 * An library containing mobile controls
	 *
	 * @namespace
	 * @name nabi.m
	 * @public
	 */

	// library dependencies

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "nabi.m",
		dependencies : ["sap.ui.core"],
		types: [],
		interfaces: [],
		controls: [
			"nabi.m.PDFViewer"
		],
		elements: [],
		noLibraryCSS: false,
		version: "${version}"
	});

	return nabi.m;

});

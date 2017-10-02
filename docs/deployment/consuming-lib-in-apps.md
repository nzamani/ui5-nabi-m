# Consuming nabi.m in UI5 apps deployed to SAPCP or NW ABAP

## Before you continue deploy the nabi.m library

- [Deployment to SAP Netweaver ABAP](sap-nw-abap-deployment.md)
- [Deployment to SAP Cloud Platform](sap-cloud-platform-deployment.md)


## Demo App consuming nabi.m

1. Deploy the demo app [MyLibraryDemoApp](../../demoapp/MyLibraryDemoApp)

    * Create a zip file with the content of [MyLibraryDemoApp](../../demoapp/MyLibraryDemoApp)
	* Deploy the zip to SAP NW ABAP and/or to SAPCP - just the way you are used to


1. Run the Demo App (it doesn't really matter how):

    ![Demo App using nabi.m controls](img/nabi-m-demo-app.gif)


## Important parts of the Demo App

1. The file `neo-app.json` is only needed for the deployment to SAPCP. To make sure the library is found at runtime the following config is important in `neo-app.json` (assuming you have followed [Deployment to SAP Cloud Platform](sap-cloud-platform-deployment.md)):

    ```json
	{
		"path": "/resources/nabi/m",
		"target": {
			"type": "application",
			"name": "nabimobilelib", 
			"entryPath": "/nabi/m/"
		},
		"description": "UI5 Nabi Mobile Library"
	}
	```

1. The rest of the app is equal no matter if deployed to SAPCP of NW ABAP

1. The `manifest.json` must contain the dependency to `nabi.m`:

    ```json
	"sap.ui5": {
		
		"dependencies": {
			"minUI5Version": "1.30.0",
			"libs": {
				"sap.ui.core": {},
				"sap.m": {},
				"sap.ui.layout": {},
				"sap.ushell": {},
				"sap.collaboration": {},
				"sap.ui.comp": {},
				"sap.uxap": {},
				"nabi.m": {}
			}
		},
		
	}
	```

1. Then the consumption works just like for any other UI5 control (i.e. in XMLViews by declaring the namespace for nabi.m):

    ```xml
	<mvc:View
		controllerName="nabi.demo.MyLibraryDemoApp.controller.PDFViewer"
		xmlns:mvc="sap.ui.core.mvc"
		displayBlock="true"
		xmlns="sap.m"
		xmlns:nabi="nabi.m"
		height="100%">
		<Page
			title="nabi.m.PDFViewer"
			showNavButton="true"
			navButtonPress="onNavBack">
			<content>
				<!-- in real apps you would get the PDF from somewhere else -->
				<nabi:PDFViewer source="static/OpenUI5.pdf"/>
			</content>
		</Page>
	</mvc:View>
	```

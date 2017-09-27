# ui5-nabi-m

UI5 Nabi Mobile - a few things we would love to share with the community.

[![NPM](https://nodei.co/npm/ui5-nabi-m.png?compact=true)](https://npmjs.org/package/ui5-nabi-m)

## Getting started

1. Install [node.js](http://nodejs.org/) (make sure to choose the LTS version, i.e. v6.11.2 LTS)
    
1. Install [git](https://git-scm.com/) if you haven't

1. Optional: Proxy Configuration in case you are working behind a proxy (see [Developing UI5](https://github.com/SAP/openui5/blob/master/docs/developing.md) for details)
	
	```
	HTTP_PROXY=http://proxy:8080
	HTTPS_PROXY=http://proxy:8080
	FTP_PROXY=http://proxy:8080
	NO_PROXY=localhost,127.0.0.1,.mycompany.corp
	```


1. Clone the repository and navigate into it

	```sh
	git clone https://github.com/nzamani/ui5-nabi-m
	cd ui5-nabi-m
	```

1. Install all npm dependencies (also installs all bower dependencies)

	```sh
	npm install
	```

1. Run npm start to lint, build and run a local server (have a look into `Gruntfile.js` to see all the tasks).

	```sh
	npm start
	```

1. Open a test page in your browser:
	- [http://localhost:8080/test-resources/nabi/m/PDFViewer.html](http://localhost:8080/test-resources/nabi/m/PDFViewer.html)
	- [http://localhost:8080/test-resources/nabi/m/ImageFileUploader.html](http://localhost:8080/test-resources/nabi/m/ImageFileUploader.html)

### Directions

[Browser](http://localhost:8080/test-resources/ui5lab/browser/index.html) A sample browser showcasing artifacts from one or more libraries

[Testuite](http://localhost:8080/test-resources/nabi/m/qunit/testsuite.qunit.html) A QUnit testsuite running all unit tests in this library

[Control page](http://localhost:8080/test-resources/nabi/m/PDFViewer.html) An HTML test page instantiating the control

[Control Test page](http://localhost:8080/test-resources/nabi/m/qunit/PDFViewer.qunit.html) A simple QUnit test

## Documentation

- [nabi.m.ImageFileUploader](docs/nabi.m.ImageFileUploader/nabi.m.ImageFileUploader.md)

## Deployment

- [Deployment to SAP Netweaver ABAP](docs/deployment/sap-nw-abap-deployment.md)
- [Deployment to SAP Cloud Platform](docs/deployment/sap-cloud-platform-deployment.md)

## Consumption of nabi.m

- [Consumption of nabi.m in own apps](docs/deployment/consuming-lib-in-apps.md)


## Contributing

This is a [UI5Lab](https://github.com/UI5Lab) project. Find out how to contribute at [UI5Lab-Central](https://github.com/UI5Lab/UI5Lab-central) and become part of the community!


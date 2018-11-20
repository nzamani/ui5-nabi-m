"use strict";

/* eslint-env es6,node */
module.exports = function(grunt) {
	// Log time how long tasks take
	require("grunt-timer").init(grunt, { deferLogs: true, friendlyTime: true, color: "cyan"});

	const nabiProject = require("./lib/nabiProject");

	const CONFIG = nabiProject.readConfig();
	//grunt.log.writeln("\n### nabi config ###\n" + JSON.stringify(CONFIG.sapDeploy, null, 2));

	grunt.initConfig({

		libraryName: "nabi.m",

		dir: {
			src: "src",
			test: "test",
			dist: "dist",
			build: "build",
			buildReportsCoverage: "build/reports/coverage",
			buildBabel: "build/babel",
			nodeModules: "node_modules",
			ui5labBrowser: "node_modules/ui5lab-browser/dist"
		},

		karma: {
			options: {
				browsers: ["Chrome"],
				basePath: ".",
				files: [
					{ pattern: "src/nabi/m/**", 				included: false, served: true, watched: true },
					{ pattern: "test/nabi/m/unit/**", 			included: false, served: true, watched: true },
					{ pattern: "test/nabi/m/integration/**",	included: false, served: true, watched: true },
					{ pattern: "test/nabi/m/samplecomp/**/*",	included: false, served: true, watched: true }
				],
				frameworks: ["qunit", "openui5"],
				openui5: {
					path: "http://localhost:8080/resources/sap-ui-core.js",
					useMockServer: false
				},
				client: {
					//clearContext: true,
					//useIframe: false,
					//captureConsole: true,
					openui5: {
						config: {
							theme: "sap_belize",
							libs: "nabi.m",
							bindingSyntax: "complex",
							compatVersion: "edge",
							animation: "false",
							//frameOptions: "deny",	// this would make the QUnit results in browser "not clickable" etc.
							preload: "async",
							resourceRoots: {
								"nabi.m": "./base/src/nabi/m/",
								"test.nabi.m": "./base/test/nabi/m/"
								// NEVER DO THIS because it would lead to "non-instrumentalized" sources (i.e. coverage not detected):
								//"nabi.m": "http://localhost:8080/resources/nabi/m/",
								//"test.nabi.m": "http://localhost:8080/test-resources/nabi/m/"
							}
						},
						tests: [
							"test/nabi/m/unit/allTests",
							"test/nabi/m/integration/AllJourneys"		// remove this in case in case it take too long, i.e. tdd/dev time
						]/*,
						mockserver: {
							config: {
								autoRespond: true
							},
							rootUri: '/my/service/',
							metadataURL: '/base/test/mock.xml',
							mockdataSettings: { }
						}
						*/
					}
				},
				reporters: ["progress"],
				port: 9876,
				logLevel: "INFO",
				browserConsoleLogOptions: {
					level: "warn"
				}
			},
			ci: {
				singleRun: true,
				browsers: ["ChromeHeadless"],
				preprocessors: {
					// src files for which we want to get coverage.
					// Exclude thirdparty libs, irrelevant folders (i.e. themes, test), and maybe also library.js and UI5 Renderers (your decision).
					"{src/nabi/m,src/nabi/m/!(thirdparty|themes|test)}/!(library|*Renderer)*.js": ["coverage"]
				},
				coverageReporter: {
					includeAllSources: true,
					dir: "<%= dir.buildReportsCoverage %>",
					reporters: [
						{ type: "html", subdir: "report-html"},
						{ type: "cobertura", subdir: "." },	//jenkins
						{ type: "text"}
					],
					check: {
						each: {
							statements: 30,
							branches: 30,
							functions: 30,
							lines: 30
						}
					}
				},
				reporters: ["progress", "coverage"]
			},
			watch: {
				client: {
					clearContext: false,
					qunit: {
						showUI: true
					}
				}
			},
			coverage: {		//same as ci, but  without the checks
				singleRun: true,
				browsers: ["ChromeHeadless"],
				preprocessors: {
					// src files for which we want to get coverage.
					// Exclude thirdparty libs, irrelevant folders (i.e. themes, test), and maybe also library.js and UI5 Renderers (your decision).
					"{src/nabi/m,src/nabi/m/!(thirdparty|themes|test)}/!(library|*Renderer)*.js": ["coverage"]
				},
				coverageReporter: {
					includeAllSources: true,
					dir: "<%= dir.buildReportsCoverage %>",
					reporters: [
						{ type: "html", subdir: "report-html"},
						{ type: "cobertura", subdir: "." },	//jenkins
						{ type: "text"}
					],
				},
				reporters: ["progress", "coverage"]
			}
		},

		babel : {
			options : {
				// see .babelrc
			},
			dist : {
				files : [{
					expand: true,
					cwd: "<%= dir.dist %>/resources",
					src: [
						"**/*.js",
						"!nabi/m/themes/**",
						"!nabi/m/thirdparty/**",
						"!nabi/m/**/*-dbg.js",
						"!nabi/m/**/*-dbg.controller.js"
					],
					dest: "<%= dir.dist %>/resources/"		//trailing slash is important
				}]
			},
			srcToBuildBabel : {
				files : [{
					expand: true,
					cwd: "<%= dir.src %>",
					src: [
						"**/*.js",
						"!nabi/m/themes/**",
						"!nabi/m/thirdparty/**"
					],
					dest: "<%= dir.buildBabel %>/"		//trailing slash is important
				}]
			}
		},

		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			serveSrcBabel: {
				tasks: ["watch:babel", "serve:srcWithBabel"]
			},
			serveSrcEdge : {
				tasks: ["watch:babel", "serve:srcWithBabel", "karma:watch"]
			}
		},

		watch: {
			babel: {
				//cwd: "<%= dir.src %>",	//this seems not to work with the next LoC as expected
				//files: ["**/*.js", "!nabi/m/themes/**", "!nabi/m/thirdparty/**"],
				files: ["<%= dir.src %>/**/*.js", "!<%= dir.src %>/nabi/m/themes/**", "!<%= dir.src %>/nabi/m/thirdparty/**"],
				tasks: ["clean:buildBabel", "babel:srcToBuildBabel"],
				options: {
					interrupt: true
				}
			}
		},

		connect: {
			options: {
				port: 8080,
				hostname: "*",
				middleware: function(connect, options, middlewares) {
					// inject a custom middleware into the array of default middlewares

					middlewares.unshift(
						connect().use("/upload", function(req, res, next) {
							//nabiProject.handleHttpFileUpload(false, req, res, next);
							nabiProject.handleHttpFileUpload(true, req, res, next);	//ONLY FOR LOCAL DEV!!!
							return undefined;
		        })
					);
					return middlewares;
				}

			},
			src: {},
			srcWithBabel: {},
			dist: {}
		},

		openui5_connect: {
			options : {
				cors: {
					origin: 'http://localhost:<%= karma.options.port %>'
				}
			},
			src: {
				options: {
					resources: [
						"<%= dir.nodeModules %>/@openui5/sap.ui.core/src",
						"<%= dir.nodeModules %>/@openui5/sap.m/src",
						"<%= dir.nodeModules %>/@openui5/sap.f/src",
						"<%= dir.nodeModules %>/@openui5/sap.ui.layout/src",
						"<%= dir.nodeModules %>/@openui5/sap.ui.unified/src",
						"<%= dir.nodeModules %>/@openui5/themelib_sap_belize/src",
						"<%= dir.src %>"
					],
					testresources: [
						"<%= dir.test %>",
						"<%= dir.ui5labBrowser %>/test-resources"
					]
				}
			},
			srcWithBabel: {
				options: {
					resources: [
						"<%= dir.nodeModules %>/@openui5/sap.ui.core/src",
						"<%= dir.nodeModules %>/@openui5/sap.m/src",
						"<%= dir.nodeModules %>/@openui5/sap.f/src",
						"<%= dir.nodeModules %>/@openui5/sap.ui.layout/src",
						"<%= dir.nodeModules %>/@openui5/sap.ui.unified/src",
						"<%= dir.nodeModules %>/@openui5/themelib_sap_belize/src",
						// the order of these two is important because contents from buildBabel shall be preferred over src
						"<%= dir.buildBabel %>",
						"<%= dir.src %>"
					],
					testresources: [
						"<%= dir.test %>",
						"<%= dir.ui5labBrowser %>/test-resources"
					]
				}
			},
			dist: {
				options: {
					resources: [
						"<%= dir.nodeModules %>/@openui5/sap.ui.core/src",
						"<%= dir.nodeModules %>/@openui5/sap.m/src",
						"<%= dir.nodeModules %>/@openui5/sap.f/src",
						"<%= dir.nodeModules %>/@openui5/sap.ui.layout/src",
						"<%= dir.nodeModules %>/@openui5/sap.ui.unified/src",
						"<%= dir.nodeModules %>/@openui5/themelib_sap_belize/src",
						"<%= dir.dist %>/resources"
					],
					testresources: [
						"<%= dir.dist %>/test-resources",
						"<%= dir.ui5labBrowser %>/test-resources"
					]
				}
			}
		},

		openui5_theme: {
			theme: {
				files: [
					{
						expand: true,
						cwd: "<%= dir.src %>",
						src: "**/themes/*/library.source.less",
						dest: "<%= dir.dist %>/resources"
					}
				],
				options: {
					rootPaths: [
						"<%= dir.nodeModules %>/@openui5/sap.ui.core/src",
						"<%= dir.nodeModules %>/@openui5/themelib_sap_belize/src",
						"<%= dir.src %>"
					],
					library: {
						name: "<%= libraryName %>"
					}
				}
			}
		},

		openui5_preload: {
			library: {
				options: {
					resources: "<%= dir.dist %>/resources",
					dest: "<%= dir.dist %>/resources",
					compatVersion : "1.44"
				},
				libraries: {
					"nabi/m": {
						src : [
							"nabi/m/**",
							"!nabi/m/thirdparty/**",
							"!nabi/m/**/*-dbg.js",
							"!nabi/m/**/*-dbg.controller.js"
						]
					}
				}
			}
		},

		clean: {
			dist: ["<%= dir.dist %>/"],
			build: ["<%= dir.build %>/"],
			buildBabel: ["<%= dir.buildBabel %>/"],
			coverage: "<%= dir.buildReportsCoverage %>"
		},

		copy: {
			srcToDist: {
				files: [
					{	// first all resources incl. themes, thirdparty and even less files (won't harm)
						expand: true,
						src: [ "**", "nabi/m/.library" ],
						cwd: "<%= dir.src %>",
						dest: "<%= dir.dist %>/resources/",		//trailing slash is important
					}, {
						//finally the test resources
						expand: true,
						cwd: "<%= dir.test %>",
						src: ["**"],
						dest: "<%= dir.dist %>/test-resources"
					}
				]
			},
			srcToDistDbg : {
				files : [
					{	// rename ui5 js files to *-dbg.js / *-dbg.controller.js
						expand: true,
						src: ["**/*.js", "!nabi/m/themes/**", "!nabi/m/thirdparty/**"],
						cwd: "<%= dir.src %>",
						dest: "<%= dir.dist %>/resources/",		//trailing slash is important
						rename: nabiProject.fileRename
					}
				]
			},
			distToDistDbg : {
				files : [
					{	// rename ui5 js files to *-dbg.js / *-dbg.controller.js
						expand: true,
						src: ["**/*.js", "!nabi/m/themes/**", "!nabi/m/thirdparty/**"],
						cwd: "<%= dir.dist %>/resources",
						dest: "<%= dir.dist %>/resources/",		//trailing slash is important
						rename: nabiProject.fileRename
					}
				]
			}
		},

		jsdoc : {
			dist : {
				src : ["src/**/*.js", "README.md", "!nabi/m/themes/**", "!nabi/m/thirdparty/**"],
				options : {
					destination : "jsdoc",
					template : "node_modules/ink-docstrap/template",
					configure : "node_modules/ink-docstrap/template/jsdoc.conf.json"
				}
			}
		},

		eslint: {
			src: ["<%= dir.src %>"],
			test: ["<%= dir.test %>"],
			gruntfile: ["Gruntfile.js"]
		},

		compress: {
			dist : {
				options: {
					archive: "<%= dir.dist %>/nabi-m.zip"
				},
				expand: true,
				cwd: "<%= dir.dist %>/resources/nabi/m",
				src: ["**/*"],
				dot : true,
				dest: "/"
			}
		},

		nwabap_ui5uploader: CONFIG.sapDeploy

	});

	// These plugins provide necessary tasks.
	// Maybe I'll switch to this in future: require("load-grunt-tasks")(grunt);
	grunt.loadNpmTasks("grunt-babel");
	grunt.loadNpmTasks("grunt-jsdoc");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-openui5");
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-concurrent");
	grunt.loadNpmTasks("grunt-karma");
	grunt.loadNpmTasks("grunt-nwabap-ui5uploader");

	// Default task
	grunt.registerTask("default", [
		"lint",
		"build",
		"serve:dist"
	]);

	// Server tasks
	grunt.registerTask("serve", function(target) {
		grunt.task.run("openui5_connect:" + (target || "src") + ":keepalive");
	});
	grunt.registerTask("serve:tdd", ["clean:coverage", "openui5_connect:src", "karma:watch"]);
	grunt.registerTask("serve:devEdge", ["clean:coverage", "clean:buildBabel", "babel:srcToBuildBabel", "concurrent:serveSrcEdge"]);
	grunt.registerTask("serve:babel", ["clean:buildBabel", "babel:srcToBuildBabel", "concurrent:serveSrcBabel"]);
	grunt.registerTask("serve:srcBabel", ["clean:buildBabel", "babel:srcToBuildBabel", "serve:srcWithBabel"]);
	grunt.registerTask("serve:distBabel", ["build:babel","serve:dist"]);

	// Test tasks
	grunt.registerTask("test", ["clean:coverage", "openui5_connect:src", "karma:coverage"]);
	grunt.registerTask("test:ci",["clean:coverage", "openui5_connect:src", "karma:ci"]);

	// Linting tasks
	grunt.registerTask("lint", ["eslint"]);

	// Build tasks
	grunt.registerTask("build", ["clean:dist", "openui5_theme", "copy:srcToDist", "copy:srcToDistDbg", "openui5_preload", "compress:dist"]);
	grunt.registerTask("build:babel", ["clean:dist", "openui5_theme", "copy:srcToDist", "babel:dist", "copy:distToDistDbg", "openui5_preload", "compress:dist"]);

	// SAP deployments
	grunt.registerTask("sapdeploy", ["lint", "build", "nwabap_ui5uploader"]);
	grunt.registerTask("sapdeploy:babel", ["lint", "build:babel", "nwabap_ui5uploader"]);

};

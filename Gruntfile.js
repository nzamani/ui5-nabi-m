module.exports = function(grunt) {
	'use strict';

	//https://www.npmjs.com/package/multiparty
	var multiparty = require('multiparty');
	//var path = require('path');
	//var TMP_UPLOAD_PATH = path.join(__dirname, 'tmp/uploads');
	//console.log("TMP_UPLOAD_PATH = " + TMP_UPLOAD_PATH);

	var fnHandleFileUpload = function(bSave, req, res, next) {
		var bError, count, aFiles, form;

		bError = false;
		count = 0;
		aFiles = [];

		// see https://github.com/pillarjs/multiparty for API
		form = new multiparty.Form({
			//uploadDir : TMP_UPLOAD_PATH,
			maxFilesSize : 1024 * 1024 * 15 // 15 MB
		});

		if (bSave) {
			// make sure to manually delete the files afterwards from!!!
			// suggestion: DO NOT USE THIS ON PROD because it exposes internal folder structures
			form.parse(req, function(err, fields, files) {
				if (err) {
					res.writeHead(err.status, {'Content-Type': 'application/json;charset=utf-8'});
					res.end(JSON.stringify({errorCode: err.code}));
				} else {
					res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
					res.end(JSON.stringify({fields: fields, files: files}));
				}
			});
		} else {
			//files are not saved to local disk :-)
			form.on('error', function(err) {
				console.log('Error parsing form: ' + err.stack);
				bError = true;
			});

			form.on('part', function(part) {
				if (!part.filename) {
					// filename is not defined when this is a field and not a file
					//console.log('got field named ' + part.name);
					part.resume();
				} else if (part.filename) {
					// filename is defined when this is a file
					count++;
					aFiles.push({
						headers : part.headers,
						fieldName: part.name,
						filename: part.filename,
						//byteOffset: part.byteOffset,
						byteCount: part.byteCount
					});
					// ignore file's content here
					part.resume();
				}

				part.on('error', function(err) {
					console.log('Error parsing part: ' + err.stack);
					bError = true;
				});
			});

			form.on('close', function() {
				console.log('Upload completed!');
				res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
				res.end(
					JSON.stringify({
						success: bError === false,
						uploadedFiles: count,
						files : aFiles
					})
				);
			});
			// finally do the job for us
			form.parse(req);
		}
	};

	grunt.initConfig({

		libraryName: 'nabi.m',

		dir: {
			src: 'src',
			test: 'test',
			dist: 'dist',
			bower_components: 'bower_components',
			ui5lab_browser: 'node_modules/ui5lab-browser/dist'
		},

		connect: {
			options: {
				port: 8080,
				hostname: '*',
				middleware: function(connect, options, middlewares) {
					// inject a custom middleware into the array of default middlewares

					middlewares.unshift(
						connect().use('/upload', function(req, res, next) {
							//fnHandleFileUpload(false, req, res, next);
							fnHandleFileUpload(true, req, res, next);	//ONLY FOR LOCAL DEV!!!
							return undefined;
		        })
					);
					return middlewares;
				}

			},
			src: {},
			dist: {}
		},

		openui5_connect: {
			src: {
				options: {
					resources: [
						'<%= dir.bower_components %>/openui5-sap.ui.core/resources',
						'<%= dir.bower_components %>/openui5-sap.m/resources',
						'<%= dir.bower_components %>/openui5-sap.f/resources',
						'<%= dir.bower_components %>/openui5-sap.ui.layout/resources',
						'<%= dir.bower_components %>/openui5-sap.ui.unified/resources',
						'<%= dir.bower_components %>/openui5-themelib_sap_belize/resources',
						'<%= dir.src %>'
					],
					testresources: [
						'<%= dir.bower_components %>/openui5-sap.ui.core/test-resources',
						'<%= dir.bower_components %>/openui5-sap.m/test-resources',
						// TODO: how to get rid of these indirect dependencies only needed for the browser (f + layout)
						'<%= dir.bower_components %>/openui5-sap.f/test-resources',
						'<%= dir.bower_components %>/openui5-sap.ui.layout/test-resources',
						'<%= dir.bower_components %>/openui5-sap.ui.unified/test-resources',
						'<%= dir.bower_components %>/openui5-themelib_sap_belize/test-resources',
						'<%= dir.test %>',
						'<%= dir.ui5lab_browser %>/test-resources'
					]
				}
			},
			dist: {
				options: {
					resources: [
						'<%= dir.bower_components %>/openui5-sap.ui.core/resources',
						'<%= dir.bower_components %>/openui5-sap.m/resources',
						'<%= dir.bower_components %>/openui5-sap.f/resources',
						'<%= dir.bower_components %>/openui5-sap.ui.layout/resources',
						'<%= dir.bower_components %>/openui5-sap.ui.unified/resources',
						'<%= dir.bower_components %>/openui5-themelib_sap_belize/resources',
						'<%= dir.dist %>/resources'
					],
					testresources: [
						'<%= dir.bower_components %>/openui5-sap.ui.core/test-resources',
						'<%= dir.bower_components %>/openui5-sap.m/test-resources',
						'<%= dir.bower_components %>/openui5-sap.f/test-resources',
						'<%= dir.bower_components %>/openui5-sap.ui.layout/test-resources',
						'<%= dir.bower_components %>/openui5-sap.ui.unified/test-resources',
						'<%= dir.bower_components %>/openui5-themelib_sap_belize/test-resources',
						'<%= dir.dist %>/test-resources',
						'<%= dir.ui5lab_browser %>/test-resources'
					]
				}
			}
		},

		openui5_theme: {
			theme: {
				files: [
					{
						expand: true,
						cwd: '<%= dir.src %>',
						src: '**/themes/*/library.source.less',
						dest: '<%= dir.dist %>/resources'
					}
				],
				options: {
					rootPaths: [
						'<%= dir.bower_components %>/openui5-sap.ui.core/resources',
						'<%= dir.bower_components %>/openui5-themelib_sap_belize/resources',
						'<%= dir.src %>'
					],
					library: {
						name: '<%= libraryName %>'
					}
				}
			}
		},

		openui5_preload: {
			library: {
				options: {
					resources: '<%= dir.src %>',
					dest: '<%= dir.dist %>/resources'
				},
				libraries: {
					'nabi/m': {
						src : [
							'nabi/m/**',
							'!nabi/m/thirdparty/**'
						]
					}
				}
			}
		},

		clean: {
			dist: '<%= dir.dist %>/'
		},

		copy: {
			dist: {
				files: [ {
					expand: true,
					cwd: '<%= dir.src %>',
					src: [
						'**'
					],
					dest: '<%= dir.dist %>/resources'
				}, {
					expand: true,
					cwd: '<%= dir.test %>',
					src: [
						'**'
					],
					dest: '<%= dir.dist %>/test-resources'
				} ]
			}
		},

		eslint: {
			src: ['<%= dir.src %>'],
			test: ['<%= dir.test %>'],
			gruntfile: ['Gruntfile.js']
		}

	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-openui5');
	grunt.loadNpmTasks('grunt-eslint');

	// Server task
	grunt.registerTask('serve', function(target) {
		grunt.task.run('openui5_connect:' + (target || 'src') + ':keepalive');
	});

	// Linting task
	grunt.registerTask('lint', ['eslint']);

	// Build task
	grunt.registerTask('build', ['openui5_theme', 'openui5_preload', 'copy']);

	// Default task
	grunt.registerTask('default', [
		'lint',
		'clean',
		'build',
		'serve:dist'
	]);
};

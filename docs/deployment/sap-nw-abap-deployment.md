# Deployment of nabi.m SAP NW ABAP

## Before Deployment

1. Install all npm dependencies (also installs all bower dependencies)
    ```sh
    npm install
    ```

## SAP Netweaver ABAP


1. Create one of the following 2 files in the root of this project: `.nabi.json` and/or `.user.nabi.json`, i.e. by copying the template + changing the content with vi:
    - `cp defaults/.nabi.json .nabi.json` and then `vi .nabi.json`
	- `cp defaults/.nabi.json .user.nabi.json` and then `vi .user.nabi.json`
	- The content of the file describes where to find the files `.sapdeploy.json` and `.sapdeployuser.json`, which we create in the next steps:
		- `.nabi.json` (default):

			```json
			{
				"_version": "0.2.0",
				"sapdeploy" : {
					"configFile" : ".sapdeploy.json",
					"credentialsFile" : "~/.sapdeployuser.json"
				},
				"sapui5" : {
					"sdk" : "~/sapui5/"
				}
			}
			```
		
		- `.user.nabi.json` (we only overwrite the path to the credentialsFile):

			```json
			{
				"_version": "0.2.0",
				"sapdeploy" : {
					"credentialsFile" : "/home/myuser/.sapdeployuser.json"
				}
			}
			```

	**Hint:** The file `.nabi.json` can contain global settings checked in into git so that everybody has these settings. Using `.user.nabi.json` allows to overwrite the project/global settings according to the needs of the current developer. Thus, `.user.nabi.json` is never checked in (see `.gitignore` file)! Having one of the 2 files with the correct configuration is enough for the deployment via sapdeploy. In the example above we keep the configFile at `.sapdeploy.json` (default) and we overwrite the credentialsFile with `/home/myuser/.sapdeployuser.json` assuming your user's home dir is in `/home/myuser/` (please change as needed). In this case we actually don't even need the file `.nabi.json` because its content is the default anyway.

	**IMPORTANT:** It is suggested to put the credentials file (`.sapdeployuser.json`) into the user's home dir. For details see below.

1. Create a file `.sapdeploy.json` in the root of this project, i.e. by copying the template + changing the vontent with vi:
    - `cp defaults/.sapdeploy.json .sapdeploy.json`
	- `vi .sapdeploy.json`:

        ```json
		{
			"upload_build_abap_750": {
				"options": {
					"conn": {
						"server": "https://myserver750:8181",
						"useStrictSSL" : true
					},
					"ui5": {
						"package": "ZZ_UI5_REPO",
						"bspcontainer": "ZZ_UI5_TRACKED",
						"bspcontainer_text": "UI5 upload",
						"transportno": "DEVK900000",
						"language" : "EN",
						"calc_appindex": true
					},
					"resources": {
						"cwd": "<%= dir.dist %>/resources",
						"src": "**/*.*"
					}
				}
			},
			"upload_build_abap_740": {
				"options": {
					"conn": {
						"server": "https://myserver740:8181",
						"useStrictSSL" : true
					},
					"ui5": {
						"package": "ZZ_UI5_REPO",
						"bspcontainer": "ZZ_UI5_TRACKED",
						"bspcontainer_text": "UI5 upload",
						"transportno": "DEVK900000",
						"language" : "EN",
						"calc_appindex": true
					},
					"resources": {
						"cwd": "<%= dir.dist %>/resources",
						"src": "**/*.*"
					}
				}
			}
		}
        ```

	- The example content of the file deploys to both `upload_build_abap_750` and `upload_build_abap_750`
	- Each of them can have it's own cofiguration and credentials (see also next step)
	- This file can and should be checked in into your own git repo (maybe in an own branch)
    - The basic config for each target system looks like this:
		* **conn.server**: The base url to the abap server used as target for deployment
		* **conn.useStrictSSL**: If true then the server must have a valid certificate
		* **ui5.package**: The package in which the BSP is created
		* **ui5.bspcontainer**: The name of the BSP application containing the UI5 app (max 15 chars)
		* **ui5.bspcontainer_text**: The description for the BSP application
		* **ui5.transportno**: The existing and modifiable Transport Request (make sure you have a task in this request!)
		* **ui5.language**: please always use "EN"
		* **ui5.calc_appindex**: If true then the UI5 app index gets calculated

    **Hint:** The ABAP deployment intertnally uses [grunt-nwabap-ui5uploader](https://github.com/pfefferf/grunt-nwabap-ui5uploader). Have a look at the documentation for config details. Basically, what you see in `.sapdeploy.json` comes from [grunt-nwabap-ui5uploader](https://github.com/pfefferf/grunt-nwabap-ui5uploader). However, the `auth` config 
	is extracted into `.sapdeployuser.json` (see next step).


1. Create a file `.sapdeployuser.json` in you user's home dir (replace user/password with your real credentials), i.e. by copying the template + changing the content/credentials with vi:
    - `cp defaults/.sapdeployuser.json ~/.sapdeployuser.json`
	- `vi ~/.sapdeployuser.json`:

        ```json
		{
			"upload_build_abap_750":{
				"options":{
					"auth":{
						"user": "myUser",
						"pwd": "myPwd"
					}
				}
			},
			"upload_build_abap_740": {
				"options":{
					"auth":{
						"user": "myUser",
						"pwd": "myPwd"
					}
				}
			}
		}
        ```

	**Hint:** Make sure not to show this file to anyone. It's ouside of the project to avoid it gets checked in accidentally. 
	The credentials in this file are used for the sap deployment task (sapdeploy), see below for details. `upload_build_abap_750` and `upload_build_abap_750` are placeholders and they correspond to the configuration of the sapdeploy task (see file `.sapdeploy.json` in project root).



1. Lint + build + deploy to SAP via Grunt
    * `grunt sapdeploy` : build + deploy to SAP
    
	**Hint:** The deployment might fail because of the Virus Scanner configuration of your ABAP target system(s). In that case contact your system admin and ask the admin to check the Virus Scan Profile(s). A good start is the transaction code `VSCANTEST`. There you can 
	choose the files that are blocked (i.e. from the local file system). After that you simply choose your Virus Scan Profile and press execute (repeat this for suspicious Virus Scan Profiles). Furthermore, make sure the URL you are uploading to is not blocked by your firewall.

## Consumption of nabi.m

- [Consumption of nabi.m in own apps](consuming-lib-in-apps.md)


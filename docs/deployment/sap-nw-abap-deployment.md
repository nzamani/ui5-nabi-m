# Deployment of nabi.m SAP NW ABAP

## Before Deployment

1. Install all npm dependencies (also installs all bower dependencies)
    ```sh
    npm install
    ```

## SAP Netweaver ABAP

1. Create `HOME` environment variable pointing to your user's hopme dir
    - this is later used to find the file `.sapdeployuser.json` whixch will later contain your credentials

1. Create a file `.sapdeployuser.json` in you user home dir (replace user/password with your real credentials), i.e. by copying the template:
    - `cp .sapdeployuser.template.json ~/.sapdeployuser.json`
	- Change credentials inside the file you created, i.e. with `vi ~/.sapdeployuser.json`:

        ```json
        {
			"upload_build_abap_750":{
				"user": "myUser",
				"pwd": "myPwd"
			},
			"upload_build_abap_740": {
				"user": "myUser",
				"pwd": "myPwd"
			}
		}
        ```

	**Hint:** Make sure not to show this file to anyone. Is is ouside of the project in order to avoid it gets checked in accidentally. 
	The credentials in this file in sap deployment task (sapdeploy), see below for details. `upload_build_abap_750` and `upload_build_abap_750` are placeholders and they correspond to the configuration of the sapdeploy task.

1. Update the file `.sapdeploy.json` in the root of this project

	* The example content of the file deploys to both `upload_build_abap_750` and `upload_build_abap_750`
	* Each of them can have it's own cofiguration and credentials (see also previous step)
	* This file can and should be checked in into your own git repo (maybe in an own branch)

    * **conn.server**: The base url to the abap server used as target for deployment
    * **conn.useStrictSSL**: If true then the server must have a valid certificate
    * **ui5.package**: The package in which the BSP is created
	* **ui5.bspcontainer**: The name of the BSP application containing the UI5 app (max 15 chars)
	* **ui5.bspcontainer_text**: The description for the BSP application
	* **ui5.transportno**: The existing and modifiable Transport Request (make sure you have a task in this request!)
	* **ui5.language**: please always use "EN"
	* **ui5.calc_appindex**: If true then the UI5 app index gets calculated

    **Hint:** The ABAP deployment is triggered via [grunt-nwabap-ui5uploader](https://github.com/pfefferf/grunt-nwabap-ui5uploader). Have a look at its documentation for config details. Basically, this is what you see in `.sapdeploy.json`. However, the `auth` config 
	is extracted into `~/.sapdeployuser.json`.

1. Lint + build + deploy to SAP via Grunt
    * `grunt sapdeploy` : build + deploy to SAP
    
	**Hint:** The deployment might fail because of the Virus Scanner configuration of your ABAP target system(s). In that case contact your system admin and ask the admin to check Virus Scan Profile(s). A good start is the transaction code `VSCANTEST`. Their you can 
	choose the files that are blocked (i.e. from the local file system). After that you simply choose your Virus Scan Profile and press execute (repeat this for suspicious Virus Scan Profiles). Furthermore, make sure the URL you are uploading to is not blocked by your firewall.


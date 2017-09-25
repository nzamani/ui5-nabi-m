# Deployment of nabi.m to SAP Cloud Platform (SAPCP)

## Before Deployment

1. Install all npm dependencies (also installs all bower dependencies)
    ```sh
    npm install
    ```


## SAP Cloud Platform (SAPCP)

Deploying to SAPCP can be achieved via in multiple ways, i.e. using the Web IDE. However, if your are not using the Web IDE you can still deploy by using the SAPCP Cockpit:

1. Lint + build the library
    ```sh
    grunt lint build
    ```

    **Hint:** This will create a file **nabi-m.zip** in the dist folder. This is the file yo want to uplöoad in the next step.

1. In your SAP Cloud Platform Cockpit got to HTML5 Applications an press **Import from File**

    ![SAPCP Cockpit - Step 1](img/sapcp-cockpit-deploy-1.png)


1. Select the library zip file, choose a name and a verison **Import**

    ![SAPCP Cockpit - Step 2](img/sapcp-cockpit-deploy-2.png)


1. Click the application name you have chosen under **HTML5 Applications**

    ![SAPCP Cockpit - Step 3](img/sapcp-cockpit-deploy-3.png)


1. Under **Versioning** press the **Activate** button for the version you just uploaded

    ![SAPCP Cockpit - Step 4](img/sapcp-cockpit-deploy-4.png)


1. Confirm the dialog in case it showes up

    ![SAPCP Cockpit - Step 5](img/sapcp-cockpit-deploy-5.png)


1. The app should be started now

    ![SAPCP Cockpit - Step 6](img/sapcp-cockpit-deploy-6.png)

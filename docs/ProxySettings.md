# Proxy Settings

## Windows

1. On Windows you may want to set you proxy by using the Windows Command Prompt:
    * execute win cmd: `rundll32.exe sysdm.cpl,EditEnvironmentVariables`
    * Then set the user env vars:
      * HTTP_PROXY=http://proxy:8080
      * HTTPS_PROXY=http://proxy:8080
      * FTP_PROXY=http://proxy:8080
      * NO_PROXY=localhost,127.0.0.1,mycompany.corp

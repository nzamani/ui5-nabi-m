pipeline {
    agent any
    tools {nodejs "Node"}
    /*options {
        //disableConcurrentBuilds() //we use the "Lockable Resources plugin" instead, see stage "Deploy"
    }*/
    environment {
        /**
         * "$SAPDEPLOY_CREDENTIALS"     ==> "USR:PSW"
         * "$SAPDEPLOY_CREDENTIALS_USR" ==> Username
         * "$SAPDEPLOY_CREDENTIALS_PSW" ==> Password
         */
        // Username + password for ZSJENKINS jenkins user on NPL via "Username and Password"
        SAPDEPLOY_CREDENTIALS = credentials('ZSJENKINS_USRPWD')

        // Both periodic git jobs and gerrit tiggered jobs have o use same lock!
        // Use gerrit project name, thus we need to trim the gerrit base url from GIT_URL for periodic jobs
        GERRIT_BASE_URL = "ssh://gerrit.my.company.com:29418/"
        LOCK_NAME = "foo" // will be filled dynamically in "Deploy" stage
    }
    stages {
        stage('Prepare') {
            steps {
                sh 'npm install'
                //bat 'npm install'
            }
        }
        stage('Validate') {
            steps {
                sh 'grunt lint'
                //bat 'grunt lint'
            }
        }
        stage('Build') {
            when {
                anyOf {
                    expression { env.GERRIT_EVENT_TYPE == "change-merged" } // gerrit merge to master
                    expression { env.GERRIT_EVENT_TYPE == null }            // for periodic job w/o gerrit event
                }
            }
            steps {
                sh 'grunt build'
                //bat 'grunt build'
            }
        }
        /*
        stage('Test'){
            steps {
                sh 'echo "OPA/Qunit skipped on purpose because nothing is available yet."'
            }
        }
        */
        stage('Deploy') {
            when {
                anyOf {
                    expression { env.GERRIT_EVENT_TYPE == "change-merged" } // gerrit merge to master
                    expression { env.GERRIT_EVENT_TYPE == null }            // for periodic job w/o gerrit event
                }
            }
            steps {
                // calculate the lock name dynamically:
                // Must be same for both gerrit and peridoc triggered jobs!
                // Example: "sddr/ui5/ssf-docmgr-SapDeployment"
                script {
                    if ( env.GERRIT_EVENT_TYPE == null ) {
                        LOCK_NAME = env.GIT_URL.split(GERRIT_BASE_URL)[1] + "-SapDeployment"
                    } else {
                        LOCK_NAME = env.GERRIT_PROJECT + "-SapDeployment"
                    }
                }

                // here the lock is always the gerrit project + appending "-SapDeployment"
                lock (LOCK_NAME) {
                    sh 'grunt nwabap_ui5uploader:NPL'
                    //bat 'grunt nwabap_ui5uploader:NPL'
                }
            }
        }
    }
}

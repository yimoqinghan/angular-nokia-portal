pipeline {
    agent any
 
    stages {
        // stage('Clone') {
        //    steps {
        //        sh 'git config --global http.sslverify false'
        //        git credentialsId: '6d78cd5f-55a0-4982-b4d7-aa61b31e58e3', url: 'https://gitlab.nokia-ices.io/ices-global/ices-ai-eigine-esp.git'
        //    }
        //}
        stage('Build') {
            steps {
               // sh 'export MAVEN_HOME=/home/maven-3.6.3 && export PATH=${MAVEN_HOME}/bin:$PATH && mvn install'
                //sh 'env'
                sh '''
                npm config set proxy=http://10.144.1.10:8080
                npm install @angular/cli@9
                ng build --prod --aot
                '''

               // sh 'ng build --prod --aot'
            }
        }  
        stage('Distribution') {
            steps {
               // sh "k8s-node1_ip=`ping k8s-node1 -c 1 | head -1 | awk -F '[()]' '{print \$2}'`"
                //sh "echo $k8s-node1_ip"
               // sh "sed -i  -r '/http/s/(\\b[0-9]{1,3}\\.){3}[0-9]{1,3}:[0-9]{1,5}\\b'/`ping k8s-node1 -c 1 | head -1 | awk -F '[()]' '{print \$2}'`:8080/   dist/ices-portal/config/app-config.json"
                sh '''
                   ssh   root@10.56.24.28 rm -rf /home/ran/ices-enterprise-portal/*
                   scp -r dist/ices-enterprise-portal/*  root@10.56.24.28:/home/ran/ices-enterprise-portal/
                    ssh   root@10.56.24.28 chmod a+r /home/ran/ices-enterprise-portal/* -R
                   '''
              //  sh 'scp target/*.jar  root@k8s-node2:${iCES_DIR}/${JOB_NAME}/'

            }
        }  
        stage('Deploy') {
            steps {
   
                sh 'ssh   root@10.56.24.28 "docker restart nginx-ices"'
                //sh 'ssh   root@k8s-node2 "cd ${iCES_DIR} ; sh  update_images.sh ${JOB_NAME}"'
               //sh 'env'
            }
        }         
    }
}


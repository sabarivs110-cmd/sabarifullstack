pipeline {

    agent any

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-creds',
                    url: 'https://github.com/sabarivs110-cmd/sabarifullstack.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                docker compose build
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                docker compose down
                docker compose up -d
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                docker ps
                '''
            }
        }

    }

}

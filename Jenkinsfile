pipeline {

    agent any

    environment {
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "660815084808"

        BACKEND_IMAGE = "sabarifullstack-backend"
        FRONTEND_IMAGE = "sabarifullstack-frontend"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-token',
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


        stage('Login to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION | \
                docker login --username AWS --password-stdin \
                $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                '''
            }
        }


        stage('Tag Images') {
            steps {
                sh '''
                docker tag sabarifullstack-pipeline-backend:latest \
                $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_IMAGE:v1


                docker tag frontend-app:latest \
                $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_IMAGE:v1
                '''
            }
        }


        stage('Push Images to ECR') {
            steps {
                sh '''
                docker push \
                $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_IMAGE:v1


                docker push \
                $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_IMAGE:v1
                '''
            }
        }


        stage('Deploy Application') {
            steps {
                sh '''
                docker compose up -d
                '''
            }
        }

    }
}

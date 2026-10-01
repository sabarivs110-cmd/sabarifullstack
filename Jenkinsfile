pipeline {

    agent any

    environment {
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "240571106446"

        BACKEND_IMAGE = "sabarifullstack-backend"
        FRONTEND_IMAGE = "sabarifullstack-frontend"

        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
    url: 'https://github.com/sabarivs110-cmd/sabarifullstack.git'
            }
        }


        stage('Build Docker Images') {
            steps {
                sh '''
                    echo "Building Docker images..."
                    docker compose build
                '''
            }
        }


        stage('Trivy Security Scan') {
            steps {
                sh '''
                    echo "Running Trivy vulnerability scan..."

                    mkdir -p trivy-reports

                    trivy --config /dev/null image \
                        --scanners vuln \
                        --severity HIGH,CRITICAL \
                        --no-progress \
                        ${BACKEND_IMAGE}:latest \
                        | tee trivy-reports/backend-trivy.txt

                    trivy --config /dev/null image \
                        --scanners vuln \
                        --severity HIGH,CRITICAL \
                        --no-progress \
                        ${FRONTEND_IMAGE}:latest \
                        | tee trivy-reports/frontend-trivy.txt

                    echo "Trivy scan completed."
                '''
            }
        }


        stage('Login to ECR') {
            steps {
                sh '''
                    echo "Logging in to Amazon ECR..."

                    aws ecr get-login-password --region $AWS_REGION | \
                    docker login --username AWS --password-stdin \
                    $ECR_REGISTRY
                '''
            }
        }


        stage('Tag Images') {
            steps {
                sh '''
                    echo "Tagging Docker images for ECR..."

                    docker tag ${BACKEND_IMAGE}:latest \
                    $ECR_REGISTRY/${BACKEND_IMAGE}:v1

                    docker tag ${FRONTEND_IMAGE}:latest \
                    $ECR_REGISTRY/${FRONTEND_IMAGE}:v1
                '''
            }
        }


        stage('Push Images to ECR') {
            steps {
                sh '''
                    echo "Pushing images to Amazon ECR..."

                    docker push \
                    $ECR_REGISTRY/${BACKEND_IMAGE}:v1

                    docker push \
                    $ECR_REGISTRY/${FRONTEND_IMAGE}:v1
                '''
            }
        }


        stage('Deploy Application') {
    steps {
        sh '''
            echo "Stopping previous deployment..."

            docker compose down || true

            echo "Deploying application using Docker Compose..."

            docker compose up -d

            echo "Current containers:"
            docker compose ps
        '''
    }
}


        stage('Health Check') {
            steps {
                sh '''
                    echo "Checking application health..."

                    echo "Checking frontend..."
                    curl -f http://localhost/

                    echo "Checking backend..."
                    curl -f http://localhost:3000/

                    echo "Checking MySQL..."
                    docker inspect --format='{{.State.Health.Status}}' mysql-container

                    echo "Health checks completed successfully."
                '''
            }
        }


        stage('Cleanup Old Images') {
            steps {
                sh '''
                    echo "Cleaning unused Docker images..."

                    docker image prune -f

                    echo "Docker cleanup completed."
                '''
            }
        }

    }

    post {

        always {
            echo "Archiving Trivy security reports..."

            archiveArtifacts artifacts: 'trivy-reports/*.txt',
                             allowEmptyArchive: true
        }

        success {
            echo "======================================"
            echo "CI/CD PIPELINE SUCCESSFUL"
            echo "======================================"
        }

        failure {
            echo "======================================"
            echo "CI/CD PIPELINE FAILED"
            echo "Check Jenkins Console Output"
            echo "======================================"
        }
    }
}

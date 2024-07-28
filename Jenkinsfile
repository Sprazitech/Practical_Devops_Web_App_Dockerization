pipeline {
    agent any
    options {
        ansiColor('xterm')
    }
  
    environment {
        AWS_DEFAULT_REGION = 'us-east-1'
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                script {
                    git branch: 'main',
                        credentialsId: 'test',
                        url: 'https://github.com/sprigsh/three-tier-app.git'
                }
            }
        }
        
        stage('Terraform Init') {
            steps {
                dir('terraform/infra/') {
                    sh 'terraform init'
                }
            }
        }
        
        stage('Terraform Plan') {
            steps {
                dir('terraform/infra/') {
                    sh 'terraform plan -out=tfplan'
                }
            }
        }
        
         stage('Manual Review') {
            steps {
                script {
                    // Send Slack notification for manual review
                    slackSend channel: '#alerts',
                        color: 'warning',
                        message: "A manual review is required for the deployment. Please approve or reject."
                    
                    // Prompt for manual review
                    input message: 'Do you approve this deployment?', ok: 'Deploy', submitter: 'engineer'
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                dir('terraform/infra/') {
                    sh 'terraform apply -auto-approve'
                }
            }
        }
    }    
    
    post {
        failure {
            script {
                slackSend channel: '#alerts',
                    color: 'danger',
                    message: "Build failed for three-tier app deployment"
            }
        }
        
        always {
            cleanWs()
        }
    }
}


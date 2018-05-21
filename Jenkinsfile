pipeline {
  agent {
    docker {
      image 'ruby:2.3.1'
    }

  }
  stages {
    stage('config system') {
      parallel {
        stage('config system') {
          steps {
            sh 'echo hi'
          }
        }
        stage('Install Postgres') {
          steps {
            sh 'apt-get update'
            sh 'apt-cache policy postgresql'
            sh 'apt-get install postgresql'
          }
        }
        stage('Install NVM') {
          steps {
            sh '''wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash


'''
          }
        }
      }
    }
    stage('Build') {
      steps {
        sh 'bundle install'
      }
    }
  }
}
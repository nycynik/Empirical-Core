pipeline {
  agent {
    docker {
      image 'ruby:2.3.1-alpine'
    }

  }
  stages {
    stage('config system') {
      parallel {
        stage('config system') {
          steps {
            sh 'yum install make'
          }
        }
        stage('build app') {
          steps {
            sh 'bundle install'
          }
        }
      }
    }
  }
}
pipeline {
  agent {
    docker {
      image 'ruby:2.3.1'
    }

  }
  stages {
    stage('config system') {
      steps {
        sh 'echo hi'
      }
    }
    stage('Build') {
      steps {
        sh 'bundle install'
      }
    }
  }
}
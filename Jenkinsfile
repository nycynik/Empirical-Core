pipeline {
  agent {
    docker {
      image 'ruby:2.3.1-alpine'
    }

  }
  stages {
    stage('test') {
      steps {
        sh 'bundle install'
      }
    }
  }
}
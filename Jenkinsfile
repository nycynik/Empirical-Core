pipeline {
  agent {
    docker {
      image 'ubuntu:16.04'
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
            sh 'apt-get install software-properties-common'
            sh 'add-apt-repository \'deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main\''
            sh 'wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add '
            sh 'apt-get update'
            sh 'apt-get install postgresql-10'
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
    stage('install services') {
      steps {
        echo 'Hi'
      }
    }
    stage('Build') {
      steps {
        sh 'bundle install'
      }
    }
  }
}

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
            sh 'apt-get --purge remove postgresql postgresql-9.5 postgresql-client-9.5 postgresql-client-common  postgresql-common postgresql-contrib-9.5'
            sh 'add-apt-repository \'deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main\''
            sh 'wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add '
            sh 'apt-get update'
            sh 'apt-get install postgres-10'
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
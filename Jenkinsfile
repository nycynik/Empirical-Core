pipeline {
  agent {
    docker {
      image 'ubuntu:16.04'
    }

  }
  stages {
    stage('config system') {
      steps {
        sh 'echo hi'
      }
    }
    stage('install services') {
      parallel {
        stage('install services') {
          steps {
            echo 'Hi'
          }
        }
        stage('Install Postgres') {
          steps {
            sh '''# Make sure add-apt-repo is installed
apt-get install -y software-properties-common


# add postgres10 repo
add-apt-repository \'deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main\'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | \\
  apt-key add -
apt-get update


# install pg
apt-get install -y postgres-10'''
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
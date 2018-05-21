pipeline {
  agent {
    docker {
      image 'ubuntu:16.04'
    }

  }
  stages {
    stage('config system') {
      steps {
        sh '''echo "Starting system config..."
apt-get update
apt-get install -y wget
apt-get install -y software-properties-common


# add ruby
apt-add-repository ppa:brightbox/ruby-ng
apt-get update
apt-get install -y ruby2.3

'''
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
            sh '''echo "Beginning PG installation"


# add postgres10 repo
add-apt-repository \'deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main\'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | \\
  apt-key add -
apt-get update

# install pg
apt-get install -y postgresql-10'''
          }
        }
      }
    }
    stage('Build') {
      steps {
        sh '''gem install bundler
bundle install'''
      }
    }
  }
}
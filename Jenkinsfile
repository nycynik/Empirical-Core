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


# add ruby deps, rbenv
## ruby dependencies
apt-get install autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm3 libgdbm-dev
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
echo \'export PATH="$HOME/.rbenv/bin:$PATH"\' >> ~/.bashrc
echo \'eval "$(rbenv init -)"\' >> ~/.bashrc
source ~/.bash_profile

# install ruby version(s)
rbenv install 2.3.1

# set global ruby version
rbenv global 2.3.1'''
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
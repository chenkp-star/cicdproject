pipeline {
  agent any
  options { timestamps(); disableConcurrentBuilds() }
  environment {
    IMAGE = "simple-cicd-pages:${env.BUILD_NUMBER}"
  }
  stages {
    stage('Test') {
      steps { sh 'npm install --ignore-scripts; npm test; npm run build' }
    }
    stage('Build image') {
      steps { sh 'docker build --pull -t $IMAGE .' }
    }
    stage('Package release') {
      when { branch 'main' }
      steps { sh 'docker save $IMAGE | gzip > image.tar.gz'; archiveArtifacts artifacts: 'image.tar.gz', fingerprint: true }
    }
  }
  post {
    always { sh 'docker image rm $IMAGE || true' }
  }
}

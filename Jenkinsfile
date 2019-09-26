pipeline {
  agent any
  stages {
    stage('Build') {
      agent {
        docker {
          // When using Node based on Alpine, some additional packages are required
          // so that icon-genie can run. See https://github.com/imagemin/optipng-bin/issues/84
          // $ apk update && apk add pkgconfig autoconf automake libtool nasm build-base zlib-dev'
          image 'node:10.16.3-slim'
        }
      }
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }
  }
}

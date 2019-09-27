pipeline {
  // Defining agent none at the top-level of the Pipeline ensures that an
  // Executor will not be assigned unnecessarily. Using agent none also forces
  // each stage section to contain its own agent section.
  agent none
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
        echo 'Dependencies installed'
        sh 'npm run build'
        echo 'Build completed'
      }
    }

    stage('Deploy') {
      // IMPORTANT: Deployment requires the following configurations:
      // * SSH Steps Plugin (https://wiki.jenkins.io/display/JENKINS/SSH+Steps+Plugin)
      // * SSH username-with-private-key credential to connect to the remote server
      agent {
        node {
          label 'master'
        }
      }
      steps {
        sh 'tar czfv dist.tar.gz dist/' // compress dist folder
        echo 'Assets packed and compressed'
        script {
          // SSH Steps Plugin needs to be executed within a script block
          // when using declarative pipelines
          def remote = [:]
          remote.name = 'node1'
          remote.host = 'hecsalazarf.sytes.net'
          remote.allowAnyHosts = true
          remote.logLevel = 'INFO'
          remote.pty = true
          // credentials binding
          withCredentials([sshUserPrivateKey(credentialsId: 'gom-node1', keyFileVariable: 'identity', passphraseVariable: 'passphrase', usernameVariable: 'username')]) {
            remote.user = username
            remote.identityFile = identity
            remote.passphrase = passphrase
            sshPut remote: remote, from: 'dist.tar.gz', into: '/home/hector/'
          }
        }
      }
    }    
  }
}

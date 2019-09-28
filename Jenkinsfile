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
      // IMPORTANT: Deployment requires the following Jenkins configurations:
      // * SSH Steps Plugin (https://wiki.jenkins.io/display/JENKINS/SSH+Steps+Plugin)
      // * SSH username-with-private-key (node1-ssh-private-key) credential to connect to the remote server
      // * SSH user-with-password (node1-ssh-password) credential for sudo operations
      agent {
        node {
          label 'master'
        }
      }
      environment {
        CRED_PRIVATE_KEY = 'node1-ssh-private-key' // private key credential
        CRED_PASSWORD = 'node1-ssh-password' // password credential
        TEMP_DIR = '/home/hector/gom/' // temporary directory on remote server to put files
        WEB_DIR = '/var/www/gom-ui/pwa/' // web directory on remove server
      }
      steps {
        // copy script to dist folder and make it executable
        sh 'cp -r jenkins/ dist/ && chmod +x dist/jenkins/copy-assets.sh'
        // compress dist folder
        sh 'tar czfv dist.tar.gz dist/'
        echo 'Assets packed and compressed'
        script {
          // SSH Steps Plugin needs to be executed within a script block
          // when using declarative pipelines
          def remote = [:]
          remote.name = 'node1'
          remote.host = 'hecsalazarf.sytes.net'
          remote.allowAnyHosts = true
          remote.logLevel = 'INFO'
          remote.pty = true // sshCommand with sudo:true param also requires pty:true
          withCredentials([
            // credentials binding
            sshUserPrivateKey(credentialsId: env.CRED_PRIVATE_KEY, keyFileVariable: 'identity', passphraseVariable: 'passphrase', usernameVariable: 'username'),
            usernamePassword(credentialsId: env.CRED_PASSWORD, passwordVariable: 'password', usernameVariable: '')
          ]) {
            remote.user = username
            remote.identityFile = identity
            remote.passphrase = passphrase
            remote.password = password
            // create temporary directory if it does not exist
            sshCommand remote: remote, command: "[ ! -d ${env.TEMP_DIR} ] && mkdir -p ${env.TEMP_DIR}"
            // copy dist package
            sshPut remote: remote, from: 'dist.tar.gz', into: env.TEMP_DIR
            // extract assets
            sshCommand remote: remote, command: "tar xzf ${env.TEMP_DIR}dist.tar.gz -C ${env.TEMP_DIR}"
            // run script to copy assets to the web server directory
            sshCommand remote: remote, sudo: true, command: "${env.TEMP_DIR}dist/jenkins/copy-assets.sh ${env.TEMP_DIR}dist/pwa/. ${env.WEB_DIR}"
            // remove temporary files
            sshCommand remote: remote, command: "rm -r ${env.TEMP_DIR}"
          }
        }
        echo 'Deployment finished'
      }
    }
  }
}

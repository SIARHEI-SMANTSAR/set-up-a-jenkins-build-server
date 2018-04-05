node {
  timestamps {
    stage('Check out') {
      checkout scm
    }

    stage('Get dependencies') {
      sh 'npm install'
    }

    stage('Tslint') {
      sh 'npm run tslint'
    }

    stage('Run Test') {
      echo 'Run Test...'
    }

    stage('Deploy') {
      echo 'Stopping old process to run new process...'
      if (env.BUILD_NUMBER == '1') {
        echo 'Clone repository...'
        sh '''
          ssh ${ADMIN_USER}@${DNS} <<EOF
            git clone https://github.com/SIARHEI-SMANTSAR/set-up-a-jenkins-build-server.git
            exit
          EOF
        '''
      }
      sh '''
        ssh ${ADMIN_USER}@${DNS} <<EOF
          cd set-up-a-jenkins-build-server
          git pull
          npm install
          npm run pm2-stop
          npm run pm2-start
          exit
        EOF
      '''
    }
  }
}

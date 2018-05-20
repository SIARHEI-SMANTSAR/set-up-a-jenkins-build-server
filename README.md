# Set Up a Jenkins Build Server

## Ubuntu

* Conect to Ubuntu

```
ssh -i /path/my-key-pair.pem user_name@public_dns_name
```
* Install [Node JS](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

* Install [Git](https://git-scm.com/download/linux)
```
sudo apt-get install git
```

* Install [Jenckins](https://pkg.jenkins.io/debian-stable/)

```
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
```
```
sudo nano /etc/apt/sources.list
```

add next line `deb https://pkg.jenkins.io/debian-stable binary/`

```
sudo apt-get update
```
```
sudo apt-get install jenkins
```

If you have error `Failed to start LSB: Start Jenki` install Java Runtime Environment:

```
sudo apt install openjdk-8-jre
```

or so to fix that you should chose version 8 as your default java environment by simply running `sudo update-alternatives --config java` and then chosing your version 8

* Start Jenkins

```
sudo service jenkins start
```

If need restsart Jenkins server: `sudo service jenkins restart`

* Connect to `http://<your_server_public_DNS>:8080`

![image](https://drive.google.com/uc?authuser=0&id=1pdqaKUsh-nbSMxReJWNxJFjJ2CCotjf6&export=download)

* As prompted, enter the password found in `/var/lib/jenkins/secrets/initialAdminPassword`. Use the following command to display this password:

```
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

![image](https://drive.google.com/uc?authuser=0&id=1GQLT-P_BSMkpYC-KzsmV40kKTFxbp8dy&export=download)

* Install plagins:

    - [Folders](https://plugins.jenkins.io/cloudbees-folder)
    - [Build Timeout](https://plugins.jenkins.io/build-timeout)
    - [Timestamper](https://plugins.jenkins.io/timestamper)
    - [Pipeline](https://plugins.jenkins.io/workflow-aggregator)
    - [Pipeline: Stage View](https://plugins.jenkins.io/pipeline-stage-view)
    - [Git](https://plugins.jenkins.io/git)
    - [Git Parameter](https://plugins.jenkins.io/git-parameter)
    - [GitHub](https://plugins.jenkins.io/github)

![image](https://drive.google.com/uc?authuser=0&id=1H738XzBPnomeGLBT8w4LO09owOdk8OWG&export=download)

![image](https://drive.google.com/uc?authuser=0&id=1MiiqyOjYpKQ5nGsV1kGqnuqJmkGxTmIX&export=download)

![image](https://drive.google.com/uc?authuser=0&id=1HundIIZ_59PgQoPFWa-6QoKR5f0E5di6&export=download)

![image](https://drive.google.com/uc?authuser=0&id=14N5wMdm4ugWNIyYaaRI0QimkFgMA5Ls2&export=download)

---
* Login to Server using SSH
    * Conect to Ubuntu
    ```
    ssh -i /path/my-key-pair.pem user_name@public_dns_name
    ```
    * Jenkins automatically creates a new user after installation. Switch to it using this command.
    ```
    sudo su
    su jenkins
    ```
    * Let’s generate RSA key, run following command.
    ```
    ssh-keygen -t rsa
    ```
    * Press Enter for the location and do not type any password when it asks to, just hit enter.

    * Once the process is completed, print the public key information using this command.
    ```
    cat ~/.ssh/id_rsa.pub
    ```
    * It should start with `ssh-rsa` and ends with `jenkins@droplet-ip`. Copy the key.

    * Now login to your development server and switch to ~/.ssh directory using following command.
    ```
    exit
    exit
    cd ~/.ssh
    ```
    * Now open the file named authorized_keys if its present, else create one.
    ```
    nano authorized_keys
    ```
    * Paste the key in the file, if there is already some information is present, just append the key in the new line and do not change anything else.

    * Once done save the file.

    * In order to validate whether keys are properly configured or not, switch to Jenkins Server and try to login to development server using SSH.
    ```
    sudo su
    su jenkins
    ssh user_name@public_dns_name
    ```
    * If it’s not asking any password and log in successfully, you are good to go.
---

### Add environment variables

![image](https://drive.google.com/uc?authuser=0&id=1hY0VDhAguV1aqHAwOl0zh_vCPODLniqn&export=download)

![image](https://drive.google.com/uc?authuser=0&id=1xT7Dmd1L-rbx0TzZFx8jNa43AVjnp0gP&export=download)

![image](https://drive.google.com/uc?authuser=0&id=1TCPOO4nFBrLezCCIAroP9lj60z0kqbZ_&export=download)

![image](https://drive.google.com/uc?authuser=0&id=1DeXI-vSV2d5io6fHU5VnAb7UJtIcxVpM&export=download)

![image](https://drive.google.com/uc?authuser=0&id=15CfffyIdSpsLzY8PX-6S8LIP91wZLge8&export=download)

![image](https://drive.google.com/uc?authuser=0&id=102UQNfooFa5uVQTfynfizhmxaWwP1NoH&export=download)

![image](https://drive.google.com/uc?authuser=0&id=1-r2sIyic0GUgynKta-dKc6vUznVzpqLe&export=download)

![image](https://drive.google.com/uc?authuser=0&id=10566ys8lO2XD1bB6XeaXlYcSXm1pkc0B&export=download)

* Jenkinsfile
```
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
```

![image](https://drive.google.com/uc?authuser=0&id=1pNAOV2UkahoYNRXxPLFuraBmybkYQNT8&export=download)

![image](https://drive.google.com/uc?authuser=0&id=1YZBIYWt6XVPFtzJZdsdCJSAsl5QGZslp&export=download)

* Connect to `http://<your_server_public_DNS>:4000`

---
### Links

* [Continuous Integration and deployment with Jenkins and Node.js](https://codeforgeek.com/2016/04/continuous-integration-deployment-jenkins-node-js/)
* [Set Up a Jenkins Build
Server](https://d1.awsstatic.com/Projects/P5505030/aws-project_Jenkins-build-server.pdf)

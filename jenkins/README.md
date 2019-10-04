# CI and Gom UI

## Introduction
Continuous Integration (CI) of Gom UI is powered by [Jenkins](https://jenkins.io/). In this directory, you can find all the necessary artifacts to execute the Pipeline.

## Hardware requirements
* 1.5+ GB of RAM
* 50 GB+ of drive space

**Note:** Sizing a Jenkins environment is very variable from one project to another. Above data is empirically obtained. More info [here](https://jenkins.io/doc/book/hardware-recommendations/#hardware-recommendations).

## Installation
The easiest way to install Jenkins is with Docker. Online documentation has a comprehensive [guide](https://jenkins.io/doc/book/installing/#downloading-and-running-jenkins-in-docker) with the steps to follow. 

### TL;DR
Run container:
```bash
docker run \ 
  -u root \ 
  --rm \ 
  -d \ 
  -p 8080:8080 \ 
  -p 50000:50000 \ 
  -v jenkins-data:/var/jenkins_home \ 
  -v /var/run/docker.sock:/var/run/docker.sock \ 
  -v "$HOME":/home \ 
  jenkinsci/blueocean 
```
## Agent
*The Dockerfile in this folder defines the **agent** needed to run the Pipeline.*

The agent specifies where the entire Pipeline, or a specific stage, will execute in the Jenkins environment depending on where the agent section is placed.

To build the image run within this folder:
```bash
docker build -t hecsalazarf/gomui-agent:0.1 .
```

## Configurations
*Gom API pipeline has some dependencies which must be configured first.*

### Credentials
Create the following [credentials](https://jenkins.io/doc/book/using/using-credentials/) where sensitive information is stored.

* **node1-ssh-private-key [SSH Username with private key]**: Private key to connect to the remote server without password.
* **node1-ssh-password [Username and password]**: Password used for sudo operations.

### SSH Agent Plugin
In order to stablish an SSH connection using the credentials, install the [SSH agent plugin](https://jenkins.io/doc/pipeline/steps/ssh-agent/).

### Script path
During the Pipeline creation, make sure to set the *Script Path* to `jenkins/Jenkinsfile`.

<!-- PROJECT SHIELDS -->
[![CircleCI](https://circleci.com/gh/ScottLogic/lookingatyou/tree/master.svg?style=svg)](https://circleci.com/gh/ScottLogic/lookingatyou/tree/master)


<!-- PROJECT LOGO -->
<br />
<p align="center">

  <h1 align="center">Looking At You</h1>

  <p align="center">
    <a href="https://github.com/ScottLogic/lookingatyou/blob/master/README.md"><strong>Explore the docs »</strong></a>
    <br />
    <a href="http://looking-at-you.s3-website.eu-west-2.amazonaws.com/">View Demo</a>
    ·
    <a href="https://github.com/ScottLogic/lookingatyou/issues">Report Bug</a>
    ·
    <a href="https://github.com/ScottLogic/lookingatyou/issues">Request Feature</a>
  </p>
</p>


## Table of Contents

* [About the Project](#about-the-project)
* [Prerequisites](#prerequisites)
* [Usage](#usage)
* [Testing](#testing)
* [Deployment](#deployment)



## About The Project

Looking At You is a single page application that tracks the object/motion with a pair of eyes on the screen.

## Prerequisites

The only requirement for the project to run is the access to the webcam. 

Tests have a single requirement - jest. You can install it using

```
npm install
```

which will install any dependencies of the project based off of the package.json file.

## Usage

Looking At You is a client side web application and does not require a server side to be run. In order to view the project open the following file:

```
src/index.html
```

## Testing

In order to run tests, execute following command:

```
npm run test
```

## Deployment

The project is automatically deployed to AWS S3 bucket on merges to Master branch through CircleCI.

In order to manually deploy the project to AWS S3 bucket first install aws cli:

```
pip install awscli --upgrade --user
```

Once the aws cli is installed, execute the following command to sync the src files to the bucket:

```
aws s3 sync ./src/ s3://<bucket-name>/ --delete
```

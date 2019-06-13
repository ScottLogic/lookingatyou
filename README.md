<!-- PROJECT SHIELDS -->
[![CircleCI](https://img.shields.io/circleci/build/github/ScottLogic/lookingatyou/master.svg?label=master&style=badge&token=ab5d53d5a9479d50259a1d2febaa710964b4bd8c)](https://circleci.com/gh/ScottLogic/lookingatyou)


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
  * [General](#general)
  * [Test](#test)
* [Usage](#usage)
* [Testing](#testing)
* [Deployment](#deployment)



## About The Project

Looking At You is a single page application that tracks the object/motion with a pair of eyes on the screen.

Research notes can be found [here](https://docs.google.com/document/d/1qzaegY8RV-7zI8W8PFPsT_O9LhHEo22WNC5yQh8-n_Q/edit#heading=h.e2w0fl8vj3ca_).

## Prerequisites

### General

The only requirement for the project to run is the access to the webcam. 

### Tests

Tests have a single requirement - [JEST](https://jestjs.io/). You can install it by using the following command from the project root directory:

```
npm install
```

which will install any dependencies of the project based off of the package.json file.

## Usage

Looking At You is a client side web application and does not require a server side to be run. In order to run the application, open the following file in the web browser:

```
src/index.html
```

You will be asked for the permission to access the webcam - click 'Allow'.

When mouse movement is detected on the screen, the configuration menu will open where certain settings can be adjusted. Following options are currently available:

| Option       | Description                                                                  |
|--------------|------------------------------------------------------------------------------|
| X FOV Bound  | X axis eyes sensitivity                                                      |
| Y FOV Bound  | Y axis eyes sensitivity                                                      |
| Swap Eyes    | Available when two webcams are detected. Swaps the webcam input for the eyes |
| Toggle Debug | Displays the camera feed with bounding boxes                                 |

## Testing

In order to run tests, execute the following command from the project root directory:

```
npm run test
```

## Deployment

The project is automatically deployed to AWS S3 bucket on merges to Master branch through CircleCI. The project can be accessed [here](http://looking-at-you.s3-website.eu-west-2.amazonaws.com) (Note: currently it only works on Firefox. Chrome does not allow access to webcams from insecure websites).

In order to manually deploy the project to AWS S3 bucket first install aws cli:

```
pip install awscli --upgrade --user
```

Once the aws cli is installed, execute the following command to sync the src files to the bucket:

```
aws s3 sync ./src/ s3://<bucket-name>/ --delete
```

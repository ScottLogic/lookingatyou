<!-- PROJECT SHIELDS -->

[![CircleCI](https://img.shields.io/circleci/build/github/ScottLogic/lookingatyou/master.svg?label=master&style=badge&token=ab5d53d5a9479d50259a1d2febaa710964b4bd8c)](https://circleci.com/gh/ScottLogic/lookingatyou)

<!-- PROJECT LOGO -->
<br />
<p align="center">

  <h1 align="center">Looking At You</h1>

  <p align="center">
    <a href="https://github.com/ScottLogic/lookingatyou/blob/master/README.md"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://looking-at-you.s3.amazonaws.com/index.html">View Demo</a>
    ·
    <a href="https://github.com/ScottLogic/lookingatyou/issues">Report Bug</a>
    ·
    <a href="https://github.com/ScottLogic/lookingatyou/issues">Request Feature</a>
  </p>
</p>

## Table of Contents

- [About the Project](#about-the-project)
- [Prerequisites](#prerequisites)
  - [General](#general)
  - [Test](#test)
- [Running the project (local)](#running-the-project-locally)
- [Usage](#usage)
- [Testing](#testing)
- [Deployment](#deployment)

## About The Project

Looking At You is a single page application that tracks the object/motion with a pair of eyes on the screen.

Research notes can be found [here](https://docs.google.com/document/d/1qzaegY8RV-7zI8W8PFPsT_O9LhHEo22WNC5yQh8-n_Q/edit#heading=h.e2w0fl8vj3ca_).

## Prerequisites

### General

In order to build and run the project, a package manager like npm or yarn is required.

### Tests

Tests have a single requirement - [JEST](https://jestjs.io/). You can install it by using the following command from the project root directory:

```
npm install
```

which will install any dependencies of the project based off of the package.json file.

## Running the project locally

Install the dependencies:

```
npm install
```

To run the project locally, run the following command:

```
npm start
```

This will start the node server and you can access the project on [http://localhost:3000](http://localhost:3000)

## Usage

When you first access the application, you will be asked for the permission to access the webcam - click 'Allow'.

When mouse movement is detected on the screen, the configuration menu will open where certain settings can be adjusted. Following options are currently available:

| Option        | Description                                                                  |
| ------------- | ---------------------------------------------------------------------------- |
| X Sensitivity | X axis eyes sensitivity                                                      |
| Y Sensitivity | Y axis eyes sensitivity                                                      |
| Swap Eyes     | Available when two webcams are detected. Swaps the webcam input for the eyes |
| Toggle Debug  | Displays the camera feed with bounding boxes                                 |

## Testing

In order to run tests, execute the following command from the project root directory:

```
npm run test
```

## Deployment

Looking At You is automatically deployed to S3 bucket after each successful merge to Master branch. The project can be accessed [here](https://looking-at-you.s3.amazonaws.com/index.html).

In order to deploy the application manually first install all dependencies and build the project:

```
npm install
npm run build
```

Once the project is build, you can deploy it to AWS S3 bucket with following command:

```
aws s3 sync ./build/ s3://<bucket-name>/ --delete
```

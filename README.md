# Axon


![Logo](https://imgur.com/pUUqjab.png)


 Axon aids developers with Express.js based applications to autogenerate integration tests and Postman Collections by extracting RESTful API endpoints from your source code. Simply import your server folder and Axon will do the hard work for you!   

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs) 
![Release: 1.0](https://img.shields.io/badge/Release-1.0-orange) 
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](https://github.com/oslabs-beta/axon)


## Installation
Axon desktop application is available to install for Mac or Windows operating systems.

[Download on Mac](https://github.com/oslabs-beta/axon/releases/download/v1.0.0/Axon-1.0.0.dmg)

[Download on Windows](https://github.com/oslabs-beta/axon/releases/download/v1.0.0/Axon.Setup.1.0.0.zip)

## Features

- Autogenerate Supertest integration tests
- Create Postman Collections 
- Edit your generated code through Monaco Code Editor
- Export your files into your application

  
## Prerequisites 

Make sure to have already installed Supertest and Jest in your project's dev-dependencies 

```npm install supertest --save```

```npm install jest --save```

## Demo

Open your Axon application to be greeted with a beautiful layout!

  ![Alt Text](gifs/FrontPage.gif)

  ### Step 1

Click on the "Import server folder" button, you will be redirected to your file folders. Choose the server folder from your Express based application. 

  ![til](gifs/ImportServerFolder.gif)

  ### Step 2

Click on the "Supertest" button to autogenerate your integration test from the API endpoints located in your server files. 

  ![til](gifs/CreateSupertest.gif)

  ### Step 3

Click on the "Postman" button to create a Postman Collection that you can import into Postman and autogenerate manual tests.
  
  ![til](gifs/CreatePostmanCollection.gif)

  ### Step 4

Enter your file name for either your Supertest or Postman Collection, make sure you are in the right tab before clicking on "Export" to download your files into your computer.

 ![til](gifs/ExportTestFile.gif)
 
 
## How To Import Postman Collection into Postman

After exporting your Postman Collection from Axon and saving it into your computer, open Postman, click on the Collections tab to the left of the screen, press the import button, then on the pop-up window drag and drop or simply upload your Postman Collection to autogenerate your endpoint tests.

   ![til](gifs/PostmanDemo.gif)
   
   

## Authors

- Alison Ziel [@aliziel](https://github.com/aliziel)
- Dylan Bury [@dylanbury](https://github.com/dylanbury)
- Michael Caballero [@caballeromichael](https://github.com/caballeromichael)
- Sebastian Damazo [@The-Sebastian](https://github.com/The-Sebastian)


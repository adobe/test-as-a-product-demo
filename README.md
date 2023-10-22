# Test as a Product - Demo
This is a demo project intended to show how Test as a Product can work. In this project we show how testBridge works.

We have the following parts:
* **my-blog** : A ReactJS project.
* **my-blog-backend** : A nodeJS-based micro-service.
* **e2e-tests/backend-tests** : A Java Project dedicated to testing the my-blog-backend apis.
* **e2e-tests/frontend-tests/fe-tests-cypress** : A cypress project dedicated to testing the front-end.

![System Design](diagrams/system-System.drawio.png)

## Demo Deployment
In this chapter we help you start the demo project.

### Requirements
The back-end project has been tested with node `v20.7.0`.
The front-end project has been tested with node `v20.7.0` and react `^18.2.0"`.

### Deployment Order
There is a rough deployment order to get this project running:
1. Start the Back End
2. Testing the Back End
3. Start the my-blog app
4. Testing the front end

#### 1. Starting the Back-End
To start the backend :
1. Go to the directory `my-blog-backend`.
2. Press `npm run dev`

Now you can test the system by running backend tests.

#### 2. Starting the Front-End
To run the backend tests:
1. Go to the directory `e2e-tests/backend-tests`.
2. Press `npm run dev`

Now you can test the system by running backend tests.


### Starting steps
In order to get the project you need to perform the following steps:
1. open terminal
2. got to `my-blog-backend`
3. type `npm run dev`. _This starts the back-end node server._
4. open another terminal
5. go to directory my-blog
6. type `npm run start`. _This starts the front-end react interface._

## Testing
We have both backend and frontend tests:

### Back-end Tests
To start the backend tests
* go to project `e2e-tests/backend-tests/`
* Run tests by entering `mvn clean test`

### Front-end tests
In order to start the cypress tests `npm run cy:run`. Other simply open cypress for manually assited running `npx cypress open`.

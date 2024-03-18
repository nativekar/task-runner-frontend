# React-based Frontend for Task runner

Each fn will query a separate endpoint (whose url is generated via a util) to fetch screenshots, logs and video.

## Installation

Before you start, make sure you have Node.js and npm installed on your machine.

1. Clone this repository: `git clone https://github.com/nativekar/task-runner-frontend.git`
2. Navigate into the project directory: `cd task-runner-frontend`
3. Install the dependencies: `npm install` or `yarn add`

## Running the Project

After installing the dependencies, you can run the project using the following command:

```bash
npm run dev
```
### Connecting to Backend and Path update

Please run this in conjuction with `https://github.com/nativekar/task-runner-backend.git`

Once that service is up and running, find the `makeUrl()` within `components/utils` and update the `url` constant to match your local express server's path.

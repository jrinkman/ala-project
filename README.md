# ALA Species Search: Web Application

- [ALA Species Search: Web Application](#ala-species-search-web-application)
  - [Design](#design)
    - [Why a CSR React app?](#why-a-csr-react-app)
  - [About](#about)
    - [Libraries Used](#libraries-used)
  - [Prerequisites](#prerequisites)
  - [Running](#running)

## Design

### Why a CSR React app?

The scope of the project is a simple web interface which interacts with the ALA Search API. As such, I decided a to develop client-side React application, for the following reasons:

- The data on the web page changes frequently (i.e. different species are displayed for each search query).
- The built static website files can easily be hosted via a CDN / edge network, to the benefit of the user (faster load times / less latency). I've used [Cloudflare Pages](https://pages.cloudflare.com/).
- Less resources are needed to host (a server application does not need to be deployed, only the static files).

See commented code for more context regarding design decisions.

## About

This project was built using [Vite](https://vitejs.dev/) and [React](https://reactjs.org/).

### Libraries Used

- [Mantine](https://mantine.dev/) - a frontend React component library
- [axios](https://github.com/axios/axios) - for HTTP requests
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) - for code quality & style enforcement

## Prerequisites

- [node.js](https://nodejs.org/en/download/) - this project was built using the latest LTS version (`16.14.0`)
- [yarn](https://yarnpkg.com/getting-started/install) - a node package manager

## Running

1. Clone the repository into your preferred folder
2. Install dependencies via the `yarn` command
3. Start the project via the `yarn dev` command

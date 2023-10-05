# Reddit Posts Notifier

A simple node.js application that notifies you when new Reddit posts are created.


## Features

- Notifications can be sent to either Pushbullet or Discord.
- Filter posts by ignoring specific keywords.
- Can monitor multiple subreddits at once.


## Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file based on the provided `.env.example` file

## Usage

First build the application with `npm run build`

Then run the application with `npm start`

For development simply run `npm run dev`

## Deployment

Docker can be used with the provided Dockerfile and Docker-compose files.

Just make sure to mount the /app/data folder to a persistent volume.
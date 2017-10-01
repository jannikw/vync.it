# [vync.it](https://devpost.com/software/vync-it)

## Inspiration

Other services similiar to ours do exist... But none of them are perfect. They are lacking in the number of supported video platforms, lacking in must-have features like fullscreen playback and several other areas aswell. We aim to improve these points!

## What it does

A group of people can join a room and watch videos together. Synchronized. This mean, that if someone has a bad connection and his/her video needs to buffer everybody else is forced to wait, too. Members of a room can also add new videos to a playlist which will play after the current video is finished. In theory, this works for various video-services, such as YouTube, Vimeo or Twitch (even though our implementation currently only support YouTube and Vimeo, but thanks to an easy wrapper-api, adding a new player can be done at a whim).

## How we built it

We used node.js with expressjs as the webserver, served through nginx as a reverse-proxy. On the client-side we used Bootstrap for the design and JavaScript with jQuery to support the functionality.

## Challenges we ran into

Not all of the features of the various players-apis are documented well, so a lot of minor differences to the expected behaviour came up during development.

## Accomplishments that we're proud of

Finishing (some of) our set goals.

## What we learned

JavaScript might not be the best programming-language... (but we already knew that ¯\_(ツ)_/¯)

## What's next for vync.it

Support more video-players, add new features like up-/downvoting videos in the upcoming playlist or a chat.

## How to run
1. git clone https://github.com/jannikw/vync.it.git
2. npm install
3. node app.js

## Screenshots

### Landing page
![Landing page](/screenshots/index.png)
### Rooms
![Rooms](/screenshots/lobbies.png)
### Empty player
![Empty Player](/screenshots/room1.png)
### Filled player
![Filled Player](/screenshots/room2.png)

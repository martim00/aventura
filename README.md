# Aventura Game Engine

A game engine for making adventure games.

Heavily inspired by AGS (http://www.adventuregamestudio.co.uk/) but with a focus on the web.

The engine is made on top of phaser 3 (http://phaser.io/).

I'm streaming periodically at twitch.com (https://www.twitch.tv/martim00). Come and watch me doing this engine and listen to good music.


## Using This Project

This is pretty much the game engine. You can just clone it and starting using.

1. Make a directory somewhere in your file system where you want to keep your project.
1. `cd` into that directory from the command line.
1. Clone this project with `git clone https://github.com/martim00/aventura.git`.
1. Start making your game 

## Installing Dependencies

1. From the cloned project's directory, run `yarn install`.

## Running The Project

Once you've installed the project's dependencies, you can run the project using [Webpack Dev Server](https://github.com/webpack/webpack-dev-server).

1. From your project's directory, run `yarn webpack-dev-server`.
1. Open up your browser to `http://localhost:8080`.
1. You should see a web page with the example game. 
1. Starting changing `assets/game.json` with your stuff.
1. All assets should be located in `assets` folder.

Because you are running the project through Webpack Dev Server, any time you make a change to your source code, the browser will automatically refresh with your updated code.

## game.json file

This is your game configuration file. Ideally all logic for your game should be located here (yes, no code at all). If you want something that's not already implemented you can change the engine and just expose through the `Engine` class api.

TODO: put complete game.json documentation


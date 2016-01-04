var __dirname = path.dirname(document.currentScript.src.slice(8));

describe("AdventureGame", function() {
  var game;

  beforeEach(function() {
    game = new aventura.app.AdventureGame();
  });

  this.getAsJsonString = function(obj) {
    return JSON.stringify(obj);
  };

  describe("when open game folder", function() {

    it("should notify user if folder does not have game.json", function() {

      var gameFolder = __dirname + "/game-folder-example-empty";

      expect( function(){ game.open(gameFolder); } )
        .toThrow(new Error("the folder should have a game.json file"));

    });

    it("should read the contents of game.json and loads into adventure game", function() {
      var gameFolder = __dirname + "/game-folder-example";
      expect( function(){ game.open(gameFolder); } )
        .not.toThrow();
    });

  });

  describe("when loads from json", function() {
    beforeEach(function() {
      var json = {
        "width" : 100,
        "height" : 100,
        "resources" : [
            {
              "name": "room1_bg",
              "path": "bg3.png",
              "type": "image"
            },
            {
              "name": "hero1",
              "path": "adventure_time_grid.png",
              "type": "spritesheet",
              "width": 32,
              "height": 48
            }
        ],        
        "rooms" : 
        {
            "room 1" : {
              "width": 600,
              "height": 600,
              "bg" : {
                "image": "room1_bg"
              },
              "walkableArea" : [ 
                { "x" : 0, "y" : 300 }, 
                { "x" : 25, "y" : 240 }, 
                { "x" : 40, "y" : 240 }, 
                { "x" : 70, "y" : 300 }, 
                { "x" : 671, "y" : 350 }, 
                { "x" : 671, "y" : 448 }, 
                { "x" : 0, "y" : 448 }],
            }
          },
        "players": [
        {
          "name": "hero",
          "spritesheet": "hero1",
          "startRoom": ""
        }
      ]
      };
      game.load(JSON.stringify(json));

    });

    it("should be able to load width and height", function() {
      
      expect(game.width).toEqual(100);
      expect(game.height).toEqual(100);
    });

    it("should be able to load a room", function() {      
      expect(game.getRoomByName("room 1")).not.toBeNull();
      expect(game.getRoomByName("room 1")).not.toBeUndefined();
    });    

    it("should be able to load the room background", function() {
        
      var room = game.getRoomByName("room 1");
      expect(room.bg).not.toBeUndefined();
      expect(room.bg).toEqual("bg3.png");
      expect(room.width).toEqual(600);
      expect(room.height).toEqual(600);
    });

    it("the first room is the current", function() {
      expect(game.isCurrentRoom("room 1")).toEqual(true);
    });

    it("should be able to load a player", function() {
      var character = game.getCharacterByName("hero");
      expect(character).not.toBeNull();
      expect(character).not.toBeUndefined();
      expect(character.hasSprite()).toEqual(true);
      expect(character.getSprite().getName()).toEqual("hero1");
      expect(character.getSprite().getPath()).toEqual("adventure_time_grid.png");
      expect(character.getSprite().getWidth()).toEqual(32);
      expect(character.getSprite().getHeight()).toEqual(48);

    });

    it("should be able to load walkable areas", function() {
      var room = game.getRoomByName("room 1");
      expect(room.getWalkableAreas().length).toEqual(1);
      expect(room.getWalkableAreas()[0].getPoints().length).toEqual(7); // 7 points
    });
  });


});

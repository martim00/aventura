describe("AdventureGame", function() {
  var game;

  beforeEach(function() {
    game = new aventura.app.AdventureGame();
  });

  this.getAsJsonString = function(obj) {
    return JSON.stringify(obj);
  }

  describe("when loads from json", function() {
    it("should be able to load width and height", function() {
      var json = {
        "width" : 100,
        "height" : 100
      };
      game.load(JSON.stringify(json));
      expect(game.width).toEqual(100);
      expect(game.height).toEqual(100);
    });

    it("should be able to load a room", function() {
      var json = {
        "rooms" : {
          "room 1" : {
          }
        }
      };
      game.load(JSON.stringify(json));
      expect(game.getRoomByName("room 1")).not.toBeNull();
      expect(game.getRoomByName("room 1")).not.toBeUndefined();
    });

    it("should be able to load the room background", function() {
      var json = {
        "rooms" : {
          "room 1" : {
            "bg" : {
              "image": "room1_bg",
              "width": 600,
              "height": 600
            }
          }
        }
      };
      game.load(JSON.stringify(json));
      var room = game.getRoomByName("room 1");
      expect(room.bg).not.toBeUndefined();
      expect(room.bg).toEqual("room1_bg");
      expect(room.width).toEqual(600);
      expect(room.height).toEqual(600);
    });
  });

});

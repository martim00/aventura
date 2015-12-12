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

  });

});

describe('MainController', function() {
  beforeEach(module('adventureApp'));

  var $controller, gameService, inputService, canvasService, currentGame;
  /*
    JsHamcrest.Integration.jasmine();
    JsMockito.Integration.JsTestDriver();

    var mockedObject = mock(Array);
    mockedObject.push("one");
    verify(mockedObject).push("one");
  */

  beforeEach(inject(function(_$controller_, $injector) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $scope = {};

    actualGame = {
        saveAs : jasmine.createSpy(),
        isPristine : jasmine.createSpy(),
        save: jasmine.createSpy()

    }
    // jasmine.createSpyObj('actualGame', ['saveAs']);
    // spyOn(actualGame, "isPristine").and.returnValue(true);

    // gameService = $injector.get('gameService')
    gameService = {
      getActualGame : function() {
        return actualGame;
      }
    }

    inputService = {
      askForFolder : function(fn) {}
    }

    spyOn(inputService, "askForFolder").and.callFake(function(fn) {
        fn(true, "/home/");
    });

    previewService = $injector.get('previewService');

    canvasService = {
      init: function() {},
      invalidate: function() {}
    }

    controller = $controller('MainController', { 
          $scope: $scope, inputService: inputService, previewService: previewService, 
          gameService: gameService, canvasService: canvasService });
  }));

  describe('MainController save behaviour', function() {
    it('should ask user for file when save as', function() {
      controller.saveAs();
      expect(inputService.askForFolder).toHaveBeenCalled();
    });

    it('should set current game folder to what user has passed', function() {
      controller.saveAs();
      expect(actualGame.saveAs).toHaveBeenCalledWith('/home/');
    });

    it('should call saveAs if actual game does not have folder yet', function() {
      actualGame.isPristine.and.returnValue(true);
      controller.save();
      expect(actualGame.saveAs).toHaveBeenCalledWith('/home/');
    });

    it('should call save if actual game does have folder', function() {
      actualGame.isPristine.and.returnValue(false);
      controller.save();
      expect(actualGame.save).toHaveBeenCalled();
    });


  });
});
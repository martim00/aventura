describe('MainController', function() {
  beforeEach(module('adventureApp'));

  var $controller, gameService, inputService, canvasService, actualGame;
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
        save: jasmine.createSpy(),
        open: jasmine.createSpy(),
    }
    // jasmine.createSpyObj('actualGame', ['saveAs']);
    // spyOn(actualGame, "isPristine").and.returnValue(true);

    // gameService = $injector.get('gameService')
    gameService = {
      getActualGame: function() {
        return actualGame;
      }
    }

    inputService = {
      askForFolder : function(fn) {},
      askForNewOrOpen: function(fn) {}
    }

    spyOn(inputService, "askForFolder").and.callFake(function(fn) {
      fn(true, "/home/");
    });


    previewService = $injector.get('previewService');

    canvasService = {
      init: function() {},
      invalidate: function() {}
    }

    timeout = function(fn) {
      fn();
    }


    controller = $controller('MainController', { 
          $scope: $scope, inputService: inputService, previewService: previewService, 
          gameService: gameService, canvasService: canvasService, $timeout: timeout });
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

  describe('User onboarding', function() {

    it('should ask for open existing game or create new one', function() {
      spyOn(inputService, "askForNewOrOpen").and.callFake(function(fn) {
      });
      controller = $controller('MainController', { 
          $scope: $scope, inputService: inputService, previewService: previewService, 
          gameService: gameService, canvasService: canvasService, $timeout: timeout });
      expect(inputService.askForNewOrOpen).toHaveBeenCalled();
    });

    it('should open existing game if user choose it', function() {
      spyOn(inputService, "askForNewOrOpen").and.callFake(function(fn) {
        fn(true, "/game-folder");
      });
      controller = $controller('MainController', { 
          $scope: $scope, inputService: inputService, previewService: previewService, 
          gameService: gameService, canvasService: canvasService, $timeout: timeout });
      expect(actualGame.open).toHaveBeenCalledWith("/game-folder");

    });

    it('should create new game if user choose it', function() {
      spyOn(inputService, "askForNewOrOpen").and.callFake(function(fn) {
        fn(false, "/game-folder-to-save");
      });
      controller = $controller('MainController', { 
          $scope: $scope, inputService: inputService, previewService: previewService, 
          gameService: gameService, canvasService: canvasService, $timeout: timeout });
      expect(actualGame.saveAs).toHaveBeenCalledWith("/game-folder-to-save");

    });
  });
});
import {WalkableAreas} from './walkable_areas'
import {ClickableAreas} from './clickable_areas'
import {ExitAreas} from './exit_areas'
import {Inventory} from './inventory'
import {Player} from './player'
import {AudioManager} from './audio_manager'
import {LazyLoader} from './lazy_loader'
import {forEachOf} from 'async-es'

export class Engine {
    constructor(game) {
        // TODO: scalemanager is not present in phaser3 
        // this.game.scale.setGameSize(this.data.width, this.data.height);

        this.data = {};
        this.walkableAreaManager = new WalkableAreas();
        this.clickableAreaManager = new ClickableAreas(this);
        this.exitAreaManager = new ExitAreas(this);
        this.inventory = new Inventory(this);
        this.audioManager = new AudioManager(this);
        this.loadScene = null;
        this.roomScene = null;
    }

    getData() {
        return this.data;
    }

    getConfig() {
        // wtf
        return this.loadScene.scene.manager.game.config;
        // return this.game.scene.sys.game.config;
    }

    getRoomScene() {
        return this.roomScene;
    }

    getLoadScene() {
        return this.loadScene;
    }

    initRoom(scene, roomName) {
        this.roomScene = scene;
        this.actualRoomName = roomName;
        this.mouseHandlers = [];
        this.updateHandlers = [];

        var actualRoomData = this.data.rooms[this.actualRoomName];

        this.playerStart = actualRoomData.startPoint;

        this.createGroups();

        this.configureBackground(actualRoomData);

        this.configureAudio(actualRoomData);

        this.createWalkableArea(actualRoomData);
        this.createInventory();

        this.createClickableAreas(actualRoomData);

        if (this.data.players.length > 0)
            this.configurePlayerAt(this.playerStart.x, this.playerStart.y
                , this.data.players[0]); // for now only one player

        this.createExitRoom(actualRoomData);

        this.roomScene.input.mouse.capture = true;
        this.roomScene.input.on('pointerdown', this.callMouseHandlers, this);
    }

    showTextAtCenter(txt) {
        var style = { font: "12px Arial", fill: "#000000", align: "center" };

        var textMarginBottom = 10;

        if (this.text) {
            this.text.destroy();
            clearTimeout(this.textTimeout);
        }
        
        this.text = this.roomScene.add.text(this.getConfig().width/2, this.getConfig().height/2 - textMarginBottom, txt, style);

        this.textTimeout = setTimeout(function() {
            this.text.destroy();

        }.bind(this), 1000);
    }

    showTextAt(x, y, text) {

        var style = { font: "12px Arial", fill: "#000000", align: "center" };

        var text = this.roomScene.add.text(x, y, text, style);

        text.anchor.set(0.5);

        setTimeout(function() {
            text.destroy();

        }.bind(this), 1000);
    }


    putItemOnInventory(itemName) {
        this.inventory.putItem(itemName);
    }

    createGroups() {
        this.backLayer = this.roomScene.add.group();
        this.frontLayer = this.roomScene.add.group();
    }

    configureBackground(roomData) {
        // var bg = this.backLayer.create(roomData.width/2, roomData.height/2, roomData.bg.image);
        var bg = this.backLayer.create(this.getConfig().width/2, this.getConfig().height/2, roomData.bg.image);
        // TODO: this is not working
        bg.width = roomData.width;
        bg.height = roomData.height;
    }

    configureAudio(roomData) {
        this.audioManager.playRoomAudio(roomData.audio)
    }

    configurePlayerAt(x, y, playerData) {
        this.player = new Player(this.roomScene, playerData.spritesheet, this.frontLayer, x, y, this.walkableAreaManager, this.exitAreaManager, this);
        this.mouseHandlers.push(this.player);
        this.updateHandlers.push(this.player);
    }

    createClickableAreas(roomData) {
        this.clickableAreaManager.init(roomData, this.roomScene);
        this.mouseHandlers.push(this.clickableAreaManager);
    }

    createExitRoom(roomData) {
        this.exitAreaManager.init(roomData, this.roomScene);
    }

    createWalkableArea(roomData) {
        this.walkableAreaManager.init(roomData, this.roomScene);
    }

    createInventory() {
        this.inventory.init(this.roomScene);
    }

    callMouseHandlers(pointer) {
        console.log('callMouseHandlers');
        this.mouseHandlers.every(function(mouseHandler) {

            return mouseHandler.handleMouse(pointer);

        });
    }

    callUpdateHandlers(delta) {
        this.updateHandlers.every(function(updateHandler) {

            return updateHandler.update(delta);

        });
    }

    containsItem(itemName) {
        return this.inventory.getInventoryItem(itemName) != null;
    }

    goToRoom(roomName) {
        if (this.roomScene)
            this.roomScene.scene.start("room", {'roomName': roomName, 'engine': this});
        else
            this.loadScene.scene.start("room", {'roomName': roomName, 'engine': this});
    }

    load(scene) {
        // this.game = scene;
        this.loadScene = scene;

        this.data = scene.cache.json.get('gameData');
        this.data.resources.forEach((resource) => {
            console.log('loading ', resource);
            if (resource.type === 'image') {
                scene.load.image(resource.name, resource.path);
            }
            else if (resource.type === 'spritesheet') {
                scene.load.spritesheet(resource.name, resource.path, {frameWidth: resource.width, frameHeight: resource.height});
            } else if (resource.type === 'audio') {
                scene.load.audio(resource.name, [resource.path]);
            }
        });

        this.loadScene.load.on('progress', (percentage) => {
            console.log(percentage);
        });

        this.loadScene.sys.game.resize(this.data.width, this.data.height);
        this.inventory.loadItems();
    }

    start() {

        this.audioManager.playDefaultAudio(this.data.defaultAudio);

        if (this.data.initialRoom === undefined)
            throw new Error("the game.json does not have an initialRoom");

        this.goToRoom(this.data.initialRoom, [32, 40]);
    }



}
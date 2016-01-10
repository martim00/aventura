ns.provide('aventura.app.GameRoom');

aventura.app.GameRoom = function(name, width, height) {
	this.name = name;
	this.bg;
	this.walkableAreas = [];
	this.clickableAreas = [];
	this.width = width;
	this.height = height;
}

aventura.app.GameRoom.prototype.setBg = function(bg) {
	this.bg = bg;
}

aventura.app.GameRoom.prototype.getBg = function() {
	return this.bg;
}

aventura.app.GameRoom.prototype.setName = function(name) {
	this.name = name;
}

aventura.app.GameRoom.prototype.getName = function() {
	return this.name;
}

aventura.app.GameRoom.prototype.createClickableArea = function(points) {
	var clickableArea = new aventura.app.ClickableArea(points);
	this.clickableAreas.push(clickableArea);
}

aventura.app.GameRoom.prototype.createWalkableArea = function(points) {
	var walkableArea = new aventura.app.WalkableArea(points);
	this.walkableAreas.push(walkableArea);
}

aventura.app.GameRoom.prototype.getWalkableAreas = function() {
	return this.walkableAreas;
}

aventura.app.GameRoom.prototype.getClickableAreas = function() {
	return this.clickableAreas;
}



aventura.app.GameRoom.prototype.serialize = function(json) {

	var roomBgId = this.name + "_bg"
	json.rooms[this.name] = {};
	json.rooms[this.name].width = this.width;
	json.rooms[this.name].height = this.height;
	json.rooms[this.name].bg = { "image" : roomBgId };
	if (this.bg) {
		json.resources.push({
			"name" : roomBgId,
			"path" : this.bg,
			"type" : "image"
		});
	}
	json.rooms[this.name].walkableAreas = [];

	this.walkableAreas.forEach(function(walkableArea) {
		var points = walkableArea.getPoints();
		json.rooms[this.name].walkableAreas.push(points);

	}.bind(this));

	json.rooms[this.name].clickableAreas = [];

	this.clickableAreas.forEach(function(clickableArea) {
		var points = clickableArea.getPoints();
		json.rooms[this.name].clickableAreas.push(points);

	}.bind(this));
}

aventura.app.GameRoom.loadFrom = function(json, roomName) {
  	var room = json.rooms[roomName];
	var width = room.width;
	var height = room.height;
	var gameRoom = new aventura.app.GameRoom(roomName, width, height); 
	if (room.bg) {
		json.resources.forEach(function(resource) {
			if (resource.name == room.bg.image)
				gameRoom.setBg(resource.path);
		});
	}

	DbC.requireNotNull(room.walkableAreas, "room.walkableAreas");

	room.walkableAreas.forEach(function(walkableArea) {
		gameRoom.createWalkableArea(walkableArea);
	});

	DbC.requireNotNull(room.clickableAreas, "room.clickableAreas");

	room.clickableAreas.forEach(function(clickableArea) {
		gameRoom.createClickableArea(clickableArea);
	});

	return gameRoom;

}

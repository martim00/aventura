ns.provide('aventura.app.GameRoom');

aventura.app.GameRoom = function(name, width, height) {
	this.name = name;
	this.bg;
	this.walkableAreas = [];
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

aventura.app.GameRoom.prototype.createWalkableArea = function(points) {
	var walkableArea = new aventura.app.WalkableArea(points);
	this.walkableAreas.push(walkableArea);
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

	this.walkableAreas.forEach(function(walkableArea) {
		var points = walkableArea.getPoints();
		json.rooms[this.name].walkableArea = points;

	}.bind(this));

	//"walkableArea" : [ [0, 300], [25, 240], [40, 240], [70, 300], [671, 350], [671, 448], [0, 448] ]
}
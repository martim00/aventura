DbC = function() {

}

DbC.require = function(condition, description) {
	if (!condition)
		throw new Error(description);
}

DbC.requireNotNull = function(object, objectName) {
	if (!object)
		throw new Error("The object " + objectName + " should not be null or undefined");
}

DbC = function() {

}

DbC.require = function(condition, description) {
	if (!condition)
		throw new Error(description);
}

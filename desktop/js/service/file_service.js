var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

function fileErrorHandler(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
}


function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}

function writeBinaryFile(filename, content) {

  // chunk is the Uint8Array object
  writeToFile(filename, toBuffer(content));

  /*return;

  var wstream = fs.createWriteStream(filename, { flags : 'w' });
  wstream.on('finish', function () {
    console.log('file has been written');
  });



// creates random Buffer of 100 bytes
  //var buffer = crypto.randomBytes(100);
  wstream.write(content);
// create another Buffer of 100 bytes and write
  //wstream.write(crypto.randomBytes(100));
  //wstream.end();
  wstream.end(function () { console.log('done'); });*/

  /*fs.writeFile(filename , content, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  }); */
}

function writeTextFile(filename, content) {
  writeToFile(filename, content);
}

function writeToFile(filename, content) {
  writeFileSync(filename, content);

  // chunk is the Uint8Array object
  /*fs.writeFile(filename, content, function (err) {
    if (err) {
      console.log("error");
    } else {
      console.log("sucess");
      fn();
    }
  });*/
}

function writeFileSync(target, content) {
  var folder = path.dirname(target);

  if (!fs.existsSync(folder)){
    fs.mkdirSync(folder);
  }
  fs.writeFileSync(target, content);
}

function copyFileSync(source, target) {
  writeFileSync(target, fs.readFileSync(source))
  //fs.writeFileSync(target, fs.readFileSync(source));
}

function copyFile(source, target, fn) {
  var fnCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!fnCalled) {
      fn(err);
      fnCalled = true;
    }
  }
}

function readFile(filename) {
  var content = fs.readFileSync(filename, "utf8");
  return content;
}
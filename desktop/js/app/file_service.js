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

var fs = require('fs');
var crypto = require('crypto');

function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}

function writeBinaryFile(filename, content, fn) {

  // chunk is the Uint8Array object
  writeToFile(filename, toBuffer(content), fn);

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

function writeTextFile(filename, content, fn) {
  writeToFile(filename, content, fn);
}

function writeToFile(filename, content, fn) {

  // chunk is the Uint8Array object
  fs.writeFile(filename, content, function (err) {
    if (err) {
      console.log("error");
    } else {
      console.log("sucess");
      fn();
    }
  });
}

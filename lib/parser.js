var fs = require('fs');
var libxmljs = require("libxmljs");
const Iconv = require('iconv').Iconv;

var Parser = function(ecoding) {
  this.encoding = ecoding || 'utf-8';
}

Parser.prototype = {
  parse: function(path, cb) {
    var self = this;
    var options = {}
    
    if (["ascii", "utf8", "utf-8", "utf16le", "ucs2", "ucs-2", "base64", "latin1", "binary", "hex"].includes(self.encoding)) {
        options = {encoding : self.encoding}
    }
    
    /*
    var iconv = new Iconv('cp1251', 'utf-8');
    const encoded = fs.readFileSync(path);
    const decoded = iconv.convert(encoded).toString();
    console.log('decoded', decoded.slice(0, 1000));
    */
    fs.readFile(path, options, function(err, data) {
      if (!err) {

        var book
          , firstName
          , lastName
          , genre
          , id
          , bookTitle
          , annotation
          , date
          , nameSpace = {FictionBook: 'http://www.gribuser.ru/xml/fictionbook/2.0'}
          , info = {};
        
        if(self.encoding == 'cp1251') {
            var iconv = new Iconv('cp1251', 'utf8');
            data = iconv.convert(data).toString();
            data = data.replace('<?xml version="1.0" encoding="windows-1251"?>', '<?xml version="1.0" encoding="utf-8"?>');
        }

        book = libxmljs.parseXmlString(data);

        firstName = book.get('//FictionBook:first-name', nameSpace);
        if(firstName) {
            firstName = firstName.text();
        }
        lastName = book.get('//FictionBook:last-name', nameSpace);
        if(lastName) {
            lastName = lastName.text();
        }
        genre = book.get('//FictionBook:genre', nameSpace);
        if(genre) {
            genre = genre.text();
        }
        date = book.get('//FictionBook:date', nameSpace);
        if(date) {
            date = date.text();
        }
        bookTitle = book.get('//FictionBook:book-title', nameSpace);
        if(bookTitle) {
            bookTitle = bookTitle.text();
        }
        annotation = book.get('//FictionBook:annotation', nameSpace);
        if(annotation) {
            annotation = annotation.text();
        }
        id = book.get('//FictionBook:id', nameSpace);
        if(id) {
            id = id.text();
        }
        
        info.firstName = firstName;
        info.lastName = lastName;
        info.genre = genre;
        info.date = date;
        info.bookTitle = bookTitle;
        info.annotation = annotation;
        info.id = id;
        cb(null, info);
      } else {
        cb(err);
        console.log(err);
      }
    });
  }
}

module.exports = Parser;

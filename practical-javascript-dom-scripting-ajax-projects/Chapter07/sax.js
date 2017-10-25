// Note: This is a very slightly modified version of the original sax.js code
// from the Mozilla project.

function SAXParser() {

  this.doc = false;
  this.handler = false;
  this.str = "";
  this.cname = new Array();
  this.curr = 0;
  this.notToBeParsed_CDATA = {
    running: false, value: ""
  };

}


SAXParser.prototype.setDocumentHandler = function(aHandler) {

  this.handler = aHandler;

}


SAXParser.prototype.parse = function(aData) {

  this.str += aData;
  if (this.handler == false) {
    return;
  }
  if (!this.doc) {
    var start = this.str.indexOf("<");
    if (this.str.substring(start,start + 3) == "<?x" ||
      this.str.substring(start,start + 3) == "<?X" ) {
      var close = this.str.indexOf("?>");
      if (close == -1) {
        return;
      }
      this.str = this.str.substring(close + 2, this.str.length);
    }
    this.handler.startDocument();
    this.doc = true;
  }
  while (1) {
    if (this.str.length == 0) {
      return;
    }
    if (this.notToBeParsed_CDATA.running) {
      var CDATA_end = this.str.indexOf("]]>");
      if (CDATA_end == -1) {
        this.notToBeParsed_CDATA.string += this.str;
        this.str = "";
        continue;
      } else {
        this.notToBeParsed_CDATA.string += this.str.substring(0, CDATA_end);
        this.str = this.str.substring(CDATA_end + 3, this.str.length);
        this.notToBeParsed_CDATA.running = false;
        this.handler.characters(this.notToBeParsed_CDATA.string);
        this.notToBeParsed_CDATA.string = "";
        continue;
      }
    }
    var eclose = this.str.indexOf("</" + this.cname[this.curr] + ">");
    if (eclose == 0) {
      this.str = this.str.substring(this.cname[this.curr].length + 3,
        this.str.length);
      this.handler.endElement(this.cname[this.curr]);
        this.curr--;
      if (this.curr == 0) {
        this.doc = false;
        this.handler.endDocument();
        return;
      }
      continue;
    }
    if (this.str.indexOf("<![CDATA[") == 0) {
      this.notToBeParsed_CDATA.running = true;
      this.notToBeParsed_CDATA.string = "";
      this.str = this.str.substring(9, this.str.length);
      continue;
    }
    var estart = this.str.indexOf("<");
    if (estart == 0) {
      close = this.indexEndElement(this.str);
      if (close == -1) {
        return;
      }
      var empty = (this.str.substring(close - 1, close) == "/");
      if (empty) {
        var starttag = this.str.substring(1, close - 1);
      }else{
        starttag = this.str.substring(1, close);
      }
      var nextspace = starttag.indexOf(" ");
      var attribs = new String();
      var name = new String();
      if (nextspace != -1) {
        name = starttag.substring(0, nextspace);
        attribs = starttag.substring(nextspace + 1, starttag.length);
      } else {
        name = starttag;
      }
      this.handler.startElement(name, this.attribution(attribs));
      if (empty) {
        this.handler.endElement(name);
      } else {
        this.curr++;
        this.cname[this.curr] = name;
      }
      this.str = this.str.substring(close + 1, this.str.length);
      continue;
    }
    if (estart == -1) {
      this.handler.characters(this.entityCheck(this.str));
      this.str = "";
    } else {
      this.handler.characters(this.entityCheck(this.str.substring(0, estart)));
      this.str = this.str.substring(estart, this.str.length);
    }
  }

}


SAXParser.prototype.indexEndElement = function(aStr) {

  var eq = sp = gt = 0;
  sp = aStr.indexOf(" ");
  gt = aStr.indexOf(">");
  if (sp < gt) {
    if (sp == -1) {
      return gt;
    }
    if (aStr.charAt(sp + 1) == ">") {
      return sp;
    }
  } else {
    return gt;
  }
  var end = 0;
  while (1) {
    eq = aStr.indexOf("=", end);
    id = aStr.charAt(eq + 1);
    end = aStr.indexOf(id, eq + 2);
    if (aStr.charAt(end+1) == "/" && aStr.charAt(end+2) == ">") {
      return end+2;
    }
    if (aStr.charAt(end+1) == ">") {
      return end + 1;
    }
    end = end + 1;
  }
  return end;

}


SAXParser.prototype.attribution = function(aStr) {

  var attribs = new Array();
  var ids = new Number();
  var eq = id1 = id2 = nextid = val = key = new String();
  i = 0;
  while(1) {
    eq = aStr.indexOf("=");
    if (aStr.length == 0 || eq == -1) { return attribs; }
    id1 = aStr.indexOf("'");
    id2 = aStr.indexOf("\"");
    if ((id1 < id2 && id1 != -1) || id2 == -1) {
      ids = id1;
      id = "'";
    }
    if ((id2 < id1 || id1 == -1) && id2 != -1) {
      ids = id2;
      id = "\"";
    }
    nextid = aStr.indexOf(id, ids + 1);
    val = aStr.substring(ids + 1, nextid);
    key = aStr.substring(0,eq);
    ws = key.split("\n");
    key = ws.join("");
    ws = key.split(" ");
    key = ws.join("");
    ws = key.split("\t");
    key = ws.join("");
    attribs[i] = key + "=" + this.entityCheck(val);
    i++;
    aStr = aStr.substring(nextid + 1, aStr.length);
  }
  return attribs;

}


SAXParser.prototype.entityCheck = function(aStr) {

  var A = new Array();
  A = aStr.split("&lt;");
  aStr = A.join("<");
  A = aStr.split("&gt;");
  aStr = A.join(">");
  A = aStr.split("&quot;");
  aStr = A.join("'");
  A = aStr.split("&apos;");
  aStr = A.join("'");
  A = aStr.split("&amp;");
  aStr = A.join("&");
  return aStr;

}

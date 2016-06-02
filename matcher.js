function _(e) {
  return new _P(e);
}
function _P(e) {
  this.e = e;
}

function match() {
  function ts(o) {
    if(o instanceof _P) {
      return '_("'+o.e+'")';
    }
    if(o instanceof Object) {
      var s = [];
      for(var i in o) {
        s.push(i+":"+ts(o[i]));
      }
      return "{"+s.join(",")+"}";
    }
    if(o instanceof Array) {
      var s = [];
      for(var i = 0; i < o.length; i++) {
        s.push(ts(o[i]));
      }
      return "["+s.join(",")+"]";
    }
    return JSON.stringify(o);
  }
  var t = "   throw ('cannot match '+e);\n"
    var str = "var f = function(e) {\n";

  for(var i = 0; i < arguments.length; i++) {
    var a = arguments[i];
    var m = a[0];
    var f = a[1];
    if (m == _) {
      str += "    return ("+f.toString()+"(e));\n"
        t = "";
      break;
    }

    var envs = [];
    var conds = [];
    function mat(m, e) {
      switch (typeof m) {
        case "object":
          if (m instanceof _P) {
            envs.push(m.e+":" + e);
            return;
          }
          conds.push("typeof e == 'object'");
          for(var i in m) {
            conds.push('"'+i+'" in '+e+'');
          }

          for(var i in m) {
            mat(m[i], e+"."+i);
          }
          return;
        case "string":
        case "number":
          conds.push(e+" == "+ts(m));
          return;
      }
    }
    mat(m, "e");
    if(conds.length > 0) {
      str += "    if ("+conds.join(" && ")+") {\n";
    }
    str += "        return ("+f+"({"+envs.join(",")+"}));\n";
    if(conds.length > 0) {
      str += "    }\n"
    }
  }
  str += t;
  str += "};\n"
    console.log(str);
  eval(str);
  return f;
}

var evl2 = match(
    [{op:"+",left:_("l"),right:_("r")}, function(e) {
      return evl2(e.l) + evl2(e.r);
    }],
    [{op:"*",left:_("l"),right:_("r")}, function(e) {
      return evl2(e.l) * evl2(e.r);
    }],
    [_,function(e){ return e;}]
    );
console.log(evl2({op:"+",left:1,right:{op:"*",left:2,right:3}}));
module.exports=match

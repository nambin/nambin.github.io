/* DEV BUILD — Gemini API key inlined from .env. DO NOT DEPLOY. */

// node_modules/js-yaml/dist/js-yaml.mjs
function isNothing(subject) {
  return typeof subject === "undefined" || subject === null;
}
function isObject(subject) {
  return typeof subject === "object" && subject !== null;
}
function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;
  else if (isNothing(sequence)) return [];
  return [sequence];
}
function extend(target, source) {
  var index, length, key, sourceKeys;
  if (source) {
    sourceKeys = Object.keys(source);
    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }
  return target;
}
function repeat(string, count) {
  var result = "", cycle;
  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }
  return result;
}
function isNegativeZero(number) {
  return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
}
var isNothing_1 = isNothing;
var isObject_1 = isObject;
var toArray_1 = toArray;
var repeat_1 = repeat;
var isNegativeZero_1 = isNegativeZero;
var extend_1 = extend;
var common = {
  isNothing: isNothing_1,
  isObject: isObject_1,
  toArray: toArray_1,
  repeat: repeat_1,
  isNegativeZero: isNegativeZero_1,
  extend: extend_1
};
function formatError(exception2, compact) {
  var where = "", message = exception2.reason || "(unknown reason)";
  if (!exception2.mark) return message;
  if (exception2.mark.name) {
    where += 'in "' + exception2.mark.name + '" ';
  }
  where += "(" + (exception2.mark.line + 1) + ":" + (exception2.mark.column + 1) + ")";
  if (!compact && exception2.mark.snippet) {
    where += "\n\n" + exception2.mark.snippet;
  }
  return message + " " + where;
}
function YAMLException$1(reason, mark) {
  Error.call(this);
  this.name = "YAMLException";
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack || "";
  }
}
YAMLException$1.prototype = Object.create(Error.prototype);
YAMLException$1.prototype.constructor = YAMLException$1;
YAMLException$1.prototype.toString = function toString(compact) {
  return this.name + ": " + formatError(this, compact);
};
var exception = YAMLException$1;
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = "";
  var tail = "";
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
  if (position - lineStart > maxHalfLength) {
    head = " ... ";
    lineStart = position - maxHalfLength + head.length;
  }
  if (lineEnd - position > maxHalfLength) {
    tail = " ...";
    lineEnd = position + maxHalfLength - tail.length;
  }
  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "\u2192") + tail,
    pos: position - lineStart + head.length
    // relative position
  };
}
function padStart(string, max) {
  return common.repeat(" ", max - string.length) + string;
}
function makeSnippet(mark, options) {
  options = Object.create(options || null);
  if (!mark.buffer) return null;
  if (!options.maxLength) options.maxLength = 79;
  if (typeof options.indent !== "number") options.indent = 1;
  if (typeof options.linesBefore !== "number") options.linesBefore = 3;
  if (typeof options.linesAfter !== "number") options.linesAfter = 2;
  var re = /\r?\n|\r|\0/g;
  var lineStarts = [0];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;
  while (match = re.exec(mark.buffer)) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);
    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }
  if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
  var result = "", i, line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
  for (i = 1; i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo - i],
      lineEnds[foundLineNo - i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
      maxLineLength
    );
    result = common.repeat(" ", options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result;
  }
  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  result += common.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
  for (i = 1; i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo + i],
      lineEnds[foundLineNo + i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
      maxLineLength
    );
    result += common.repeat(" ", options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  }
  return result.replace(/\n$/, "");
}
var snippet = makeSnippet;
var TYPE_CONSTRUCTOR_OPTIONS = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
];
var YAML_NODE_KINDS = [
  "scalar",
  "sequence",
  "mapping"
];
function compileStyleAliases(map2) {
  var result = {};
  if (map2 !== null) {
    Object.keys(map2).forEach(function(style) {
      map2[style].forEach(function(alias) {
        result[String(alias)] = style;
      });
    });
  }
  return result;
}
function Type$1(tag, options) {
  options = options || {};
  Object.keys(options).forEach(function(name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });
  this.options = options;
  this.tag = tag;
  this.kind = options["kind"] || null;
  this.resolve = options["resolve"] || function() {
    return true;
  };
  this.construct = options["construct"] || function(data) {
    return data;
  };
  this.instanceOf = options["instanceOf"] || null;
  this.predicate = options["predicate"] || null;
  this.represent = options["represent"] || null;
  this.representName = options["representName"] || null;
  this.defaultStyle = options["defaultStyle"] || null;
  this.multi = options["multi"] || false;
  this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}
var type = Type$1;
function compileList(schema2, name) {
  var result = [];
  schema2[name].forEach(function(currentType) {
    var newIndex = result.length;
    result.forEach(function(previousType, previousIndex) {
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
        newIndex = previousIndex;
      }
    });
    result[newIndex] = currentType;
  });
  return result;
}
function compileMap() {
  var result = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, index, length;
  function collectType(type2) {
    if (type2.multi) {
      result.multi[type2.kind].push(type2);
      result.multi["fallback"].push(type2);
    } else {
      result[type2.kind][type2.tag] = result["fallback"][type2.tag] = type2;
    }
  }
  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}
function Schema$1(definition) {
  return this.extend(definition);
}
Schema$1.prototype.extend = function extend2(definition) {
  var implicit = [];
  var explicit = [];
  if (definition instanceof type) {
    explicit.push(definition);
  } else if (Array.isArray(definition)) {
    explicit = explicit.concat(definition);
  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    if (definition.implicit) implicit = implicit.concat(definition.implicit);
    if (definition.explicit) explicit = explicit.concat(definition.explicit);
  } else {
    throw new exception("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  }
  implicit.forEach(function(type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
    if (type$1.loadKind && type$1.loadKind !== "scalar") {
      throw new exception("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    }
    if (type$1.multi) {
      throw new exception("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }
  });
  explicit.forEach(function(type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
  });
  var result = Object.create(Schema$1.prototype);
  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);
  result.compiledImplicit = compileList(result, "implicit");
  result.compiledExplicit = compileList(result, "explicit");
  result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
  return result;
};
var schema = Schema$1;
var str = new type("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(data) {
    return data !== null ? data : "";
  }
});
var seq = new type("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(data) {
    return data !== null ? data : [];
  }
});
var map = new type("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(data) {
    return data !== null ? data : {};
  }
});
var failsafe = new schema({
  explicit: [
    str,
    seq,
    map
  ]
});
function resolveYamlNull(data) {
  if (data === null) return true;
  var max = data.length;
  return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
}
function constructYamlNull() {
  return null;
}
function isNull(object) {
  return object === null;
}
var _null = new type("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
});
function resolveYamlBoolean(data) {
  if (data === null) return false;
  var max = data.length;
  return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
}
function constructYamlBoolean(data) {
  return data === "true" || data === "True" || data === "TRUE";
}
function isBoolean(object) {
  return Object.prototype.toString.call(object) === "[object Boolean]";
}
var bool = new type("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function(object) {
      return object ? "true" : "false";
    },
    uppercase: function(object) {
      return object ? "TRUE" : "FALSE";
    },
    camelcase: function(object) {
      return object ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
});
function isHexCode(c) {
  return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
}
function isOctCode(c) {
  return 48 <= c && c <= 55;
}
function isDecCode(c) {
  return 48 <= c && c <= 57;
}
function resolveYamlInteger(data) {
  if (data === null) return false;
  var max = data.length, index = 0, hasDigits = false, ch;
  if (!max) return false;
  ch = data[index];
  if (ch === "-" || ch === "+") {
    ch = data[++index];
  }
  if (ch === "0") {
    if (index + 1 === max) return true;
    ch = data[++index];
    if (ch === "b") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (ch !== "0" && ch !== "1") return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "x") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "o") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (!isOctCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
  }
  if (ch === "_") return false;
  for (; index < max; index++) {
    ch = data[index];
    if (ch === "_") continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }
  if (!hasDigits || ch === "_") return false;
  return true;
}
function constructYamlInteger(data) {
  var value = data, sign = 1, ch;
  if (value.indexOf("_") !== -1) {
    value = value.replace(/_/g, "");
  }
  ch = value[0];
  if (ch === "-" || ch === "+") {
    if (ch === "-") sign = -1;
    value = value.slice(1);
    ch = value[0];
  }
  if (value === "0") return 0;
  if (ch === "0") {
    if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
    if (value[1] === "x") return sign * parseInt(value.slice(2), 16);
    if (value[1] === "o") return sign * parseInt(value.slice(2), 8);
  }
  return sign * parseInt(value, 10);
}
function isInteger(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
}
var int = new type("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary: function(obj) {
      return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
    },
    octal: function(obj) {
      return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
    },
    decimal: function(obj) {
      return obj.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(obj) {
      return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
});
var YAML_FLOAT_PATTERN = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function resolveYamlFloat(data) {
  if (data === null) return false;
  if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  data[data.length - 1] === "_") {
    return false;
  }
  return true;
}
function constructYamlFloat(data) {
  var value, sign;
  value = data.replace(/_/g, "").toLowerCase();
  sign = value[0] === "-" ? -1 : 1;
  if ("+-".indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }
  if (value === ".inf") {
    return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  } else if (value === ".nan") {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}
var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
function representYamlFloat(object, style) {
  var res;
  if (isNaN(object)) {
    switch (style) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  } else if (common.isNegativeZero(object)) {
    return "-0.0";
  }
  res = object.toString(10);
  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
}
function isFloat(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
}
var float = new type("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: "lowercase"
});
var json = failsafe.extend({
  implicit: [
    _null,
    bool,
    int,
    float
  ]
});
var core = json;
var YAML_DATE_REGEXP = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
);
var YAML_TIMESTAMP_REGEXP = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}
function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
  if (match === null) throw new Error("Date resolve error");
  year = +match[1];
  month = +match[2] - 1;
  day = +match[3];
  if (!match[4]) {
    return new Date(Date.UTC(year, month, day));
  }
  hour = +match[4];
  minute = +match[5];
  second = +match[6];
  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) {
      fraction += "0";
    }
    fraction = +fraction;
  }
  if (match[9]) {
    tz_hour = +match[10];
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 6e4;
    if (match[9] === "-") delta = -delta;
  }
  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
  if (delta) date.setTime(date.getTime() - delta);
  return date;
}
function representYamlTimestamp(object) {
  return object.toISOString();
}
var timestamp = new type("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});
function resolveYamlMerge(data) {
  return data === "<<" || data === null;
}
var merge = new type("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: resolveYamlMerge
});
var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
function resolveYamlBinary(data) {
  if (data === null) return false;
  var code, idx, bitlen = 0, max = data.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    code = map2.indexOf(data.charAt(idx));
    if (code > 64) continue;
    if (code < 0) return false;
    bitlen += 6;
  }
  return bitlen % 8 === 0;
}
function constructYamlBinary(data) {
  var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map2 = BASE64_MAP, bits = 0, result = [];
  for (idx = 0; idx < max; idx++) {
    if (idx % 4 === 0 && idx) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    }
    bits = bits << 6 | map2.indexOf(input.charAt(idx));
  }
  tailbits = max % 4 * 6;
  if (tailbits === 0) {
    result.push(bits >> 16 & 255);
    result.push(bits >> 8 & 255);
    result.push(bits & 255);
  } else if (tailbits === 18) {
    result.push(bits >> 10 & 255);
    result.push(bits >> 2 & 255);
  } else if (tailbits === 12) {
    result.push(bits >> 4 & 255);
  }
  return new Uint8Array(result);
}
function representYamlBinary(object) {
  var result = "", bits = 0, idx, tail, max = object.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    if (idx % 3 === 0 && idx) {
      result += map2[bits >> 18 & 63];
      result += map2[bits >> 12 & 63];
      result += map2[bits >> 6 & 63];
      result += map2[bits & 63];
    }
    bits = (bits << 8) + object[idx];
  }
  tail = max % 3;
  if (tail === 0) {
    result += map2[bits >> 18 & 63];
    result += map2[bits >> 12 & 63];
    result += map2[bits >> 6 & 63];
    result += map2[bits & 63];
  } else if (tail === 2) {
    result += map2[bits >> 10 & 63];
    result += map2[bits >> 4 & 63];
    result += map2[bits << 2 & 63];
    result += map2[64];
  } else if (tail === 1) {
    result += map2[bits >> 2 & 63];
    result += map2[bits << 4 & 63];
    result += map2[64];
    result += map2[64];
  }
  return result;
}
function isBinary(obj) {
  return Object.prototype.toString.call(obj) === "[object Uint8Array]";
}
var binary = new type("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});
var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
var _toString$2 = Object.prototype.toString;
function resolveYamlOmap(data) {
  if (data === null) return true;
  var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;
    if (_toString$2.call(pair) !== "[object Object]") return false;
    for (pairKey in pair) {
      if (_hasOwnProperty$3.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;
        else return false;
      }
    }
    if (!pairHasKey) return false;
    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
    else return false;
  }
  return true;
}
function constructYamlOmap(data) {
  return data !== null ? data : [];
}
var omap = new type("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});
var _toString$1 = Object.prototype.toString;
function resolveYamlPairs(data) {
  if (data === null) return true;
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    if (_toString$1.call(pair) !== "[object Object]") return false;
    keys = Object.keys(pair);
    if (keys.length !== 1) return false;
    result[index] = [keys[0], pair[keys[0]]];
  }
  return true;
}
function constructYamlPairs(data) {
  if (data === null) return [];
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    keys = Object.keys(pair);
    result[index] = [keys[0], pair[keys[0]]];
  }
  return result;
}
var pairs = new type("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});
var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
function resolveYamlSet(data) {
  if (data === null) return true;
  var key, object = data;
  for (key in object) {
    if (_hasOwnProperty$2.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }
  return true;
}
function constructYamlSet(data) {
  return data !== null ? data : {};
}
var set = new type("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: resolveYamlSet,
  construct: constructYamlSet
});
var _default = core.extend({
  implicit: [
    timestamp,
    merge
  ],
  explicit: [
    binary,
    omap,
    pairs,
    set
  ]
});
var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var CONTEXT_FLOW_IN = 1;
var CONTEXT_FLOW_OUT = 2;
var CONTEXT_BLOCK_IN = 3;
var CONTEXT_BLOCK_OUT = 4;
var CHOMPING_CLIP = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP = 3;
var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function is_EOL(c) {
  return c === 10 || c === 13;
}
function is_WHITE_SPACE(c) {
  return c === 9 || c === 32;
}
function is_WS_OR_EOL(c) {
  return c === 9 || c === 32 || c === 10 || c === 13;
}
function is_FLOW_INDICATOR(c) {
  return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
}
function fromHexCode(c) {
  var lc;
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  lc = c | 32;
  if (97 <= lc && lc <= 102) {
    return lc - 97 + 10;
  }
  return -1;
}
function escapedHexLen(c) {
  if (c === 120) {
    return 2;
  }
  if (c === 117) {
    return 4;
  }
  if (c === 85) {
    return 8;
  }
  return 0;
}
function fromDecimalCode(c) {
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  return -1;
}
function simpleEscapeSequence(c) {
  return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
}
function charFromCodepoint(c) {
  if (c <= 65535) {
    return String.fromCharCode(c);
  }
  return String.fromCharCode(
    (c - 65536 >> 10) + 55296,
    (c - 65536 & 1023) + 56320
  );
}
function setProperty(object, key, value) {
  if (key === "__proto__") {
    Object.defineProperty(object, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value
    });
  } else {
    object[key] = value;
  }
}
var simpleEscapeCheck = new Array(256);
var simpleEscapeMap = new Array(256);
for (i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}
var i;
function State$1(input, options) {
  this.input = input;
  this.filename = options["filename"] || null;
  this.schema = options["schema"] || _default;
  this.onWarning = options["onWarning"] || null;
  this.legacy = options["legacy"] || false;
  this.json = options["json"] || false;
  this.listener = options["listener"] || null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap = this.schema.compiledTypeMap;
  this.length = input.length;
  this.position = 0;
  this.line = 0;
  this.lineStart = 0;
  this.lineIndent = 0;
  this.firstTabInLine = -1;
  this.documents = [];
}
function generateError(state, message) {
  var mark = {
    name: state.filename,
    buffer: state.input.slice(0, -1),
    // omit trailing \0
    position: state.position,
    line: state.line,
    column: state.position - state.lineStart
  };
  mark.snippet = snippet(mark);
  return new exception(message, mark);
}
function throwError(state, message) {
  throw generateError(state, message);
}
function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}
var directiveHandlers = {
  YAML: function handleYamlDirective(state, name, args) {
    var match, major, minor;
    if (state.version !== null) {
      throwError(state, "duplication of %YAML directive");
    }
    if (args.length !== 1) {
      throwError(state, "YAML directive accepts exactly one argument");
    }
    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
    if (match === null) {
      throwError(state, "ill-formed argument of the YAML directive");
    }
    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);
    if (major !== 1) {
      throwError(state, "unacceptable YAML version of the document");
    }
    state.version = args[0];
    state.checkLineBreaks = minor < 2;
    if (minor !== 1 && minor !== 2) {
      throwWarning(state, "unsupported YAML version of the document");
    }
  },
  TAG: function handleTagDirective(state, name, args) {
    var handle, prefix;
    if (args.length !== 2) {
      throwError(state, "TAG directive accepts exactly two arguments");
    }
    handle = args[0];
    prefix = args[1];
    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
    }
    if (_hasOwnProperty$1.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }
    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
    }
    try {
      prefix = decodeURIComponent(prefix);
    } catch (err) {
      throwError(state, "tag prefix is malformed: " + prefix);
    }
    state.tagMap[handle] = prefix;
  }
};
function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;
  if (start < end) {
    _result = state.input.slice(start, end);
    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
          throwError(state, "expected valid JSON character");
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, "the stream contains non-printable characters");
    }
    state.result += _result;
  }
}
function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;
  if (!common.isObject(source)) {
    throwError(state, "cannot merge mappings; the provided source object is unacceptable");
  }
  sourceKeys = Object.keys(source);
  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];
    if (!_hasOwnProperty$1.call(destination, key)) {
      setProperty(destination, key, source[key]);
      overridableKeys[key] = true;
    }
  }
}
function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
  var index, quantity;
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);
    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, "nested arrays are not supported inside keys");
      }
      if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
        keyNode[index] = "[object Object]";
      }
    }
  }
  if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
    keyNode = "[object Object]";
  }
  keyNode = String(keyNode);
  if (_result === null) {
    _result = {};
  }
  if (keyTag === "tag:yaml.org,2002:merge") {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, "duplicated mapping key");
    }
    setProperty(_result, keyNode, valueNode);
    delete overridableKeys[keyNode];
  }
  return _result;
}
function readLineBreak(state) {
  var ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 10) {
    state.position++;
  } else if (ch === 13) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 10) {
      state.position++;
    }
  } else {
    throwError(state, "a line break is expected");
  }
  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}
function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 9 && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    if (allowComments && ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 10 && ch !== 13 && ch !== 0);
    }
    if (is_EOL(ch)) {
      readLineBreak(state);
      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;
      while (ch === 32) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }
  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, "deficient indentation");
  }
  return lineBreaks;
}
function testDocumentSeparator(state) {
  var _position = state.position, ch;
  ch = state.input.charCodeAt(_position);
  if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
    _position += 3;
    ch = state.input.charCodeAt(_position);
    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }
  return false;
}
function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += " ";
  } else if (count > 1) {
    state.result += common.repeat("\n", count - 1);
  }
}
function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
  ch = state.input.charCodeAt(state.position);
  if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
    return false;
  }
  if (ch === 63 || ch === 45) {
    following = state.input.charCodeAt(state.position + 1);
    if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }
  state.kind = "scalar";
  state.result = "";
  captureStart = captureEnd = state.position;
  hasPendingContent = false;
  while (ch !== 0) {
    if (ch === 58) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }
    } else if (ch === 35) {
      preceding = state.input.charCodeAt(state.position - 1);
      if (is_WS_OR_EOL(preceding)) {
        break;
      }
    } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;
    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);
      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }
    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }
    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }
    ch = state.input.charCodeAt(++state.position);
  }
  captureSegment(state, captureStart, captureEnd, false);
  if (state.result) {
    return true;
  }
  state.kind = _kind;
  state.result = _result;
  return false;
}
function readSingleQuotedScalar(state, nodeIndent) {
  var ch, captureStart, captureEnd;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 39) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 39) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (ch === 39) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a single quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a single quoted scalar");
}
function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 34) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 34) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;
    } else if (ch === 92) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;
      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;
        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);
          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;
          } else {
            throwError(state, "expected hexadecimal character");
          }
        }
        state.result += charFromCodepoint(hexResult);
        state.position++;
      } else {
        throwError(state, "unknown escape sequence");
      }
      captureStart = captureEnd = state.position;
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a double quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a double quoted scalar");
}
function readFlowCollection(state, nodeIndent) {
  var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = /* @__PURE__ */ Object.create(null), keyNode, keyTag, valueNode, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 91) {
    terminator = 93;
    isMapping = false;
    _result = [];
  } else if (ch === 123) {
    terminator = 125;
    isMapping = true;
    _result = {};
  } else {
    return false;
  }
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(++state.position);
  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? "mapping" : "sequence";
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, "missed comma between flow collection entries");
    } else if (ch === 44) {
      throwError(state, "expected the node content, but found ','");
    }
    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;
    if (ch === 63) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }
    _line = state.line;
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if ((isExplicitPair || state.line === _line) && ch === 58) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }
    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === 44) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }
  throwError(state, "unexpected end of the stream within a flow collection");
}
function readBlockScalar(state, nodeIndent) {
  var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 124) {
    folding = false;
  } else if (ch === 62) {
    folding = true;
  } else {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);
    if (ch === 43 || ch === 45) {
      if (CHOMPING_CLIP === chomping) {
        chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, "repeat of a chomping mode identifier");
      }
    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, "repeat of an indentation width identifier");
      }
    } else {
      break;
    }
  }
  if (is_WHITE_SPACE(ch)) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (is_WHITE_SPACE(ch));
    if (ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (!is_EOL(ch) && ch !== 0);
    }
  }
  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;
    ch = state.input.charCodeAt(state.position);
    while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }
    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }
    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }
    if (state.lineIndent < textIndent) {
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) {
          state.result += "\n";
        }
      }
      break;
    }
    if (folding) {
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat("\n", emptyLines + 1);
      } else if (emptyLines === 0) {
        if (didReadContent) {
          state.result += " ";
        }
      } else {
        state.result += common.repeat("\n", emptyLines);
      }
    } else {
      state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
    }
    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;
    while (!is_EOL(ch) && ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, state.position, false);
  }
  return true;
}
function readBlockSequence(state, nodeIndent) {
  var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    if (ch !== 45) {
      break;
    }
    following = state.input.charCodeAt(state.position + 1);
    if (!is_WS_OR_EOL(following)) {
      break;
    }
    detected = true;
    state.position++;
    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }
    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a sequence entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "sequence";
    state.result = _result;
    return true;
  }
  return false;
}
function readBlockMapping(state, nodeIndent, flowIndent) {
  var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = /* @__PURE__ */ Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line;
    if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
      if (ch === 63) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        detected = true;
        atExplicitKey = true;
        allowCompact = true;
      } else if (atExplicitKey) {
        atExplicitKey = false;
        allowCompact = true;
      } else {
        throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
      }
      state.position += 1;
      ch = following;
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;
      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        break;
      }
      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 58) {
          ch = state.input.charCodeAt(++state.position);
          if (!is_WS_OR_EOL(ch)) {
            throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
          }
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;
        } else if (detected) {
          throwError(state, "can not read an implicit mapping pair; a colon is missed");
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true;
        }
      } else if (detected) {
        throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true;
      }
    }
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }
      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a mapping entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "mapping";
    state.result = _result;
  }
  return detected;
}
function readTagProperty(state) {
  var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 33) return false;
  if (state.tag !== null) {
    throwError(state, "duplication of a tag property");
  }
  ch = state.input.charCodeAt(++state.position);
  if (ch === 60) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);
  } else if (ch === 33) {
    isNamed = true;
    tagHandle = "!!";
    ch = state.input.charCodeAt(++state.position);
  } else {
    tagHandle = "!";
  }
  _position = state.position;
  if (isVerbatim) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (ch !== 0 && ch !== 62);
    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, "unexpected end of the stream within a verbatim tag");
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      if (ch === 33) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);
          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, "named tag handle cannot contain such characters");
          }
          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, "tag suffix cannot contain exclamation marks");
        }
      }
      ch = state.input.charCodeAt(++state.position);
    }
    tagName = state.input.slice(_position, state.position);
    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, "tag suffix cannot contain flow indicator characters");
    }
  }
  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, "tag name cannot contain such characters: " + tagName);
  }
  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, "tag name is malformed: " + tagName);
  }
  if (isVerbatim) {
    state.tag = tagName;
  } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;
  } else if (tagHandle === "!") {
    state.tag = "!" + tagName;
  } else if (tagHandle === "!!") {
    state.tag = "tag:yaml.org,2002:" + tagName;
  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }
  return true;
}
function readAnchorProperty(state) {
  var _position, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 38) return false;
  if (state.anchor !== null) {
    throwError(state, "duplication of an anchor property");
  }
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an anchor node must contain at least one character");
  }
  state.anchor = state.input.slice(_position, state.position);
  return true;
}
function readAlias(state) {
  var _position, alias, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 42) return false;
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an alias node must contain at least one character");
  }
  alias = state.input.slice(_position, state.position);
  if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }
  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}
function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type2, flowIndent, blockIndent;
  if (state.listener !== null) {
    state.listener("open", state);
  }
  state.tag = null;
  state.anchor = null;
  state.kind = null;
  state.result = null;
  allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;
      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }
  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }
  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }
  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }
    blockIndent = state.position - state.lineStart;
    if (indentStatus === 1) {
      if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;
        } else if (readAlias(state)) {
          hasContent = true;
          if (state.tag !== null || state.anchor !== null) {
            throwError(state, "alias node should not have any properties");
          }
        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;
          if (state.tag === null) {
            state.tag = "?";
          }
        }
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }
  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }
  } else if (state.tag === "?") {
    if (state.result !== null && state.kind !== "scalar") {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }
    for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type2 = state.implicitTypes[typeIndex];
      if (type2.resolve(state.result)) {
        state.result = type2.construct(state.result);
        state.tag = type2.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== "!") {
    if (_hasOwnProperty$1.call(state.typeMap[state.kind || "fallback"], state.tag)) {
      type2 = state.typeMap[state.kind || "fallback"][state.tag];
    } else {
      type2 = null;
      typeList = state.typeMap.multi[state.kind || "fallback"];
      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type2 = typeList[typeIndex];
          break;
        }
      }
    }
    if (!type2) {
      throwError(state, "unknown tag !<" + state.tag + ">");
    }
    if (state.result !== null && type2.kind !== state.kind) {
      throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type2.kind + '", not "' + state.kind + '"');
    }
    if (!type2.resolve(state.result, state.tag)) {
      throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
    } else {
      state.result = type2.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }
  if (state.listener !== null) {
    state.listener("close", state);
  }
  return state.tag !== null || state.anchor !== null || hasContent;
}
function readDocument(state) {
  var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = /* @__PURE__ */ Object.create(null);
  state.anchorMap = /* @__PURE__ */ Object.create(null);
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if (state.lineIndent > 0 || ch !== 37) {
      break;
    }
    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];
    if (directiveName.length < 1) {
      throwError(state, "directive name must not be less than one character in length");
    }
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && !is_EOL(ch));
        break;
      }
      if (is_EOL(ch)) break;
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveArgs.push(state.input.slice(_position, state.position));
    }
    if (ch !== 0) readLineBreak(state);
    if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }
  skipSeparationSpace(state, true, -1);
  if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);
  } else if (hasDirectives) {
    throwError(state, "directives end mark is expected");
  }
  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);
  if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, "non-ASCII line breaks are interpreted as content");
  }
  state.documents.push(state.result);
  if (state.position === state.lineStart && testDocumentSeparator(state)) {
    if (state.input.charCodeAt(state.position) === 46) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }
  if (state.position < state.length - 1) {
    throwError(state, "end of the stream or a document separator is expected");
  } else {
    return;
  }
}
function loadDocuments(input, options) {
  input = String(input);
  options = options || {};
  if (input.length !== 0) {
    if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
      input += "\n";
    }
    if (input.charCodeAt(0) === 65279) {
      input = input.slice(1);
    }
  }
  var state = new State$1(input, options);
  var nullpos = input.indexOf("\0");
  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, "null byte is not allowed in input");
  }
  state.input += "\0";
  while (state.input.charCodeAt(state.position) === 32) {
    state.lineIndent += 1;
    state.position += 1;
  }
  while (state.position < state.length - 1) {
    readDocument(state);
  }
  return state.documents;
}
function loadAll$1(input, iterator, options) {
  if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
    options = iterator;
    iterator = null;
  }
  var documents = loadDocuments(input, options);
  if (typeof iterator !== "function") {
    return documents;
  }
  for (var index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}
function load$1(input, options) {
  var documents = loadDocuments(input, options);
  if (documents.length === 0) {
    return void 0;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new exception("expected a single document in the stream, but found more");
}
var loadAll_1 = loadAll$1;
var load_1 = load$1;
var loader = {
  loadAll: loadAll_1,
  load: load_1
};
var _toString = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;
var CHAR_BOM = 65279;
var CHAR_TAB = 9;
var CHAR_LINE_FEED = 10;
var CHAR_CARRIAGE_RETURN = 13;
var CHAR_SPACE = 32;
var CHAR_EXCLAMATION = 33;
var CHAR_DOUBLE_QUOTE = 34;
var CHAR_SHARP = 35;
var CHAR_PERCENT = 37;
var CHAR_AMPERSAND = 38;
var CHAR_SINGLE_QUOTE = 39;
var CHAR_ASTERISK = 42;
var CHAR_COMMA = 44;
var CHAR_MINUS = 45;
var CHAR_COLON = 58;
var CHAR_EQUALS = 61;
var CHAR_GREATER_THAN = 62;
var CHAR_QUESTION = 63;
var CHAR_COMMERCIAL_AT = 64;
var CHAR_LEFT_SQUARE_BRACKET = 91;
var CHAR_RIGHT_SQUARE_BRACKET = 93;
var CHAR_GRAVE_ACCENT = 96;
var CHAR_LEFT_CURLY_BRACKET = 123;
var CHAR_VERTICAL_LINE = 124;
var CHAR_RIGHT_CURLY_BRACKET = 125;
var ESCAPE_SEQUENCES = {};
ESCAPE_SEQUENCES[0] = "\\0";
ESCAPE_SEQUENCES[7] = "\\a";
ESCAPE_SEQUENCES[8] = "\\b";
ESCAPE_SEQUENCES[9] = "\\t";
ESCAPE_SEQUENCES[10] = "\\n";
ESCAPE_SEQUENCES[11] = "\\v";
ESCAPE_SEQUENCES[12] = "\\f";
ESCAPE_SEQUENCES[13] = "\\r";
ESCAPE_SEQUENCES[27] = "\\e";
ESCAPE_SEQUENCES[34] = '\\"';
ESCAPE_SEQUENCES[92] = "\\\\";
ESCAPE_SEQUENCES[133] = "\\N";
ESCAPE_SEQUENCES[160] = "\\_";
ESCAPE_SEQUENCES[8232] = "\\L";
ESCAPE_SEQUENCES[8233] = "\\P";
var DEPRECATED_BOOLEANS_SYNTAX = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
];
var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function compileStyleMap(schema2, map2) {
  var result, keys, index, length, tag, style, type2;
  if (map2 === null) return {};
  result = {};
  keys = Object.keys(map2);
  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map2[tag]);
    if (tag.slice(0, 2) === "!!") {
      tag = "tag:yaml.org,2002:" + tag.slice(2);
    }
    type2 = schema2.compiledTypeMap["fallback"][tag];
    if (type2 && _hasOwnProperty.call(type2.styleAliases, style)) {
      style = type2.styleAliases[style];
    }
    result[tag] = style;
  }
  return result;
}
function encodeHex(character) {
  var string, handle, length;
  string = character.toString(16).toUpperCase();
  if (character <= 255) {
    handle = "x";
    length = 2;
  } else if (character <= 65535) {
    handle = "u";
    length = 4;
  } else if (character <= 4294967295) {
    handle = "U";
    length = 8;
  } else {
    throw new exception("code point within a string may not be greater than 0xFFFFFFFF");
  }
  return "\\" + handle + common.repeat("0", length - string.length) + string;
}
var QUOTING_TYPE_SINGLE = 1;
var QUOTING_TYPE_DOUBLE = 2;
function State(options) {
  this.schema = options["schema"] || _default;
  this.indent = Math.max(1, options["indent"] || 2);
  this.noArrayIndent = options["noArrayIndent"] || false;
  this.skipInvalid = options["skipInvalid"] || false;
  this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
  this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
  this.sortKeys = options["sortKeys"] || false;
  this.lineWidth = options["lineWidth"] || 80;
  this.noRefs = options["noRefs"] || false;
  this.noCompatMode = options["noCompatMode"] || false;
  this.condenseFlow = options["condenseFlow"] || false;
  this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes = options["forceQuotes"] || false;
  this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;
  this.tag = null;
  this.result = "";
  this.duplicates = [];
  this.usedDuplicates = null;
}
function indentString(string, spaces) {
  var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
  while (position < length) {
    next = string.indexOf("\n", position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }
    if (line.length && line !== "\n") result += ind;
    result += line;
  }
  return result;
}
function generateNextLine(state, level) {
  return "\n" + common.repeat(" ", state.indent * level);
}
function testImplicitResolving(state, str2) {
  var index, length, type2;
  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type2 = state.implicitTypes[index];
    if (type2.resolve(str2)) {
      return true;
    }
  }
  return false;
}
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}
function isPrintable(c) {
  return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
}
function isNsCharOrWhitespace(c) {
  return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
}
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (
    // ns-plain-safe
    (inblock ? (
      // c = flow-in
      cIsNsCharOrWhitespace
    ) : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar
  );
}
function isPlainSafeFirst(c) {
  return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
}
function isPlainSafeLast(c) {
  return !isWhitespace(c) && c !== CHAR_COLON;
}
function codePointAt(string, pos) {
  var first = string.charCodeAt(pos), second;
  if (first >= 55296 && first <= 56319 && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 56320 && second <= 57343) {
      return (first - 55296) * 1024 + second - 56320 + 65536;
    }
  }
  return first;
}
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}
var STYLE_PLAIN = 1;
var STYLE_SINGLE = 2;
var STYLE_LITERAL = 3;
var STYLE_FOLDED = 4;
var STYLE_DOUBLE = 5;
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
  var i;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false;
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1;
  var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
  if (singleLineOnly || forceQuotes) {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
          i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
  }
  if (!hasLineBreak && !hasFoldableLine) {
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}
function writeScalar(state, string, level, iskey, inblock) {
  state.dump = (function() {
    if (string.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
      }
    }
    var indent = state.indent * Math.max(1, level);
    var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
    var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
    function testAmbiguity(string2) {
      return testImplicitResolving(state, string2);
    }
    switch (chooseScalarStyle(
      string,
      singleLineOnly,
      state.indent,
      lineWidth,
      testAmbiguity,
      state.quotingType,
      state.forceQuotes && !iskey,
      inblock
    )) {
      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string) + '"';
      default:
        throw new exception("impossible error: invalid scalar style");
    }
  })();
}
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
  var clip = string[string.length - 1] === "\n";
  var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
  var chomp = keep ? "+" : clip ? "" : "-";
  return indentIndicator + chomp + "\n";
}
function dropEndingNewline(string) {
  return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
}
function foldString(string, width) {
  var lineRe = /(\n+)([^\n]*)/g;
  var result = (function() {
    var nextLF = string.indexOf("\n");
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  })();
  var prevMoreIndented = string[0] === "\n" || string[0] === " ";
  var moreIndented;
  var match;
  while (match = lineRe.exec(string)) {
    var prefix = match[1], line = match[2];
    moreIndented = line[0] === " ";
    result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }
  return result;
}
function foldLine(line, width) {
  if (line === "" || line[0] === " ") return line;
  var breakRe = / [^ ]/g;
  var match;
  var start = 0, end, curr = 0, next = 0;
  var result = "";
  while (match = breakRe.exec(line)) {
    next = match.index;
    if (next - start > width) {
      end = curr > start ? curr : next;
      result += "\n" + line.slice(start, end);
      start = end + 1;
    }
    curr = next;
  }
  result += "\n";
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }
  return result.slice(1);
}
function escapeString(string) {
  var result = "";
  var char = 0;
  var escapeSeq;
  for (var i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
    char = codePointAt(string, i);
    escapeSeq = ESCAPE_SEQUENCES[char];
    if (!escapeSeq && isPrintable(char)) {
      result += string[i];
      if (char >= 65536) result += string[i + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }
  return result;
}
function writeFlowSequence(state, level, object) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
      if (_result !== "") _result += "," + (!state.condenseFlow ? " " : "");
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = "[" + _result + "]";
}
function writeBlockSequence(state, level, object, compact) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
      if (!compact || _result !== "") {
        _result += generateNextLine(state, level);
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += "-";
      } else {
        _result += "- ";
      }
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = _result || "[]";
}
function writeFlowMapping(state, level, object) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (_result !== "") pairBuffer += ", ";
    if (state.condenseFlow) pairBuffer += '"';
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level, objectKey, false, false)) {
      continue;
    }
    if (state.dump.length > 1024) pairBuffer += "? ";
    pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
    if (!writeNode(state, level, objectValue, false, false)) {
      continue;
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = "{" + _result + "}";
}
function writeBlockMapping(state, level, object, compact) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
  if (state.sortKeys === true) {
    objectKeyList.sort();
  } else if (typeof state.sortKeys === "function") {
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    throw new exception("sortKeys must be a boolean or a function");
  }
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (!compact || _result !== "") {
      pairBuffer += generateNextLine(state, level);
    }
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue;
    }
    explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += "?";
      } else {
        pairBuffer += "? ";
      }
    }
    pairBuffer += state.dump;
    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }
    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue;
    }
    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ":";
    } else {
      pairBuffer += ": ";
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = _result || "{}";
}
function detectType(state, object, explicit) {
  var _result, typeList, index, length, type2, style;
  typeList = explicit ? state.explicitTypes : state.implicitTypes;
  for (index = 0, length = typeList.length; index < length; index += 1) {
    type2 = typeList[index];
    if ((type2.instanceOf || type2.predicate) && (!type2.instanceOf || typeof object === "object" && object instanceof type2.instanceOf) && (!type2.predicate || type2.predicate(object))) {
      if (explicit) {
        if (type2.multi && type2.representName) {
          state.tag = type2.representName(object);
        } else {
          state.tag = type2.tag;
        }
      } else {
        state.tag = "?";
      }
      if (type2.represent) {
        style = state.styleMap[type2.tag] || type2.defaultStyle;
        if (_toString.call(type2.represent) === "[object Function]") {
          _result = type2.represent(object, style);
        } else if (_hasOwnProperty.call(type2.represent, style)) {
          _result = type2.represent[style](object, style);
        } else {
          throw new exception("!<" + type2.tag + '> tag resolver accepts not "' + style + '" style');
        }
        state.dump = _result;
      }
      return true;
    }
  }
  return false;
}
function writeNode(state, level, object, block, compact, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;
  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }
  var type2 = _toString.call(state.dump);
  var inblock = block;
  var tagStr;
  if (block) {
    block = state.flowLevel < 0 || state.flowLevel > level;
  }
  var objectOrArray = type2 === "[object Object]" || type2 === "[object Array]", duplicateIndex, duplicate;
  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }
  if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
    compact = false;
  }
  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = "*ref_" + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type2 === "[object Object]") {
      if (block && Object.keys(state.dump).length !== 0) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object Array]") {
      if (block && state.dump.length !== 0) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact);
        } else {
          writeBlockSequence(state, level, state.dump, compact);
        }
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object String]") {
      if (state.tag !== "?") {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type2 === "[object Undefined]") {
      return false;
    } else {
      if (state.skipInvalid) return false;
      throw new exception("unacceptable kind of an object to dump " + type2);
    }
    if (state.tag !== null && state.tag !== "?") {
      tagStr = encodeURI(
        state.tag[0] === "!" ? state.tag.slice(1) : state.tag
      ).replace(/!/g, "%21");
      if (state.tag[0] === "!") {
        tagStr = "!" + tagStr;
      } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
        tagStr = "!!" + tagStr.slice(18);
      } else {
        tagStr = "!<" + tagStr + ">";
      }
      state.dump = tagStr + " " + state.dump;
    }
  }
  return true;
}
function getDuplicateReferences(object, state) {
  var objects = [], duplicatesIndexes = [], index, length;
  inspectNode(object, objects, duplicatesIndexes);
  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}
function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList, index, length;
  if (object !== null && typeof object === "object") {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);
      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);
        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}
function dump$1(input, options) {
  options = options || {};
  var state = new State(options);
  if (!state.noRefs) getDuplicateReferences(input, state);
  var value = input;
  if (state.replacer) {
    value = state.replacer.call({ "": value }, "", value);
  }
  if (writeNode(state, 0, value, true, true)) return state.dump + "\n";
  return "";
}
var dump_1 = dump$1;
var dumper = {
  dump: dump_1
};
function renamed(from, to) {
  return function() {
    throw new Error("Function yaml." + from + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
  };
}
var Type = type;
var Schema = schema;
var FAILSAFE_SCHEMA = failsafe;
var JSON_SCHEMA = json;
var CORE_SCHEMA = core;
var DEFAULT_SCHEMA = _default;
var load = loader.load;
var loadAll = loader.loadAll;
var dump = dumper.dump;
var YAMLException = exception;
var types = {
  binary,
  float,
  map,
  null: _null,
  pairs,
  set,
  timestamp,
  bool,
  int,
  merge,
  omap,
  seq,
  str
};
var safeLoad = renamed("safeLoad", "load");
var safeLoadAll = renamed("safeLoadAll", "loadAll");
var safeDump = renamed("safeDump", "dump");
var jsYaml = {
  Type,
  Schema,
  FAILSAFE_SCHEMA,
  JSON_SCHEMA,
  CORE_SCHEMA,
  DEFAULT_SCHEMA,
  load,
  loadAll,
  dump,
  YAMLException,
  types,
  safeLoad,
  safeLoadAll,
  safeDump
};

// lib/utils.js
var AWARD_NAMES = [
  "Berlin Goldener B\xE4r",
  "Cannes Palme d'Or",
  "C\xE9sar Award for Best Film",
  "Hong Kong Film Awards",
  "IIFA Awards",
  "Japan Academy Prize",
  "Oscar Best International Film",
  "Oscar Best Picture",
  "Venice Leone d\u2019oro",
  "\uCCAD\uB8E1\uC601\uD654\uC81C \uCD5C\uC6B0\uC218 \uC791\uD488\uC0C1"
];
var BADGE_KEY_BY_NAME = {
  "\uCCAD\uB8E1\uC601\uD654\uC81C \uCD5C\uC6B0\uC218 \uC791\uD488\uC0C1": "blue_dragon",
  "Oscar Best Picture": "oscar",
  "Oscar Best International Film": "oscar",
  "Cannes Palme d'Or": "cannes",
  "Venice Leone d\u2019oro": "venice",
  "Berlin Goldener B\xE4r": "berlin"
};
function deriveAwardBadges(awardNames) {
  const out = [];
  for (const name of awardNames) {
    const badge = BADGE_KEY_BY_NAME[name];
    if (badge && !out.includes(badge)) out.push(badge);
  }
  return out;
}
function isKoreanLanguage(s) {
  if (typeof s !== "string") return false;
  for (const ch of s) {
    const code = ch.codePointAt(0);
    if (code >= 44032 && code <= 55203) return true;
  }
  return false;
}
function buildKoreanDirectorMap(movies2) {
  const map2 = /* @__PURE__ */ new Map();
  for (const m of movies2) {
    if (!m?.is_korean_director) continue;
    const director = m.director;
    if (!director || !isKoreanLanguage(director)) continue;
    const romanized = m.tmdb_director_name_1;
    if (typeof romanized === "string" && !map2.has(romanized)) {
      map2.set(romanized, director);
    }
  }
  return map2;
}
var DISPLAY_NAMES = new Intl.DisplayNames(["en"], {
  type: "language",
  fallback: "code"
});
var TMDB_LANGUAGE_OVERRIDES = {
  // TMDb tags Cantonese-language films (Hong Kong cinema) with "cn". ISO 639-1
  // has no Cantonese code; the BCP-47 form is "zh-yue".
  cn: "Cantonese"
};
function getLanguageName(code) {
  if (!code) return null;
  if (Object.prototype.hasOwnProperty.call(TMDB_LANGUAGE_OVERRIDES, code)) {
    return TMDB_LANGUAGE_OVERRIDES[code];
  }
  try {
    return DISPLAY_NAMES.of(code);
  } catch {
    return code;
  }
}
function bool2(v) {
  return v === true ? 1 : 0;
}
function awardsLen(m) {
  return Array.isArray(m?.awards) ? m.awards.length : 0;
}
function sortMovies(movies2) {
  return [...movies2].sort((a, b) => {
    const yearDiff = (b.year ?? 0) - (a.year ?? 0);
    if (yearDiff !== 0) return yearDiff;
    const mpDiff = bool2(b.masterpiece) - bool2(a.masterpiece);
    if (mpDiff !== 0) return mpDiff;
    const mbDiff = bool2(b.my_best) - bool2(a.my_best);
    if (mbDiff !== 0) return mbDiff;
    const awDiff = awardsLen(b) - awardsLen(a);
    if (awDiff !== 0) return awDiff;
    const da = a.director ?? "";
    const db = b.director ?? "";
    if (db > da) return 1;
    if (db < da) return -1;
    return 0;
  });
}
var YAML_DUMP_OPTIONS = Object.freeze({
  lineWidth: -1,
  flowLevel: -1,
  sortKeys: false,
  noRefs: true,
  noCompatMode: true
});

// lib/tmdb_utils.js
function getTmdbKey() {
  return "f6d7fb04f4d4d6b07d2d750811e73a4c" ? "f6d7fb04f4d4d6b07d2d750811e73a4c" : null;
}
function extractTmdbIdFromUrl(url) {
  if (typeof url !== "string") return null;
  const m = url.match(/\/movie\/(\d+)/);
  return m ? Number(m[1]) : null;
}
function buildMovieEntryFromTmdb(tmdb) {
  if (!tmdb || typeof tmdb !== "object") {
    throw new Error("buildMovieEntryFromTmdb: tmdb response missing");
  }
  if (!tmdb.imdb_id) {
    throw new Error(
      `buildMovieEntryFromTmdb: TMDB response has no imdb_id (TMDB id=${tmdb.id})`
    );
  }
  const directors = (tmdb.credits?.crew ?? []).filter(
    (c) => c.job === "Director"
  );
  const tmdbDirectorName1 = directors[0]?.name ?? null;
  const tmdbDirectorName2 = directors[1]?.name ?? null;
  const director = tmdbDirectorName1 ?? "";
  const releaseYear = (tmdb.release_date ?? "").slice(0, 4);
  const year = releaseYear ? Number(releaseYear) : null;
  const tmdbTitle = tmdb.title;
  const tmdbOriginalTitle = tmdb.original_title;
  const tmdbPosterPath = tmdb.poster_path;
  let title;
  if (!tmdbTitle) {
    title = tmdbOriginalTitle ?? null;
  } else if (!tmdbOriginalTitle || tmdbTitle === tmdbOriginalTitle) {
    title = tmdbTitle;
  } else {
    title = `${tmdbTitle} (${tmdbOriginalTitle})`;
  }
  return {
    title,
    year,
    director,
    is_korean_director: isKoreanLanguage(director),
    imdb_id: tmdb.imdb_id,
    imdb_url: `https://www.imdb.com/title/${tmdb.imdb_id}`,
    tmdb_url: `https://www.themoviedb.org/movie/${tmdb.id}`,
    tmdb_title: tmdbTitle !== tmdbOriginalTitle ? tmdbTitle : null,
    tmdb_original_title: tmdbOriginalTitle,
    tmdb_original_language: getLanguageName(tmdb.original_language),
    tmdb_director_name_1: tmdbDirectorName1,
    tmdb_director_name_2: tmdbDirectorName2,
    tmdb_num_directors: directors.length,
    tmdb_poster_url: tmdbPosterPath ? `https://image.tmdb.org/t/p/w200${tmdbPosterPath}` : null
  };
}

// lib/canonicalize.js
var MAIN_KEY_ORDER = [
  "title",
  "year",
  "director",
  "country",
  "is_korean_director",
  "imdb_id",
  "imdb_url",
  "tmdb_url",
  "tmdb_title",
  "tmdb_original_title",
  "tmdb_original_language",
  "tmdb_director_name_1",
  "tmdb_director_name_2",
  "tmdb_num_directors",
  "tmdb_poster_url"
];
var OPTIONAL_KEY_ORDER = [
  "custom_korean_title",
  "masterpiece",
  "my_best",
  "note",
  "award_names",
  "awards"
];
var ALL_KNOWN_KEYS = /* @__PURE__ */ new Set([...MAIN_KEY_ORDER, ...OPTIONAL_KEY_ORDER]);
function trimOrEmpty(v) {
  return typeof v === "string" ? v.trim() : "";
}
function canonicalizeEntry(entry) {
  if (!entry || typeof entry !== "object") {
    throw new Error("canonicalizeEntry: entry must be an object");
  }
  const out = {};
  for (const k of MAIN_KEY_ORDER) {
    if (!(k in entry)) continue;
    if (k === "director") {
      out[k] = trimOrEmpty(entry[k]);
    } else if (k === "is_korean_director") {
      out[k] = isKoreanLanguage(trimOrEmpty(entry.director));
    } else {
      out[k] = entry[k];
    }
  }
  const ckt = trimOrEmpty(entry.custom_korean_title);
  if (ckt) out.custom_korean_title = ckt;
  if (entry.masterpiece === true) {
    out.masterpiece = true;
  } else if (entry.my_best === true) {
    out.my_best = true;
  }
  const note = trimOrEmpty(entry.note);
  if (note) out.note = note;
  if (Array.isArray(entry.award_names) && entry.award_names.length > 0) {
    const names = [];
    for (const n of entry.award_names) {
      const t = typeof n === "string" ? n.trim() : "";
      if (t && !names.includes(t)) names.push(t);
    }
    if (names.length > 0) {
      out.award_names = names;
      const badges = deriveAwardBadges(names);
      if (badges.length > 0) out.awards = badges;
    }
  }
  for (const k of Object.keys(entry)) {
    if (!ALL_KNOWN_KEYS.has(k)) out[k] = entry[k];
  }
  return out;
}
function canonicalizeAll(movies2) {
  return movies2.map(canonicalizeEntry);
}

// lib/gemini_utils.js
var GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent";
function getGeminiKey() {
  return "AIzaSyCq-1ovfUvCiIzn3x5ZUrbQU09-scfHSZQ" ? "AIzaSyCq-1ovfUvCiIzn3x5ZUrbQU09-scfHSZQ" : null;
}
function paragraphs(parts) {
  return parts.map((s) => s.trim().replace(/\s+/g, " ")).join("\n\n");
}
async function callGemini({ systemPrompt, userPrompt, schema: schema2, apiKey }) {
  if (!apiKey) throw new Error("Missing Gemini API key");
  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema2,
      temperature: 0
    }
  };
  const url = `${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!r.ok) {
    let detail = "";
    try {
      const j = await r.json();
      detail = j?.error?.message || "";
    } catch {
    }
    throw new Error(
      `Gemini ${r.status}${detail ? `: ${detail}` : `: ${r.statusText}`}`
    );
  }
  const data = await r.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("Gemini response had no text content");
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Gemini returned non-JSON: ${text.slice(0, 200)}`);
  }
}
var CALL_A_SYSTEM = paragraphs([
  `You receive a single line from an unstructured memo of movie titles. Decide
   whether it names a movie. If it does not (e.g. a note like "watched with J",
   a date, a comment), return {"is_movie": false}. Otherwise return a
   TMDB-searchable query.`,
  `A very common case is that a non-Korean movie is written in Korean phonetic
   transliteration (e.g. "\uBCF4\uD5E4\uBBF8\uC548 \uB7A9\uC18C\uB514" = "Bohemian Rhapsody",
   "\uD50C\uB77C\uC6CC\uD0AC\uB9C1\uBB38" = "Killers of the Flower Moon", "\uC5D0\uBC00\uB9AC\uC544 \uD398\uB808\uC2A4" =
   "Emilia P\xE9rez"). For these, return the original English title in "title".
   Do NOT put the Korean phonetic form in "title_korean_overlay".`,
  `For a Korean original-language movie (e.g. "\uC5B4\uCA54\uC218\uAC00\uC5C6\uB2E4", "\uAE30\uC0DD\uCDA9"),
   return the canonical Korean title in "title". Light normalization is fine
   \u2014 fix obvious typos, adjust whitespace, expand common abbreviations \u2014 but
   keep the result in Korean script. TMDB search handles Korean originals
   natively.`,
  `"title_korean_overlay" is ONLY for the explicit "English Title (\uD55C\uAD6D\uC5B4)"
   parenthetical pattern, e.g. "Adolescence (\uC18C\uB144\uC758 \uC2DC\uAC04)" \u2192
   title_korean_overlay: "\uC18C\uB144\uC758 \uC2DC\uAC04".`,
  `Do not invent year or director unless they are explicit in the line.`
]);
var CALL_A_SCHEMA = {
  type: "object",
  properties: {
    is_movie: { type: "boolean" },
    title: { type: "string", nullable: true },
    year: { type: "integer", nullable: true },
    director: { type: "string", nullable: true },
    title_korean_overlay: { type: "string", nullable: true }
  },
  required: ["is_movie"]
};
async function parseMemoLine(line, apiKey) {
  return callGemini({
    systemPrompt: CALL_A_SYSTEM,
    userPrompt: line,
    schema: CALL_A_SCHEMA,
    apiKey
  });
}
var CALL_B_SYSTEM = paragraphs([
  `You are matching one user memo line to one TMDB movie. The app provides the
   raw memo line, a parsed search query, and a list of TMDB candidates with
   selected fields including title, year, director, popularity, and IMDB-ID
   presence.`,
  `Pick which candidate (if any) matches the memo line. Matching cues:`,
  `(1) Title likeness across romanization, transliteration, or translation
   (e.g. "\uBCF4\uD5E4\uBBF8\uC548 \uB7A9\uC18C\uB514" matches "Bohemian Rhapsody").`,
  `(2) Year (when the memo specifies one) \u2014 but TMDB release dates can be off
   by \xB11 year from what the user remembers, so don't reject solely on year.`,
  `(3) Director (when the memo specifies one).`,
  `(4) Popularity \u2014 when multiple candidates have similar title likeness,
   strongly prefer the higher-popularity one. The user logs films that
   became culturally popular; popularity above 1.0 usually means a real
   released film, while popularity below 0.1 is usually a short film,
   festival piece, or unreleased entry.`,
  `(5) has_imdb \u2014 "yes" means TMDB has an IMDB ID for the film (catalogued,
   almost always a released film). "no" means it lacks an IMDB ID (often
   unreleased or obscure). "unknown" means full details weren't fetched for
   this candidate. Strongly prefer has_imdb=yes candidates; reject has_imdb=no
   unless the title is a near-exact match AND no "yes" candidate fits.
   has_imdb=unknown is neutral \u2014 judge by the other cues.`,
  `If no candidate is a confident match, return matched_tmdb_id: null. Be
   willing to reject all candidates \u2014 a wrong match is worse than no match.`,
  `The "reasoning" field should be one short sentence explaining the pick.`
]);
var CALL_B_SCHEMA = {
  type: "object",
  properties: {
    matched_tmdb_id: { type: "integer", nullable: true },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
    reasoning: { type: "string" }
  },
  required: ["matched_tmdb_id", "confidence"]
};
async function matchTmdbCandidate({ rawLine, parsed, candidates, apiKey }) {
  const lines = [
    `User memo line: ${rawLine}`,
    `Parsed query: title="${parsed.title ?? ""}" year=${parsed.year ?? "-"} director="${parsed.director ?? ""}"`,
    "",
    "TMDB candidates:"
  ];
  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    const year = c.release_date?.slice(0, 4) ?? "-";
    const dirs = (c.directors ?? []).join(", ") || "-";
    const pop = typeof c.popularity === "number" ? c.popularity.toFixed(1) : "-";
    let hasImdb;
    if (c._details) {
      hasImdb = c._details.imdb_id ? "yes" : "no";
    } else {
      hasImdb = "unknown";
    }
    lines.push(
      `${i + 1}. tmdb_id=${c.id} title="${c.title ?? ""}" original_title="${c.original_title ?? ""}" year=${year} directors="${dirs}" popularity=${pop} has_imdb=${hasImdb}`
    );
  }
  return callGemini({
    systemPrompt: CALL_B_SYSTEM,
    userPrompt: lines.join("\n"),
    schema: CALL_B_SCHEMA,
    apiKey
  });
}
var CALL_C_SYSTEM = paragraphs([
  `Return the director's name in Korean script (\uD55C\uAE00, U+AC00\u2013U+D7A3) if and
   only if you are confident this person is Korean. Return null otherwise. Do
   not guess. Return only Hangul characters in korean_name (no romanization,
   no Latin letters).`
]);

// lib/memo_pipeline.js
var TMDB_BASE = "https://api.themoviedb.org/3";
var CANDIDATE_SEARCH_LIMIT = 20;
var CANDIDATE_DETAILS_FETCH_LIMIT = 10;
async function tmdbSearch(parsed, tmdbApiKey) {
  const q = parsed.title?.trim();
  if (!q) return [];
  const buildUrl = (year) => {
    const p = new URLSearchParams({ api_key: tmdbApiKey, query: q });
    if (year) p.set("primary_release_year", String(year));
    return `${TMDB_BASE}/search/movie?${p}`;
  };
  const years = parsed.year ? [parsed.year, parsed.year + 1, parsed.year - 1] : [null];
  const responses = await Promise.allSettled(
    years.map(async (year) => {
      const r = await fetch(buildUrl(year));
      if (!r.ok) throw new Error(`TMDB search ${r.status}: ${r.statusText}`);
      const data = await r.json();
      return data.results ?? [];
    })
  );
  if (responses.every((res) => res.status === "rejected")) {
    throw responses[0].reason;
  }
  const seen = /* @__PURE__ */ new Set();
  const merged = [];
  for (const res of responses) {
    if (res.status !== "fulfilled") continue;
    for (const result of res.value) {
      if (seen.has(result.id)) continue;
      seen.add(result.id);
      merged.push(result);
    }
  }
  return merged.slice(0, CANDIDATE_SEARCH_LIMIT);
}
async function fetchTmdbDetails(tmdbId, tmdbApiKey) {
  const url = `${TMDB_BASE}/movie/${tmdbId}?api_key=${tmdbApiKey}&append_to_response=credits`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`TMDB details ${r.status}: ${r.statusText}`);
  return r.json();
}
async function enrichCandidatesForMatch(tmdbCandidates, tmdbApiKey) {
  const tasks = tmdbCandidates.map(async (c, i) => {
    if (i >= CANDIDATE_DETAILS_FETCH_LIMIT) return { ...c, directors: [] };
    try {
      const tmdbDetail = await fetchTmdbDetails(c.id, tmdbApiKey);
      const directors = (tmdbDetail.credits?.crew ?? []).filter((cr) => cr.job === "Director").map((cr) => cr.name);
      return { ...c, directors, _details: tmdbDetail };
    } catch {
      return { ...c, directors: [] };
    }
  });
  return Promise.all(tasks);
}
async function processMemoLine({
  rawLine,
  geminiKey,
  tmdbApiKey,
  koreanDirectorMap
}) {
  const result = { rawLine };
  let parsed;
  try {
    parsed = await parseMemoLine(rawLine, geminiKey);
  } catch (e) {
    return { ...result, status: "error", error: `Call A failed: ${e.message}` };
  }
  result.parseResult = parsed;
  if (!parsed.is_movie) {
    return { ...result, status: "not_movie" };
  }
  if (!parsed.title || !parsed.title.trim()) {
    return {
      ...result,
      status: "error",
      error: "Call A returned is_movie=true but no title"
    };
  }
  let tmdbCandidates;
  try {
    tmdbCandidates = await tmdbSearch(parsed, tmdbApiKey);
  } catch (e) {
    return { ...result, status: "error", error: e.message };
  }
  if (tmdbCandidates.length === 0) {
    return { ...result, status: "no_match" };
  }
  const enrichedTmdbCandidates = await enrichCandidatesForMatch(
    tmdbCandidates,
    tmdbApiKey
  );
  result.candidates = enrichedTmdbCandidates;
  let match;
  try {
    match = await matchTmdbCandidate({
      rawLine,
      parsed,
      candidates: enrichedTmdbCandidates,
      apiKey: geminiKey
    });
  } catch (e) {
    return { ...result, status: "error", error: `Call B failed: ${e.message}` };
  }
  result.matchResult = match;
  if (match.matched_tmdb_id == null) {
    return { ...result, status: "no_match" };
  }
  let pickedTmdbDetails = enrichedTmdbCandidates.find(
    (c) => c.id === match.matched_tmdb_id
  )?._details;
  if (!pickedTmdbDetails) {
    try {
      pickedTmdbDetails = await fetchTmdbDetails(
        match.matched_tmdb_id,
        tmdbApiKey
      );
    } catch (e) {
      return {
        ...result,
        status: "error",
        error: `TMDB details fetch failed: ${e.message}`
      };
    }
  }
  let entry;
  try {
    entry = buildMovieEntryFromTmdb(pickedTmdbDetails);
  } catch (e) {
    return {
      ...result,
      status: "error",
      error: `Entry build failed: ${e.message}`
    };
  }
  if (parsed.title_korean_overlay && typeof parsed.title_korean_overlay === "string") {
    const v = parsed.title_korean_overlay.trim();
    if (v) entry.custom_korean_title = v;
  }
  const romanized = entry.tmdb_director_name_1;
  if (romanized && koreanDirectorMap.has(romanized)) {
    entry.director = koreanDirectorMap.get(romanized);
    entry.is_korean_director = true;
  }
  result.entry = entry;
  result.status = "ok";
  return result;
}

// lib/app.js
var TMDB_API_KEY = getTmdbKey();
var LOCAL_STORAGE_KEY = "movie-collection-v1";
var NEW_IDS_STORAGE_KEY = "movie-collection-new-ids-v1";
var DIRTY_STORAGE_KEY = "movie-collection-dirty-v1";
var DEFAULT_DATA_URL = "data/movies.yml";
var movies = [];
var dirty = false;
var newImdbIds = /* @__PURE__ */ new Set();
var newOnly = false;
var $ = (id) => document.getElementById(id);
var fileInput = $("file-input");
var searchInput = $("search-input");
var tmdbUrlInput = $("tmdb-url-input");
var addBtn = $("add-btn");
var addStatus = $("add-status");
var downloadBtn = $("download-btn");
var movieList = $("movie-list");
var countEl = $("count");
var dirtyIndicator = $("dirty-indicator");
var cardTemplate = $("movie-card-template");
var newOnlyToggle = $("new-only-toggle");
var newOnlyLabel = $("new-only-label");
var newCountEl = $("new-count");
var memoBar = document.querySelector(".memo-bar");
var memoInput = $("memo-input");
var processMemoBtn = $("process-memo-btn");
var memoStatus = $("memo-status");
var reviewPane = $("review-pane");
var reviewList = $("review-list");
var reviewSummary = $("review-summary");
var commitAllBtn = $("commit-all-btn");
var discardAllBtn = $("discard-all-btn");
var reviewCardTemplate = $("review-card-template");
function persist() {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(movies));
  } catch (e) {
    console.warn("localStorage write failed:", e);
  }
}
function restoreFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return false;
    movies = parsed;
    return true;
  } catch (e) {
    console.warn("localStorage restore failed:", e);
    return false;
  }
}
function setDirty(v) {
  dirty = v;
  dirtyIndicator.hidden = !dirty;
  try {
    localStorage.setItem(DIRTY_STORAGE_KEY, dirty ? "1" : "0");
  } catch (e) {
    console.warn("localStorage write failed:", e);
  }
}
function restoreDirty() {
  try {
    return localStorage.getItem(DIRTY_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}
function persistNewIds() {
  try {
    localStorage.setItem(NEW_IDS_STORAGE_KEY, JSON.stringify([...newImdbIds]));
  } catch (e) {
    console.warn("localStorage write failed:", e);
  }
}
function restoreNewIds() {
  try {
    const raw = localStorage.getItem(NEW_IDS_STORAGE_KEY);
    if (!raw) return;
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) newImdbIds = new Set(arr);
  } catch (e) {
    console.warn("localStorage restore failed:", e);
  }
}
function clearNewIds() {
  newImdbIds = /* @__PURE__ */ new Set();
  newOnly = false;
  persistNewIds();
}
function refreshNewIndicator() {
  const n = newImdbIds.size;
  if (n === 0) newOnly = false;
  newCountEl.textContent = n > 0 ? `(${n})` : "";
  newOnlyLabel.textContent = newOnly ? "New" : "All";
  newOnlyToggle.setAttribute("aria-pressed", newOnly ? "true" : "false");
  newOnlyToggle.disabled = n === 0;
}
function setAddStatus(msg, level = "") {
  addStatus.textContent = msg;
  addStatus.className = `status ${level}`;
}
fileInput.addEventListener("change", async (e) => {
  const f = e.target.files?.[0];
  if (!f) return;
  try {
    const text = await f.text();
    const parsed = jsYaml.load(text);
    if (!Array.isArray(parsed)) {
      throw new Error("YML root is not a list of movies");
    }
    movies = parsed;
    clearNewIds();
    setDirty(false);
    persist();
    renderAll();
    setAddStatus(`Loaded ${movies.length} movies from ${f.name}`, "success");
  } catch (err) {
    setAddStatus(`Failed to load: ${err.message}`, "error");
  } finally {
    fileInput.value = "";
  }
});
async function fetchTmdbMovie(tmdbId) {
  const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
  const r = await fetch(url);
  if (!r.ok) {
    throw new Error(`TMDB API ${r.status}: ${r.statusText}`);
  }
  return r.json();
}
addBtn.addEventListener("click", async () => {
  const url = tmdbUrlInput.value.trim();
  if (!url) {
    setAddStatus("Paste a TMDB URL first.", "error");
    return;
  }
  const id = extractTmdbIdFromUrl(url);
  if (!id) {
    setAddStatus("Couldn't extract a TMDB ID from that URL.", "error");
    return;
  }
  const tmdbUrl = `https://www.themoviedb.org/movie/${id}`;
  const dupByTmdb = movies.find((m) => m.tmdb_url === tmdbUrl);
  if (dupByTmdb) {
    setAddStatus(
      `Already in list: ${dupByTmdb.title} (TMDB id ${id}). Not added.`,
      "error"
    );
    return;
  }
  setAddStatus("Fetching from TMDB\u2026");
  try {
    const tmdb = await fetchTmdbMovie(id);
    const entry = buildMovieEntryFromTmdb(tmdb);
    const koreanDirectorMap = buildKoreanDirectorMap(movies);
    const romanized = entry.tmdb_director_name_1;
    if (romanized && koreanDirectorMap.has(romanized)) {
      entry.director = koreanDirectorMap.get(romanized);
      entry.is_korean_director = true;
    }
    const dupByImdb = movies.find((m) => m.imdb_id === entry.imdb_id);
    if (dupByImdb) {
      setAddStatus(
        `Already in list: ${dupByImdb.title} (imdb_id ${entry.imdb_id}). Not added.`,
        "error"
      );
      return;
    }
    if (entry.year === null) {
      setAddStatus(
        `Added (${entry.title}) \u2014 TMDB has no release_date; please set Year manually.`,
        "success"
      );
    } else {
      setAddStatus(`Added: ${entry.title}`, "success");
    }
    movies.push(entry);
    newImdbIds.add(entry.imdb_id);
    persistNewIds();
    setDirty(true);
    persist();
    renderAll();
    tmdbUrlInput.value = "";
  } catch (err) {
    setAddStatus(`Failed: ${err.message}`, "error");
  }
});
tmdbUrlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addBtn.click();
});
function renderAll() {
  movieList.innerHTML = "";
  refreshNewIndicator();
  if (movies.length === 0) {
    movieList.innerHTML = '<li class="empty-state">No movies loaded. Use "Load YML" or paste a TMDB URL above.</li>';
    countEl.textContent = "";
    return;
  }
  const display = sortMovies(movies);
  for (const m of display) {
    const node = renderCard(m);
    movieList.appendChild(node);
  }
  applyFilter(searchInput.value);
}
function renderCard(entry) {
  const node = cardTemplate.content.firstElementChild.cloneNode(true);
  const posterLink = node.querySelector(".poster-link");
  const poster = node.querySelector(".poster");
  if (entry.tmdb_poster_url) {
    poster.src = entry.tmdb_poster_url;
  } else {
    poster.alt = "(no poster)";
    poster.style.background = "#ddd";
  }
  posterLink.href = entry.tmdb_url || entry.imdb_url || `https://www.imdb.com/title/${entry.imdb_id}`;
  node.querySelector(".title").textContent = entry.tmdb_original_title || entry.title || "";
  const tmdbTitleP = node.querySelector(".tmdb-title");
  tmdbTitleP.textContent = entry.tmdb_title || "";
  node.querySelector(".language").textContent = entry.tmdb_original_language ? `\u{1F5E3} ${entry.tmdb_original_language}` : "";
  const korFlag = node.querySelector(".kor-flag");
  korFlag.textContent = entry.is_korean_director ? "\u{1F1F0}\u{1F1F7} Korean dir" : "";
  const idsLine = node.querySelector(".ids");
  idsLine.innerHTML = "";
  if (entry.imdb_url) {
    const a = document.createElement("a");
    a.href = entry.imdb_url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = `IMDB ${entry.imdb_id}`;
    idsLine.appendChild(a);
  }
  if (entry.tmdb_url) {
    const a = document.createElement("a");
    a.href = entry.tmdb_url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "TMDB";
    idsLine.appendChild(a);
  }
  if (entry.country) {
    const sp = document.createElement("span");
    sp.textContent = `country: ${entry.country}`;
    idsLine.appendChild(sp);
  }
  const yearInput = node.querySelector(".year");
  yearInput.value = entry.year ?? "";
  yearInput.addEventListener("change", () => {
    const y = Number(yearInput.value);
    if (Number.isInteger(y) && y >= 1900 && y < 2100) {
      entry.year = y;
      onEdit();
    } else {
      yearInput.value = entry.year ?? "";
    }
  });
  const dirInput = node.querySelector(".director");
  dirInput.value = entry.director ?? "";
  dirInput.addEventListener("change", () => {
    const v = dirInput.value.trim();
    entry.director = v;
    entry.is_korean_director = isKoreanLanguage(v);
    korFlag.textContent = entry.is_korean_director ? "\u{1F1F0}\u{1F1F7} Korean dir" : "";
    onEdit();
  });
  const cktInput = node.querySelector(".custom-korean-title");
  cktInput.value = entry.custom_korean_title ?? "";
  cktInput.addEventListener("change", () => {
    const v = cktInput.value.trim();
    if (v) entry.custom_korean_title = v;
    else delete entry.custom_korean_title;
    onEdit();
  });
  const ratingSelect = node.querySelector(".rating");
  if (entry.masterpiece) ratingSelect.value = "masterpiece";
  else if (entry.my_best) ratingSelect.value = "my_best";
  else ratingSelect.value = "";
  ratingSelect.addEventListener("change", () => {
    delete entry.masterpiece;
    delete entry.my_best;
    if (ratingSelect.value === "masterpiece") entry.masterpiece = true;
    else if (ratingSelect.value === "my_best") entry.my_best = true;
    onEdit();
  });
  const awardsBox = node.querySelector(".awards-checkboxes");
  const currentAwardNames = new Set(entry.award_names ?? []);
  for (const name of AWARD_NAMES) {
    const lbl = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = name;
    cb.checked = currentAwardNames.has(name);
    cb.addEventListener("change", () => {
      const checked = [...awardsBox.querySelectorAll('input[type="checkbox"]')].filter((c) => c.checked).map((c) => c.value);
      if (checked.length > 0) {
        entry.award_names = checked;
        const badges = deriveAwardBadges(checked);
        if (badges.length > 0) entry.awards = badges;
        else delete entry.awards;
      } else {
        delete entry.award_names;
        delete entry.awards;
      }
      onEdit();
    });
    lbl.appendChild(cb);
    lbl.appendChild(document.createTextNode(` ${name}`));
    awardsBox.appendChild(lbl);
  }
  const noteArea = node.querySelector(".note");
  noteArea.value = entry.note ?? "";
  noteArea.addEventListener("change", () => {
    const v = noteArea.value.trim();
    if (v) entry.note = v;
    else delete entry.note;
    onEdit();
  });
  node.querySelector(".delete").addEventListener("click", () => {
    if (!confirm(`Delete "${entry.tmdb_original_title || entry.title}"? This cannot be undone in this UI.`))
      return;
    const idx = movies.indexOf(entry);
    if (idx !== -1) movies.splice(idx, 1);
    if (newImdbIds.delete(entry.imdb_id)) persistNewIds();
    setDirty(true);
    persist();
    renderAll();
  });
  node.dataset.isNew = newImdbIds.has(entry.imdb_id) ? "1" : "0";
  node.dataset.searchText = [
    entry.title,
    entry.tmdb_title,
    entry.tmdb_original_title,
    entry.custom_korean_title,
    entry.director,
    entry.tmdb_director_name_1,
    entry.tmdb_director_name_2,
    entry.year,
    entry.tmdb_original_language,
    (entry.award_names || []).join(" "),
    entry.note
  ].filter(Boolean).join(" ").toLowerCase();
  return node;
}
function onEdit() {
  setDirty(true);
  persist();
}
function applyFilter(query) {
  const q = (query ?? "").trim().toLowerCase();
  let visible = 0;
  for (const li of movieList.querySelectorAll(".movie-card")) {
    const matchesQuery = !q || li.dataset.searchText.includes(q);
    const matchesNew = !newOnly || li.dataset.isNew === "1";
    const matches = matchesQuery && matchesNew;
    li.classList.toggle("hidden", !matches);
    if (matches) visible++;
  }
  if (q || newOnly) {
    countEl.textContent = `${visible} of ${movies.length} movies`;
  } else {
    countEl.textContent = `${movies.length} movies`;
  }
}
searchInput.addEventListener("input", () => applyFilter(searchInput.value));
newOnlyToggle.addEventListener("click", () => {
  newOnly = !newOnly;
  refreshNewIndicator();
  applyFilter(searchInput.value);
});
downloadBtn.addEventListener("click", () => {
  const processed = sortMovies(canonicalizeAll(movies));
  const text = jsYaml.dump(processed, YAML_DUMP_OPTIONS);
  const blob = new Blob([text], { type: "application/x-yaml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "movies.yml";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  clearNewIds();
  setDirty(false);
  renderAll();
});
async function tryAutoLoadFromServer() {
  let res;
  try {
    res = await fetch(`${DEFAULT_DATA_URL}?_=${Date.now()}`, {
      cache: "no-store"
    });
  } catch (err) {
    console.info("Auto-load skipped (fetch failed):", err.message);
    return;
  }
  if (!res.ok) {
    console.info(`Auto-load skipped (HTTP ${res.status})`);
    return;
  }
  let parsed;
  try {
    parsed = jsYaml.load(await res.text());
  } catch (err) {
    setAddStatus(`Auto-load failed to parse data/movies.yml: ${err.message}`, "error");
    return;
  }
  if (!Array.isArray(parsed)) return;
  if (dirty) {
    setAddStatus(
      `Server has ${parsed.length} movies in data/movies.yml \u2014 kept your unsaved local edits instead. (Click "Load YML" to override.)`,
      ""
    );
    return;
  }
  movies = parsed;
  clearNewIds();
  setDirty(false);
  persist();
  renderAll();
  setAddStatus(`Auto-loaded ${movies.length} movies from data/movies.yml`, "success");
}
function refreshProcessButton() {
  const keyPresent = !!getGeminiKey();
  const memoNonEmpty = memoInput.value.trim().length > 0;
  processMemoBtn.disabled = !(keyPresent && memoNonEmpty);
}
memoInput.addEventListener("input", refreshProcessButton);
var activeReviews = [];
function setMemoStatus(msg, level = "") {
  memoStatus.textContent = msg;
  memoStatus.className = `status ${level}`;
}
function setReviewSummary(msg) {
  reviewSummary.textContent = msg;
}
function openReviewPane() {
  reviewList.innerHTML = "";
  reviewPane.hidden = false;
  memoInput.disabled = true;
  processMemoBtn.disabled = true;
}
function closeReviewPane() {
  reviewList.innerHTML = "";
  reviewPane.hidden = true;
  activeReviews = [];
  memoInput.disabled = false;
  refreshProcessButton();
}
function createPlaceholderCard(rawLine) {
  const node = reviewCardTemplate.content.firstElementChild.cloneNode(true);
  node.dataset.status = "pending";
  node.querySelector(".review-status-badge").textContent = "\u23F3 processing\u2026";
  node.querySelector(".review-raw-line").textContent = rawLine;
  return node;
}
function buildCandidateOption(c) {
  const opt = document.createElement("option");
  opt.value = String(c.id);
  const year = c.release_date?.slice(0, 4) || "\u2014";
  const dirs = (c.directors ?? []).join(", ") || "\u2014";
  opt.textContent = `${c.title || c.original_title} (${year}) \xB7 ${dirs}`;
  return opt;
}
function renderReviewCard(review) {
  const node = reviewCardTemplate.content.firstElementChild.cloneNode(true);
  const r = review.result;
  node.querySelector(".review-raw-line").textContent = review.rawLine;
  const statusBadge = node.querySelector(".review-status-badge");
  const body = node.querySelector(".review-body");
  const approveLabel = node.querySelector(".review-approve");
  const approveCb = node.querySelector(".approve-cb");
  if (r.status === "not_movie") {
    node.dataset.status = "not_movie";
    statusBadge.textContent = "\u21B7 not a movie";
    body.hidden = true;
    approveLabel.hidden = true;
    review.approved = false;
    review.cardEl = node;
    return node;
  }
  if (r.status === "error") {
    node.dataset.status = "error";
    statusBadge.textContent = `\xD7 error`;
    body.hidden = true;
    approveLabel.hidden = true;
    const msg = document.createElement("span");
    msg.style.fontSize = "0.85rem";
    msg.style.color = "#c00";
    msg.textContent = r.error || "unknown error";
    node.querySelector(".review-card-header").appendChild(msg);
    review.approved = false;
    review.cardEl = node;
    return node;
  }
  if (r.status === "no_match") {
    node.dataset.status = "no_match";
    statusBadge.textContent = "\u2205 no TMDB match";
    body.hidden = true;
    approveLabel.hidden = true;
    const hint = document.createElement("span");
    hint.style.fontSize = "0.85rem";
    hint.style.color = "#555";
    hint.textContent = "Use the TMDB URL paste above to add this one manually.";
    node.querySelector(".review-card-header").appendChild(hint);
    review.approved = false;
    review.cardEl = node;
    return node;
  }
  const confidence = r.matchResult?.confidence || "low";
  node.dataset.status = "ok";
  node.dataset.confidence = confidence;
  statusBadge.textContent = `\u2713 ${confidence}`;
  approveLabel.hidden = false;
  body.hidden = false;
  review.approved = true;
  approveCb.addEventListener("change", () => {
    review.approved = approveCb.checked;
  });
  review.currentEntry = r.entry;
  review.currentDetailsById = /* @__PURE__ */ new Map();
  for (const c of r.candidates ?? []) {
    if (c._details) review.currentDetailsById.set(c.id, c._details);
  }
  const posterLink = node.querySelector(".poster-link");
  const poster = node.querySelector(".poster");
  function rebindFromEntry(entry) {
    if (entry.tmdb_poster_url) {
      poster.src = entry.tmdb_poster_url;
      poster.style.background = "";
    } else {
      poster.removeAttribute("src");
      poster.alt = "(no poster)";
      poster.style.background = "#ddd";
    }
    posterLink.href = entry.tmdb_url || entry.imdb_url || "#";
    node.querySelector(".title").textContent = entry.tmdb_original_title || entry.title || "";
    node.querySelector(".tmdb-title").textContent = entry.tmdb_title || "";
    node.querySelector(".language").textContent = entry.tmdb_original_language ? `\u{1F5E3} ${entry.tmdb_original_language}` : "";
    const idsLine = node.querySelector(".ids");
    idsLine.innerHTML = "";
    if (entry.imdb_url) {
      const a = document.createElement("a");
      a.href = entry.imdb_url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = `IMDB ${entry.imdb_id}`;
      idsLine.appendChild(a);
    }
    if (entry.tmdb_url) {
      const a = document.createElement("a");
      a.href = entry.tmdb_url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "TMDB";
      idsLine.appendChild(a);
    }
  }
  rebindFromEntry(review.currentEntry);
  const yearInput = node.querySelector(".year");
  yearInput.value = review.currentEntry.year ?? "";
  yearInput.addEventListener("change", () => {
    const y = Number(yearInput.value);
    if (Number.isInteger(y) && y >= 1900 && y < 2100) {
      review.currentEntry.year = y;
    } else {
      yearInput.value = review.currentEntry.year ?? "";
    }
  });
  const dirInput = node.querySelector(".director");
  dirInput.value = review.currentEntry.director ?? "";
  const korFlag = node.querySelector(".kor-flag");
  function refreshKorFlag() {
    korFlag.textContent = review.currentEntry.is_korean_director ? "\u{1F1F0}\u{1F1F7} Korean dir" : "";
  }
  refreshKorFlag();
  dirInput.addEventListener("change", () => {
    const v = dirInput.value.trim();
    review.currentEntry.director = v;
    review.currentEntry.is_korean_director = isKoreanLanguage(v);
    refreshKorFlag();
  });
  const cktInput = node.querySelector(".custom-korean-title");
  cktInput.value = review.currentEntry.custom_korean_title ?? "";
  cktInput.addEventListener("change", () => {
    const v = cktInput.value.trim();
    if (v) review.currentEntry.custom_korean_title = v;
    else delete review.currentEntry.custom_korean_title;
  });
  const picker = node.querySelector(".candidate-picker");
  for (const c of r.candidates ?? []) {
    picker.appendChild(buildCandidateOption(c));
  }
  picker.value = String(r.matchResult.matched_tmdb_id);
  picker.addEventListener("change", async () => {
    const newId = Number(picker.value);
    let details = review.currentDetailsById.get(newId);
    if (!details) {
      try {
        const r2 = await fetch(
          `https://api.themoviedb.org/3/movie/${newId}?api_key=${TMDB_API_KEY}&append_to_response=credits`
        );
        if (!r2.ok) throw new Error(`TMDB ${r2.status}`);
        details = await r2.json();
        review.currentDetailsById.set(newId, details);
      } catch (err) {
        setMemoStatus(`Couldn't load TMDB id ${newId}: ${err.message}`, "error");
        return;
      }
    }
    let newEntry;
    try {
      newEntry = buildMovieEntryFromTmdb(details);
    } catch (err) {
      setMemoStatus(
        `Can't use TMDB id ${newId}: ${err.message}. Pick a different candidate.`,
        "error"
      );
      return;
    }
    const ckt = cktInput.value.trim();
    if (ckt) newEntry.custom_korean_title = ckt;
    review.currentEntry = newEntry;
    rebindFromEntry(newEntry);
    yearInput.value = newEntry.year ?? "";
    dirInput.value = newEntry.director ?? "";
    refreshKorFlag();
  });
  const reasoningEl = node.querySelector(".reasoning");
  reasoningEl.textContent = r.matchResult?.reasoning || "(none)";
  review.cardEl = node;
  return node;
}
processMemoBtn.addEventListener("click", async () => {
  const key = getGeminiKey();
  if (!key) {
    setMemoStatus("Bulk import is unavailable (no Gemini key in this build).", "error");
    return;
  }
  const lines = memoInput.value.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    setMemoStatus("Memo is empty.", "error");
    return;
  }
  const koreanDirectorMap = buildKoreanDirectorMap(movies);
  openReviewPane();
  setMemoStatus("");
  setReviewSummary(`Processing ${lines.length} line(s)\u2026`);
  activeReviews = lines.map((rawLine) => {
    const placeholder = createPlaceholderCard(rawLine);
    reviewList.appendChild(placeholder);
    return { rawLine, placeholder, approved: false, result: null, cardEl: null };
  });
  let completed = 0;
  await Promise.all(
    activeReviews.map(async (review) => {
      let result;
      try {
        result = await processMemoLine({
          rawLine: review.rawLine,
          geminiKey: key,
          tmdbApiKey: TMDB_API_KEY,
          koreanDirectorMap
        });
      } catch (e) {
        result = { rawLine: review.rawLine, status: "error", error: e.message };
      }
      review.result = result;
      const cardEl = renderReviewCard(review);
      review.placeholder.replaceWith(cardEl);
      completed++;
      setReviewSummary(
        `Processed ${completed} / ${activeReviews.length}\u2026`
      );
    })
  );
  const okCount = activeReviews.filter((r) => r.result?.status === "ok").length;
  const skipped = activeReviews.length - okCount;
  setReviewSummary(
    `Done. ${okCount} ready for review, ${skipped} skipped or unmatched.`
  );
});
commitAllBtn.addEventListener("click", () => {
  let added = 0;
  let dupCount = 0;
  for (const r of activeReviews) {
    if (!r.approved) continue;
    if (r.result?.status !== "ok" || !r.currentEntry) continue;
    const entry = r.currentEntry;
    const dup = movies.some((m) => m.imdb_id === entry.imdb_id) || movies.some((m) => m.tmdb_url === entry.tmdb_url);
    if (dup) {
      dupCount++;
      continue;
    }
    movies.push(entry);
    newImdbIds.add(entry.imdb_id);
    added++;
  }
  persistNewIds();
  if (added > 0) {
    setDirty(true);
    persist();
  }
  closeReviewPane();
  memoInput.value = "";
  renderAll();
  const dupMsg = dupCount ? `, skipped ${dupCount} duplicate(s)` : "";
  setMemoStatus(`Committed ${added} new movie(s)${dupMsg}.`, added > 0 ? "success" : "");
});
discardAllBtn.addEventListener("click", () => {
  closeReviewPane();
  setMemoStatus("Discarded.", "");
});
window.addEventListener("beforeunload", (e) => {
  if (!dirty) return;
  e.preventDefault();
  e.returnValue = "";
});
restoreNewIds();
if (restoreFromLocalStorage()) {
  setDirty(restoreDirty());
  setAddStatus(`Restored ${movies.length} movies from this browser's storage.`, "success");
}
renderAll();
if (memoBar) memoBar.hidden = !getGeminiKey();
refreshProcessButton();
tryAutoLoadFromServer();
/*! Bundled license information:

js-yaml/dist/js-yaml.mjs:
  (*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT *)
*/

//Define helpers for common operators and expressions

const mongo_query_operators = [
  "eq",
  "gt",
  "gte",
  "lt",
  "lte",
  "not",
  "ne",
  "in",
  "nin",
  "and",
  "regex",
  "or",
  "nor",
  "exists",
  "elemMatch",
  "expr",
  "jsonSchema",
  "size",
  "type",
];

const mongo_update_operators =[
  "set",
  "inc",
  "push",
  "min",
  "max",
  "unset",
  "addToSet"
]


for (let op of mongo_query_operators) {
  this[op] = function () {
    if (arguments.length == 1) {
      return new Document({ [`$${op}`]: arguments[0] });
    } else {
      if (arguments.length == 2) {
        return new Document({ [`${arguments[0]}`]: { [`$${op}`]: arguments[1] } });
      } else {
        return new Document({ [`${arguments[0]}`]: { [`$${op}`]: [...arguments].shift() }})
      }
    }
  };
}


for (let op of mongo_update_operators) {
  this[op] = function () {
      if (arguments.length == 2) {
        return new Document({ [`$${op}`]: { [`${arguments[0]}`]: arguments[1] } });
      } else {
        throw new Error(`${op} takes 2 arguments`);
      }
  };
}


function empty() { return {} }


function combine() {
  const rval = {}
  for(update of arguments) {
    // op will be something like  {$set:{a:1}} and we need ot merge them
    for( op in update) {
      rval[op] = { ...update[op],...rval[op]}
    }
  }
  return new Document(rval);
}

function include() {
  const rval = new Document();
  for(let arg of arguments) {
    rval[arg] = true;
  }
  return rval;
}

function exclude() {
  const rval = new Document();
  for(let arg of arguments) {
    rval[arg] = false;
  }
  return rval;
}
function fields() {
  rval = new Document()
  for(let arg of arguments) {
    rval = { ...rval, ...arg }
  }
  return rval;
}
const Projections = {
  fields,
  include,
  exclude
}

const Updates = {
  combine,
  inc,
  push,
  set,
  min,
  max,
  unset,
  addToSet
}



const Filters = {
  empty,
  eq,
  gt,
  gte,
  lt,
  lte,
  not,
  ne,
  in: this.in,
  nin,
  and,
  regex,
  or,
  nor,
  exists,
  elemMatch,
  expr,
  jsonSchema,
  size,
  type,
  and,
  or
}
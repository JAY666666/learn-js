// (1)浅拷贝
let sourceTarget = {
  name: "wxl",
  age: 18,
};
let shallowCopy = Object.assign({}, sourceTarget);
console.log("浅拷贝", shallowCopy);

// (2)深拷贝基础类型数据
// JSON.parse(JSON.stringfy(obj))
// 对象的序列化和反序列化来实现深拷贝
let obj = {
  name: "wxl",
  age: 18,
  like: {
    sport: "basketball",
  },
};
let cloneObj = JSON.parse(JSON.stringify(obj)); // clone success
console.log("基础类型深拷贝", cloneObj);

// (3) 深拷贝包含引用数据类型
let obj2 = {
  name: "wxl",
  age: 18,
  money: null,
  price: undefined,
  like: {
    sport: "basketball",
  },
  action: function () {
    console.log(this.name);
  },
};

let cloneObj2 = JSON.parse(JSON.stringify(obj2)); // obj2 中含有引用类型数据 clone失败, function未拷贝
console.log("引用类型深拷贝", cloneObj2);

// 工具函数
function isObject(target) {
  const type = typeof target;
  return type !== null && (type === "object" || type === "function");
}

function getType(target) {
  return Object.prototype.toString.call(target);
}

// (4) 深拷贝 考虑各种情况(拷贝函数暂不考虑)
const mapTag = "[object Map]";
const setTag = "[object Set]";
const arrayTag = "[object Array]";
const objectTag = "[object Object]";

const boolTag = "[object Boolean]";
const dateTag = "[object Date]";
const numberTag = "[object Number]";
const stringTag = "[object String]";
const errorTag = "[object Error]";
const symbolTag = "[object Symbol]";
// const regexpTag = "[object RegExp]";

const deepTag = [mapTag, setTag, arrayTag, objectTag];

// 非可继续递归类型数据
function cloneOtherType(target) {
  if (target === null) {
    return null;
  }
  const type = getType(target);
  const Cor = target.constructor;
  switch (type) {
    case boolTag:
    case dateTag:
    case numberTag:
    case stringTag:
    case errorTag:
      return new Cor(target);
    case symbolTag:
      return Object(Symbol.prototype.toString.call(target))
    default:
      target;
      break;
  }
}

function cloneDeep(target) {
  if (!isObject(target)) {
    return target;
  }
  const type = getType(target);
  let cloneTarget;
  if (deepTag.includes(type)) {
    if (type === mapTag) {
      cloneTarget = new Map();
      target.forEach((value, key) => {
        cloneTarget.set(key, cloneDeep(value));
      });
      return cloneTarget;
    }
    if (type === setTag) {
      target.forEach((value) => {
        cloneTarget = new Set();
        cloneTarget.add(cloneDeep(value));
      });
      return cloneTarget;
    }
    cloneTarget = type === objectTag ? {} : [];
    for (const key in target) {
      cloneTarget[key] = cloneDeep(target[key]);
    }
  } else {
    return cloneOtherType(target);
  }
  return cloneTarget;
}

// test
let obj3 = {
  name: "wxl",
  money: null,
  luckeyNumber: [6, 8, 4, 9],
  children: {
    name: "wxl2",
  },
  like: undefined,
  other: new Set([1, 2, 3, 4]),
  son: new Map([
    [1, "one"],
    [2, "two"],
    [3, "three"],
  ]),
  symbol: Object(Symbol(666)),
  num: new Number(1),
  bool: new Boolean(false),
  date: new Date(),
};
// obj3.test = obj3;
console.log(cloneDeep(obj3), "深拷贝啊");
JSON.parse(JSON.stringify(cloneDeep(obj3)));

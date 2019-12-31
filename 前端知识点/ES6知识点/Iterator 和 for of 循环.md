# Iterator（遍历器）的概念 #
> JavaScript 原有的表示“集合”的数据结构，主要是数组（Array）和对象（Object），ES6 又添加了Map和Set。这样就有了四种数据集合，用户还可以组合使用它们，定义自己的数据结构，比如数组的成员是Map，Map的成员是对象。这样就需要一种统一的接口机制，来处理所有不同的数据结构。
> 
> 遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。
> 
> Iterator 的作用有三个：一是为各种数据结构，提供一个统一的、简便的访问接口；二是使得数据结构的成员能够按某种次序排列；三是 ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费。


## Iterator 的遍历过程是这样的 ##
1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。
2. 第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。
3. 第二次调用指针对象的next方法，指针就指向数据结构的第二个成员。
4. 不断调用指针对象的next方法，直到它指向数据结构的结束位置。

每一次调用next方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含value和done两个属性的对象。其中，value属性是当前成员的值，done属性是一个布尔值，表示遍历是否结束。

下面是一个模拟next方法返回值的例子。

<pre>
let it = makeIterator(["a", "b"]);

function makeIterator(data) {
  var nextIndex = 0;
  return {
    next() {
      return nextIndex < data.length
        ? { value: data[nextIndex++], done: false }
        : { value: undefined, done: true };
    }
  };
}

console.log(it.next()); // {value: 'a', done: false}
console.log(it.next()); // {value: 'b', done: false}
console.log(it.next()); // {value: undefined, done: true}
</pre>

上面代码定义了一个makeIterator函数，它是一个遍历器生成函数，作用就是返回一个遍历器对象。对数组['a', 'b']执行这个函数，就会返回该数组的遍历器对象（即指针对象）it。

next方法返回一个对象，表示当前数据成员的信息。这个对象具有value和done两个属性，value属性返回当前位置的成员，done属性是一个布尔值，表示遍历是否结束，即是否还有必要再一次调用next方法。


## 默认 Iterator 接口 ##
Iterator 接口的目的，就是为所有数据结构，提供了一种统一的访问机制，即for...of循环（详见下文）。当使用for...of循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。

ES6 规定，默认的 Iterator 接口部署在数据结构的Symbol.iterator属性，或者说，一个数据结构只要具有Symbol.iterator属性，就可以认为是“可遍历的”（iterable）。Symbol.iterator属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器。至于属性名Symbol.iterator，它是一个表达式，返回Symbol对象的iterator属性，这是一个预定义好的、类型为 Symbol 的特殊值，所以要放在方括号内。

<pre>
const obj = {
  [Symbol.iterator] : function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        };
      }
    };
  }
};
</pre>

上面代码中，对象obj是可遍历的（iterable），因为具有Symbol.iterator属性。执行这个属性，会返回一个遍历器对象。该对象的根本特征就是具有next方法。每次调用next方法，都会返回一个代表当前成员的信息对象，具有value和done两个属性。

ES6 的有些数据结构原生具备 Iterator 接口（比如数组），即不用任何处理，就可以被for...of循环遍历。原因在于，这些数据结构原生部署了Symbol.iterator属性（详见下文），另外一些数据结构没有（比如对象）。凡是部署了Symbol.iterator属性的数据结构，就称为部署了遍历器接口。调用这个接口，就会返回一个遍历器对象。

原生具备 Iterator 接口的数据结构如下:

- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象

下面的例子是数组的Symbol.iterator属性。

<pre>
let arr = ["a", "b"];
let arrIterator = arr[Symbol.iterator]();

console.log(arrIterator.next()); // {value: 'a', done: false}
console.log(arrIterator.next()); // {value: 'b', done: false}
console.log(arrIterator.next()); // {value: undefined, done: true}
</pre>

上面代码中，变量arr是一个数组，原生就具有遍历器接口，部署在arr的Symbol.iterator属性上面。所以，调用这个属性，就得到遍历器对象。

对于原生部署 Iterator 接口的数据结构，不用自己写遍历器生成函数，for...of循环会自动遍历它们。除此之外，其他数据结构（主要是对象）的 Iterator 接口，都需要自己在Symbol.iterator属性上面部署，这样才会被for...of循环遍历。

对象（Object）之所以没有默认部署 Iterator 接口，是因为对象的哪个属性先遍历，哪个属性后遍历是不确定的，需要开发者手动指定。

下面是另一个为对象添加 Iterator 接口的例子。

<pre>
let obj = {
  data: ["hello", "world"],
  [Symbol.iterator]() {
    const self = this;
    let index = 0;
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false
          };
        } else {
          return { value: undefined, done: true };
        }
      }
    };
  }
};

let objIterator = obj[Symbol.iterator]();

// 可以被 for...of 循环，它会去找 obj 对象的 [Symbol.iterator] 属性
for (var item of obj) {
  console.log(item); // hello world
}

console.log(objIterator.next()); // {value: "hello", done: false}
console.log(objIterator.next()); // {value: "world", done: false}
console.log(objIterator.next()); // {value: undefined, done: true}
</pre>

对于类似数组的对象（存在数值键名和length属性），部署 Iterator 接口，有一个简便方法，就是Symbol.iterator方法直接引用数组的 Iterator 接口。

下面是另一个类似数组的对象调用数组的Symbol.iterator方法的例子。

<pre>
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};

for (let item of iterable) {
  console.log(item); // 'a', 'b', 'c'
}

// 或者把这个类数组对象转换成数组，就不用手动添加 [Symbol.iterator] 属性了
for (let item of Array.from(iterable)) {
  console.log(item); // 'a', 'b', 'c'
}
</pre>


注意，普通对象部署数组的Symbol.iterator方法，并无效果。

<pre>
let iterable = {
  a: 'a',
  b: 'b',
  c: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};

for (let item of iterable) {
  console.log(item); // undefined, undefined, undefined
}
</pre>

如果Symbol.iterator方法对应的不是遍历器生成函数（即会返回一个遍历器对象），解释引擎将会报错。

<pre>
var obj = {};

obj[Symbol.iterator] = () => 1;

[...obj] // TypeError: [] is not a function
</pre>


## 调用 Iterator 接口的场合 ##
有一些场合会默认调用 Iterator 接口（即Symbol.iterator方法），除了下文会介绍的for...of循环，还有几个别的场合。

**（1）解构赋值**

对数组和 Set 结构进行解构赋值时，会默认调用Symbol.iterator方法。

<pre>
let set = new Set().add('a').add('b').add('c');
let [x,y] = set;  // x='a'; y='b'
let [first, ...rest] = set;  // first='a'; rest=['b','c'];
</pre>

**（2）扩展运算符**

扩展运算符（...）也会调用默认的 Iterator 接口。

<pre>
// 例一
var str = 'hello';
[...str]  //  ['h','e','l','l','o']

// 例二
let arr = ['b', 'c'];
['a', ...arr, 'd']  // ['a', 'b', 'c', 'd']
</pre>

实际上，这提供了一种简便机制，可以将任何部署了 Iterator 接口的数据结构，转为数组。也就是说，只要某个数据结构部署了 Iterator 接口，就可以对它使用扩展运算符，将其转为数组。

<pre>
let str = "hello";

console.log([...str]); // ["h", "e", "l", "l", "o"]
</pre>

<pre>
let iterable = {
  0: "a",
  1: "b",
  2: "c",
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};

console.log([...iterable]); // ["a", "b", "c"]
</pre>

**（3）其他场合**

由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。下面是一些例子。

- for...of
- Array.from()
- Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）
- Promise.all() 和 Promise.race()


## 字符串的 Iterator 接口 ##
字符串是一个类似数组的对象，也原生具有 Iterator 接口。

<pre>
var someString = "hi";
var iterator = someString[Symbol.iterator]();

iterator.next()  // { value: "h", done: false }
iterator.next()  // { value: "i", done: false }
iterator.next()  // { value: undefined, done: true }
</pre>

可以覆盖原生的Symbol.iterator方法，达到修改遍历器行为的目的。

<pre>
var str = 'hi';

[...str] // ["h", "i"]

str[Symbol.iterator] = function() {
  return {
    next: function() {
      if (this._first) {
        this._first = false;
        return { value: "bye", done: false };
      } else {
        return { done: true };
      }
    },
    _first: true
  };
};

[...str] // ["bye"]
str // "hi"
</pre>

上面代码中，字符串 str 的Symbol.iterator方法被修改了，所以扩展运算符（...）返回的值变成了bye，而字符串本身还是hi。


## for...of 循环 ##
ES6 借鉴 C++、Java、C# 和 Python 语言，引入了for...of循环，作为遍历所有数据结构的统一的方法。

一个数据结构只要部署了Symbol.iterator属性，就被视为具有 iterator 接口，就可以用for...of循环遍历它的成员。也就是说，for...of循环内部调用的是数据结构的Symbol.iterator方法。

for...of循环可以使用的范围包括数组、Set 和 Map 结构、某些类似数组的对象（比如arguments对象、DOM NodeList 对象）、后文的 Generator 对象，以及字符串。


**数组**

数组原生具备iterator接口（即默认部署了Symbol.iterator属性），for...of循环本质上就是调用这个接口产生的遍历器，可以用下面的代码证明。

<pre>
const arr = ['red', 'green', 'blue'];

const obj = {};
obj[Symbol.iterator] = arr[Symbol.iterator].bind(arr);

for(let v of obj) {
  console.log(v); // red green blue
}
</pre>

上面代码中，空对象obj部署了数组arr的Symbol.iterator属性，结果obj的for...of循环，产生了与arr完全一样的结果。

for...of循环可以代替数组实例的forEach方法。

JavaScript 原有的for...in循环，只能获得对象的键名，不能直接获取键值。ES6 提供for...of循环，允许遍历获得键值。

<pre>
var arr = ['a', 'b', 'c', 'd'];

for (let a in arr) {
  console.log(a); // 0 1 2 3
}

for (let a of arr) {
  console.log(a); // a b c d
}
</pre>

上面代码表明，for...in循环读取键名，for...of循环读取键值。如果要通过for...of循环，获取数组的索引，可以借助数组实例的entries方法和keys方法（参见《数组的扩展》一章）。

<pre>
let arr = ["a", "b", "c"];

for (let a of arr.keys()) {
  console.log(a); // 0 1 2 3
}

for (let a of arr.values()) {
  console.log(a); // a b c
}
</pre>

for...of循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。这一点跟for...in循环也不一样。

<pre>
let arr = [3, 5, 7];
arr.foo = 'hello';

for (let i in arr) {
  console.log(i); // "0", "1", "2", "foo"
}

for (let i of arr) {
  console.log(i); //  "3", "5", "7"
}
</pre>

上面代码中，for...of循环不会返回数组arr的foo属性。


## 计算生成的数据结构 ##
有些数据结构是在现有数据结构的基础上，计算生成的。比如，ES6 的数组、Set、Map 都部署了以下三个方法，调用后都返回遍历器对象。

1. entries() 返回一个遍历器对象，用来遍历[键名, 键值]组成的数组。对于数组，键名就是索引值；对于 Set，键名与键值相同。Map 结构的 Iterator 接口，默认就是调用entries方法。
2. keys() 返回一个遍历器对象，用来遍历所有的键名。
3. values() 返回一个遍历器对象，用来遍历所有的键值。

这三个方法调用后生成的遍历器对象，所遍历的都是计算生成的数据结构。

<pre>
let arr = ['a', 'b', 'c'];
for (let pair of arr.entries()) {
  console.log(pair);
}
// [0, 'a']
// [1, 'b']
// [2, 'c']
</pre>


## 类似数组的对象 ##
类似数组的对象包括好几类。下面是for...of循环用于字符串、DOM NodeList 对象、arguments对象的例子。

<pre>
// 字符串
let str = "hello";

for (let s of str) {
  console.log(s); // h e l l o
}

// DOM NodeList对象
let paras = document.querySelectorAll("p");

for (let p of paras) {
  p.classList.add("test");
}

// arguments对象
function printArgs() {
  for (let x of arguments) {
    console.log(x);
  }
}
printArgs('a', 'b'); // a b
</pre>

并不是所有类似数组的对象都具有 Iterator 接口，一个简便的解决方法，就是使用Array.from方法将其转为数组。

<pre>
let arrayLike = { length: 2, 0: "a", 1: "b" };

// 报错
for (let x of arrayLike) {
  console.log(x);
}

// 修改
// Array.from(arrayLike) = ["a", "b"]
for (let item of Array.from(arrayLike)) {
  console.log(item);
}
</pre>


## 对象 ##
对于普通的对象，for...of结构不能直接使用，会报错，必须部署了 Iterator 接口后才能使用。但是，这样情况下，for...in循环依然可以用来遍历键名。

<pre>
let obj = {
  name: "xiaoming",
  age: 20
};

for (let item of obj) {
  console.log(item); // obj is not iterable
}

console.log(Object.keys(obj)); // ["name", "age"]
for (let item of Object.keys(obj)) {
  console.log(item); // name age
}

console.log(Object.values(obj)); // ["xiaoming", 20]
for (let item of Object.values(obj)) {
  console.log(item); // xiaoming 20
}
</pre>

上面代码表示，对于普通的对象，for...in循环可以遍历键名，for...of循环会报错。

一种解决方法是，使用 Object.keys 或者 Object.values 方法将对象的键名生成一个数组，然后遍历这个数组。


## 与其他遍历语法的比较 ##
以数组为例，JavaScript 提供多种遍历语法。最原始的写法就是for循环。

<pre>
for (var index = 0; index < myArray.length; index++) {
  console.log(myArray[index]);
}
</pre>

这种写法比较麻烦，因此数组提供内置的forEach方法。

<pre>
myArray.forEach(function (value) {
  console.log(value);
});
</pre>

这种写法的问题在于，无法中途跳出forEach循环，break命令或return命令都不能奏效。

<pre>
for (var index in myArray) {
  console.log(myArray[index]);
}
</pre>

for...in循环有几个缺点：

1. 数组的键名是数字，但是for...in循环是以字符串作为键名“0”、“1”、“2”等等。
2. for...in循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。
3. 某些情况下，for...in循环会以任意顺序遍历键名。

总之，for...in循环主要是为遍历对象而设计的，不适用于遍历数组。

for...of循环相比上面几种做法，有一些显著的优点。

1. 有着同for...in一样的简洁语法，但是没有for...in那些缺点。
2. 不同于forEach方法，它可以与break、continue和return配合使用。
3. 提供了遍历所有数据结构的统一操作接口。

下面是一个使用 break 语句，跳出for...of循环的例子。

<pre>
for (var n of fibonacci) {
  if (n > 1000)
    break;
  console.log(n);
}
</pre>

上面的例子，会输出斐波纳契数列小于等于 1000 的项。如果当前项大于 1000，就会使用break语句跳出for...of循环。


















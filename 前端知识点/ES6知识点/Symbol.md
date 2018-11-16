# 概述 #
ES5 的对象的属性都是字符串，这很容易造成属性名重名的冲突，也就是后者会覆盖前者；如果有一种机制，能够保证属性名永远是唯一的就好了，这样就从根本上防止了属性名重名冲突的影响。<br>

ES6 引入了一种全新的原始数据类型 Symbol，它表示独一无二的值。它是 javascript 第7中数据类型 symbol 类型。

Symbol 值通过 Symbol 函数生成，也就是说，对象的属性可以有两种类型，一种是字符串，还有一种就是 symbol 类型，只要属性名为 symbol 类型，那么该属性名就是该对象独一无二的，可以保证不会与该对象的其他属性名重名。

<pre>
var s = Symbol();
console.log(typeof s) // symbol
</pre>

注意，Symbol 函数不能使用 new 去生成，这是因为生成的 Symbol 它是一种原始的数据类型，不是对象，所以生成的 symbol 不能添加属性和方法，基本上它是一种类似于字符串的数据类型。<br>
Symbol 函数可以接收一个字符串参数，主要是用来做区分用的。

<pre>
var s1 = Symbol('s1');
var s2 = Symbol('s2');

console.log(s1) // Symbol(s1)
console.log(s2) // Symbol(s2)
</pre>

注意，Symbol 函数的参数，只能用来表示他们生成的 symbol 数据类型的描述符，即使参数一样，但也是不同的 symbol。

<pre>
var s1 = Symbol('s1');
var s2 = Symbol('s1');

console.log(s1 == s2) // false
</pre>

symbol 值有以下一些特点：

1. 不能与其他数据类型进行运算，否则报错
2. 可以显示的通过 toString、String 方法转换成字符串
3. 可以转换成布尔值（都会true），担不能转换为数值（Number 转换报错）

<pre>
var sym = Symbol('sym');

console.log(String(sym))  // Symbol(sym)
console.log(sym.toString())  // Symbol(sym)
console.log(sym+'str')  // 报错
</pre>


## Symbol 作为对象属性名时的三种表示方法 ##
var sym = Symbol();<br>

第一种：
<pre>
var obj = {};
obj[sym] = 'hello';
</pre>

第二种：
<pre>
var obj = {
	[sym]: 'hello'
};
</pre>

第三种：
<pre>
var obj = {};
Object.defineProperty(obj, sym, {
  value: &#x27;hello&#x27;
})
</pre>

注意，在对象读取 symbol 值的时候，不能使用“点”运算符，因为点运算符后面跟的都是字符串，所以对象读取 symbol 值的时候，应该使用“[]”运算符：

<pre>
var obj = {};
var sym = Symbol(&#x27;sym&#x27;);

obj.sym = &#x27;sym&#x27;;
obj[sym] = &#x27;sym hello&#x27;;

console.log(obj[&#x27;sym&#x27;]) // sym
console.log(obj[sym])   // sym hello
</pre>

同理，symbol 变量作为对象属性名时，也应该放在“[]”中。


## Symbol 属性名的遍历 ##
Symbol 数据类型作为对象属性名时，它不会出现在 for...in、for...of 循环中，也不会被对象的变量方法 Object.keys()、Object.getOwnPropertyNames() 返回。但它也不是私用属性，它只能被特定的方法 Object.getOwnproperSymbols() 方法返回，返回的是一个数组，成员是当前对象所有的以 symbol 变量作为属性名的 symbol 值：

<pre>
var sym1 = Symbol(&#x27;sym1&#x27;);
var sym2 = Symbol(&#x27;sym2&#x27;);
var obj = {
  name: &#x27;小明&#x27;,
  age: 24,
  [sym1]: &#x27;男&#x27;,
  [sym2]: &#x27;女&#x27;
};

for (let attr in obj) {
  console.log(obj[attr])  // 小明 24
}
</pre>

<pre>
var sym1 = Symbol(&#x27;sym1&#x27;);
var sym2 = Symbol(&#x27;sym2&#x27;);
var obj = {
  name: &#x27;小明&#x27;,
  age: 24,
  [sym1]: &#x27;男&#x27;,
  [sym2]: &#x27;女&#x27;
};

var objSymbols = Object.getOwnPropertySymbols(obj);

console.log(objSymbols) // [Symbol(sym1), Symbol(sym2)]

objSymbols.forEach(function(key) {
  console.log(obj[key]) // 男 女
})
</pre>

所以，你如果想遍历一个对象中即包含普通字符串属性又包含 symbol 属性的话，可以使用Reflect.ownKeys(obj) 和 forEach() 方法结合：<br>

<pre>
var sym1 = Symbol(&#x27;sym1&#x27;);
var sym2 = Symbol(&#x27;sym2&#x27;);
var obj = {
  name: &#x27;小明&#x27;,
  age: 24,
  [sym1]: &#x27;男&#x27;,
  [sym2]: &#x27;女&#x27;
};

var objList = Reflect.ownKeys(obj);

objList.forEach(function(key) {
  console.log(obj[key])	// 小明 24 男 女
})
</pre>



## 为什么要使用Symbol? ##
有这样一种场景，我们想区分两个属性，其实我们并不在意，这两个属性值究竟是什么，我们在意的是，这两个属性绝对要区分开来！例如:

<pre>
var shapeNum = {
  min: &#x27;min&#x27;,
  max: &#x27;max&#x27;
}

function computedNum(num, count) {
  var setNum = 0;
  switch (count) {
    case shapeNum.min:
      setNum = num * 20
      break;
    case shapeNum.max:
      setNum = num * 10
      break;
  }
  return setNum
}

var num1 = computedNum(10, shapeNum.min);
var num2 = computedNum(10, shapeNum.max);

console.log(num1) // 100
console.log(num2) // 200
</pre>

上面这个列子说的是对一个数字，到底是使用 *20 还是 *10 的区别，一般我们会向上面那样写代码，只是我们发现，其实只要属性名加以区分就可以了，属性值只要不一样即可，但如果向上面那样，我们的属性值每次取名的时候就要小心，它们可不能相同，不然结果会出错，所以我们这个时候就可以使用 symbol 来代替了：

<pre>
var shapeNum = {
  min: Symbol(),
  max: Symbol()
}

function computedNum(num, count) {
  var setNum = 0;
  switch (count) {
    case shapeNum.min:
      setNum = num * 20
      break;
    case shapeNum.max:
      setNum = num * 10
      break;
  }
  return setNum
}

var num1 = computedNum(10, shapeNum.min);
var num2 = computedNum(10, shapeNum.max);

console.log(num1) // 100
console.log(num2) // 200
</pre>

也就是说，我们不用非要去给变量赋一个字符串的值，去区分它和别的变量的值不同，因为去给每个变量取个语义化而又不同的值是一件伤脑子的事，当我们只需要知道每个变量的值都是百分百不同的即可，这时候我们就可以用 Symbol。
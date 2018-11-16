# for of 与 for in的区别 #
提外话：遍历数组通常使用 for 循环，ES5 的话也可以使用 forEach，ES5 具有遍历数组功能的还有map、filter、some、every、reduce等，只不过他们的返回结果不一样。但是使用 forEach 遍历数组的话，使用 break 不能中断循环，使用 return 也不能返回到外层函数。


## for...in ##
for...in 语句用于遍历数组或者对象的属性（对数组或者对象的属性进行循环操作）
> for...in 循环只遍历**可枚举属性**。像 Array 和 Object 使用内置构造函数所创建的对象都会继承自 Object.prototype 和 String.prototype 的**不可枚举属性**，例如 String 的 indexOf() 方法或 Object 的 toString()方法。循环将遍历对象本身的所有可枚举属性，以及对象从其构造函数原型中继承的属性，并且它是以任意顺序遍历一个数组或者对象的可枚举属性。

**循环数组存在以下几个问题**

1. index索引为字符串型数字，不能直接进行几何运算
2. 在某些情况下，遍历顺序有可能不是按照实际数组的内部顺序
3. 使用 for in 会遍历数组所有的可枚举属性，包括原型上添加的属性，或者你从对象原型上添加的可枚举属性

**尤其是第3点：会遍历数组所有的可枚举属性，包括原型上添加的属性，或者你从对象原型上添加的可枚举属性**
<pre>
var arr = [1, 2, 3];

arr.foo = &#x27;hello&#x27;;

Object.prototype.objCustom = &#x27;objCustomFn&#x27;; 
Array.prototype.arrCustom = &#x27;arrCustomFn&#x27;;
 
for (var attr in arr) {
  console.log(attr); // 0, 1, 2, &quot;foo&quot;, &quot;arrCustom&quot;, &quot;objCustom&quot;
  console.log(arr[attr]); // 1, 2, 3, &quot;foo&quot;, &quot;arrCustomFn&quot;, &quot;objCustomFn&quot;
}
</pre>
因为迭代的顺序是依赖于执行环境的，所以数组遍历不一定按次序访问元素。因此当迭代访问顺序很重要时，最好用整数索引去进行for循环（或者使用 Array.prototype.forEach() 或 for...of 循环）


**它更适合遍历对象类型**
<pre>
var obj = {
  name: &#x27;小明&#x27;,
  age: 24
};

obj.sex = &#x27;男&#x27;;

Object.prototype.getName = &#x27;name&#x27;;

for (var key in obj) {
  console.log(obj[key])  // 小明 24 男 name 
}
</pre>

如果你不想遍历对象类型的原型上继承的属性，可以使用 对象.hasOwnProperty(key) 方法过滤，该方法会判断该属性是否是对象本身实例上的属性，返回布尔值：

<pre>
var obj = {
  name: '小明',
  age: 24
};

obj.sex = '男';

Object.prototype.getName = 'name';

for (var key in obj) {
  if(obj.hasOwnProperty(key)){
    console.log(obj[key])  // 小明 24 男
  }
}
</pre>



## for...of ##
> for … of 循环是ES6引入的新的语法，用for … of循环遍历集合。
> 
> for...of 语句在可迭代对象（包括 Array，Map，Set，String，TypedArray，arguments 对象等等）上创建一个迭代循环。

**for...of 遍历集合 value 值，不遍历 key 值：**
<pre>
var str = 'hello';
 
for (var key in str) {
  console.log(key); // 0 1 2 3 4
}
</pre>

<pre>
var str = 'hello';
 
for (var value of str) {
  console.log(value); // h e l l o
}
</pre>


如果遍历数组，遍历的只是数组内的元素，而不包括数组的原型属性和索引：

<pre>
var arr = ['a', 'b', 'c'];

arr.d = 'd';

Array.prototype.getName = 'name';

for (var value of arr) {
  console.log(value)  // a b c 
}
</pre>

因为对象类型不具备 iterate 接口，所以不能用来直接遍历对象，否则报错：

<pre>
var obj = {
  name: '小明',
  age: 24
};

obj.sex = '男';

Object.prototype.getName = 'name';

for (var key of obj) {
  console.log(obj[key])  // 报错
}
</pre>


# 总结 #

- for...in 循环是用来遍历对象（包括原型上继承的）可枚举的属性键值；但由于历史遗留问题，一个 Array 数组实际上也是一个对象，它的每个元素的索引被视为一个属性。
- for...of 循环则修复了这些问题，它只循环集合本身的元素（不包括原型上继承来的可枚举属性），并且可以使用 break、return、continue 控制循环过程
- 遍历对象类型适合用 for...in 或者 for...of，而遍历数组最好不要用 for...in
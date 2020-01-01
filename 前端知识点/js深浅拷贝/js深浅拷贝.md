# JS浅拷贝和深拷贝详解 #
> 如何区分深拷贝与浅拷贝，简单点来说，就是假设B复制了A，当修改A或者B时，看A或者B是否相互影响，如果相互影响，说明这是浅拷贝，如果都没有影响，那就是深拷贝。
> 
> 在js中，对于非基本类型数据（普通对象或数组），浅拷贝只是拷贝了内存地址，子类属性指向父类属性的内存地址，而子类修改后父类也会被修改。
> 而基本类型（数字、字符串、布尔值、null、undefaild），都属于深拷贝
> 
> 为什么要了解深浅拷贝，因为在多人协作处理同一数据时，你操作这个数据的时候，不能影响其他人。例如后台返回了一堆数据，你需要对这堆数据做操作，但多人开发情况下，你是没办法明确这堆数据是否有其它功能也需要使用，直接修改可能会造成隐性问题，所以这个时候，你对数据的修改就需要先拷贝下来，并且修改你的数据的时候，不能影响原有数据。


## 数组的深拷贝 ##
<pre>
var a = [1,2,3]
var b = a.slice() // 或者使用 es6语法：var b = [...a];

b[0] = 4

console.log(a)	// [1,2,3]
console.log(b)	// [4,2,3]
</pre>

按照上面的说法，b或者a改变了，都不会相互影响，那么数组的slice方法应该是个深拷贝。但深拷贝，是拷贝对象各个层级的属性，这个时候如果a是一个二维以上的数组，或者a的一级属性是一个引用类型的话，slice方法还能正常使用吗？

<pre>
var a = [1,2,[3,4]]
var b = a.slice()	// 也可以换成 var b = [].concat(a)

b[2][0] = 5

console.log(a)	// [1,2,[5,4]]
console.log(b)	// [1,2,[5,4]]
</pre>

<pre>
var a = [{num: 1}, {name: 2}]
var b = a.slice()

b[0].num = 3

console.log(a)	// [{num: 3}, {num: 2}]
console.log(b)	// [{num: 3}, {num: 2}]
</pre>

从上面两个的例子可以发现，如果a的一级属性是基本类型的话，数组的slice或者concat方法都能实现深拷贝；但如果a的一级属性是引用类型的话，就不能深拷贝；同理，如果a的二级或多级属性是引用类型的话，也不鞥呢深拷贝，所以数组的slice、concat方法，不能称之为真正的深拷贝，因为它只能拷贝一级属性，并且一级属性还必须是基本类型；那么如何才能真正意义上的实现数组的深拷贝呢？<br>
这里可以借助JSON对象的parse和stringify两个方法

<pre>
var a = [1,2,[3,4]]
var b = JSON.parse(JSON.stringify(a))

b[2][0] = 5

console.log(a)	// [1,2,[3,4]]
console.log(b)	// [1,2,[5,4]]
</pre>

所以数组真正意义上的深拷贝可以借助JSON对象的parse和stringify两个方法来实现，或者使用jquery的$.extend函数也能达到这样的效果。


## 对象的深拷贝 ##
上面说了数组的深拷贝，现在来说一下json对象的深拷贝
<pre>
var a = {
  name: '小明',
  age: 20
}

var b = Object.assign({}, a)

b.name = '小红'

console.log(a)	// {name: "小明", age: 20}
console.log(b)	// {name: "小红", age: 20}
</pre>

这个列子和上面的数组的列子一样，b的改变不会影响到a，那么es6中 Object.assign 这个方法就是深拷贝？其实不然，因为这个方法和数组的 slice或者concat 方法一样，如果拷贝的属性是一个基本类型的话，那没有问题，称得上是一个深拷贝；但如果拷贝属性是引用类型的话，那就不能达到想要的效果了，看下面的实例。

<pre>
var a = {
  name: '小明',
  add: {ct: '杭州市-江干区'}
}

var b = Object.assign({}, a)

b.name = '小红'
b.add.ct = '上海市-虹桥区'

console.log(a)	// {name: "小明", add: {ct: '上海市-虹桥区'}
console.log(b)	// {name: "小红", add: {ct: '上海市-虹桥区'}}
</pre>

这里发现，通过对象的 assign 方法，还是无法真正的实现深拷贝。那我们来尝试下利用上面的 JSON 方法试试。

<pre>
var a = {
  name: '小明',
  add: {ct: '杭州市-江干区'}
}

var b = JSON.parse( JSON.stringify(a) )

b.name = '小红'
b.add.ct = '上海市-虹桥区'

console.log(a)	// {name: "小明", add: {ct: '杭州市-江干区'}
console.log(b)	// {name: "小红", add: {ct: '上海市-虹桥区'}}
</pre>

通过这个列子发现 JSON的parse和stringify方法也可以达到深拷贝的效果；不过这里先插播一个特殊的现象，就是如何你的属性是一个函数的时候，Object.assign 只能实现浅拷贝；但是如果使用 JSON 的那两个方法去进行深拷贝时，发现属性如果是一个函数的话，它无法进行拷贝，看下面的实例。

<pre>
var a = {
  name: '小明',
  add: {ct: '杭州市-江干区'},
  sex: function () {
    return '男'
  }
}

var b = JSON.parse( JSON.stringify(a) )

b.name = '小红'
b.add.ct = '上海市-虹桥区'

console.log(a)		// {name: "小明", add: {ct: '杭州市-江干区'}, sex: f()}
console.log(b)		// {name: "小红", add: {ct: '上海市-虹桥区'}}
console.log(b.sex) 	// undefined
</pre>

所以对json对象类型使用深拷贝的时候，应该尽量避免函数这种特殊的类型。当然在实际的开发过程中，数据里面是不会有函数数据的。下面就来简单的封装以下深拷贝的函数。


# 简单封装下深拷贝函数 #
<pre>
function extend(obj) {
  var newObj
  // obj属性只能是数组和对象
  if (obj && typeof obj !== 'function' && typeof obj === 'object') {
    newObj = JSON.parse( JSON.stringify(obj) )
  } else {
    newObj = obj
  }
  return newObj
}
</pre>


# 关于JSON.parse(JSON.stringify(obj))实现深拷贝应该注意的坑 #
JSON.parse(JSON.stringify(obj))我们一般用来深拷贝，其过程说白了 就是利用JSON.stringify 将js对象序列化（JSON字符串），再使用JSON.parse来反序列化(还原)js对象；序列化的作用是存储(对象本身存储的只是一个地址映射，如果断电，对象将不复存在，因此需将对象的内容转换成字符串的形式再保存在磁盘上 )和传输（例如 如果请求的Content-Type是 application/x-www-form-urlencoded，则前端这边需要使用JSON.stringify(data)来序列化参数再传给后端，否则后端接受不到；

Content-Type 为 application/json;charset=UTF-8或者 multipart/form-data 则可以不需要  ）；

我们在使用 JSON.parse(JSON.stringify(obj))时应该注意以下几点：

**1、如果obj里面有时间对象，则JSON.stringify后再JSON.parse的结果，时间将只是字符串的形式。而不是时间对象**

**2、如果obj里有RegExp、Error对象，则序列化的结果将只得到空对象**

**3、如果obj里有函数，undefined，则序列化的结果会把函数或 undefined 丢失**

**4、如果obj里有NaN、Infinity和-Infinity，则序列化的结果会变成null**

**5、JSON.stringify()只能序列化对象的可枚举的自有属性，例如obj中的对象是有构造函数生成的，则使用 JSON.parse(JSON.stringify(obj)) 深拷贝后，会丢弃对象的constructor**

**6、如果对象中存在循环引用的情况也无法正确实现深拷贝**


# 封装一个简单的深拷贝函数 #
综合上面所有的关于深拷贝的问题，做下面的函数封装<br>
如果拷贝的对象不涉及上面讲的情况，可以直接使用 JSON.parse(JSON.stringify(obj))<br>
但是涉及到上面的情况，可以考虑使用如下方法实现深拷贝：<br>
**使用方法：var 得到的新对象 = deepClone(要拷贝的对象)**

<pre>
function getType(obj){
  //tostring会返回对应不同的标签的构造函数
  var toString = Object.prototype.toString;
  var map = {
    '[object Boolean]'  : 'boolean', 
    '[object Number]'   : 'number', 
    '[object String]'   : 'string', 
    '[object Function]' : 'function', 
    '[object Array]'    : 'array', 
    '[object Date]'     : 'date', 
    '[object RegExp]'   : 'regExp', 
    '[object Undefined]': 'undefined',
    '[object Null]'     : 'null', 
    '[object Object]'   : 'object'
  }
  if(obj instanceof Element) {
    return 'element';
  }
  return map[toString.call(obj)];
}

function deepClone(data){
  var type = getType(data);
  var obj;
  if(type === 'array'){
    obj = [];
  } else if(type === 'object'){
    obj = {};
  } else {
    // 不再具有下一层次
    return data;
  }
  if(type === 'array'){
    for(var i = 0, len = data.length; i < len; i++){
      obj.push(deepClone(data[i]));
    }
  } else if(type === 'object'){
    for(var key in data){
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
}
</pre>

要使用完整的深拷贝，可以借助一些库提供的深拷贝方法
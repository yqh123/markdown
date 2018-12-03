# 基本概念 #
Generator 函数是 ES6 提供的一种异步编程的解决方案，它的语法行为和传统的函数完全不同。执行该函数会返回一个遍历器对象，可以遍历该函数内部的每一个状态。<br>
形式上，Generator 函数是一个普通函数，但它有两个特性：<br>

1. function 命令与函数名之间有一个 * 号
2. 函数内部使用 “yield”（产出的意思） 语句定义不同的内部状态

<pre>
// Es6 没有规定 * 号的具体位置，所以你可以写成这样 
// function* helloworldFn、 function *helloworldFn 或者 function * helloworldFn
function * helloworldFn() {
  yield &#x27;hello&#x27;;
  yield &#x27;world&#x27;;
  return &#x27;ending&#x27;
}

let hw = helloworldFn();

console.log(hw) // helloworldFn {&lt;suspended&gt;}
</pre>

上面代码定义了一个 Generator 函数，它内部有三种状态：hello world 和 return语句（结束语句）。<br>

Generator 函数的调用和普通函数一样使用 () 执行，不同的是，调用它时并不会执行，返回的也不是函数的运行结果，而是一个指向内部状态的指针对象，也就是一个遍历器对象。<br>
下一步必须调用该函数的 next 方法，使得指针移向下一个状态，直到遇见 yield 或者 return 语句时停止。也就是说调用 next 方法，内部指针就从函数头部或者上一次停留的位置开始向下执行，直到遇到下一条 yield 或者 return 语句为止。Generator 函数是分段执行的，yield 语句是暂停执行的标记，而 next 方法是恢复执行的标记。

<pre>
function * helloworldFn() {	
  yield &#x27;hello&#x27;;
  yield &#x27;world&#x27;;
  return &#x27;ending&#x27;
}

let hw = helloworldFn();

console.log(hw.next()) // {value: &quot;hello&quot;, done: false}
console.log(hw.next()) // {value: &quot;world&quot;, done: false}
console.log(hw.next()) // {value: &quot;ending&quot;, done: true}
console.log(hw.next()) // {value: &quot;undefined&quot;, done: true}
</pre>

上面代码中，next 方法返回一个对象，value 值为 yield 语句 或者 return 语句的值，done 表示遍历是否结束。<br>

总结一下，调用 Generator 函数返回一个遍历器对象，代表 Generator 函数的内部指针。以后每一次调用 next 方法，都会返回一个有着 value 和 done 属性的对象，value 表示当前内部状态 yield 或者 return 语句的值，而 done 是一个布尔值，表示该遍历是否结束。<br>


## 与普通函数对比 ##
一个 Generator 函数可以用多个 yield 语句，但只能有一个 return 语句；普通函数只能返回一个值，但 Generator 函数可以返回多个值，从另一个角度上看，也可以说 Generator 函数生成了一系列的值，这也就是 generator 名称的由来（生成器）。<br>

Generator 函数内部也可以不使用 yield 语句和 return 语句，那么它就变成了一个普通执行函数，调用 next 方法后就会和普通函数一样执行，返回的依然是拥有 value 和 done 两个属性的对象。

<pre>
function * helloworldFn() {
  console.log(&#x27;hello world&#x27;)
}

let hw = helloworldFn().next(); // 打印 hello world

console.log(hw) // 返回 {value: undefined, done: true}
</pre>

或者使用变量保存 Generator 函数，那么变量名就是 Generator 的函数名：

<pre>
let helloworldFn = function *() {
  console.log(&#x27;hello world&#x27;)
}

let hw = helloworldFn().next(); // 打印 hello world

console.log(hw) // 返回 {value: undefined, done: true}
</pre>


## next方法的参数 ##
yield 语句本身没有返回值，或者说返回值就是 undefined，而 next 方法可以接收一个参数，该参数表示上一条 yield 语句的返回值。

<pre>
function * fn() {
  for(var i = 0; true; i++) {
    var reset = yield i;
    if (reset) {i = -1}
  }
}

var g = fn();

console.log(g.next()) // {value: 0, done: false}
console.log(g.next()) // {value: 1, done: false}
console.log(g.next(true)) // {value: 0, done: false}
</pre>

上面代码中，yield 总是直接返回 undefined，所以 if 语句不会执行，但是当 next 有一个true 参数后，那么该次执行的时候，当前定义的变量 reset 就被重置为该参数 true 了，因此 i 会等于 -1，那么下一轮循环就从 -1 开始循环。<br>
注意，第一次调用 next 方法的时候不用带参数，因为第一次调用 next 方法可以理解为启动遍历器对象，所以不用带参数。<br>

看一下下面这个运算结果：

<pre>
function * fn(x) {
  var y = 2 * (yield (x+1));
  var z = yield (y/3);
  return (x+y+z)
}

var a = fn(5);

console.log(a.next()) // {value: 6, done: false}
console.log(a.next()) // {value: NaN, done: false}
console.log(a.next()) // {value: NaN, done: false}
</pre>

第一次调用 next 方法，返回第一个 yield 语句的值 (x+1)，得到 （5+1），为6；<br>
第二次调用 next 方法，执行第二个 yield 语句，返回的也是第二个 yield 语句的值，因为没有带参数，所以 y = 2 * undefined，(yield (x+1)) 返回 undefined 值，所以变成 yield (undefined/3)，得到 NaN；<br>
第三次调用 next 方法，返回 return 语句的值，这个时候 x=5，y=undefined，z=NaN<br>

在看一下带参数的运算结果：

<pre>
function * fn(x) {
  var y = 2 * (yield (x+1));
  var z = yield (y/3);
  return (x+y+z)
}

var b = fn(5);
console.log(b.next()) // {value: 6, done: false}
console.log(b.next(12)) // {value: 8, done: false}
console.log(b.next(13)) // {value: 42, done: true}
</pre>

第一次调用 next 方法，返回第一个 yield 语句的值 (x+1)，得到 （5+1），为6；<br>
第二次调用 next 方法，因为带了参数 12，所以上一条 yield 语句返回这个值，那么 y = 2*12 得到 24，那么第二条 yield 语句变成 yield (24/3) 得到 8；<br>
第三次调用 next 方法，带用参数 13，所以第二条 yield 语句直接返回 13，那么 z = 13;
所以，x=5，y=24，z=13，return 得到返回值 42；



# 在实际开发中的应用 #
Generator 函数是异步编程的解决方案，我们之前在写异步编程的时候，用的其实就是回调函数的写法，比如，刚进入页面的时候，第一步需要显示加载页面，执行加载页面的时候异步去后端获取数据，数据获取完成后，把加载页面隐藏掉，显示首屏页面；比如向下面的这种写法：

<pre>
window.onload = function() {
  第一步：显示加载页面
  第二步：在第1步的回调函数里面，调用 ajax 请求数据
  第三步：在第2步的回调函数里面，隐藏加载页面
}
</pre>

换成 Generator 函数的写法：

<pre>
window.onload = function() {
  let logind = loadingFn(); // 开始不会执行
  logind.next() // 加载页面，执行第一个 yield 返回值(ajax1函数)
  logind.next() // 执行第二个 yield 返回值(ajax2函数)
  logind.next() // 隐藏加载页面
}

function * loadingFn() {
  show()  	 // 执行加载页面代码
  yield ajax1()  // 获取首屏数据1
  yield ajax2()  // 获取首屏数据2
  hide()	 // 隐藏加载页面
}
</pre>

第一次调用 loadingFn() 函数不会执行，而是返回一个遍历器对象，当第一次调用 next 方法的时候，开始执行 show() 函数去显示加载页面，同时执行第一个 yield 返回的异步 ajax1 函数，并执行；<br>
第二次调用 next 方法时，执行第二个 yield 返回的异步函数 ajax2 函数，并执行；<br>
第三次调用 next 方法时，从第二个 yield 标记开始，往下执行 hide 函数，隐藏加载页面；<br>
综上，就是一个典型的通过 Generator 函数去“分阶段”执行异步操作的方式，这样写的话，更便于维护，而且更直观，不用在写回调函数去处理异步加载的过程，其实说白了就是让异步编程有点同步化的过程。<br>


## 部署 Iterator 接口 ##
利用 Generator 函数给任意对象部署 Iterator 接口，让它可以被 for...of 循环遍历：

<pre>
function * iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i = 0; i &lt; keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]]
  }
}

let myObj = {name: &#x27;小明&#x27;, age: 24};

for (var [key, value] of iterEntries(myObj)) {
  console.log(key, value)
}
</pre>



## Generator 一步执行（自动流程管理） ##
所谓一步执行 Generator 函数的意思就是，不用在调用 next 方法去往下执行，而是调用一次就把所有 Generator 函数中 yield 语句中的所有方法都执行完成。

普通写法：
<pre>
function * generators() {
  yield fn1()
  yield fn2()
}

function fn1() {
  console.log(1)
}
function fn2() {
  console.log(2)
}

var fn = generators();
fn.next()	// 1
fn.next()	// 2
</pre>

现在如果有一个方法，只要执行一次，就可以全部调用两个 yield 里面的方法就好了。

封装一个遍历函数：也叫 Thunk 函数
<pre>
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data)
    if(result.done) return
    result.value(next)
  }

  next()
}
</pre>

执行方式如下：

<pre>
run(generators)
</pre>

这样一来，Generator 函数不仅可以写得像同步，而且还可以一行代码搞定所有的 next 方法调用。


## co 模块 ##
co 模块是由他人发布的一个管理 Generator 函数执行流程的小工具，用于 Generator 函数的自动执行，也就是上面封装的简单的一步执行函数。<br>
比如有一个 Generator 函数，用于执行两个其他的异步操作，并且该异步操作返回的是一个 Promise 对象。

<pre>
function * gen() {
  yield ajax1()  
  yield ajax2()   
}
</pre>

它引入 co 模块后可以这样达到一步执行，并且使用 Promise 对象的 then 方法去回调处理：

<pre>
var co = require('co');
co(gen).then((value)=>{
	console.log(value)
})
</pre>
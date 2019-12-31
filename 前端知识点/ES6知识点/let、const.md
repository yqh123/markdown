# let #
> 用于声明变量，语法同 var，它主要有以下几个特点

## 1、声明的变量会生成块级作用域，并且该变量仅在该域内有效 ##
<pre>
{
	var a = 1;
	let b = 2;
}

console.log(a)	// 1
console.log(b)	// 报错
</pre>

for 循环的计数器就很适合 let 声明<br>

**使用 var 声明**
<pre>
var arr = []

for (var i = 0; i &lt; 10; i++) {	//var来声明变量i，所以for循环代码块不具备块级作用域，因此i认为是全局变量，直接放在全局变量中
	arr[i] = function () {	// 没有变成闭包函数体
		console.log(i)
	}
}

arr[6]()	// 10
console.log(i)	// 10
</pre>
在 for 循环中用 var 声明 i 变量时，for 循环不存在块级作用域，所以里面的一级函数体不会变成闭包函数，那么函数体被调用时会沿着作用域链向上一级查找变量 i，但 i 是用 var 声明的，所以 i 变量也就是全局下的变量，在 arr[6] 被调用时，函数体执行，从全局中寻找变量 i，但经过 for 循环之后，变量 i 已经被多次覆盖了，所以 arr[6] 得到的值是 for 循环最后一次循环的结果

**使用 let 声明**
<pre>
var arr = []

for (let i = 0; i < 10; i++) {	// 因为使用let使得for循环为块级作用域，此次let i=0在这个块级作用域中，而不是在全局环境中
	arr[i] = function () {	// 变成闭包函数体
		console.log(i)
	}
}

arr[6]()	// 6
console.log(i)	// 报错
</pre>
在 for 循环中用 let 声明 i 变量时，每一次循环都会生成一个块级作用域 {...}，并且每个域之间互不影响，所以在 arr[6] 调用时执行的是下面的代码块，并且拥有独立的作用域，在加上此时的函数体变成了闭包体，所以该代码块内的作用域不会被销毁：
<pre>
{
	let i = 6
	arr[6] = function () {
		console.log(i)
	}
}
</pre>
当 arr[6] 执行时，函数体会去上一级作用域里面查找变量 i，正好这个上一级的作用域又没有被销毁，所以 arr[6] = 6


## 2、不存在变量提升 ##
let 不像 var 那样会存在“变量提升”现象，所以变量一定要在声明之后使用，否则报错
<pre>
console.log(a)	// undefined
var a = 1;

console.log(b)	// 报错
let b = 2;
</pre>


## 3、暂时性死区 ##
在代码块内，如果使用 let（或者const）声明的变量，不管该变量是否在上一级作用域或者全局下存在，在使用该变量时，都必须在 let（或者const）声明之后，否则报错
<pre>
var num = 123;

if (true) {
	num = 456;	// 报错
	let num;
}
</pre>


## 4、在相同作用域内不能重复声明同一变量 ##
<pre>
var a = 1;
let a = 2;	// 报错
</pre>
<pre>
function fn (arg) {	// 相当于 var arg = undefined
	let arg;	// 报错
}

fn()
</pre>
<pre>
function fn (arg) {	
	for (let arg = 0; arg &lt; 10; arg++) {	// 不会报错
		console.log(arg)
	}
}

fn()	
</pre>
总之，ES6规定的不存在变量提升、重复声明、暂时性死区等，都是会了在程序编写和运行过程中减少意料之外的错误发生


# 块级作用域 #
ES5 只有全局作用域和函数作用域，不存在块级作用域，这样就带来和很多不合理的情况，比如：

1. 由于变量提升导致内层变量覆盖外层变量
	<pre>
	var num = 10;
	
	function fn () {	
		console.log(num)	// undefined
		if (true) {
			var num = 20;
			console.log(num)	// 20
		}
	}
	
	fn()		
	</pre>
	使用 let 修正
	<pre>
	var num = 10;
	
	function fn () {	
		console.log(num)	// 10
		if (true) {
			let num = 20;
			console.log(num)	// 20
		}
	}
	
	fn()			
	</pre>

2. 变量泄漏
<pre>
for (var i = 0; i < 10; i++) {}

console.log(i)	// 10
</pre>


## 全局对象的属性 ##
看下面的列子：
<pre>
var a = 1;
let b = 2;

console.log(window.a)	// 1
console.log(window.b)	// undefined
</pre>

ES6 规定，为了避免不知不觉创建创建变量，使用 let 或者 const 声明的变量不在挂载到 window 对象下面


# 总结 #
- let 声明的变量会生成块级作用域，并且该变量仅在该域内有效
- let 声明不存在变量提升，必须在声明之后使用
- let 不能在相同作用域下重复声明同一变量
- let 存在暂时性死区（不管该变量是否在上一级作用域或者全局下存在，在使用该变量时，都必须在声明之后使用）
- let 在全局下声明的变量不在挂载到 window 对象下面
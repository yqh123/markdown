# const 声明 #
用来声明一个常量，它除了拥有 let 声明的全部特点外，还有以下特点：

## 声明必须赋值，并且值或者引用地址不能改变 ##
**基本类型：值不能改变**
<pre>
const num;	// 报错
</pre>
<pre>
const num = 1;

num = 2;	// 报错
</pre>

**引用类型：引用地址不能改变**
<pre>
const obj = {
	name: &#x27;小明&#x27;,
	age: 24
}

obj.age = 25;

obj = {}	// 报错
</pre>


## 全局对象的属性 ##
看下面的列子：
<pre>
var a = 1;
const b = 2;

console.log(window.a)	// 1
console.log(window.b)	// undefined
</pre>

ES6 规定，为了避免不知不觉创建创建变量，使用 let 或者 const 声明的变量不在挂载到 window 对象下面


# 总结 #
- const 声明的变量会生成块级作用域，并且该变量仅在该域内有效
- const 声明不存在变量提升，必须在声明之后使用
- const 不能在相同作用域下重复声明同一变量
- const 存在暂时性死区（不管该变量是否在上一级作用域或者全局下存在，在使用该变量时，都必须在声明之后使用）
- const 声明必须赋值，并且值或者引用地址不能改变
- const 在全局下声明的变量不在挂载到 window 对象下面
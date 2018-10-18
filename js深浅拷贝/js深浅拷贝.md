# JS浅拷贝和深拷贝详解 #
> 如何区分深拷贝与浅拷贝，简单点来说，就是假设B复制了A，当修改A时，看B是否会发生变化，如果B也跟着变了，说明这是浅拷贝，如果B没变，那就是深拷贝。
> 
> 在js中，对于非基本类型数据（普通对象或数组），浅拷贝只是拷贝了内存地址，子类属性指向父类属性的内存地址，而子类修改后父类也会被修改。
> 
> 为什么要了解深浅拷贝，因为在多人协作处理同一数据时，你操作这个数据的时候，不能影响其他人。例如后台返回了一堆数据，你需要对这堆数据做操作，但多人开发情况下，你是没办法明确这堆数据是否有其它功能也需要使用，直接修改可能会造成隐性问题，所以这个时候，你对数据的修改就需要先拷贝下来，并且修改你的数据的时候，不能影响原有数据。


## 数组的深拷贝 ##
<pre>
var a = [1,2,3]
var b = a.slice()	

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
var b = JSON.stringify(a)
	b = JSON.parse(b)

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


# 深拷贝函数封装 #
<pre>
function extend(obj) {
	var newObj
	// obj不能是 null、undefined、函数 以外的数据类型
	if (obj && typeof obj !== 'function' && typeof obj === 'object') {
		newObj = JSON.parse( JSON.stringify(obj) )
	} else {
		newObj = obj
	}
	return newObj
}
</pre>






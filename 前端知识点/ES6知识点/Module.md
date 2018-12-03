# 模块化 #
历史上，javascript 一直没有实现模块化，无法将一个大程序拆分成相互依赖的小文件，在用简单的方法拼接起来。在 ES6 之前，社区制定了一些模块加载方案，最主要的就是 CommonJs 和 AMD、CMD，这三种，CommonJs 主要用于服务器的模块化开发（比如 NodeJs），后两者主要用于浏览器的模块化开发。

ES6 在语言规格层面上实现了模块功能，而且实现得相当简单，完全可以取到服务端和浏览器端的现有模块化解决方案，成为浏览器和服务器通用的模块解决方案。

在 ES6 前， 前端就使用 RequireJS 或者 seaJS 实现模块化， requireJS 是基于 AMD 规范的模块化库，而像 seaJS 是基于 CMD 规范的模块化库，两者都是为了为了推广前端模块化的工具。

现在 ES6 自带了模块化，也是 JS 第一次支持 module，在很久以后 ，我们可以直接通过 import 和export 在浏览器中导入和导出各个模块了，一个js文件代表一个js模块；现代浏览器对模块(module)支持程度不同，目前都是使用 babelJS，或者 Traceur 把 ES6 代码转化为兼容 ES5 版本的js代码;


# 编译时加载模块 #
ES6 模块的设计思想是尽量静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJs 和 AMD 模块都是在运行时确定这些东西，比如 CommonJs 模块就是对象，输入时必须查找对象属性：

<pre>
let {stat, exists, readFile} = require('fs')
</pre>

以上代码的实质是整体加载整个 fs 模块（即加载 fs 模块的所有输出的方法），然后在使用时用到3个方法，这就是典型的 “运行时加载”。

ES6 模块不是对象，而是通过 export 命令显示指定输出的代码，输入时也采用静态命令的形式

<pre>
import {stat, exists, readFile} from 'fs'
</pre>

以上代码的实质是从 fs 模块引入了3个方法，其他方法则不引入，这种加载就是典型的 “编译时加载”


# 严格模式 #
ES6 模块自动采用严格模式，不管有没有在模块头部加上 “use strict”：

- 变量必须声明后在使用
- 函数参数不能有同名属性
- 不能使用 with 语句
- 不能使用 arguments.callee 或者 arguments.caller
- 禁止 this 指向全局变量
- 增加了一些保留字，比如 protected、static interface 等
- ......


# export 输出命令 #
模块的主要功能就是输入和输出，export 主要用于输出，import 主要用于输入。

一个模块就是一个独立的文件，该文件的内部方法或者变量，外部是无法直接获取的，必须通过 export 向外输出，然后其他模块在通过 import 引入到自己内部使用。

<pre>
export const name = '小明';
export const age = 20;
export const getName = function() {......}
</pre>

除了上面的这种直接输出外，export 还可以这样写：

<pre>
let name = '小明'';
let age = 20;

export {name, age}
</pre>

下面这种写法是比较好的，因为在模块的末尾一眼就可以看到该模块向外输出了哪些内容，不过这也视情况而定，在有些场景下，反而第一种写法比较合适，比如输出很多 API 请求接口：

<pre>
export const getUserName = function() {};
export const getUserAge = function() {};
......
</pre>

这样写主要是方便后期添加或者删除默写方法时，不用去删除两次，或者添加时还要在末尾继续输出模块，总之用哪一种方式看自己的业务场景。


## as 输出变量重命名 ##
一般情况下，输出的变量名就是本来的名字，比如下面的写法：

<pre>
const getUserName = function() {};
const getUserAge = function() {};

export {
  getUserName,
  getUserAge
}
</pre>

但你也可以改变输出的名字：

<pre>
const getUserName = function() {};
const getUserAge = function() {};

export {
  userName as getUserName,
  userAge as getUserAge
}
</pre>


# import 单个导入命令 #
使用 export 命令输出该模块的对外接口后，就可以通过 import 单个引入该模块的对外接口，需要用到什么方法或者变量就引入什么方法或者变量：

export.js
<pre>
let name = '小明'';
let age = 20;

export {name, age}
</pre>

import.js
<pre>
import {name} from './export.js'	
console.log(name)	// 小明
</pre>


# import 整体导入命令 #

1. 使用 * 号整体导入全部通过 export 对外输出的接口
	**export.js**
	<pre>
	let name = '小明'';
	let age = 20;
	
	export {name, age}
	</pre>
	
	**import.js**
	<pre>
	import * as userInfo from './export.js'	
	console.log(userInfo)	// {name: '小明', age: 20}
	</pre>

2. 使用 module 命令整体导入全部通过 export 对外输出的接口
	**export.js**
	<pre>
	let name = '小明'';
	let age = 20;
	
	export {name, age}
	</pre>
	
	**import.js**
	<pre>
	module userInfo from './export.js'	
	console.log(userInfo)	// {name: '小明', age: 20}
	</pre>	



## 模块提升 ##
值得一提的是，在 ES6 的规范中，都是不支持变量提示的，但是在模块加载时，却是可以的，因为在文件编译时，会把 import 命令提示到整个模块头部先执行：

<pre>
console.log(name)	// 小明
import {name} from './export.js'	
</pre>


# export default 默认输出 #
从前面的例子可以看到，import 在导入模块时，需要指定导入的变量名，要么你就整体导入。但为了方便，可以使用 export default 去默认输出，用 import 引入时，可以自己自定义指定使用的名称：

export.js
<pre>
export default {
	name: '小明',
	age: 20
}
</pre>

import.js
<pre>
import userInfo from './export.js'
console.log(userInfo)	// {name: '小明', age: 20}
</pre>

可以看到，如果输出是采用 export default 时，在 import 引入的时候，不需要使用大括号 {} 去指定引入那个变量，相当于全部引入了该模块的默认输出。因为一个模块只允许你默认输出一个变量，export default 不能使用多次，所以，import 不需要使用大括号，它也只可能对应一个变量。


# 模块的继承 #
模块与模块之间是可以继承的，假设有一个 a 模块和 b 模块：

a.js
<pre>
export const name = '小明';
export const age = 20;
</pre>

b.js（b 模块引入 a 模块）；
<pre>
export * from './a.js'		// 引入 a 模块的所有输出的变量
export const sex = '女';
</pre>

<pre>
export {name as userName} from './a.js'		// 引入 a 模块的 name 变量，并将其改名为userName 
export const sex = '女';
</pre>

c.js => c 模块现在引入 b 模块：
<pre>
import {name, age, sex} from './b.js'

console.log(name)	// 小明
console.log(age)	// 20
console.log(sex)	// 女
</pre>


# export 输出是动态的 #
如果异步去动态的改变原本输出的值会怎么样呢？

<pre>
let name = '小明';

setTimeout(function(){
  name = '小红'
}, 1000)

export {
  name
}
</pre>

export 语句输出的值是动态绑定的，绑定其所在的模块。上面代码表示，该模块输出变量 name=小明，1s 后变成 name=小红。那么请问，其他模块如果引入了该模块，name 的值在其他模块是什么？

答案是，其他模块中先得到的 name 值初始时是 “小明”，等 1s 后，这个值就在该引入的模块中变成了 “小红”，也就是说，在其他模块中，1s 钟之前，使用 name 这个变量的话，是 “小明”，但 1s 后在使用这个变量时，就是 “小红” 了。原因请往下继续看。


# ES6 模块加载的实质 #
先来看一下 CommonJs 模块的加载实质：

a.js
<pre>
var num = 1;
function addNum() {
  num++
}

module.exports = {
  num: num,
  addNum: addNum
}
</pre>

b.js
<pre>
var getNum = require(./a.js).num;
var getAddNum = require(./a.js).addNum;

console.log(getNum)	// 1
getAddNum()
console.log(getNum)	// 1
</pre>

从上面的代码可以看出，CommonJs 模块的输入的值，是被输出的值的一种拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值了，你也可以看做是在 b 模块中，新开辟的内存中，通过导入得到的变量 getNum 有自己的内存空间，和 a 模块的 num 没有任何关系，它是只是拷贝了一份 a 模块 num 的值而已。

ES6 的加载机制则和 CommonJs 完全不同，它遇到了 import 命令时不会执行模块，而是生成了一个只读的引入，等到真正需要用到该引入的模块时，会通过这个引入去读取引用模块里面的值：

a.js
<pre>
export const num = 1;
export const addNum = function() {
  num++
}
</pre>

b.js
<pre>
import {num, addNum} from './a.js'

console.log(num)  // 1
addNum()  
console.log(num)  // 2
</pre>

所以可以看出，ES6 模块的加载机制是活的，通过 import 引入其他模块时，被引入的模块的内部变化是会实时的体现在引入模块的内部的。

由于 ES6 输入的模块变量只是一个 “符号链接”，所以输入的变量是只读的，对它进行重新赋值是会报错的：

<pre>
import {obj} from './a.js'

console.log(obj)	// {name: '小明', age: 20}
obj.name = '小红';	// OK
obj = {}		// 报错
</pre>



# ES6 模块的缓存 #
和 CommonJs 模块一样，模块只加载一次，下一次再去 import 导入同一个模块时，它是不会在加载了，而是从内存中直接读取。
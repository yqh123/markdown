# 模块化的由来 #
在JavaScript发展初期就是为了实现简单的页面交互逻辑，寥寥数语即可；如今CPU、浏览器性能得到了极大的提升，很多页面逻辑迁移到了客户端（比如表单验证等），随着web2.0时代的到来，Ajax技术得到广泛应用，jQuery等前端库层出不穷，前端代码日益膨胀。

这时候JavaScript作为嵌入式的脚本语言的定位动摇了，JavaScript却没有为组织代码提供任何明显帮助，甚至没有类的概念，更不用说模块（module）了，JavaScript极其简单的代码组织规范不足以驾驭如此庞大规模的代码。


# 模块 #
既然JavaScript不能管理如此大规模的代码，我们可以借鉴一下其它语言是怎么处理大规模程序设计的，在Java中有一个重要带概念——package，逻辑上相关的代码组织到同一个包内，包内是一个相对独立的王国，不用担心命名冲突什么的，那么外部如果使用呢？直接import对应的package即可。

遗憾的是JavaScript在设计时定位原因，没有提供类似的功能，开发者需要模拟出类似的功能，来隔离、组织复杂的JavaScript代码，我们称为模块化。

一个模块就是实现特定功能的文件，有了模块，我们就可以更方便地使用别人的代码，想要什么功能，就加载什么模块。模块开发需要遵循一定的规范，各行其是就都乱套了

规范形成的过程是痛苦的，前端的先驱在刀耕火种、茹毛饮血的阶段开始，发展到现在初具规模，简单了解一下这段不凡的历程


## 函数封装 ##
我们在讲函数的时候提到，函数一个功能就是实现特定逻辑的一组语句打包，而且JavaScript的作用域就是基于函数的，所以把函数作为模块化的第一步是很自然的事情，在一个文件里面编写几个相关函数就是最开始的模块了。
<pre>
function fn1(){
  statement
}

function fn2(){
  statement
}
</pre>
这样在需要的以后夹在函数所在文件，调用函数就可以了;这种做法的缺点很明显：污染了全局变量，无法保证不与其他模块发生变量名冲突，而且模块成员之间没什么关系。


## 对象 ##
为了解决上面问题，对象的写法应运而生，可以把所有的模块成员封装在一个对象中
<pre>
var myModule = {
  var1: 1,
  var2: 2,
  fn1: function(){

  },
  fn2: function(){

  }
}
</pre>
这样避免了变量污染，只要保证模块名唯一即可，同时同一模块内的成员也有了关系。看似不错的解决方案，但是也有缺陷，外部可以随意修改内部成员。


## 立即执行函数 ##
可以通过立即执行函数，来达到隐藏细节的目的，让模块函数更安全
<pre>
var myModule = (function(){
  var a = 1;
  var b = 2;
  function fn1 () { alert(a) }
  function fn2 () { alert(b) }
  return {
    fn1: fn1,
    fn2: fn2
  }
})()
</pre>
这样在模块外部无法修改我们没有暴露出来的变量、函数；上述做法就是我们模块化的基础，目前，通行的JavaScript模块规范主要有两种：CommonJS和AMD


# CommonJS #
我们先从CommonJS谈起，因为在网页端没有模块化编程只是页面JavaScript逻辑复杂，但也可以工作下去，在服务器端却一定要有模块，所以虽然JavaScript在web端发展这么多年，第一个流行的模块化规范却由服务器端的JavaScript应用带来，CommonJS规范是由NodeJS发扬光大，这标志着JavaScript模块化编程正式登上舞台。

**定义模块**

根据CommonJS规范，一个单独的文件就是一个模块。每一个模块都是一个单独的作用域，也就是说，在该模块内部定义的变量，无法被其他模块读取，除非定义为global对象（nodeJS全局对象）的属性。

**输出模块**

模块只有一个出口，module.exports对象，我们需要把模块希望输出的内容放入该对象。

**加载模块**

加载模块使用require方法，该方法读取一个文件并执行，返回文件内部的module.exports对象

<pre>
//模块定义 myModel.js
var name = 'Byron';

function printName(){
  console.log(name);
}

function printFullName(firstName){
  console.log(firstName + name);
}

module.exports = {
  printName: printName,
  printFullName: printFullName
}

//加载模块
var nameModule = require('./myModel.js');
nameModule.printName();
</pre>

**尴尬的浏览器**

仔细看上面的代码，会发现require是同步的。模块系统需要同步读取模块文件内容，并编译执行以得到模块接口。这在服务器端实现很简单，也很自然，然而，想在浏览器端实现问题却很多。

浏览器端，加载JavaScript最佳、最容易的方式是在document中插入script标签。但脚本标签天生异步，传统CommonJS模块在浏览器环境中无法正常加载。

解决思路之一是，开发一个服务器端组件，对模块代码作静态分析，将模块与它的依赖列表一起返回给浏览器端。 这很好使，但需要服务器安装额外的组件，并因此要调整一系列底层架构。

另一种解决思路是，用一套标准模板来封装模块定义，但是对于模块应该怎么定义和怎么加载，又产生的分歧。


# AMD #
AMD 即Asynchronous Module Definition，中文名是异步模块定义的意思。它是一个在浏览器端模块化开发的规范。由于不是JavaScript原生支持，使用AMD规范进行页面开发需要用到对应的库函数，也就是大名鼎鼎RequireJS，实际上AMD 是 RequireJS 在推广过程中对前端模块定义的规范化的产出。

requireJS主要解决两个问题：

1. 多个js文件可能有依赖关系，被依赖的文件需要早于依赖它的文件加载到浏览器 
2. 模块需要异步加载（js加载的时候浏览器会停止页面渲染，加载依赖文件件越多，页面失去响应时间越长）

<pre>
// 定义模块 myModule.js
define(['jquery'], function(){
    var name = 'Byron';
    function printName(){
        console.log(name);
    }

    return {
        printName: printName
    };
});

// 加载模块
require(['myModule'], function (my){
　 my.printName();
});
</pre>

require()函数在加载依赖的函数的时候是异步加载的，这样浏览器不会失去响应，它指定的回调函数，只有前面的模块都加载成功后，才会运行，解决了依赖性和异步加载的问题。

看一下AMD规范你会发现，AMD基本都是提前说明依赖模块，然后预加载这些模块，实际上这就要求你提前想好这些依赖，提前写好，不然写代码过程中要回到开头继续添加依赖。


# CMD #
CMD 即Common Module Definition通用模块定义，CMD规范是国内发展出来的（淘宝的玉伯大牛），就像AMD有个requireJS，CMD有个浏览器的实现SeaJS，SeaJS要解决的问题和requireJS一样，只不过在模块定义方式和模块加载（可以说运行、解析）时机上有所不同。

ps：不清楚是不是针对 AMD 规范的依赖前置加载问题，淘宝的玉伯大牛才开发出的 CMD 规范。

CMD推崇：

1. 一个文件一个模块，所以经常就用文件名作为模块id
2. CMD推崇依赖就近，所以一般不在define的参数中写依赖，在factory中写

factory是一个函数，有三个参数，function(require, exports, module)

1. require 是一个方法，接受 模块标识 作为唯一参数，用来获取其他模块提供的接口：require(id)
2. exports 是一个对象，用来向外提供模块接口
3. module 是一个对象，上面存储了与当前模块相关联的一些属性和方法

<pre>
// 定义模块  myModule.js
define(function(require, exports, module) {
  var $ = require('jquery.js')	// require函数是同步的，需要加载完之后才会执行下面的代码
  $('div').addClass('active');
});

// 加载模块
seajs.use(['myModule.js'], function(my){

});
</pre>


# AMD 与 CMD 共同点 #
1. 解决依赖问题
2. 解决异步加载问题

# AMD 与 CMD 的区别 #
- AMD：依赖前置，在定义模块的时候就要声明其依赖的模块 
- CMD：就近依赖，只有在用到某个模块的时候再去require 

AMD和CMD最大的区别是**对依赖模块的执行时机处理**不同，注意不是加载的时机或者方式不同

很多人说requireJS是异步加载模块，SeaJS是同步加载模块，这么理解实际上是不准确的，其实加载模块都是异步的，只不过AMD依赖前置，js可以方便知道依赖模块是谁，立即加载，而CMD就近依赖，在你用到时，在去加载依赖模块，这也是很多人诟病CMD的一点，牺牲性能来带来开发的便利性，实际上解析模块用的时间短到可以忽略。

同样都是异步加载模块，AMD在加载模块完成后就会执行该模块，所有模块都加载执行完后会进入require的回调函数，执行主逻辑，这样的效果就是依赖模块的执行顺序和书写顺序不一定一致，看网络速度，哪个先下载下来，哪个先执行，但是主逻辑一定在所有依赖加载完成后才执行。

CMD加载完某个依赖模块后并不执行，只是下载而已，在所有依赖模块加载完成后进入主逻辑，遇到require语句的时候才执行对应的模块，这样模块的执行顺序和书写顺序是完全一致的。


# AMD 与 CMD 性能 #
- AMD：用户体验好，因为没有延迟，依赖模块提前执行了
- CMD：性能好，因为只有用户需要的时候才执行


# ES6 模块化 #
算是 javascript 第一次支持模块化。只是目前很多浏览器还不支持，所以需要使用babelJS， 或者Traceur把ES6代码转化为兼容ES5版本的js代码。

**ES6的模块化的基本规则或特点：**

1. 每一个模块只加载一次， 每一个JS只执行一次， 如果下次再去加载同目录下同文件，直接从内存中读取。
2. 每一个模块内声明的变量都是局部变量，不会污染全局作用域；
3. 模块内部的变量或者函数可以通过export导出，再用 import 引入（支持全局引入和单个引入）；
4. 一个模块可以导入别的模块
5. 具体请查阅 ES6 模块化相关知识
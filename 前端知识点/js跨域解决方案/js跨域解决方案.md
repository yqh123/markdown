# js中几种实用的跨域方法原理详解 #
这里说的js跨域是指通过js在不同的域之间进行数据传输或通信，比如用ajax向一个不同的域请求数据，或者通过js获取页面中不同域的框架中(iframe)的数据。只要协议、域名、端口有任何一个不同，都被当作是不同的域。这种限制也叫做**“同源策略”**


# 什么是同源策略 #
它是一种安全机制，就是你通过程序去传输数据或者通信时，必须要遵守的规则（协议、域名、端口必须一致）：

<table>
	<thead>
		<tr>
			<th>URL</th>
			<th>说明</th>
			<th>是否允许通信</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>
				http://www.a.com/a.js<br>
				http://www.a.com/a.js
			</td>
			<td>同一域名下</td>
			<td>允许</td>
		</tr>
		<tr>
			<td>
				http://www.a.com/lab/a.js<br>
				http://www.a.com/script/b.js
			</td>
			<td>同一域名下不同文件夹</td>
			<td>允许</td>
		</tr>
		<tr>
			<td>
				http://www.a.com:8000/a.js<br>
				http://www.a.com/b.js
			</td>
			<td>同一域名，不同端口</td>
			<td>不允许</td>
		</tr>
		<tr>
			<td>
				http://www.a.com/a.js<br>
				https://www.a.com/b.js
			</td>
			<td>同一域名，不同协议</td>
			<td>不允许</td>
		</tr>
		<tr>
			<td>
				http://www.a.com/a.js<br>
				http://70.32.92.74/b.js
			</td>
			<td>域名和域名对应ip</td>
			<td>不允许</td>
		</tr>
		<tr>
			<td>
				http://www.a.com/a.js<br>
				http://script.a.com/b.js
			</td>
			<td>主域相同，子域不同</td>
			<td>不允许</td>
		</tr>
		<tr>
			<td>
				http://www.a.com/a.js<br>
				http://a.com/b.js
			</td>
			<td>同一域名，不同二级域名（同上）</td>
			<td>不允许</td>
		</tr>
		<tr>
			<td>
				http://www.cnblogs.com/a.js<br>
				http://www.a.com/b.js
			</td>
			<td>不同域名</td>
			<td>不允许</td>
		</tr>
	</tbody>
</table>

**特别注意两点**

1. 如果是协议和端口造成的跨域问题，前台是无能为力的
2. 在跨域问题上，域仅仅是通过“URL的首部”来识别而不会去尝试判断相同的ip地址对应着两个域或两个域是否在同一个ip上。



# 为什么浏览器要限制跨域访问呢？ #
> 原因就是安全问题：如果一个网页可以随意地访问另外一个网站的资源，那么就有可能在客户完全不知情的情况下出现安全问题。比如下面的操作就有安全问题：

1. 用户访问www.mybank.com ，登陆并进行网银操作，这时cookie啥的都生成并存放在电脑硬盘里面
2. 用户突然想起件事，并迷迷糊糊地访问了一个邪恶的网站 www.xiee.com
3. 该网站就可以在它的页面中，拿到银行的cookie，比如用户名，登陆token等，然后发起对www.mybank.com 的操作。
4. 如果这时浏览器不予限制，并且银行也没有做响应的安全处理的话，那么用户的信息有可能就这么泄露了。


# 为什么要跨域？ #
既然有安全问题，那为什么又要跨域呢？ 有时公司内部有多个不同的子域，比如一个是location.company.com ,而应用是放在app.company.com , 这时想从 app.company.com去访问 location.company.com 的资源就属于跨域



# 通过 jsonp 跨域 #
> 在js中，我们直接用XMLHttpRequest请求不同域上的数据时，是不可以的。但是，在页面上引入不同域上的js脚本文件却是可以的，jsonp正是利用这个特性来实现的。这需要前后端配合。

比如，有个a.html页面，它里面的代码需要利用ajax获取一个不同域上的json数据，假设这个json数据地址是http://example.com/data.php,那么a.html中的代码就可以这样：

<pre>
&lt;script&gt;
function dosomething (data) {
  // data 参数就是后端返回的数据 
}
&lt;/script&gt;
&lt;script src=&quot;http://example.com/data.php?callback=dosomething&quot;&gt;&lt;/script&gt;
</pre>

我们看到获取数据的地址后面还有一个callback参数，按惯例是用这个参数名，但是你用其他的也一样。当然如果获取数据的jsonp地址页面不是你自己能控制的，就得按照提供数据的那一方的规定格式来操作了，也就是需要后端告诉你callback执行的函数名。

因为是当做一个js文件来引入的，所以http://example.com/data.php返回的必须是一个能执行的js文件，所以这个页面的php代码可能是这样的:

<pre>
&lt;?php
$callback = $_GET[&#x27;callback&#x27;]	// 得到回调函数名
$data = array(&#x27;a&#x27;,&#x27;b&#x27;,&#x27;c&#x27;)	// 要返回的数据
echo $callback.&#x27;(&#x27;.json_encode($data).&#x27;)&#x27;	// 输出数据
?&gt;
</pre>

最终那个页面输出的结果是:

<pre>
&lt;script&gt;
function dosomething (data) {
  console.log(data)	// ['a','b','c']
}
&lt;/script&gt;
</pre>

所以通过http://example.com/data.php?callback=dosomething得到的js文件，就是我们之前定义的dosomething函数,并且它的参数就是我们需要的json数据，这样我们就跨域获得了我们需要的数据。

这样jsonp的原理就很清楚了，通过script标签引入一个js文件，这个js文件载入成功后会执行我们在url参数中指定的函数，并且会把我们需要的json数据作为参数传入。所以jsonp是需要服务器端的页面进行相应的配合的。

知道jsonp跨域的原理后我们就可以用js动态生成script标签来进行跨域操作了，而不用特意的手动的书写那些script标签。如果你的页面使用jquery，那么通过它封装的方法就能很方便的来进行jsonp操作了。

原理是一样的，只不过我们不需要手动的插入script标签以及定义回掉函数。jquery会自动生成一个全局函数来替换callback=?中的问号，之后获取到数据后又会自动销毁，实际上就是起一个临时代理函数的作用。$.getJSON方法会自动判断是否跨域，不跨域的话，就调用普通的ajax方法；跨域的话，则会以异步加载js文件的形式来调用jsonp的回调函数。

<pre>
$.getJSON(&#x27;http://example.com/data.php?callback=?&#x27;, function(json) {
  // 处理获得的json数据
});
</pre>

**JSONP的缺点主要源自他的script引用资源方式，JSONP的缺点如下**：

1. JSONP是通过script标签获取资源的，也就是说JSONP注定只能用GET的方式访问资源，GET以外的请求无法做到；
2. JSONP是通过src引用不同源的代码，如果其他域的代码存在恶意代码，那么这将造成严重的网络安全，如果需要跨域的服务器不足以信任，那么必须放弃JSONP；
3. 要确定JSONP请求是否成功，需要启动一个计时器监测数据变动。



# 通过修改 document.domain 来跨子域(只适用于不同子域的框架间的交互) #
浏览器都有一个同源策略，其限制之一就是第一种方法中我们说的不能通过ajax的方法去请求不同源中的文档。 它的第二个限制是浏览器中不同域的框架之间是不能进行js的交互操作的。**所以js不能访问不同域的 iFrame 中的内容**。

**有一点需要说明，不同的框架之间（父子或同辈），是能够获取到彼此的window对象的，但蛋疼的是你却不能使用获取到的window对象的属性和方法**(html5中的postMessage方法是一个例外，还有些浏览器比如ie6也可以使用top、parent等少数几个属性)，总之，你可以当做是只能获取到一个几乎无用的window对象。比如，有一个页面，它的地址是http://www.example.com/a.html  ， 在这个页面里面有一个iframe，它的src是http://example.com/b.html, 很显然，这个页面与它里面的iframe框架是不同域的，所以我们是无法通过在页面中书写js代码来获取iframe中的东西的：

<pre>
&lt;script&gt;
function onLoadFn () {
	var iframe = document.getElementById(&#x27;iframe&#x27;)
	var win = iframe.contentWindow;	// 这里可以获取到iframe里面的window对象
	var doc = win.document;	// 但是无法获取跨域的iframe里面的document对象
	var name = win.name;	// 无法获取跨域iframe的window对象的name属性
}
&lt;/script&gt;

&lt;iframe id=&quot;iframe&quot; src=&quot;http://example.com/b.html&quot; onload=&quot;onLoadFn()&quot;&gt;&lt;/iframe&gt;
</pre>

这个时候，document.domain就可以派上用场了，我们只要把http://www.example.com/a.html 和 http://example.com/b.html这两个页面的document.domain都设成相同的域名就可以了。但要注意的是，document.domain的设置是有限制的，我们只能把document.domain设置成自身或更高一级的父域，且主域必须相同。

例如：a.b.example.com 中某个文档的document.domain 可以设成a.b.example.com、b.example.com 、example.com中的任意一个，但是不可以设成 c.a.b.example.com,因为这是当前域的子域，也不可以设成baidu.com,因为主域已经不相同了。<br>

**在页面 http://www.example.com/a.html 中设置document.domain:**

<pre>
&lt;iframe id=&quot;iframe&quot; src=&quot;http://example.com/b.html&quot; onload=&quot;test()&quot;&gt;&lt;/iframe&gt;

&lt;script&gt;
document.domain = &#x27;example.com&#x27;
function test () {
	var iframe = document.getElementById(&#x27;iframe&#x27;)
	console.log(iframe.contentWindow.document)	// 可以获取到跨域页面的document对象了
}
&lt;/script&gt;
</pre>

在页面 http://example.com/b.html 中也设置document.domain，而且这也是必须的，虽然这个文档的domain就是example.com,但是还是必须显示的设置document.domain的值才行：

<pre>
document.domain = &#x27;example.com&#x27;	
</pre>

这样我们就可以通过js访问到iframe中的各种属性和对象了。

**不过如果你想在 http://www.example.com/a.html 页面中通过ajax直接请求 http://example.com/b.html 页面，即使你设置了相同的document.domain也还是不行的，所以修改document.domain的方法只适用于不同子域的框架间的交互**。

如果你想通过ajax的方法去与不同子域的页面交互，除了使用jsonp的方法外，还可以用一个隐藏的iframe来做一个代理。原理就是让这个iframe载入一个与你想要通过ajax获取数据的目标页面处在相同的域的页面，所以这个iframe中的页面是可以正常使用ajax去获取你要的数据的，然后就是通过我们刚刚讲得修改document.domain的方法，让我们能通过js完全控制这个iframe，这样我们就可以让iframe去发送ajax请求，然后收到的数据我们也可以获得了。



# 使用 window.name 来进行跨域 #
window对象有个name属性，该属性有个特征：即在一个窗口(window)的生命周期内,窗口载入的所有的页面都是共享一个window.name的，每个页面对window.name都有读写的权限，window.name是持久存在一个窗口载入过的所有页面中的，并不会因新页面的载入而进行重置。(这里和上面的跨域访问window对象是有区别的，这个窗口不是同时存在两个跨域页面的，而是单独存在某一个页面，你可以通过跳转同一窗口的方式去访问同一个window对象)。

比如：有一个页面a.html,它里面有这样的代码：
<pre>
window.name = &#x27;我是a页面的数据&#x27;	//设置a页面的window.name属性
setTimeout(function() {		// 3秒后这个窗口重定向到b页面
	window.location = &#x27;b.html&#x27;
}, 3000)
</pre>

再看看b.html页面的代码：
<pre>
alert(window.name)	// 我是a页面的数据
</pre>

我们看到在b.html页面上成功获取到了它的上一个页面a.html给window.name设置的值。如果在之后所有载入的页面都没对window.name进行修改的话，那么所有这些页面获取到的window.name的值都是a.html页面设置的那个值。当然，如果有需要，其中的任何一个页面都可以对window.name的值进行修改。注意，window.name的值只能是字符串的形式，这个字符串的大小最大能允许2M左右甚至更大的一个容量，具体取决于不同的浏览器，但一般是够用了。

上面的例子中，我们用到的页面a.html和b.html是处于同一个域的，不过即使a.html与b.html处于不同的域中，上述结论同样是适用的，这也正是利用window.name进行跨域的原理。

下面就来看一看具体是怎么样通过window.name来跨域获取数据的。还是举例说明。

比如有一个www.example.com/a.html页面,需要通过a.html页面里的js来获取另一个位于不同域上的页面www.cnblogs.com/data.html里的数据。

www.cnblogs.com/data.html 页面里的代码很简单，就是给当前的window.name设置一个a.html页面想要得到的数据值。www.cnblogs.com/data.html 里的代码：

<pre>
window.name = '我是www.cnblogs.com/data.html页面提供的数据'
</pre>

那么在a.html页面中，我们怎么把data.html页面载入进来呢？显然我们不能直接在a.html页面中通过改变window.location来载入data.html页面，因为我们想要即使a.html页面不跳转也能得到data.html里的数据。答案就是在a.html页面中使用一个隐藏的iframe来充当一个中间人角色，由iframe去获取data.html的数据，然后a.html再去得到iframe获取到的数据。 

充当中间人的iframe想要获取到data.html的通过window.name设置的数据，只需要把这个iframe的src设为www.cnblogs.com/data.html就行了。然后a.html想要得到iframe所获取到的数据，也就是想要得到iframe的window.name的值，还必须把这个iframe的src设成跟a.html页面同一个域才行，不然根据前面讲的同源策略，a.html是不能访问到iframe里的window.name属性的。这就是整个跨域过程。

<pre>
&lt;script&gt;
function getName () {
	var iframe = document.getElementById(&#x27;iframe&#x27;);
	iframe.onload = function() {
		var data = this.contentWindow.name;	
		console.log(data)	// 我是www.cnblogs.com/data.html页面提供的数据
	}
	iframe.src = &#x27;b.html&#x27;;		// 这个页面地址只要与a页面同源就可以，主要是让a页面能够获取隐藏的iframe里面的东西，设置成 about:blank（打开一个空白页） 也行
}
&lt;/script&gt;

&lt;iframe id=&quot;iframe&quot; style=&quot;display: none;&quot; src=&quot;www.cnblogs.com/data.html&quot; onload=&quot;getName()&quot;&gt;&lt;/iframe&gt;
</pre>

上面的代码只是最简单的原理演示代码，你可以对使用js封装上面的过程，比如动态的创建iframe,动态的注册各种事件等等，当然为了安全，获取完数据后，还可以销毁作为代理的iframe。



# 使用HTML5中新引进的window.postMessage方法来跨域传送数据 #
window.postMessage(message,targetOrigin)  方法是html5新引进的特性，可以使用它来向其它的window对象发送消息，无论这个window对象是属于同源或不同源，目前IE8+、FireFox、Chrome、Opera等浏览器都已经支持window.postMessage方法。  

调用postMessage方法的window对象是指要接收消息的那一个window对象，该方法的第一个参数message为要发送的消息，类型只能为字符串；第二个参数targetOrigin用来限定接收消息的那个window对象所在的域，如果不想限定域，可以使用通配符 * 。

需要接收消息的window对象，可是通过监听自身的message事件来获取传过来的消息，消息内容储存在该事件对象的data属性中。

上面所说的向其他window对象发送消息，其实就是指一个页面有几个框架的那种情况，因为每一个框架都有一个window对象。在讨论第二种方法的时候，我们说过，不同域的框架间是可以获取到对方的window对象的，而且也可以使用window.postMessage这个方法。下面看一个简单的示例，有两个页面：

**这个是a页面： http://test.com/a.html**
<pre>
function onLoadFn () {
  var iframe = document.getElementById(&#x27;iframe&#x27;);
  var win = iframe.contentWinodw;	
  win.postMessage(&#x27;我是a页面的数据&#x27;, &#x27;*&#x27;);	// 向不同域下的b页面发送数据
}
&lt;/script&gt;

&lt;iframe id=&quot;iframe&quot; src=&quot;http://www.test.com/b.html&quot; onload=&quot;onLoadFn()&quot;&gt;&lt;/iframe&gt;
</pre>

**这个是b页面： http://www.test.com/b.html**
<pre>
window.onmessage = function (e) {	// 注册message事件来接收数据
  e = e || event;	// 获取事件对象
  alert(e.data);	// 我是a页面的数据
}
</pre>

使用postMessage来跨域传送数据还是比较直观和方便的，但是缺点是IE6、IE7不支持，所以用不用还得根据实际需要来决定。<br>
不过值得一提的是，如果存在跨域，那么父域是不能够获取子域里面的DOM节点的，只能获取window的一些属性数据。<br>



# 跨域资源共享（CORS） #
CORS（Cross-Origin Resource Sharing）跨域资源共享，定义了必须在访问跨域资源时，浏览器与服务器应该如何沟通。CORS背后的基本思想就是使用自定义的HTTP头部让浏览器与服务器进行沟通，从而决定请求或响应是应该成功还是失败。

服务器端对于CORS的支持，主要就是通过设置 Access-Control-Allow-Origin 来进行的。如果浏览器检测到相应的设置，就可以允许Ajax进行跨域的访问。只需要在后台中加上响应头来允许域请求！在被请求的Response header中加入以下设置，就可以实现跨域访问了。

这些操作都是在服务端完成的。

<pre>
//指定允许其他域名访问
&#x27;Access-Control-Allow-Origin:*&#x27;//或指定域
//响应类型
&#x27;Access-Control-Allow-Methods:GET,POST&#x27;
//响应头设置
&#x27;Access-Control-Allow-Headers:x-requested-with,content-type&#x27;
</pre>



# 代理服务器 #
> 更多细节，自行百度

代理服务器解决跨域的思路是利用代理服务器对浏览器页面的请求进行转发，因为同源策略的限制只存在在浏览器中，到了服务器端就没有这个限制了。现在有很多跨域的服务端访问都是这么做的。

通俗点的理解是这样的： 

1. 客户端发起请求-----代理服务器-----服务端响应
2. 服务的返回数据-----代理服务器-----客户端拿到数据

所以代理服务器起到一个中间人的角色，由它来解决跨域的请求。


**代理服务器的优点：**

1. 资源获取是通过server端进行，可以根据需要转发的API选择使用GET以外的HTTP方法进行资源请求；
2. 请求的资源需要经过server端转发到浏览器端，server端可以对资源进行处理，因此可以避免一些直接的恶意代码，比JSONP更安全；
3. 浏览器页面正常使用Ajax请求数据，通过回调可以得知请求是否结束，不再需要使用计时器监测。

**代理服务器的缺点：**<br>
使用代理服务器的缺点是对不同源资源的转发请求，如果同时多个用户进行跨域请求，因为服务器内部需要进行额外的HTTP请求，那么服务器端的处理压力将会变大，从而导致阻塞等一系列性能问题，如需更好的方案，还是得使用Nginx等反向代理服务器进行端口代理处理。


# 客户端插件 #
现在有很多插件也可以去处理跨域的请求，他们的原理通俗点叫是下面这样的：

1. 客户端发起请求----插件把请求的域设置成服务端的同源域----服务端
2. 服务端返回数据----客户端接收数据




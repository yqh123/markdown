# JS 详解 Cookie、LocalStorage 与 SessionStorage #

## cookie ##
Cookie 是小甜饼的意思。顾名思义，cookie 确实非常小，它其实就是一些数据, 能存储于你电脑硬盘的一个文件中，这个文件通常对应于一个域名（这也是为什么cookie不能跨域访问的原因）。当 web 服务器向浏览器发送 web 页面时，在连接关闭后，服务端不会记录用户的信息，所以后端获取不到用户在浏览器中填写的用户信息。所以服务端急需一种用于解决 "如何记录客户端用户信息"的方式。<br>
当浏览器从服务器上请求 web 页面时，属于该页面的 cookie 会被添加到该请求中。服务端通过这种方式来获取用户的信息。


## localStorage ##
localStorage 是 HTML5 标准中新加入的技术，它并不是什么划时代的新东西。早在 IE 6 时代，就有一个叫 userData 的东西用于本地存储，而当时考虑到浏览器兼容性，更通用的方案是使用 Flash。而如今，localStorage 被大多数浏览器所支持，并且它是永久存在的，即使窗口或者浏览器关闭它依然存在，除非手动删除。


## sessionStorage ##
sessionStorage 与 localStorage 的接口类似，但保存数据的生命周期与 localStorage 不同。Session 这个词的意思，直译过来是“会话”。而 sessionStorage 是一个前端的概念，它只是可以将一部分数据在当前会话中保存下来，刷新页面数据依旧存在。但当窗口关闭后，sessionStorage 中的数据就会被清空。


## 关于cookie判定用户信息的问题（前后端不分离） ##

1. 用户初次访问
2. 填写用户信息
3. 用户再次访问该页面

上面两个步骤中，关于服务端如何判定用户是否登录的流程是这样的：<br>
用户第一次进入该web页面时，客户端（浏览器）向服务端发送请求，在这次请求的过程中，会把客户端的 cookie 信息以http请求头的的形式发送给服务端，而服务端会返还给客户端一个标识id，但这个标识没有带人登录的凭证，所以服务端会返还给客户端一个登录页面，让用户去填写登录信息；<br>
当用户填写完成并提交时，服务端会把之前给你的那个标识id，标记为登录状态，并保存在客户端的 cookie 信息里面，所以用户刷新页面或者重新进入该页面时，向服务端请求的信息里面（请求头中），会带有这个标识id，并且有登录状态。<br>
这里可以举一个通俗的例子：比如服务端是一个实体店，你第一次进去买东西的时候，老板会给你一张优惠卷，但是没有盖章，所以你不能用；你只有填写完你的电话、姓名等信息后，店老板才会给你的这张优惠卷上面盖章，那么你下次来的时候，就可以用了。


## 关于判定用户信息的问题（前后端分离） ##

1. 用户初次访问
2. 填写用户信息
3. 用户再次访问该页面

如果是前后端分离，那么情况则完全不同，一般的做法是通过 ajax 去请求服务端来判定用户是否登录：<br>
用户初次进入该页面，页面发起 ajax 请求，在设置的请求头信息里面，登录的标识开始是为空的，所以服务端返回结果判定你为没有登录凭证，然后前端重定向页面到登录页面；<br>
用户登录后，再次发送 ajax 请求，这次后端会返回一个登录凭证，前端拿到这个登录凭证（token）后，会把它保存在客户端的 cookie 信息中，那么下次关于这个用户的请求头里面都会带有这个用户信息，后端也就是通过这个 cookie 信息是否是登录状态去判定用户是否登录的。


## cookie 的保护 ##
在客户端存储 cookie 信息是有风险的，因为客户端的 cookie 信息是会被带入到请求头里面的，如果有黑客拿到了你的那个登录凭证 cookie 信息的话，它就可以以你的身份去登录网址操作了。所以后端一般都会设置登录凭证 cookie 的有限期，比如20分钟，请求一次算1分钟，请求超过20次后就必须重新登录，这样也是为了防止用户信息泄露导致不可控后果的一种方式。



## 它们三者的区别 ##
<table style="text-align: center;">
	<thead>
		<tr>
			<th width="120">特性</th>
			<th>Cookie</th>
			<th>localStorage</th>
			<th>sessionStorage</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>数据的生命期</td>
			<td>可设置失效时间。如果在浏览器端生成Cookie，并且没有设置失效时间，默认是关闭浏览器后失效</td>
			<td>除非被清除，否则永久保存</td>
			<td>仅在当前会话下有效，关闭窗口或浏览器后被清除</td>
		</tr>
		<tr>
			<td>存放数据大小</td>
			<td>4KB左右</td>
			<td colspan="2">5MB左右</td>
		</tr>
		<tr>
			<td>有效期</td>
			<td>只要你设置的过期时间没到，它一直有效，即使窗口或者浏览器关闭</td>
			<td>永久存储，永不失效，除非手动删除</td>
			<td>数据存储在窗口对象中，窗口关闭后，数据丢失 </td>
		</tr>
		<tr>
			<td>作用域</td>
			<td colspan="3">不同的浏览器窗口不能共享，即使是同一个页面。遵循同源策略，跨域不能共享</td>
		</tr>
		<tr>
			<td>操作方式</td>
			<td>需要前端开发者自己封装 setCookies 和 getCookies</td>
			<td colspan="2">主要通过js操作 window.localStorage 和 window.sessionStorage 这两个对象实例的属性和方法 </td>
		</tr>
		<tr>
			<td>与服务器端通信</td>
			<td>每次都会携带在HTTP头中，如果使用cookie保存过多数据会带来性能问题</td>
			<td colspan="2">仅在客户端（即浏览器）中保存，不参与和服务器的通信</td>
		</tr>
	</tbody>
</table>


## 一些常用的应用场景 ##
因为考虑到每个 HTTP 请求都会带着 Cookie 的信息，所以 Cookie 当然是能精简就精简啦，比较常用的一个应用场景就是判断用户是否登录。针对登录过的用户，服务器端会在他登录时往 Cookie 中插入一段加密过的唯一辨识单一用户的辨识码，下次只要读取这个值就可以判断当前用户是否登录啦。曾经还使用 Cookie 来保存用户在电商网站的购物车信息，如今有了 localStorage，似乎在这个方面也可以给 Cookie 放个假了~<br>
而另一方面 localStorage 接替了 Cookie 管理购物车的工作，同时也能胜任其他一些工作。比如HTML5游戏通常会产生一些本地数据，localStorage 也是非常适用的。如果遇到一些内容特别多的表单，为了优化用户体验，我们可能要把表单页面拆分成多个子页面，然后按步骤引导用户填写。这时候 sessionStorage 的作用就发挥出来了，用户填完一页信息后，同一窗口继续跳转到另一个页面继续填写，最后提交的时候，只需要从存储的 sessionStorage 中拿到所用保存的 session 数据，提交一次就可以了。<br>


## 安全性的考虑 ##
需要注意的是，不是什么数据都适合放在 Cookie、localStorage 和 sessionStorage 中的。使用它们的时候，需要时刻注意是否有代码存在 XSS 注入的风险。因为只要打开控制台，你就随意修改它们的值，也就是说如果你的网站中有 XSS 的风险，它们就能对你的 localStorage 肆意妄为。所以千万不要用它们存储你系统中的敏感数据。


## cookie、localStorage、sessionStorage 使用方式 ##

**cookie**
<pre>
//设置cookie: cookie名，cookie值，天数
function setCookie(name, value, iDay){
	var oDate = new Data();
	oDate.setDate(oDate.getDate() + iDay);
	document.cookie = name+ &#x27;=&#x27; + value + &#x27;; expires = &#x27; + oDate
}
</pre>

<pre>
//获取cookie
function getCookie(name) {
	var arr = document.cookie.split(; ); 
	for(var i = 0; i &lt; arr.length; i++) {
		var arr2 = arr[i].split(&#x27;=&#x27;); 
		if(arr2[0] == name) {
			return arr2[1]; 
		}
	}
	return &#x27;&#x27;; 
}
</pre>

<pre>
//删除cookie
function removeCookie(name) {
	setCookie(name, 1, -1);
}
</pre>



## localStorage和sessionStorage 常用操作方式 ##
localStorage和sessionStorage都具有相同的操作方法，例如setItem、getItem和removeItem等<br>

**setItem存储value**
<pre>
window.localStorage.setItem("key", "value");
window.sessionStorage.setItem("key", "value");     
</pre>

**getItem获取value**
<pre>
var value = window.localStorage.getItem("key");   
var value = window.sessionStorage.getItem("key");     
</pre>

**removeItem删除key**
<pre>
window.localStorage.removeItem("key");
window.sessionStorage.removeItem("key");     
</pre>

**clear清除所有的key/value**
<pre>
window.localStorage.clear();
window.sessionStorage.clear();     
</pre>


## localStorage和sessionStorage 其他操作方式 ##
它们不但可以用自身的setItem,getItem等方便存取，也可以像普通对象一样用点(.)操作符，及[]的方式进行数据存储，像如下的代码：
<pre>
var storage = window.localStorage; 

storage.key1 = &quot;hello&quot;; 
storage[&quot;key2&quot;] = &quot;world&quot;; 

console.log(storage.key1); 		// hello
console.log(storage[&quot;key2&quot;]);	// world
</pre>


## localStorage和sessionStorage的key和length属性实现遍历 ##
sessionStorage和localStorage提供的key()和length可以方便的实现存储的数据遍历，例如下面的代码：
<pre>
var storage = window.localStorage;
for(var i=0, len=storage.length; i&lt;len;i++) {
    var key = storage.key(i);     
    var value = storage.getItem(key);     
    console.log(key + &quot;=&quot; + value); 
}
</pre>


## 思考问题 ##
1. cookie 跨域访问（查看“跨域解决方案”）
2. cookie 跨浏览器访问（往下看）


# cookie 跨浏览器访问 #
之前说过，不管是 cookie、localStorage 还是 sessionStorage，都要遵循同源策略，并且不能跨浏览器访问。如果要实现数据的跨浏览器访问，那就必须要用到 FlashCookies（用户数据跟踪），不过这样做也没有必要，下面可以做为了解看看。

**什么是flashCookies？**<br>
Cookies是一种保存在我们电脑硬盘文本文件内的数据，常用来保存用户信息。但是在客户端Cookie里保存数据是不稳定的，因为用户可能随时会清除掉浏览器的Cookie。所以想要用户不方便清除，而且能长时间保存，并且还能跨浏览器访问；这个时候又是那个牛B的公司--Adobe 站了出来，他们搞了一个 flaseCookies 的东东用来解决以上问题<br>

**flashCookies的特点？**<br>

1. 容量更大，最多能存储100kb
2. 没有默认的过期时间，永久存在，除非你在你的电脑上找到它并删除它（目前也有一些软件可以清除）
3. 存储位置：C:\Documents and Settings\用户名\Application Data\Macromedia\Flash Player文件夹下。其中#sharedobjects文件夹用于存储flash cookies，macromedia.com存储flash cookies的全局设置。

**web端用 flashCookies 能做什么？**<br>

1. 跨浏览器共享数据：这样用户在 A 浏览器登陆后，用 B 浏览器再次打开同一页面时，依然可以保持登陆状态
2. 网站窃取用户数据：现在网络媒体用的一直偷取用户数据的技术，一般用户删除不了，也阻止不了，基本上国内大部分媒体和广告都在使用它来偷用户的信息

**flashCookies 使用？**<br>
引入jquery 和 swfstore.min.js 
<pre>
mySwfStore.set('myKey', '值');	//设置flashcookie
mySwfStore.get('myKey');  	//读取flashcookie
。。。。。。。。			//删除flashcookie
</pre>
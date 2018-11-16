# Javascript相关问题 #
#### 普通javascript问题 ####
<pre>
<a href="#appJiaoHu">app与wap页面的交互</a>
</pre>


#### <div id="appJiaoHu">app与wap页面的交互</div> ####
> 公司很多项目都会放入到公司app架构中，所以wap页面与app原生页面的交互就必不可少，原生app提供了很多接口供wap调用它的内部方法，比如跳转登录页面、设置title、分享等；<br>
> wiki地址：[http://wiki.hzjiehun.bid/pages/viewpage.action?pageId=1088961](http://wiki.hzjiehun.bid/pages/viewpage.action?pageId=1088961 "appWiki")

**跳转登录页面（以vue项目为例）**
<pre>
1：全局设置 => window.selfThis = '';
2：created生命周期钩子中赋值this => selfThis = this
3：调用方法 => utils.callapp("loginApp",{},"selfThis.callbacks")  其中selfThis.callbacks为回调函数，就是app登录成功后的回调函数
4---methods中设置回调函数 => callbacks回调函数，如果没有回调需求，可以不用设置，但要在utils.callapp参数中去掉回调参数 utils.callapp("loginApp",{})
</pre>

**设置title（以vue项目为例）**
> 在app中设置title目前是一个比较麻烦的事，因为在刚进入路由页面时，需要通过设置head里面的title和meta来设置app title（设置title和meta是分别做Android和ios的兼容处理）；而在页面路由跳转时，你需要在触发事件里面去调用app提供的方法去设置title，也就是说，在页面进入的时候，你可以通过vue的生命周期去设置app的title，当你通过触发事件，比如你点击某个按钮跳转到其他路由页面的时候，那么在其他路由页面是vue的缓存页面的时候（比如你设置了全局的keep-alive缓存机制），那么很有可能app的title在第二次进入这个页面时，不会改变（因为你的keep-alive阻止了路由页面的生命周期函数，所以你在生命周期函数中执行的app头部设置方法不会执行）；所以经常采用的方法是，在路由发生跳转时，手动调用app的title设置方法，如果两个路由页面要来回跳转，那就要分别设置title

<p>1：设置路由元信息meta（路由配置里面）</p>
<pre>
{   
  path: &#x27;/&#x27;,
  name: &#x27;index&#x27;,
  meta:{
     title:&#x27;app标题&#x27;
  }
}
</pre>

<p>2：设置主meta和title标签（主页面index.html）</p>
<pre>
&lt;meta name=&quot;hapj-wap-title&quot; id=&quot;hapj-wap-title&quot; content=&quot;&quot;&gt;
&lt;title id=&quot;titTag&quot;&gt;&lt;/title&gt;
</pre>

<p>3：设置页面跳转前奏条件（router.beforeEach）</p>
<pre>
import router from './router'

router.beforeEach((to, from, next) =&gt; {
  /* 路由发生变化修改页面title */
  document.getElementById(&quot;hapj-wap-title&quot;).setAttribute(&#x27;content&#x27;,to.meta.title);
  document.title = to.meta.title;
  document.getElementById(&quot;titTag&quot;).innerHTML=to.meta.title;
  next()
})
</pre>

<p>4：手动设置页面内跳转的app头部设置方法（先引入utils.js文件）</p>
<pre>
import utils from '../../../static/js/util.js'

methods执行函数 () {
  utils.callapp(&quot;ui_webview_title&quot;,{&quot;title&quot;:&quot;app标题&quot;})
}
</pre>

<p>5：utils.js</p>
<pre>
var util = {
	getUrlAllParam: function(){
		var self = this;
		var locationSearch = location.search;
		if(locationSearch){
			var urlParam  = self._parseQueryString(locationSearch);
			return urlParam;			
		}	
	},
	_parseQueryString: function(argu) {  
		  var str = argu.split(&#x27;?&#x27;)[1];
		  var result = {};
		  var temp = str.split(&#x27;&amp;&#x27;);
		  for(var i=0; i&lt;temp.length; i++)
		  {
		     var temp2 = temp[i].split(&#x27;=&#x27;);
		     result[temp2[0]] = temp2[1];
		  }
		  return result;
	},
	getUrlParam: function(name){
		var self = this;
		var locationSearch = location.search;
		if(!locationSearch) return false;
		var urlParam  = self._parseQueryString(locationSearch);
		return urlParam[name] ? 	decodeURIComponent(urlParam[name]) : false;	
	},
	browers: function () {
		var ua = navigator.userAgent.toLowerCase(),
		rwebkit = /(webkit)[ \/]([\w.]+)/,
		ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
		rmsie = /(msie) ([\w.]+)/,
		rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,
		match = rwebkit.exec(ua) ||
			ropera.exec(ua) ||
			rmsie.exec(ua) ||
			ua.indexOf(&#x27;compatible&#x27;) &lt; 0 &amp;&amp; rmozilla.exec(ua) ||
			[];
	
	
		// 通过userAgent获取中间的键值对，其中值支持小数点，如v=1.2.2
		var extraMs, extra = {};
		if ((extraMs = /&lt;&lt;([a-z0-9]+\=\w*(?:&amp;[a-z0-9]+\=[\w\.]*)*)&gt;&gt;/.exec(ua.replace(&#x27;$s=&#x27;,&#x27;&amp;s=&#x27;)))) {
			var arr = extraMs[1].split(&#x27;&amp;&#x27;)
			for(var i in arr) {
				var ar = arr[i].split(&#x27;=&#x27;);
				extra[ar[0]] = ar[1];
			}
		}
	
		let usa = navigator.userAgent,
			isApp = Object.keys(extra).length
		
		return {
			type: match[1] || &#x27;&#x27;,
			version: match[2] || &#x27;0&#x27;,
			mobile: /(MIDP|WAP|UP\.Browser|Smartphone|Obigo|AU\.Browser|wxd\.Mms|WxdB\.Browser|CLDC|UP\.Link|KM\.Browser|UCWEB|UCBrowser|SEMC\-Browser|Mini|Symbian|Palm|Nokia|Panasonic|MOT|SonyEricsson|NEC|Alcatel|Ericsson|BENQ|BenQ|Amoisonic|Amoi|Capitel|PHILIPS|SAMSUNG|Lenovo|Mitsu|Motorola|SHARP|WAPPER|LG|EG900|CECT|Compal|kejian|Bird|BIRD|G900\/V1\.0|Arima|CTL|TDG|Daxian|DAXIAN|DBTEL|Eastcom|EASTCOM|PANTECH|Dopod|Haier|HAIER|KONKA|KEJIAN|LENOVO|Soutec|SOUTEC|SAGEM|SEC|SED|EMOL|INNO55|ZTE|iPhone|Android|Windows CE|BlackBerry|MicroMessenger)/i.test(navigator.userAgent),
			android: ua.indexOf(&#x27;android&#x27;) &gt; -1,
			ios: /(ipad|ios|iphone)/.test(ua),
			weixin: usa.indexOf(&#x27;MicroMessenger&#x27;) &gt; -1,
			qq: usa.indexOf(&#x27;MQQBrowser&#x27;) &gt; -1 || usa.indexOf(&#x27;QQ/&#x27;) &gt; -1,
			userAgent: usa,
			extra: extra,
			isApp: isApp,
			isWeixinWeibo: (usa.indexOf(&#x27;MicroMessenger&#x27;) &gt; -1) || (ua.match(/WeiBo/i) == &quot;weibo&quot;)
		};
	},
	callapp: function(handlerName, args, callbackName) {
		var self = this;

		callbackName = !!callbackName ? callbackName : &#x27;&#x27;;    
		args = JSON.stringify(args) ? JSON.stringify(args) : &#x27;&#x27;;
		
		let browser = self.browers(), 
			isIos = browser.ios, 
			isAndroid = browser.android,
			isApp = browser.isApp;

		if(isApp){
			if(isIos){
				window.webkit.messageHandlers.ios.postMessage({
					&quot;handler&quot;: handlerName,
					&quot;args&quot;: args,
					&quot;callback&quot;: callbackName
				});
			}
		
			if(isAndroid){            
				hapj_hybrid.android(handlerName, args, callbackName);
			}
		}
	}
}

export default util;
</pre>


#### <div id="vuePopup">弹出层禁止页面滑动（以移动端vue项目为例）</div> ####
> 移动端弹出框时可以调用使用者两个方法，如果不是Vue，可以在弹窗层出现时直接给html或body设置height:100%; overflow：hidden;或者preventDefault属性来实现<br>
> 在vue等框架中要实现弹窗禁止出现禁止页面滚动，弹窗消失页面恢复的话，建议通过设置html的样式来做，设置html的id值 &lt;html id=&quot;pageHTML&quot;&gt;<br>
> vue提供阻止页面滚动事件: @touchmove.prevent 但这里有个问题，就是如果弹窗里面也有滚动行为的话，内部滚动会失效<br>

<pre>
**css解决**
禁止页面滚动（弹窗显示时）
document.getElementById("pageHTML").style.height = '100%'
document.getElementById("pageHTML").style.overflow = 'hidden'

恢复页面滚动（弹窗隐藏时）
document.getElementById("pageHTML").style.height = 'auto'
document.getElementById("pageHTML").style.overflow = ''

**vue解决**
&lt;div @touchmove.prevent &gt;&lt;/div&gt;
</pre>

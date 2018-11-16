## 关于 --save 与 --save-dev 的区别 ##

- --save：将保存配置信息到pacjage.json的dependencies节点中。
- --save-dev：将保存配置信息到pacjage.json的devDependencies节点中。
- dependencies：运行时的依赖，发布后，即生产环境下还需要用的模块
- devDependencies：开发时的依赖。里面的模块是开发时用的，发布时用不到它。


# 安装 webpack 与 webpack-dev-server #

1. 创建一个文件夹：demo
2. 初始化：npm init（执行后会有一系列选项，可以填写自己想要的，或者直接回车，完成后会在demo文件夹里面生成一个 package.json 文件）
3. 本地局部安装 webpack：npm install webpack --save-dev（--save-dev 会作为开发依赖来安装 webpack）
4. 安装 webpack-dev-server：npm install webpack-dev-server --save-dev （它可以在开发环境中提供很多服务）
5. 安装 webpack-cli：npm install webpack-cli -D（如果你是 webpack4.x之后的版本，那么就需要安装它，因为到了webpack4.x之后, webpack 已经将 webpack 命令行相关的内容都迁移到 webpack-cli）

执行完成后3、4步之后 package.json 文件的代码如下
<pre>
{
  &quot;name&quot;: &quot;yqh&quot;,
  &quot;version&quot;: &quot;1.0.0&quot;,
  &quot;description&quot;: &quot;cs&quot;,
  &quot;main&quot;: &quot;index.js&quot;,
  &quot;scripts&quot;: {
    &quot;test&quot;: &quot;echo \&quot;Error: no test specified\&quot; &amp;&amp; exit 1&quot;
  },
  &quot;author&quot;: &quot;&quot;,
  &quot;license&quot;: &quot;ISC&quot;,
  &quot;devDependencies&quot;: {
    &quot;webpack&quot;: &quot;^4.23.1&quot;,
    &quot;webpack-dev-server&quot;: &quot;^3.1.10&quot;
  }
}		
</pre>


# 创建 webpack 配置文件 #

1. 在 demo 文件夹下面创建：webpack.config.js（代码如下）
	<pre>
	var config = {
	
	};
	
	module.exports = config;
	</pre> 
2. 在 package.json 文件的 script 属性里面添加一个能够快速启动 webpack-dev-server 服务的脚本
	<pre>
	{
	  &quot;name&quot;: &quot;yqh&quot;,
	  &quot;version&quot;: &quot;1.0.0&quot;,
	  &quot;description&quot;: &quot;cs&quot;,
	  &quot;main&quot;: &quot;index.js&quot;,
	  &quot;scripts&quot;: {
	    &quot;test&quot;: &quot;echo \&quot;Error: no test specified\&quot; &amp;&amp; exit 1&quot;,
	    &quot;dev&quot;: &quot;webpack-dev-server --open --config webpack.config.js&quot;
	  },
	  &quot;author&quot;: &quot;&quot;,
	  &quot;license&quot;: &quot;ISC&quot;,
	  &quot;devDependencies&quot;: {
	    &quot;webpack&quot;: &quot;^4.23.1&quot;,
	    &quot;webpack-cli&quot;: &quot;^3.1.2&quot;,
	    &quot;webpack-dev-server&quot;: &quot;^3.1.10&quot;
	  }
	}
	</pre> 	
3. 运行 npm run dev：会执行你配置的dev里面的内容，--config 是指向 webpack-dev-server 读取的配置文件路径；--open 会在执行 npm run dev 命令时自动打开浏览器，默认地址是 http://localhost:8080/；不过这个默认的IP和端口都是可以配置的，如下：
	<pre>
	&quot;dev&quot;: &quot;webpack-dev-server --host localhost --port 8888 --open --config webpack.config.js&quot;
	</pre>


# 配置 webpack 入口(entry)和出口(output) #
**入口**：告诉 webpack 从哪里开始寻找依赖，并进行编译<br>
**出口**：则是用来配置编译后的文件存储位置和文件名

1. 在 demo 目录下面创建一个空的 main.js 做为入口文件，在 webpack.config.js 文件中进行入口和输出的配置
	<pre>
	var path = require(&#x27;path&#x27;);
	
	var config = {
		entry: {
			main: &#x27;./main.js&#x27;	// webpack开始工作的文件路径
		},
		output: {
			path: path.join(__dirname, &#x27;./dist&#x27;),	// webpack打包后的输出目录
			publicPath: &#x27;/dist/&#x27;,	// 资源文件引用的目录（如果你的资源文件在CDN服务上，可以填写CDN地址）
			filename: &#x27;main.js&#x27;	// 打包后的输出文件名
		}
	};
	
	module.exports = config;
	</pre>
	所以上面的代码意思为：webpack 从你的 ./main.js 文件开始编译，并且最终输出到 demo/dist/main.js 文件中，你只要在 html 页面中引入这个打包、编译好的文件即可
2. 在 demo 目录下面创建一个 index.html 文件，并且引入经 webpack 打包并编译的 main.js 文件
	<pre>
	&lt;!DOCTYPE html&gt;
	&lt;html lang=&quot;en&quot;&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;UTF-8&quot;&gt;
		&lt;title&gt;webpack 工程化&lt;/title&gt;
	&lt;/head&gt;
	&lt;body&gt;
		&lt;div id=&quot;app&quot;&gt;&lt;/div&gt;
		&lt;script type=&quot;text/javascript&quot; src=&quot;/dist/main.js&quot;&gt;&lt;/script&gt;
	&lt;/body&gt;
	&lt;/html&gt;
	</pre>
3. 执行 npm run dev：这时候浏览器就会自动打开你创建的那个 index.html 文件
4. 在 demo/main.js 文件中测试下，比如写上下面的代码看看：
	<pre>
	document.getElementById(&#x27;app&#x27;).innerHTML = &#x27;hello webpack&#x27;
	</pre>
	你会发现你写完并保存之后，浏览器主动刷新了结果；这是因为 webpack-dev-server 服务的热更新功能，它通过创建一个 webSocket 链接来实时响应代码的修改


# 安装插件 处理css模块 #

1. 安装 css-loader 和 style-loader
	<pre>
	npm install css-loader --save-dev
	npm install style-loader --save-dev
	</pre>
	安装完成后在 package.json 文件里面添加对 .css 后缀文件的处理
	<pre>
	......
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					&#x27;style-loader&#x27;,
					&#x27;css-loader&#x27;
				]
			}
		]
	}
	......
	</pre>
	 module 对象的 rules 属性中可以定义一系列的 loaders，每一个 loader 都必须包含 test 和 use 两个选项。<br>
	上面的配置的意思是：当 webpack 在编译过程中遇到 require() 或者 import 语句导入一个后缀名为 .css 的文件时，先将它通过 css-loader 转换，在通过 style-loader 转换，然后继续打包。use 选项的值可以是数组或者字符串，如果是数组，它的编译顺序是从后往前进行的。在

2. 在 demo 目录下面创建 style.css，然后在main.js 文件中引入
	<pre>
	import './style.css'
	</pre>
	当我们再次运行 npm run dev 时发现，在 index.html 的 head 标签中，我们写的 css 被动态的添加进去了。这也就意味着 css 是通过 动态创建 style 标签，然后通过 main.js 导出到 head 标签中的。<br>
	但在实际业务中，css 不可能都放在 js 中，这个时候就需要使用下面的 webpack 插件，让 css 在页面上通过 link 标签的形式加载到页面中。

3. 安装处理插件：
	webpack 的插件功能很强大而且可以定制插件，我们在这里使用一个 mini-css-extract-plugin 插件，此插件将 CSS 提取到单独的文件中。它为每个包含CSS的JS文件创建一个CSS文件。

	<pre>
	npm install mini-css-extract-plugin --save-dev
	</pre>

	<pre>
	// 引入模块
	var MiniCssExtractPlugin  =  require（“ mini-css-extract-plugin ”）;
	......
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
			        	{ loader: MiniCssExtractPlugin.loader },
			        	&quot;css-loader&quot;
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin(&#x27;main.css&#x27;)
	]
	......
	</pre>

4. index.html 页面引入
	<pre>
	&lt;link rel=&quot;stylesheet&quot; type=&quot;text/css&quot; href=&quot;/dist/main.css&quot;&gt;
	</pre>

**webpack 看似复杂，但它只不过是一个 js 配置文件，只要搞清楚：入口(entry)、出口（output）、加载器（loaders）和插件（plugins），这样使用起来就不那么困惑了。**


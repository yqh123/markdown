# Hello Webpack #

> 它是一个模块打包器
> 它能打包你的所有资源，可以将多种静态资源 js、css、less 转换成一个静态文件，减少了页面的请求。
> 它能帮你编译和处理各种文件，它也有很多插件帮来辅助你的项目

### 初次体验打包的乐趣 ###

1.  创建文件：
	  <pre>mkdir 文件名</pre>
2.  创建package.json文件：webpack依赖文件
	<pre>npm init -y	(-y代表默认设置)</pre>
3.  安装webpack依赖：
	<pre>npm i -D webpack@3	（-D表示开发环境，-S表示生产环境；@3表示你安装的webpack版本）</pre>
4.  创建webpack.config.js文件：webpack配置文件（手动创建：这里是告诉webpack我该以什么样的方配置去打包）；比如你创建了一个src文件夹，和一个dist文件夹。<br>
src文件下面放置你的其他js文件，和一个打包的js文件（index.js）；dist文件夹是webpack打包后生成的js文件放置的地方<br>
	**./src/a.js**
	<pre>
	export default function handler() {
		console.log('mdule a')
	}
	</pre>
	**./src/b.js**
	<pre>
	export default function handler() {
		console.log('mdule b')
	}
	</pre>
	**./src/index.js**
	<pre>
	import A from './a.js'
	import B from './b.js'
	A()
	B()
	</pre>

	**webpack.config.js (这个文件是用nodeJs执行的，所以要用module.exports导出对象)**
	<pre>
	const path = require('path');		// 引入path绝对路径模块
	module.exports = {
		entry: './src/index.js',	// webpack入口文件
		output: {
			path: path.resolve(__dirname, 'dist'),	// 它需要引入绝对路径，所以先创建绝对路径path模块
			filename: 'index.js'	// 打包后生成的文件名
		},
		mode: 'development'	// development：开发环境;  production：生成环境（这个mode配置可以省略，因为它目前针对的是webpack4.0的版本）
	};
	</pre>  
5.  在package.json文件里面去添加webpack的运行命令，dev的配置后你就可以使用 npm run dev 的形式去运行打包任务了，它会自动找到webpack.config.js文件去执行里面的配置。如果你无法运行，那是因为webpack版本问题，可能需要你根据它的报错提示在去安装一个 webpack-cli 的东西
	<pre>
	npm i -D webpack-cli
	</pre>
	在配置package.json文件
	<pre>
	"scripts": {
	    "test": "echo \"Error: no test specified\" && exit 1",
	    "dev": "webpack"	// 如果你的文件名不是默认的webpack.config.js的话，那么要写成："dev": "webpack --config 文件名.js"
	 }
	</pre>  
6.  运行webpack进行打包，在你的入口html文件里面只要引入打包好的入口js文件即可
	<pre>npm run dev</pre>

### 插件：plugin ###
> 它是一个插件集合数组，它里面可以配置很多项目上要用的插件，比如下面的html打包插件 html-webpcak-plugin

1.  安装插件：
	<pre>npm i -D html-webpack-plugin</pre>
2.  使用插件：在webpack.config.js里面去配置plugins（你可以把你的index.html文件里面的js引入去掉了）
	<pre>
	const htmlWebpcakPlugin = require('html-webpack-plugin');	// 引入html打包插件
	
	module.exports = {
		plugins: [						// 配置插件，在dist文件夹下面打包html文件
			new htmlWebpcakPlugin({
				filename: 'index.html',			// 打包的文件名
				inject: 'head',				// 让自动html页面里面的script标签插入到页面的head部分，默认是body最下面插入
				template: 'index.html',			// 要打包的那个html文件地址，默认相对于跟路径
				title: '页面传入的参数',			// 你向要打包的html页面里面传入的参数，通过 htmlWebpackPlugin.options.title 配合ejs（&lt;P&gt;&lt;%= htmlWebpackPlugin.options.title %&gt;&lt;/P&gt;）
				minify:{				// 压缩代码的形式(删除注释/删除空格)
		  			removeComments:true,  
		  			collapseWhitespace:true	
		  		}
			})
		]
	};
	</pre>

### 插件：loader ###
> 它是webpack用来预处理模块的(比如css、less、sass、js、jsx等)<br>
> 在一个模块被引入之前，会预先使用loader去处理模块的内容<br>
> 它的module配置机制是 “从右至左”、“从下至上”
 
#### 引入css、less或者sass ####
----------
1.  比如你要在项目中引入less，在这之前你要先安装css-loader 和 style-loader
	<pre>
	npm i -D css-loader style-loader
	</pre>
2.  在安装处理less文件的loader(它依赖less)
	<pre>
	npm i -D less-loader less
	</pre>
3.  在webpack.config.js里面配置module模块
	<pre>
	module: {
		rules: [
  			{
  				test: /\.(less|css)$/,	// 匹配规则
  				use: ['style-loader','css-loader','less-loader']	// 加载什么样的loader去处理，这里引入style-loader是因为要把打包好的样式引入到结构当中
  			}
		]
	}
	</pre>
4.  之后你就可以在你的js模块里面去引入了
	<pre>
	require('./src/mode.less')<br>或者<br>import './src/mode.less'
	</pre>

### css模块化1 ###
> 它的作用可以让你更加方便的使用定义的样式文件，即使是同名的样式名，只要引入的模块不同，那么他们之间不会冲突，比如下面的情况

1.  webpack.config.js文件里面去开启css模块化，默认是不开启的
	<pre>
	{
		test: /\.css$/,
		use: [
			'style-loader',
			{
				loader: 'css-loader',
				options: {
					module: true,
					localIdentName: '[local]'	// 让class名字保持原样
				}
			}
		]
	}
	</pre>
	<pre>
	.bj {background:red;}
	</pre>
2.  假设你有两个css样式文件，assets/style1.css 、assets/style2.css
	<pre>
	.bj {background:blue;}
	</pre>
	<pre>
	.bj {background:red;}
	</pre>
3.  在你的组件中去分别引入两个模块
	<pre>
	import style1 from './assets/style1.css'
	import style2 from './assets/style2.css'
	</pre>
4.  分别给不同的元素添加样式，这里使用了jsx的语法，不过可以看到，即使样式名一样，但模块不同时，它们的样式不会覆盖
	<pre>
	&lt;div className={style1.bj}&gt;样式1&lt;/div&gt;
	&lt;div className={style2.bj}&gt;样式2&lt;/div&gt;
	</pre>

### css模块化2 ###
> css模块化功能很强大，但在实际的开发过程中，并不是所有的css都是需要模块化的，比如你自己的css文件，或者node_modules里面服务商提供的css样式，只有少量的css文件才是需要模块化的，当然具体看你的项目需求

1.  webpack.config.js文件里面去开启css模块化，同时指定exclude、include参数，告诉loader哪些是不需要模块化的；比如下面的配置就是告诉webpack，node_modules和src/assets这两个文件夹下面的css是不需要被模块化的，否者其他的都需要模块化
	<pre>
	{
		test: /\.(less|css)$/,
		use: [
			'style-loader',
			{
				loader: 'css-loader',
				options: {
					module: true，
					localIdentName: '[local]'
				}
			},
			'less-loader'
		],
		exclude: [	// 排除下面文件夹的css，不对其进行模块化
			path.resolve(__dirname, 'node_modules'),
			path.resolve(__dirname, 'src/assets')
		]
	},
	{
		test: /\.(less|css)$/,
		use: ['style-loader', 'css-loader', 'less-loader'],
		include: [	// 除了下面文件夹的css文件，其他的都需要模块化
			path.resolve(__dirname, 'node_modules'),
			path.resolve(__dirname, 'src/assets')
		]
	}
	</pre>
2.  假设你有两个样式文件夹，src/assets、src/common，一个是不需要模块化的assets文件，一个是需要模块化的common文件
	<pre>
	import './src/assets/style.less'
	import commonStyle './src/common/comStyle.less'

	&lt;div class=&quot;style&quot;&gt;样式1&lt;/div&gt;
	&lt;div class={commonStyle.style}&quot;&gt;样式2&lt;/div&gt;
	</pre>

#### 引入图片：file-loader ####
> 它是打包图片用的，在你引入图片或者打包图片的时候，都会用到它，打包后的dist文件里面也会把图片一起打包进去

1.  安装file-loader
	<pre>
	npm i -D file-loader
	</pre>
2.  在webpack.config.js里面配置file-loader
	<pre>
	module: {
		rules: [
			{
				test: /\.(jpg|png|gif)$/,
				use: ['file-loader']
			}
		]
	},
	</pre>
3.  在样式文件中引入图片，就是正常写路径就可以了。但是如果在结构中引入图片的话，比如在react或者vue模块中，那就需要处理下图片的引入问题，这样打包图片的时候才不会出错
	<pre>
	&lt;img src=&quot;${require(&#x27;图片地址&#x27;)}&quot;&gt;
	</pre>

#### 引入图片：url-loader ####
> 相当于一个加强版的file-loader，它可以判断你的图片大小，来做打包处理还是把图片转换成base64格式的编码，达到减少网页http请求，它和file-loader只要配置一个就可以了

1.  安装url-loader
	<pre>
	npm i -D url-loader
	</pre>
2.  在webpack.config.js里面配置file-loader
	<pre>
	module: {
		rules: [
			{
				test: /\.(jpg|png|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000	// 大于10kb的时候被打包，否则编码成base64
						}
					}
				]
			}
		]
	},
	</pre>

#### 引入字体：本地引入字体 ####
> 如果你在本地的目录下面已经下载好了字体文件，那么就需要用file-loader去处理字体的url的

1.  比如你的字体文件在fonts文件夹下面，你在css里面先写好样式
	<pre>
	@font-face {
		font-family: 'f';
		src: url('./fonts/fontawesome-webfont.woff');
	}
	.rocket {
		font-family: f;
		font-size: 50px;
	}
	.rocket::before {
		content: '\f135';
	}
	</pre>
2.  在webpack.config.js里面配置file-loader
	<pre>
	module: {
		rules: [
			test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
			urs: ['file-loader']
		]
	},
	</pre>
3.  在你的页面或组件中直接引入字体样式文件，添加指定class即可
	<pre>
	&lt;i class=&quot;rocket&quot;&gt;&lt;/i&gt;
	</pre>

#### 引入字体：服务商提供的字体 ####
> 如果你是引入服务商提供的字体文件库，比如fontAwesome，那么就需要用另外的处理方式，看下面

1.  安装字体
	<pre>
	npm i -S font-awesome
	</pre>
2.  引入字体
	<pre>
	import 'font-awesome/css/font-awesome.css'
	</pre>
3.  使用字体
	<pre>
	&lt;i class=&quot;fa fa-rocket&quot;&gt;&lt;/i&gt;
	</pre>


### devserver ###
> 它是webpack专门用来开发和调试项目用的，我们的项目会跑在服务器上，通过请求来访问我们的项目，给我们的项目模拟一个真实的项目环境<br>
> 这里需要注意的是，如果你的devserver是版本3的话，那么你的webpack版本必须是比3大的版本，依次类推

1.  安装devserver（注意查看安装成功后的版本号）
	<pre>
	npm i -D webpack-dev-server
	</pre>
2.  配置package.json文件scripts的start
	<pre>
	"scripts": {
	    "test": "echo \"Error: no test specified\" && exit 1",
	    "dev": "webpack",
	    "start": "webpack-dev-server"
	  },
	</pre>
3.  运行webpack: start是个关键字，所以不需要加run，而且他的运行规则是，先运行webpack.config.js之后在去开启webpack服务器，并且它有热加载功能，而且它是在内存中运行的
	<pre>
	npm start
	</pre>
4.  当然你也可以在webpack.config.js里面去配置自己devserver，它里面有很多配置项，可以自行选择，比如 open 就是自动打开浏览器
	<pre>
	devServer: {
		port: 8080,
		open: true
	}
	</pre>

### babel：初体验 ###
> 它是一个javascript编译器，他依赖很多插件来帮它完成编译，它是把浏览器无法识别的语法编译成浏览器能够识别的语法，比如它可以把es6编译成es5

1.  安装 babel-cli 和 babel-preset-env
	<pre>
	npm i -D babel-cli babel-preset-env
	</pre>
2.  创建一个 .babelrc 的文件，并做es6编译成es5的配置
	<pre>
	{
		"presets": ["env"]
	}
	</pre>
3.  在package.json文件里面配置babel要编译的es6文件
	<pre>
	"scripts": {
		"babel": "babel src/app.js"
	}
	</pre>
	如果你想把编辑的文件打包起来，可以这样配置
	<pre>
	"scripts": {
		"babel": "babel src/app.js -o out/app.js"
	}
	</pre>
4.  运行babel
	<pre>
	npm run babel
	</pre>

### babel-loader ###
> 在真实项目中使用babel-loader来编译es6

1.  安装 babel-preset-env
	<pre>
	npm i -D babel-preset-env
	</pre>
2.  配置webpack.config.js文件的babel-loader
	<pre>
	{
		test: /\.js$/,
		use: [
			{
				loader: 'babel-loader',
				options: {
					presets: ['env']
				}
			}
		]
	}
	</pre>
3.  运行webpack
	<pre>
	npm start
	</pre>

### 优化babel-loader ###
> 在以上的所有配置运行的过程中，发现它运行得比较慢，这是因为webpack在运行的时候，会执行webpack.config.js里面的配置，在运行到一些配置时，比如babel-loader，它都会去node_modules里面去查看一遍，然后让babel去处理里面的很多已经写好的配置，这样效率比较低，所以我们在实际开发中可以排除掉babel的需要查找的文件，来提高我们的开发效率，比如下面这样

1.  配置webpack.config.js文件，让babel-loader排除需要查找的文件
	<pre>
	{
		test: /\.js$/,
		use: [
			{
				loader: 'babel-loader',
				options: {
					presets: ['env']
				}
			}
		]，
		exclude: [
			path.resolve(__dirname, 'node_modules')
		]
	}
	</pre>
2.  如果你的babel-loader需要配置很多东西，那么你可以把它的配置提取出来形成一个 .babelrc 的文件，在webpack运行的时候，它自动运行这个文件
	<pre>
	{
		test: /\.js$/,
		use: [
			{
				loader: 'babel-loader'
			}
		]，
		exclude: [
			path.resolve(__dirname, 'node_modules')
		]
	}
	</pre>
3.  在跟目录下面创建 .babelrc 的文件，并做babel-loader的配置
	<pre>
	{
		"presets": ["env", "react"]
	}
	</pre>


### 打包处理：清空打包目录 ###
> 每次打包先清空dist目录，这样在开发过程中，dist目录都是从新生成的

1.  安装 clean-webpack-plugin
	<pre>
	npm i -D clean-webpack-plugin
	</pre>
2.  配置webpack.config.js
	<pre>
	const cleanWebpackPlugin = require('clean-webpack-plugin');

	plugins: [
		new cleanWebpackPlugin(['dist'])
	],
	</pre>

### 打包处理：文件归类 ###
> 让打包的所有css、img、js等资源文件都打包到asstes目录下面的归类文件里面，入口html页面放在dist跟目录下面

1.  让打包入口js文件打包到asstes目录下面(默认也为这个路径)
	<pre>
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'assets/js/index.js',	// 打包在dist/js目录下
		publicPath: './'		// 所有资源的基础路径，并且要以 / 结尾（这样js、img等打包后的文件路径在引入时不会出错）
	}
	</pre>
2.  配置webpack.config.js，让其他img、font等资源打包到各自的文件夹下面
	<pre>
	const cleanWebpackPlugin = require('clean-webpack-plugin');

	plugins: [
		new htmlWebpcakPlugin({
			inject: true,			
			filename: 'index.html',	// 打包在dist根目录下
			template: 'index.html'
		}),
		new cleanWebpackPlugin(['dist'])
	],
	module: {
		rules: [
			................
			{
				test: /\.(jpg|png|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 1000,	
							name: 'assets/img/[name]_[hash:6].[ext]'	// 在像img或者字体等打包路径的时候添加这个name属性
						}
					}
				]
			}
		]
	}
	</pre>
3.  配置webpack.config.js，在webpack服务器环境下能找到资源
	<pre>
	devServer: {
		port: 8080,
		open: false,
		contentBase: './src/common',	// 服务器资源查找的路径(建议把所有的项目静态资源文件都放在同一个目录下面)
		publicPath: '/'			// 服务器打包资源的路径
	}
	</pre>

# end #
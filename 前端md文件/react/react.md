# React #
> React 起源于 Facebook 的内部项目，因为该公司对市场上所有 JavaScript MVC 框架，都不满意，就决定自己写一套，用来架设Instagram 的网站。做出来以后，发现这套东西很好用，就在2013年5月开源了

## JSX ##
> 它是一种JavaScript语法扩展，在React中可以方便地用来描述UI<br>
> JSX本身也是一个表达式，在编译后，JSX表达式会变成普通的JavaScript对象

1.  关键字和保留字
	<pre>
	class：替换成 className
	自定义属性：使用 "data-" 前缀
	</pre>

2.  自定义样式style
	<pre>
	&lt;p style={{color:&#x27;red&#x27;}}&gt;我是行内样式&lt;/p&gt;
	</pre>

3.  表达式
	<pre>
	let text = &quot;hello world&quot;;
	let el = &lt;span&gt;I is React&lt;/span&gt;;
	ReactDOM.render(
	    &lt;div className=&quot;colorRed&quot; data-name=&quot;r&quot;&gt;
	    	&lt;span&gt;{text}&lt;/span&gt;
	    	&lt;p&gt;{el}&lt;/p&gt;
	    &lt;/div&gt;,
	    document.getElementById(&#x27;root&#x27;)
	);
	</pre>

4.  引入图片地址：单标签：后面要跟 "/"
	<pre>
	&lt;img src={require(&quot;图片地址&quot;)} /&gt;
	</pre>

## react组件 ##
> react把页面看成一个一个组件拼接而成的，也更加方便的利于开发和调试

1.  只有一个根节点
	<pre>
	class Nav extends React.Component{
		render(){
			return (
				&lt;div&gt;
			    		&lt;div&gt;我是nav组件内容&lt;/div&gt;
			    	&lt;/div&gt;
			)
		}
	}
	React.render(
		&lt;div&gt;
			&lt;Nav/&gt;
		&lt;/div&gt;
		document.getElementById(&#x27;root&#x27;)
	)
	</pre>

2.  组件的扩展：可以在项目里面新建一个components文件夹,然后把所有的组件都放在里面
	<p>（1）配置webpack.config.js</p>
	<pre>
	resolve: {
	    modules: [
	        &#x27;node_modules&#x27;,
	        path.resolve(__dirname, &#x27;src/components&#x27;)
	    ]
	}
	</pre>
	<p>（2）引入这个nav组件时路径前面可以不用加 ./components</p>
	<pre>
	import Nav from &#x27;nav/nav.js&#x27; 
	</pre>

### react组件：props ###
> 组件之间的数据传递，它的特点是逐级向下传递

1.  在父组件里面通过自定义属性传递数据：./compoents/parent.js
	<pre>
	import React, {Component} from &#x27;react&#x27;
	import Childen from &#x27;./compoents/childen.js&#x27;
	
	let data = [
	    {
	       name:&#x27;A&#x27;,
	       age: 20
	    },
	    {
	       name:&#x27;B&#x27;,
	       age: 24
	    }
	];
	
	export default class Parent extends React.Component {
	    render() {
	        let card = data.map((elt, i)=&gt; {
	            return (
	                &lt;Childen {...elt} key={i} /&gt;
	            )
	        })
	        return (
	            &lt;div&gt; {card} &lt;/div&gt;
	        )
	    }
	}
	</pre>

2.  在子组件里面使用 this.props.属性名，去接收父组件传递的数据：./compoents/childen.js
	<pre>
	import React, {Component} from &#x27;react&#x27;

	export default  class Childen extends React.Component {
	    render() {
	        let {name, age} = this.props;
	        return (
	            &lt;div&gt;{name} {age}&lt;/div&gt;
	        )
	    }
	}
	</pre>

### react组件：数据验证 ###
> 组件之间的数据传递中的数据初始验证，防止得到的数据有问题

1.  安装prop-types
	<pre>
	npm i -S prop-types
	</pre>

2.  组件页面引入，并验证数据
	<pre>
	import React, {Component} from 'react'
	import PropTypes from 'prop-types'

	// 如果某个数据是必传的，可以这样写 PropTypes.类型.isRequired
	let propTypes = {
	    name: PropTypes.string,
	    age: PropTypes.number
	};

	export default class Prop extends React.Component {
	    render() {
	        let {name, age} = this.props;
	        return(
	            &lt;div&gt;{name} {age}&lt;/div&gt;
	        )
	    }
	}
	
	// 如果name值没有传，可以指定默认值
	Card.defaultProps = {       
	    name: &#x27;默认值&#x27;
	};
	
	Prop.propTypes = propTypes;
	</pre>

3.  验证规则
	<pre>
	PropTypes.string,	// 字符串
	PropTypes.number,	// 数字
	PropTypes.func,		// 函数
	PropTypes.bool,		// 布尔值
	PropTypes.oneOf(['字符1', '字符2']),	// 只包含某些特定字符串，如果不是数组里面的字符，react验证报错
	</pre>


### react组件：context ###
> 它是跨组件传递数据，在一个组件里面去绑定一个数据，在其他任何的组件里面都可以使用，不需要层层传递

1.  在组件里面使用 "getChildContext" 定义一个数据，并使用 "childContextTypes" 进行数据类型定义
	<pre>
	class App extends React.Component {
	    getChildContext() {
	        return {
	            et: &#x27;Died&#x27;
	        }
	    }
	    render() { ...... }
	}
	
	App.childContextTypes = {
	    et: PropTypes.string
	}
	</pre>

2.  在其他组件中使用步骤
	<pre>
	// 数据验证
	let contextTypes = {            
	    et: PropTypes.string
	}
	
	export default class Card extends React.Component {
	    render() {
	        let {et} = this.context;    // 引入数据
	        return (
	            &lt;div&gt;{et}&lt;/div&gt;
	        )
	    }
	}
	
	// 绑定数据
	Card.contextTypes = contextTypes;  
	</pre>


### react组件：state ###
> 它是组件的内部状态，用来管理当前组件的状态，是动态更新的

1.  获取内部状态 state
	<pre>
	export default class Card extends React.Component {
	    constructor(props) {    		// props：接收外部数据(Card.propTypes = propTypes;)
	        super(props);
	        this.state = {      		// 定义组件内部状态
	            datas: &#x27;内部数据&#x27;
	        }
	    }
	    render() {
	        let {datas} = this.state;	// 获取组件内部状态
	        return (
	            &lt;div&gt;
	                &lt;i&gt;{datas}&lt;/i&gt;
	            &lt;/div&gt;
	        )
	    }
	} 
	</pre>

2.  改变内部状态 setState
	<pre>
	export default class Card extends React.Component {
	    constructor(props) {    
	        super(props);
	        this.state = {      
	            datas: &#x27;内部数据&#x27;
	        };
	        this.changeState = this.changeState.bind(this)	// 绑定下 changeState 函数的this
	    }
	    changeState() {
	        let {datas} = this.state;
	        this.setState({     // 触发setState改变内部state
	            datas: &#x27;改变内部数据&#x27;
	        })
	    }
	    render() { 
	        let {datas} = this.state; 
	        return (
	            &lt;div&gt;
	                &lt;i onClick={this.changeState}&gt;{datas}&lt;/i&gt;
	            &lt;/div&gt;
	        )
	    }
	}
	</pre>

3.  setState是批量更新的：<br>
	每次触发setState的时候，它都会触发React组件render里面的代码，所以按道理来说每调用一次setState的时候render方法都会执行一次。但事实上，不管你有多少个setState，render方法只会调用一次，所以setState是批量一次性处理的

4.  setState是异步执行的
	<pre>
	changeState() {
	    this.setState({     	// 我后触发
	        .......
	    })
	    console.log(&#x27;我触发了&#x27;)	// 我先触发
	}
	</pre>

4.  setState的异步回调
	<pre>
	changeState() {
	    this.setState({     	// 我后触发
	        .......
	    },()=>{
		console.log('我触发了')	// state更新后我才执行
	    })
	    console.log(&#x27;我触发了&#x27;)	// 我先触发
	}
	</pre>


### react组件：无状态函数式组件 ###
>  什么意思呢？其实就是，如果一个组件，它没有自己的内部state，那么就可以称这个组件为 "无状态组件"，而且这种无状态组件是没有react生命周期函数的，并且react也提倡组件是无状态的。这样的组件可以改写成另外的一种形式

1.  "有状态组件" 的常规写法
	<pre>
	export default class Footer extends React.Component {
		constructor(props) {
	  	super(props);
		  	this.state = {
		  		data: '我是state数据'
		  	}
		}
		render({
			let {data} = this.state;
			return(
				&lt;div&gt;{data}&lt;/div&gt;
			)
		})
	}
	</pre>

2.  "无状态组件" 的常规写法：其实就是把render里面的所有东西都提取出来，去掉reader就可以了
	<pre>
	export default function Footer() {
		let data = '我是state数据'
		return(
			&lt;div&gt;{data}&lt;/div&gt;
		)
	}
	</pre>


### react组件：生命周期 ###
> 一个组件的创建到移除的阶段

1.  Mounting：jsx对象渲染进页面
2.  Updating：更新state
3.  Upmounting：组件被移除
	<pre>
	export default class Home extends React.Component {
	    componentDidMount() {
	        console.log(&#x27;组件 渲染完成&#x27;)
	    }
	    componentDidUpdate() {
	        console.log(&#x27;组件 更新好了&#x27;)
	    }
	    componentWillMount() {
	        console.log(&#x27;组件 卸载完成&#x27;)
	    }
	    render() {.....}
	}
	</pre>

## React工作原理 ##
1.  渲染组件：ReactDOM.render() 渲染jsx到页面中
2.  更新组件：比如setState之后去重新生成整个组件结构，然后在用diff方法去比较更新前后的不同，最后把不同的地方重新渲染，形成更新后的结构


### 事件系统 ###
> 和原生的事件系统类似，只是前面要加on

1.  不传递参数的情况
	<pre>
	&lt;button onClick={eventFn}&gt;&lt;/button&gt;
	</pre>

2.  传递参数的情况
	<pre>
	&lt;button
		onClick = {ev=&gt;eventFn(data)}
	&gt;&lt;/button&gt;
	</pre>

### 受控组件和非受控组件 ###
> react提倡我们尽量让组件是受控的，什么意思呢？比如你的组件中有一个input输入框，而在你每次输入的时候，输入框里面的内容都在变化，然后你可以用event.target.value去获取输入框里面的value值<br>
> 这个时候，那个input输入框得到的value值，其实就是非受控的组件，因为你的state里面没有绑定这个value值，你得到的value值的变化，其实是input原生自带的功能

1.  非受控组件
	<pre>
	&lt;input type=&quot;text&quot;&gt;
	</pre>

2.  受控组件：这样做的好处是，你获取到的value值，可以供给其他的地方去使用,并且也是动态更新的
	<pre>
	export default class Item extends React.Component {
		constructor(props) {
		  	super(props);
		  	this.state = {
		  		val: &#x27;&#x27;
		  	};
		  	this.valChange = this.valChange.bind(this);
		}
		valChange(event) {
			this.setState({
				val: event.target.value.trim()
			})
		}
		render() {
			let {val} = this.state;
	
			return(
				&lt;input type=&quot;text&quot; value={val} onChange={valChange}&gt;
			)
		}
	}
	</pre>


# 路由 #
> 可以理解为匹配视图

1.  安装路由
	<pre>
	npm i -S react-router-dom
	</pre>

2.  引入路由，顺便换了个名字
	<pre>
	import {BrowserRouter as Router} from 'react-router-dom'
	</pre>

3.  使用路由
	<pre>
	ReactDOM.render(
		&lt;Router&gt;
			&lt;App/&gt;
		&lt;/Router&gt;,
	    document.getElementById(&#x27;root&#x27;)
	)
	</pre>

4.  如果Router里面包含多个组件，请使用一个跟节点将其包含
	<pre>
	ReactDOM.render(
		&lt;Router&gt;
			&lt;div&gt;
				&lt;App/&gt;
				&lt;Bpp/&gt;
			&lt;/div&gt;
		&lt;/Router&gt;,
	    document.getElementById(&#x27;root&#x27;)
	)
	</pre>


## 路由：Route ##
> 它是react路由最重要的一个组件，它是匹配你的请求，来渲染相应的组件

1.  引入Route
	<pre>
	import {BrowserRouter as Router, Route} from 'react-router-dom'
	</pre>

2.  使用Route，访问这些组件的时候，加上路径即可
	<p>(1) component匹配方式：组件匹配</P>
	<pre>
	ReactDOM.render(
		&lt;Router&gt;
			&lt;div&gt;
				&lt;Route path=&quot;/a&quot; component={A}/&gt;
				&lt;Route path=&quot;/b&quot; component={B}/&gt;
			&lt;/div&gt;
		&lt;/Router&gt;,
	    document.getElementById(&#x27;root&#x27;)
	);
	</pre>
	<p>(2) render匹配方式：函数匹配</P>
	<pre>
	ReactDOM.render(
		&lt;Router&gt;
			&lt;div&gt;
				&lt;Route path=&quot;/app&quot; render={
					()=&gt;{
						return (
							&lt;App/&gt;
						)
					}
				}/&gt;
			&lt;/div&gt;
		&lt;/Router&gt;,
	    document.getElementById(&#x27;root&#x27;)
	);
	</pre>
	<p>(3) children匹配方式：函数匹配；它与render一般只用一种即可，它与render的唯一不同就是，不管有没有匹配，你都想显示些什么内容的时候，你就可以用children</P>
	<pre>
	ReactDOM.render(
		&lt;Router&gt;
			&lt;div&gt;
				&lt;Route path=&quot;/app&quot; children={
					()=&gt;{
						return (
							&lt;App/&gt;
						)
					}
				}/&gt;
			&lt;/div&gt;
		&lt;/Router&gt;,
	    document.getElementById(&#x27;root&#x27;)
	);
	</pre>


## 路由：Route匹配规则(exact | strict) ##
> 更多匹配规则详见react文档<br>
> 路由有三种匹配规则，一是默认匹配规则，二是exact(精确匹配)，三是strict(严格匹配)<br>
> 
> 默认：/app/a
> 它能同时匹配app和a路径下面的组件<br>
<pre>
&lt;Route path=&quot;/&quot; component={App}/&gt;
如果你的访问地址为：app/a；那么它也会把a路径对应的组件也显示出来
</pre>

> exact：/app
> 它只能匹配到app路径下面的组件<br>
<pre>
&lt;Route path=&quot;/app&quot; exact component={App}/&gt;
</pre>

> strict：/app/
> 你的path路径和访问路径必须严格相等<br>
<pre>
&lt;Route path=&quot;/app/&quot; strict component={App}/&gt;
你的访问路径必须是 /app/
</pre>

## 路由：视图切换(link) ##
> 有两种方式，一种是a链接跳转，还有一种是link组件切换

1.  a链接跳转，它会刷新页面
	<pre>
	&lt;a href=&quot;/app&quot;&gt;app组件&lt;/a&gt;
	</pre>

2.  link配置，它是对原生a链接的封装，它不会刷新页面，不过使用之前记得先引入Link
	<pre>
	&lt;Link to=&quot;/app&quot;&gt;app组件&lt;/Link&gt;
	</pre>

## 路由：Router props ##
> 如何通过路由传递参数，以及里面有很多操作路由的方法，详见react文档

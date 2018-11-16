# JS算法与数据结构 #
> 作为前端开发者而言，可能不会像后端开发那样遇到很多的算法和数据结构问题，但是不论是做前端、 服务端还是客户端， 任何一个程序员都会开始面对更加复杂的问题， 这个时候算法和数据结构知识就变得不可或缺，它是编程能力中很重要的一部分。

## 热身运动 ##


> 翻转字符串

1.  反向遍历字符串
	<pre>
	function reverseString(str){
	  var tmp = '';
	  for(var i=str.length-1; i>=0; i--)
	    tmp += str[i];
	  return tmp
	}
	</pre>

> 数组去重

1.  数组去重
	<pre>
	function unique(arr) {
	    var obj = {};
	    var result = [];
	    for (var i = 0, len = arr.length; i < len; i++) {
	        if (!obj[arr[i]]) {
	            obj[arr[i]] = true;
	            result.push(arr[i])
	        }
	    }
	    return result;
	}
	</pre>

2.  数组中最大差值
	<pre>
	function getMaxProfit(arr){
	  var min = arr[0],
	      max = arr[0];
	  for (var i = 1, len = arr.length; i < len; i++) {
	      if(arr[i] < min) min = arr[i];
	      if(arr[i] > max) max = arr[i];
	  }
	  return max - min;
	}
	</pre>

> 数组排序

1.  冒泡排序：两两比较，如果前一个比后一个大，则交换位置
	<pre>
	var array = [2,1,6,3,1,2,7,5,4];
	function sort(arr) {
	    for (var i = 0, len = arr.length -1; i &lt; len; i++) {
	    	for (var j = 0, les = arr.length - (i+1); j &lt; les; j++) {
			// ">" 从小到大排序
      		// "<" 从大到小排序
	    		if (arr[j] &gt; arr[j+1]) {
	    			var temp = arr[j];
	    			arr[j] = arr[j+1];
	    			arr[j+1] = temp;
	    		}
	    	}
	    }
	}
	sort(array);
	document.write(array);
	</pre>
2.  下标排序：只针对正整数，就当做是玩；原理是把数组的值当成下标去添加到新数组中，对于重复的值，可以先提取出来放到一个数组中，然后在把它们通过数组的插入方法，把重复的项按照下标值重新插入到新数组中
	<pre>
	var array = [2,1,3,4,2,8,2,3,4,4,6];

	function sort(arr) {
	    var newArr = [];    // 接收不重复的值
	    var arrF = [];      // 接收重复的值
	    for (var i = 0, len = arr.length; i < len; i++) {   
	        if (arr[i] >= 0) {
	            var num = arr[i];
	            // 判断数组中是否有重复的项
	            if (newArr[num] == undefined) {
	                newArr[num] = num;
	            } else {
	                arrF.push(num)
	            }
	        }
	    }
	
	    // 把不重复的数组组成的数组转换成数字数组
	    newArr = newArr.join(' ').trim().split(/\s+/);
	    for (var i = 0, len = newArr.length; i < len; i++) {   
	        newArr[i] = Number(newArr[i])
	    }
	
	    // 把重复的数组项重新添加到新数组中
	    for (var i = 0, len = arrF.length; i < len; i++) {
	        var index = newArr.indexOf(arrF[i])
	        if (index != -1) {
	            newArr.splice(index, 0, arrF[i])
	        }
	    }
	    return newArr
	}

	var storeArr = sort(array);
	document.write(storeArr);
	</pre>




## 寻路模式 ##
> 就比如你在做地铁的时候，通过查找路线的方法去找到一条最捷径的路线

1.  深度优先搜索
	<p>
	**特点**：A->B B->C C->D；它是从起点搜索相邻的临界点，在从临界点继续往下搜索，直至目标点，它有层级搜索的意思<br>
	**缺点**：它无法直接找到最优的路线，耗时比较多
	</P>
2.  广度优先搜索
	<p>
	**特点**：像网状一样去广发式搜索，由起始点向四周扩散，覆盖面积广，直至扩散到目标点<br>
	**缺点**：需要大量计算，难以保证搜索性能
	</P>
3.  启发式搜索
	<p>
	**特点**：结合深度、广度搜索，既能保证深度，又能兼顾广度<br>
	</P>

**完整代码如下:**
<pre>
&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;en&quot;&gt;
&lt;head&gt;
	&lt;meta charset=&quot;UTF-8&quot;&gt;
	&lt;title&gt;A-stat-寻路&lt;/title&gt;
	&lt;style&gt;
		* {margin: 0; padding: 0;}
		li {list-style: none;}
		#ul {height: auto; overflow: hidden; margin: 20px auto; border: 1px solid #000; border-right: none; border-bottom: none;}
		#ul li {width: 20px; height: 20px; border: 1px solid #000; border-top: none; border-left: none; float: left;}
		#button {display: block; width: 100px; margin: 0 auto;}
		.info {text-align: center; margin-bottom: 10px;}
		.info span {display: inline-block; margin: 0 10px;}
		.red {background: red; }
		.green {background: green; }
		.blue {background: blue; }
	&lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;ul id=&quot;ul&quot;&gt;&lt;/ul&gt;
&lt;p class=&quot;info&quot;&gt;绿色：起始点&lt;span&gt;&lt;/span&gt;红色：目标点&lt;span&gt;&lt;/span&gt;蓝色：障碍物&lt;/p&gt;
&lt;input type=&quot;button&quot; value=&quot;开始寻路&quot; id=&quot;button&quot;&gt;

&lt;script&gt;
// 0代表可通行 1代表起始点 2代表目标点 3代表障碍
var map = [
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
	0,0,0,0,1,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,2,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
];

// 获取指定元素
var oUl = document.getElementById(&#x27;ul&#x27;);
var aLi = oUl.getElementsByTagName(&#x27;li&#x27;);
var oBtn = document.getElementById(&#x27;button&#x27;);
var startEl = null;	// 起始位置
var endEl = null;	// 结束位置

var cols = Math.sqrt(map.length);	// 网格每一行的数量
var sizeGird = 20;	// 每个网格的大小

var openArr = [];	// 可行路线
var closeArr = [];	// 不可行路线

init();

// 初始化函数
function init() {
	oUl.style.width = ((sizeGird+1) * cols) + 1 + &#x27;px&#x27;;
	creatMap();
	oBtn.onclick = function() {
		openFn();	
	}
}

// 生成地图
function creatMap() {
	// 创建li
	for (var i = 0, len = map.length; i &lt; len; i++) {
		var li = document.createElement(&#x27;li&#x27;);
		oUl.appendChild(li);
		// 标注颜色
		if (map[i] == 1) {
			li.setAttribute(&#x27;id&#x27; , &#x27;start&#x27;);
			li.className = &#x27;green&#x27;;
			startEl = document.getElementById(&#x27;start&#x27;);
			openArr.push(li);
		} else if (map[i] == 2) {
			li.setAttribute(&#x27;id&#x27; , &#x27;end&#x27;);
			li.className = &#x27;red&#x27;;
			endEl = document.getElementById(&#x27;end&#x27;);
		} else if (map[i] == 3) {
			li.className = &#x27;blue&#x27;;
			closeArr.push(li);
		}
	}
}

/*
	寻路算法的程序实现：
	1.open队列：收集可行路线
	2.close队列：排除干扰路线
	3.查询相邻位置
	4.封装估价函数
	5.设置父节点指针
*/
function openFn() {
	var nowEl = openArr.shift();
	// 递归结束条件
	if (nowEl == endEl) {
		// 当递归结束后，在地图上标出路径
		showLine();
		return
	}
	closeFn(nowEl);
	findFn(nowEl);
	// 根据绑定的num值，去把最近的一个元素排在最后面
	openArr.sort(function(a, b) {
		return a.num - b.num
	})
	openFn()
}
function closeFn(nowEl) {
	closeArr.push(nowEl)
}
function findFn(nowEl) {
	var result = [];

	// 查找可行的元素
	for (var i = 0, len = aLi.length; i &lt; len; i++) {
		if (filter(aLi[i])) {
			result.push(aLi[i]);
		}
	}

	// 查找可行的元素中离选中元素最近的元素集合，然后添加到openArr中
	for (var i = 0, len = result.length; i &lt; len; i++) {
		var size = sizeGird + 1;
		var l = Math.abs(nowEl.offsetLeft - result[i].offsetLeft); 
		var t = Math.abs(nowEl.offsetTop - result[i].offsetTop); 
		if (l &lt;= size &amp;&amp; t &lt;= size) {
			result[i].num = f(result[i]);
			result[i].parent = nowEl;
			openArr.push(result[i]);
		}
	}

	// 排查不可行的元素 openArr closeArr 都需要遍历
	function filter(el) {
		for (var i = 0, len = closeArr.length; i &lt; len; i++) {
			if (closeArr[i] == el) {
				return false
			}
		}
		for (var i = 0, len = openArr.length; i &lt; len; i++) {
			if (openArr[i] == el) {
				return false
			}
		}
		return true
	}
}

/*
	封装估价函数：f(n) = g(n) + h(n)
	--f(n)：n节点的估价函数
	--g(n)：起始点=&gt;n节点 的最短路径
	--h(n)：n节点=&gt;目标点 的最短路径
	(n节点：起始点=&gt;目标点 过程中的节点)
*/ 
function f(n) {
	return g(n) + h(n)
}
function g(n) {
	var l = startEl.offsetLeft - n.offsetLeft;
	var t = startEl.offsetTop - n.offsetTop;
	return Math.sqrt(l*l +t*t)
}
function h(n) {
	var l = endEl.offsetLeft - n.offsetLeft;
	var t = endEl.offsetTop - n.offsetTop;
	return Math.sqrt(l*l +t*t)
}

// 当递归结束后，在地图上标出路径
function showLine() {
	var result = [];
	var iNow = 0;
	var lastEl = closeArr.pop();
	findParent(lastEl);

	var timer = setInterval(function() {
		result[iNow].style.background = &#x27;#333&#x27;;
		iNow ++;
		if(iNow == result.length){
			clearInterval(timer);
		}
	}, 100);

	function findParent(el) {
		result.unshift(el);
		if( el.parent == startEl ) {
			return;
		}
		findParent(el.parent)
	}
}
&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;
</pre>


## 八皇后 ##
> 来源于国际象棋，就是每个皇后所在的位置上，它的横、纵、斜都不能有其他皇后
> 下面的例子是一个 8 * 8 的棋盘，如何让最后一排上也能放上一个皇后，这是个问题
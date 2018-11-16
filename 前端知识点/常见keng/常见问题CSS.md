# CSS相关问题 #
#### 普通css问题 ####
<pre>
<a href="#ElementContent">元素居中问题</a> <a href="#VUEscoped">vue的scoped</a>  <a href="#multEllipsis">css实现多行省略号</a>
</pre>


#### <div id="ElementContent">元素居中问题</div> ####
> 如果你想让 **子元素块** 水平、垂直居中不会有兼容问题的话，建议使用定位。
<pre>
position: absolute;
left: 0;
top: 0;
bottom: 0;
right: 0;
width: 设置宽度;
height: 设置高度;
margin: auto;
</pre>

#### <div id="VUEscoped">vue的scoped</div> ####
> 在项目中一定提取出公共样式和插件的常用样式，在单页面中，尽量在style标签上面添加scoped区域设置样式。否则在以后的维护中很有可能因为样式问题导致时间的浪费

#### <h2 id="multEllipsis">css实现多行省略号</h2> ####
文章链接: [https://blog.csdn.net/xiaoqingpang/article/details/78952621](https://blog.csdn.net/xiaoqingpang/article/details/78952621 "文章链接")
<pre>
.mult_line_ellipsis{
  overflow: hidden;
  text-overflow:ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;	// 这里是表示从第几行开始显示省略号
  -webkit-box-orient: vertical;
}
</pre>
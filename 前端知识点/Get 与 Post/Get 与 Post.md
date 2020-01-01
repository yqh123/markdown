# HTTP 请求方法：GET 和 POST #
在客户机和服务器之间进行请求-响应时，两种最常被用到的方法是：GET 和 POST。

- Get：从指定资源请求数据
- Post：向指定资源发送数据


# GET 方法 #
查询字符串（名称/值对）是在 GET 请求的 URL 中发送的：
<pre>
/test/demo_form.asp?name1=value1&name2=value2
</pre>

有关 GET 请求的其他一些注释：

- 请求可被缓存
- 请求保留在浏览器历史记录中
- 请求可被收藏为书签
- 请求不应在处理敏感数据时使用
- 请求有长度限制
- 数据格式只能是字符串
- 请求只应当用于取回数据


# POST 方法 #
查询字符串（名称/值对）是在 POST 请求的 HTTP 消息主体中(request body)发送的：
<pre>
POST /test/demo_form.asp HTTP/1.1
Host: w3schools.com
name1=value1&name2=value2
</pre>

有关 POST 请求的其他一些注释：

- 请求不会被缓存
- 请求不会保留在浏览器历史记录中
- 不能被收藏为书签
- 请求对数据长度没有要求
- 数据格式没有限制


# 比较 GET 与 POST #
下面的表格比较了两种 HTTP 方法：GET 和 POST：

<table>
	<thead>
		<tr>
			<th width="160">属性</th>
			<th>GET</th>
			<th>POST</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>后退按钮/刷新</td>
			<td>没有影响</td>
			<td>数据会被重新提交</td>
		</tr>
		<tr>
			<td>浏览器书签</td>
			<td>可收藏为书签</td>
			<td>不可收藏为书签</td>
		</tr>
		<tr>
			<td>历史记录</td>
			<td>参数保留在浏览器历史中</td>
			<td>参数不会保存在浏览器历史中</td>
		</tr>
		<tr>
			<td>编码类型</td>
			<td>application/x-www-form-urlencoded</td>
			<td>application/x-www-form-urlencoded 或 multipart/form-data。为二进制数据使用多重编码</td>
		</tr>
		<tr>
			<td>对数据长度的限制</td>
			<td>长度受限制（URL 的最大长度是 2048 个字符）</td>
			<td>不受限制</td>
		</tr>
		<tr>
			<td>对数据类型的限制</td>
			<td>只允许字符串</td>
			<td>没有限制</td>
		</tr>
		<tr>
			<td>安全性</td>
			<td>不安全，因为所发送的数据是 URL 的一部分</td>
			<td>相对更安全，因为参数不会被保存在浏览器历史或 web 服务器日志中</td>
		</tr>
		<tr>
			<td>HTTP 发送</td>
			<td>浏览器会把 http header 和 data 一并发送出去，服务器响应200（返回数据）</td>
			<td>浏览器先发送 header，服务器响应100，浏览器再发送 data，服务器响应 200 ok（返回数据）</td>
		</tr>
	</tbody>
</table>

























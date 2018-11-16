# 什么是pm2 #
> 日常开发中需要启动一个node项目，需要用npm run …,，如果终端被关掉，程序也就自动停止，有时候几个项目一起跑起来，好几个终端开着，个人不太喜欢，有一神器可以解决：pm2。pm2 是一个带有负载均衡功能的Node应用的进程管理器.当你要把你的独立代码利用全部的服务器上的所有CPU，并保证进程永远都活着，0秒的重载， PM2是完美的。它非常适合IaaS结构，但不要把它用于PaaS方案。


## 主要特性 ##
- 内建负载均衡（使用 Node cluster 集群模块）
- 后台运行
- 0 秒停机重载，我理解大概意思是维护升级的时候不需要停机.
- 具有 Ubuntu 和 CentOS 的启动脚本
- 停止不稳定的进程（避免无限循环）
- 控制台检测
- 提供 HTTP API
- 远程控制和实时的接口 API ( Nodejs 模块，允许和 PM2 进程管理器交互 )


## 安装pm2 ##
<pre>
npm install -g pm2
</pre>


## 日常使用 ##
由于node的百花齐放，启动一个网站的办法，也会有很多种。这里先以：npm run dev为例：首先查看项目的package.json文件
<pre>
  "scripts": {
    "dev": "node build/dev-server.js --env=local",
    "start": "node build/dev-server.js --env=local",
    "build": "node build/build.js --env=publish",
    "build-local": "node build/build.js"
  }
</pre>
npm run dev 实际就是运行node脚步文件：dev-server.js，<br>
可以用pm2启动：pm2 start build/dev-server.js，可以给这个进程取一个自己记得能理解的名字：pm2 start build/dev-server.js --name XXX，（XXX是你定义的名字），<br>
如果你的node项目配置文件和以上代码不一样，，，莫急，pm2 也是有办法可以启动的（这是一个万能的启动的方法）：
<pre>
pm2 start npm -- run XXX
</pre>
列出由pm2管理的所有进程信息,还会显示一个进程会被启动多少次，因为没处理的异常。<br>
<pre>
pm2 list
</pre>
用它替代：npm run dev，就可以写成：pm2 start npm -- run dev，项目启动：
![pm2](https://images2018.cnblogs.com/blog/886977/201711/886977-20171128142359222-1681967336.png)
虽然项目启动了，但是名字并不是我想要的（我需要个自己能记得住的名字，并且是一个项目一个专属name），这时候可以用：
<pre>
pm2 start npm --watch --name XXX -- run start
</pre>
项目启动：
![pm2](https://images2018.cnblogs.com/blog/886977/201711/886977-20171128142937706-1378783035.png)


## 常使用命令: ##
<pre>
$ pm2 logs 显示所有进程日志
$ pm2 stop all 停止所有进程
$ pm2 restart all 重启所有进程
$ pm2 reload all 0秒停机重载进程 (用于 NETWORKED 进程)
$ pm2 stop 0 停止指定的进程
$ pm2 restart 0 重启指定的进程
$ pm2 startup 产生 init 脚本 保持进程活着
$ pm2 web 运行健壮的 computer API endpoint
$ pm2 delete 0 杀死指定的进程
$ pm2 delete all 杀死全部进程
</pre>
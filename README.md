# 另『一个』手机客户端
复杂世界里，『一个』还不够。

## 简介
我（一个文艺青年）平常都在『一个』手机客户端上看文章，但是它有以下缺点：

 + 只提供10期内容
 + 有广告
 + 收藏文章需要登录，并且动不动就被清空
 + 看过的内容没有缓存在手机里，没办法离线阅读

另『一个』就是为了解决这些缺点而被开发出来的。

## 开发进度
目前完成了基本的内容抓取功能，还有这些待完成：

 - [ ] 跳转功能：跳转到任意一期
 - [x] 缓存功能：将内容缓存到手机里，方便离线阅读
 - [ ] 收藏功能
 - [ ] 已阅功能：记录哪几期是已经读过的，还可以将读过的某一期重新标记为未阅读状态
 - [ ] 样式：最后再完善样式，使它方便在手机上浏览
 
## 在线预览

在线预览**仅**支持 Chrome 浏览器，因为使用了 [FileSystem API](http://www.html5rocks.com/en/tutorials/file/filesystem/) 缓存数据。

> 使用这个被弃用的 API 是因为 [PhoneGap](http://phonegap.com/) 使用此 API 读写手机的文件系统，详情见 [FileSystem 插件文档](http://plugins.cordova.io/#/package/org.apache.cordova.file)。

 1. 先将你的 Chrome 设置为允许发起跨域请求（[如何设置？](https://www.baidu.com/s?wd=chrome+跨域)）
 2. 在新打开的标签页里按下 F12 弹出开发人员工具，并单击左上角的手机图标
 3. 选择一个你喜欢的手机模式
 4. 在地址栏输入 http://lmk123.github.io/app-another-one/www/
 
在线预览比较慢，另外，一些手机上才有的功能会被替换或将无法使用。
 
## 声明
 本程序仅供学习交流所用，程序的所有内容均来自[『一个』官方网站](http://www.wufazhuce.com/one/)，内容版权归『一个』所有。
 
## 许可
 [GNU General Public License Version 3](https://www.gnu.org/licenses/gpl.html) 或更高版本。
 

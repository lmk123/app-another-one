# 另『一个』移动客户端
复杂世界里，[『一个』](http://www.wufazhuce.com/one/)还不够。

## 简介
我（一个文艺青年）平常都在[『一个』手机客户端](http://shouji.baidu.com/software/item?docid=7662760)上看文章，但是它有以下缺点：

 + 只提供10期内容
 + 有广告
 + 收藏文章需要登录，并且动不动就被清空
 + 看过的内容没有缓存在手机里，没办法离线阅读

另『一个』就是为了解决这些缺点而被开发出来的。

## 开发进度
目前完成了基本的内容抓取功能，还有这些待完成：

 - [ ] 菜单：菜单里应该包含这些项：收藏列表、跳转到某一期。从右边滑出来
 - [x] 文件系统：使用 FileSystem API 将数据保存到本地
 - [ ] 将图片也保存到 FileSystem 中
 - [ ] 收藏功能：这个数据用 localStorage 保存吧
 
## 在线预览
在线预览地址：http://lmk123.github.io/app-another-one/

在线预览支持 IE9+ 及其他现代浏览器。如果你使用 Chrome 访问，那么将会使用 [FileSystem API](http://www.html5rocks.com/en/tutorials/file/filesystem/) 保存数据到本地，这样就可以离线阅读了。（注：图片暂时没有保存到本地）

> 使用这个被弃用的 API 是因为 [PhoneGap](http://phonegap.com/) 使用此 API 读写手机的文件系统，详情见 [ FileSystem 插件文档](http://plugins.cordova.io/#/package/org.apache.cordova.file)。
 
## 端到端测试
 > 先确保你全局安装了 [Protractor](https://github.com/angular/protractor)
 
 修改 [test/protractor.conf.js](https://github.com/lmk123/app-another-one/tree/master/test/protractor.conf.js) 里的 `params.testUrlRoot` 属性，然后运行 `npm test`
 
## 声明
 本程序仅供学习交流所用，内容版权归[『一个』](http://www.wufazhuce.com/one/)所有。
 
## 许可
 [GNU General Public License Version 3](https://www.gnu.org/licenses/gpl.html) 或更高版本。
 

## 隐藏功能介绍

+ 文件托放编辑功能：支持直接拖入文本文件进入编辑区域进行编辑
+ 可以进入预览页面，使用浏览器自带的打印功能打印页面


## markdown 语法

# 一级标题
## 二级标题
### 三级标题

*斜体* 
_斜体_

**粗体**
__粗体__



* 列表1
* 列表2
* 列表3


1. 有序列表1
1. 有序列表2
1. 有序列表3

> 引用

>> 嵌套第二层

点 [这个链接](https://github.com/wy-ei/markdown-editor “markdown editor”)  去github查看源代码。

插入图片

![markdown](src/md.jpg)

插入代码

```
!function(){
	var fullscreen = document.getElementById('edit-full-screen');
	fullscreen.addEventListener('click',function(){
		document.body.classList.remove('preview-mode');
		document.body.classList.add('edit-full-screen-mode');
	},false);
}();

```


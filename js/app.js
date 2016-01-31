'use strict';
var wm = new Vue({
  el: "#markdown",
  data: {
    sourceContent: "",
    fullScreetEditState: "全屏编辑",
    fullScreenPreviewState: "预览",
    isSaved:false
  },
  methods: {
    dropHandler: function(event) {
      var that = this;
      var files = event.dataTransfer.files;
      for (var i = 0, len = files.length; i < len; i++) {
        var reader = new FileReader();
        if (/text/.test(files[i].type) || /\.md$/i.test(files[i].name)) {
          reader.readAsText(files[i]);
          reader.onload = function() {
            that.sourceContent = reader.result;
          }
        } else {
          alert('请拖放文本文件，谢谢！');
        }
      }
    },
    toggleFullScreenEdit: function() {
      this.fullScreetEditState = this.fullScreetEditState == "全屏编辑" ? "退出全屏" : "全屏编辑";
      if (this.$el.classList.contains('fullscreen-edit')) {
        this.$el.classList.remove('fullscreen-edit');
      } else {
        this.$el.classList.remove('fullscreen-preview');
        this.$el.classList.add('fullscreen-edit');
      }
    },
    toggleFullScreenPreview: function() {
      this.fullScreenPreviewState = this.fullScreenPreviewState == "预览" ? "退出预览" : "预览";
      if (this.$el.classList.contains('fullscreen-preview')) {
        this.$el.classList.remove('fullscreen-preview');
      } else {
        this.$el.classList.remove('fullscreen-edit');
        this.$el.classList.add('fullscreen-preview');
      }
    },
    save:function(){
    		if(this.isSaved == false){
        	window.localStorage.setItem('markdown-text',this.sourceContent);
    			this.isSaved = true;
    		}
    }
  },
  ready: function() {
    var text = window.localStorage.getItem('markdown-text');
    if (text) {
    	// because this Vue instance is already in DOM
    	// so ready event will be fired before Vue instance 
    	// create complete,so watch will not notice this change
    	// becase vm.$watch is added after ready hook fired
    	// so use nextTick let this change noticed by $watch.
    	this.$nextTick(function () {
      	this.sourceContent = text;
    	});
    } else {
      var xmlhttp;
      if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
      } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      xmlhttp.open('GET', 'src/example.md');
      xmlhttp.send();
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          this.sourceContent = xmlhttp.responseText;
        }
      };
    }
    // save content every 5s
    setInterval(this.save, 50000);
    window.addEventListener('unload', this.save, false);
  }
});

wm.$watch("sourceContent", function(text) {
  var dist = document.getElementById('dist');
  dist.innerHTML = marked(text);
  this.isSaved = false;
});

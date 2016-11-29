'use strict';

var getToken = require('./getToken');

var QINIU_UPLOADER = null;

marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
});

var wm = new Vue({
    el: "#markdown",
    data: {
        sourceContent: "",
        isFullScreenPreview: false,
        isFullScreenEdit:false,
        isSaved: false,
        isHighLightLoaded:false,
        setting:{
            domStyle: 'none',
            space:'',
            ak:'',
            sk:'',
            domain:'',
            token:''
        }
    },
    methods: {
        toggleFullScreenEdit: function () {
            this.isFullScreenEdit = !this.isFullScreenEdit;
            if(this.isFullScreenEdit){
                this.$el.classList.add('fullscreen-edit');
            }else{
                this.$el.classList.remove('fullscreen-edit');
                this.sourceContent += " ";
            }
        },
        toggleFullScreenPreview: function () {
            this.isFullScreenPreview = !this.isFullScreenPreview;
            if(this.isFullScreenPreview){
                this.$el.classList.add('fullscreen-preview');
            }else{
                this.$el.classList.remove('fullscreen-preview');
            }
        },
        save: function () {
            if (this.isSaved == false) {
                window.localStorage.setItem('markdown-text', this.sourceContent);
                this.isSaved = true;
            }
        },
        tabHandler:function(event){
            var textarea = event.target;
            var text = textarea.value;
            var selectionStart = textarea.selectionStart;
            var selectionEnd = textarea.selectionEnd;
            // convert tab to four space
            var newText = text.slice(0,selectionStart) + '    ' + text.slice(selectionEnd);
            textarea.value = newText;
            // set cursor position
            textarea.selectionStart = selectionStart + 4;
            textarea.selectionEnd = selectionStart + 4;
        },
        print: function(){
            window.print();
        },
        saveSetting:function(){
            if(!this.setting.space || !this.setting.ak || !this.setting.sk || !this.setting.domain){
                alert('以上四项都必须填写');
                return;
            }
            var token = getToken(this.setting.space,this.setting.ak,this.setting.sk);
            var info = {
                space:this.setting.space,
                ak:this.setting.ak,
                sk:this.setting.sk,
                domain:this.setting.domain,
                token:token
            }
            this.setting.token = token;
            localStorage.setItem('qiniu', JSON.stringify(info));
            this.setting.domStyle = 'none';

            if(!QINIU_UPLOADER){
                this.initUpload();
            }else{
                QINIU_UPLOADER.destroy();
                this.initUpload();
            }
        },
        readSetting: function(){
            var info = localStorage.getItem('qiniu');
            if(info){
                info = JSON.parse(info);
                this.setting.space = info.space;
                this.setting.ak = info.ak;
                this.setting.sk = info.sk;
                this.setting.domain = info.domain;
                this.setting.token = info.token;
            }
            this.setting.domStyle = 'none';
        },
        initUpload: function(){
            var _this = this;
            QINIU_UPLOADER = Qiniu.uploader({
                runtimes: 'html5,flash,html4',
                browse_button: 'js-upload-image',
                uptoken: _this.setting.token,
                unique_names: false,
                domain: _this.setting.domain,
                get_new_uptoken: false,
                container: 'js-drag-container',
                max_file_size: '10mb',
                flash_swf_url: 'https://cdn.staticfile.org/Plupload/2.1.1/Moxie.swf',
                max_retries: 3,
                dragdrop: true,
                drop_element: 'js-drag-container',
                chunk_size: '4mb',
                auto_start: true,
                filters: {
                    mime_types : [
                        { title : "Image files", extensions : "jpg,jpeg,png,bmp,gif" },
                    ],
                    max_file_size: "10mb",
                    prevent_duplicates: true
                },
                init: {
                    BeforeUpload: function (up, file) {
                        var alt = file.name.split('.')[0];
                        var insert = '![' + alt  + '正在上传...]';

                        var textarea = document.getElementById('js-textarea');

                        var selectionStart = textarea.selectionStart;
                        var selectionEnd = textarea.selectionEnd;

                        var text = _this.sourceContent;
                        var newText = text.slice(0,selectionStart) + '\n' + insert + '\n' + text.slice(selectionEnd);

                        _this.sourceContent = newText;

                        textarea.selectionStart = selectionStart + insert.length;
                        textarea.selectionEnd = selectionStart + insert.length;
                    },
                    FileUploaded: function (up, file, info) {
                        var domain = up.getOption('domain');
                        var url = 'http://' + domain + '/'+ JSON.parse(info).key;

                        var oldInsertContent = '![' + file.name.split('.')[0]  + '正在上传...]';
                        var newInsertcontent = '![' + file.name.split('.')[0]  +']('+ url +')';

                        _this.sourceContent = _this.sourceContent.replace(oldInsertContent, newInsertcontent);
                    },
                    Error: function (up, err, errTip) {
                        if(err.code == -602){
                            alert('你已经上传过这张图片了');
                        }else{
                            up.files.forEach(function(file){
                                var oldInsertContent = '![' + file.name.split('.')[0]  + '正在上传...]'
                                var newInsertcontent = '![' + file.name.split('.')[0]  +'](上传失败)';

                                _this.sourceContent = _this.sourceContent.replace(oldInsertContent, newInsertcontent);
                            })
                        }
                    },
                    UploadComplete: function () {
                    },
                    Key: function (up, file) {
                        var date = new Date();
                        var key = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '/' + ((date.valueOf() * Math.random()).toFixed(0) + '').substr(0, 6);
                        // do something with key here
                        return key + '.' + file.name.split('.')[1];
                    }
                }
            });
        }

    },
    mounted: function () {
        var _this = this;
        this.readSetting();
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
            xmlhttp.open('GET', 'static/example.md');
            xmlhttp.send();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    this.sourceContent = xmlhttp.responseText;
                }
            };
        }
        // save content every 3s
        setInterval(this.save, 3000);
        window.addEventListener('unload', this.save, false);

        if(this.setting.token){
            this.initUpload();
        }
    }
});

wm.$watch("sourceContent", function (text) {
    if(!this.isFullScreenEdit){
        var dist = document.getElementById('dist');
        dist.innerHTML = marked(text);
    }
    this.isSaved = false;
});

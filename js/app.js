'use strict';

function getToken(bucket, accessKey, secretKey) {
    function utf16to8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    }

    function utf8to16(str) {
        var out, i, len, c;
        var char2, char3;
        out = "";
        len = str.length;
        i = 0;
        while (i < len) {
            c = str.charCodeAt(i++);
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx
                    out += str.charAt(i - 1);
                    break;
                case 12:
                case 13:
                    // 110x xxxx 10xx xxxx
                    char2 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx 10xx xxxx 10xx xxxx
                    char2 = str.charCodeAt(i++);
                    char3 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    }

    /*
     * Interfaces:
     * b64 = base64encode(data);
     * data = base64decode(b64);
     */
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

    function base64encode(str) {
        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    }

    function base64decode(str) {
        var c1, c2, c3, c4;
        var i, len, out;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            /* c1 */
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c1 == -1);
            if (c1 == -1) break;
            /* c2 */
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c2 == -1);
            if (c2 == -1) break;
            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
            /* c3 */
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61) return out;
                c3 = base64DecodeChars[c3];
            } while (i < len && c3 == -1);
            if (c3 == -1) break;
            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
            /* c4 */
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61) return out;
                c4 = base64DecodeChars[c4];
            } while (i < len && c4 == -1);
            if (c4 == -1) break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    }
    var safe64 = function(base64) {
        base64 = base64.replace(/\+/g, "-");
        base64 = base64.replace(/\//g, "_");
        return base64;
    };

    var put_policy = JSON.stringify({
        scope: bucket,
        deadline: 1793791775
    });

    var encoded = base64encode(utf16to8(put_policy));

    var hash = CryptoJS.HmacSHA1(encoded, secretKey);
    var encoded_signed = hash.toString(CryptoJS.enc.Base64);

    var upload_token = accessKey + ":" + safe64(encoded_signed) + ":" + encoded;
    return upload_token;
};


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
            let token = getToken(this.setting.space,this.setting.ak,this.setting.sk);
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
            let _this = this;
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
                        var insert = '![' + alt  +'](正在上传...)';

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

                        var oldInsertContent = '![' + file.name.split('.')[0]  +'](正在上传...)';
                        var newInsertcontent = '![' + file.name.split('.')[0]  +']('+ url +')';

                        _this.sourceContent = _this.sourceContent.replace(oldInsertContent, newInsertcontent);
                    },
                    Error: function (up, err, errTip) {
                        if(err.code == -602){
                            alert('你已经上传过这张图片了');
                        }else{
                            up.files.forEach(function(file){
                                var oldInsertContent = '![' + file.name.split('.')[0]  +'](正在上传...)';
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
        let _this = this;
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
            xmlhttp.open('GET', 'src/example.md');
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

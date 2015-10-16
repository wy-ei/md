window.addEventListener('load', function () {
    'use strict';
    var fullScreenEdit = false; // if enter full screen edit mode don't need update preview page
    var editarea = document.getElementById('edit-area');
    var view = document.getElementById('view-content');
    //handle input event
    ! function () {
        editarea.addEventListener('input', function () {
            if (fullScreenEdit == false) {
                // scroll view window to right position according to cursor position
                scrollWindowAndSetConvertResult();
            }
        }, false);
    }();

    // handle full screen edit button click event
    ! function () {
        var fullscreen = document.getElementById('edit-full-screen');
        fullscreen.addEventListener('click', function () {
            fullScreenEdit = true;
            document.body.classList.remove('preview-mode');
            document.body.classList.add('edit-full-screen-mode');
        }, false);
    }();

    // handle preview button click event
    ! function () {
        var preview = document.getElementById('preview');
        preview.addEventListener('click', function () {
            document.body.classList.remove('edit-full-screen-mode');
            document.body.classList.add('preview-mode');
        }, false);
    }();


    // handle exit full screen edit button click event
    ! function () {
        var preview = document.getElementById('exit-edit-full-screen');
        preview.addEventListener('click', function () {
            view.innerHTML = marked(editarea.value);
            fullScreenEdit = false;
            document.body.classList.remove('edit-full-screen-mode');
            document.body.classList.remove('preview-mode');
        }, false);
    }();



    // handle  exit full screen preview button click event
    ! function () {
        var preview = document.getElementById('view-exit-full-screen');
        preview.addEventListener('click', function () {
            document.body.classList.remove('edit-full-screen-mode');
            document.body.classList.remove('preview-mode');
            var viewToolBar = document.getElementById('view-tool-bar');
            viewToolBar.classList.remove('hover-view');
        }, false);
    }();

    // handle  print button click event
    ! function () {
        var preview = document.getElementById('print');
        preview.addEventListener('click', function () {
            document.body.classList.remove('edit-full-screen-mode');
            document.body.classList.add('preview-mode');

            alert('请使用浏览器自带的打印功能打印此页面');
        }, false);
    }();


    //every 5 sec save the text into localStorage
    ! function () {
        setInterval(function () {
            save();
        }, 5000);
    }();


    /*
     *  init data,if the user has data svaed in localStorage ,read it out
     * if not , load example.md as default
     */
    (function () {
        var text = window.localStorage.getItem('markdown-text');
        if (text) {
            editarea.value = text;
            view.innerHTML = marked(text);
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
                    editarea.value = xmlhttp.responseText;
                    view.innerHTML = marked(xmlhttp.responseText);
                } else if (xmlhttp.readyState == 4 && xmlhttp.status != 200) {
                    console.log('err');
                }
            };
        }
    })();



    function scrollWindowAndSetConvertResult() {
        // we want view the converted content realtime
        // but how can we know the scrollTop value of view container
        // Here is my idea:
        // insert a spacial string at the position of cursor
        // find this spacial string in view container
        // find that node which contains this string
        // and scroll this node,after that result

        var text = editarea.value,
            index = editarea.selectionStart,
            spacialText = "*%^6$@A#$^",
            helpText = "",
            i,
            len;
        helpText = text.slice(0, index);
        helpText += spacialText;
        helpText += text.slice(index);

        view.innerHTML = marked(helpText);

        var children = view.childNodes;
        for (i = 0, len = children.length; i < len; i++) {
            var content = children[i].textContent;
            if (content.indexOf(spacialText) !== -1) {
                break;
            }
        }
        var currentEditNode = children[i];
        console.log(currentEditNode);
        var nodes = currentEditNode.getElementsByTagName("*");

        for (i = 0, len = nodes.length; i < len; i++) {
            var content = children[i].textContent;
            if (content.indexOf(spacialText) !== -1) {
                break;
            }
        }
        currentEditNode = nodes[i] || currentEditNode;
        if (currentEditNode.scrollIntoViewIfNeeded) {
            currentEditNode.scrollIntoViewIfNeeded()
        } else {
            currentEditNode.scrollIntoView();
        }
        view.innerHTML = marked(text);
    }

    var save = (function () {
        var editarea = document.getElementById('edit-area');

        function _save() {
            var text = editarea.value;
            if (text) {
                window.localStorage.setItem('markdown-text', text);
            }
        }
        return _save;
    })();

    //handle close event
    window.addEventListener('unload', save, false);

    var editWindow = document.getElementById('edit-window');
    editWindow.addEventListener('dragover', function (event) {
        event.preventDefault();
        event.target.style.opacity = 0.5;
    });
    editWindow.addEventListener('dragenter', function (event) {
        event.preventDefault();
    });
    editWindow.addEventListener('dragleave', function (event) {
        event.preventDefault();
        event.target.style.opacity = 1;
    });

    editWindow.addEventListener('drop', function (event) {
        event.preventDefault();
        var files = event.dataTransfer.files;
        for (var i = 0, len = files.length; i < len; i++) {
            var reader = new FileReader();
            if (/text/.test(files[i].type)) {
                reader.readAsText(files[i]);
                reader.onload = function () {
                    editarea.value = reader.result;
                    try {
                        view.innerHTML = marked(reader.result);
                    } catch (e) {
                        $alert('解析文件失败！');
                    }
                }
            } else {
                alert('请拖放文本文件，谢谢！');
            }
        }
        event.target.style.opacity = 1;
    });
});

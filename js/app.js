window.addEventListener('load',function(){

	!function(){
		var inputer = document.getElementById('edit-area');
		inputer.addEventListener('input',function(){
			var view = document.getElementById('view-content');
			view.innerHTML = marked(this.value);
		},false);
	}();



	// bind full screen button click event
	!function(){
		var fullscreen = document.getElementById('edit-full-screen');
		fullscreen.addEventListener('click',function(){
			document.body.classList.remove('preview-mode');
			document.body.classList.add('edit-full-screen-mode');
		},false);
	}();



	// bind preview button click event
	!function(){
		var preview = document.getElementById('preview');
		preview.addEventListener('click',function(){
			document.body.classList.remove('edit-full-screen-mode');
			document.body.classList.add('preview-mode');
		},false);
	}();


	// bind exit full screen button click event
	!function(){
		var preview = document.getElementById('exit-edit-full-screen');
		preview.addEventListener('click',function(){
			document.body.classList.remove('edit-full-screen-mode');
			document.body.classList.remove('preview-mode');
		},false);
	}();


	
	// bind  exit full screen preview button click event
	!function(){
		var preview = document.getElementById('view-exit-full-screen');
		preview.addEventListener('click',function(){
			document.body.classList.remove('edit-full-screen-mode');
			document.body.classList.remove('preview-mode');
			var viewToolBar = document.getElementById('view-tool-bar');
			viewToolBar.classList.remove('hover-view');
		},false);
	}();


	

	// bind  print button click event
	!function(){
		var preview = document.getElementById('print');
		preview.addEventListener('click',function(){
			document.body.classList.remove('edit-full-screen-mode');
			document.body.classList.add('preview-mode');
			
			//隐藏工具条
			var viewToolBar = document.getElementById('view-tool-bar');
			viewToolBar.style.display = 'none';
			// viewToolBar.style.opacity = 0;
			// setTimeout(function(){
			// 	viewToolBar.style.opacity = '';
			// 	viewToolBar.classList.remove('none');
			// 	viewToolBar.classList.add('hover-view');
			// }, 3000);
			window.print();
			viewToolBar.style.display = 'block';
		},false);
	}();



	!function(){
		setInterval(function(){
			save();
		}, 5000);
	}();


	//从localStorage里读取出之前编辑过的内容
	!function(){
		var text = window.localStorage.getItem('markdown-text');
		var view = document.getElementById('view-content');
		var editarea = document.getElementById('edit-area');
		if(text){
			editarea.value = text;
			view.innerHTML = marked(text);
		}else{
			var xmlhttp;
			if(window.XMLHttpRequest){
				xmlhttp = new XMLHttpRequest();
			}else{
				xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			xmlhttp.open('GET','src/example.md');
			xmlhttp.send();
			xmlhttp.onreadystatechange = function(){
				if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
					editarea.value = xmlhttp.responseText;
					view.innerHTML = marked(xmlhttp.responseText);
				}else if(xmlhttp.readyState == 4 && xmlhttp.status != 200){
					console.log('err');
				}
			}
		}	
	}();

},false);


var save = (function(){
	var inputer = document.getElementById('edit-area');
	function _save(){
		var text = inputer.value;
		if(text){
			window.localStorage.setItem('markdown-text',text);
		}
	}

	return _save;
})();


window.addEventListener('unload', save,false);
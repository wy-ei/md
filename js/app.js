var fullScreenEdit = false;    // if enter full screen edit mode don't need update preview page

window.addEventListener('load',function(){

	//handle input event
	!function(){
		var inputer = document.getElementById('edit-area');
		inputer.addEventListener('input',function(){
			var view = document.getElementById('view-content');
			if(fullScreenEdit == false){
				view.innerHTML = marked(this.value);
				scroll(view);
			}
		},false);
	}();

	// handle full screen edit button click event
	!function(){
		var fullscreen = document.getElementById('edit-full-screen');
		fullscreen.addEventListener('click',function(){
			fullScreenEdit = true;
			document.body.classList.remove('preview-mode');
			document.body.classList.add('edit-full-screen-mode');
		},false);
	}();

	// handle preview button click event
	!function(){
		var preview = document.getElementById('preview');
		preview.addEventListener('click',function(){
			document.body.classList.remove('edit-full-screen-mode');
			document.body.classList.add('preview-mode');
		},false);
	}();


	// handle exit full screen edit button click event
	!function(){
		var preview = document.getElementById('exit-edit-full-screen');
		var inputer = document.getElementById('edit-area');
		var view = document.getElementById('view-content');
		preview.addEventListener('click',function(){
			view.innerHTML = marked(inputer.value);
			fullScreenEdit = false;		
			document.body.classList.remove('edit-full-screen-mode');
			document.body.classList.remove('preview-mode');
		},false);
	}();


	
	// handle  exit full screen preview button click event
	!function(){
		var preview = document.getElementById('view-exit-full-screen');
		preview.addEventListener('click',function(){
			document.body.classList.remove('edit-full-screen-mode');
			document.body.classList.remove('preview-mode');
			var viewToolBar = document.getElementById('view-tool-bar');
			viewToolBar.classList.remove('hover-view');
		},false);
	}();


	

	// handle  print button click event
	!function(){
		var preview = document.getElementById('print');
		preview.addEventListener('click',function(){
			document.body.classList.remove('edit-full-screen-mode');
			document.body.classList.add('preview-mode');
			
			alert('请使用浏览器自带的打印功能打印此页面');
			//hide tools bar and print
			// var viewToolBar = document.getElementById('view-tool-bar');
			// viewToolBar.style.display = 'none';
			// window.print();
			// viewToolBar.style.display = 'block';
		},false);
	}();


	//every 5 sec save the text into localStorage
	!function(){
		setInterval(function(){
			save();
		}, 5000);
	}();


	/*
	*  init data,if the user has data svaed in localStorage ,read it out
	* if not , load example.md as default
	*/
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


	var scroll = (function(){
		var text = document.getElementById('edit-area');
		return function(elem){
			var scrollTop = text.scrollTop;
			elem.scrollTop =scrollTop;
		}
	})();

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

	//handle close event
	window.addEventListener('unload', save,false);

});
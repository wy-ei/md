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
		},false);
	}();


	

	// bind  print button click event
	!function(){
		var preview = document.getElementById('print');
		preview.addEventListener('click',function(){
			document.body.classList.remove('edit-full-screen-mode');
			document.body.classList.remove('preview-mode');
			document.body.classList.add('print-mode');
			window.print();
		},false);
	}();

},false);
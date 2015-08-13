var http = require('http');
var path = require('path');
var fs = require('fs');


http.createServer(function(req,res){
	var file = path.normalize('.'+req.url);
	console.log('Trying to server',file);

	function reporeError(err){
		console.log(err);
		res.writeHead(500);
		res.end('Internal Server Error.');
	}

	fs.exists(file,function(exists){
		if(exists){
			fs.stat(file,function(err,stats){
				if(err){
					return reporeError(err);
				}
				if(stats.isDirectory()){
					file = file+"/index.html";
					fs.exists(file,function(exists){
						if(exists){
							var rs = fs.createReadStream(file);
							rs.on('error',reporeError);
							res.writeHead(200);
							rs.pipe(res);
						}
					});
				}else{
					var rs = fs.createReadStream(file);
					rs.on('error',reporeError);
					res.writeHead(200);
					rs.pipe(res);
				}
			});
		}else{
			res.writeHead(404);
			res.end('Not found');
		}
	});
}).listen(4001);

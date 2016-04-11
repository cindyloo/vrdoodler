var sys = require("sys"),
my_http = require("http"),
path = require("path"),
url = require("url"),
filesys = require("fs");
glob = require("glob");


my_http.createServer(function(request, response) {
	
	var headers = request.headers;
	var method = request.method;
	
	var body = [];
	  
	var my_path = url.parse(request.url).pathname;
	var url_parts = url.parse(request.url);
	var full_path = path.join(process.cwd(),my_path);
	var data_req = url_parts.query;
		
	  request.on('error', function(err) {
		console.error(err);
	  }).on('data', function(chunk) {
	  console.log("data incoming " + chunk);
		body.push(chunk);
	  }).on('end', function() {
	  	  console.log("request was " + request.url );
		body = Buffer.concat(body).toString();
		
		if (request.method === 'POST' && request.url === '/writeObj') {
    		writeOBJ(".", body);
    	}
		
		if (request.url === '/getObjFiles') {
			sys.puts("getpics received");
			
			var files = getOBJFiles("/assets/doodleverse/",function(files){
					 console.log("length " + files.length);
						 for (f = 0; f< files.length; f++){
						 	var file = files[f];
							 filesys.readFile("/Users/csbishop/Sites/360/vrdoodler/" + file, "binary", function(err, file) {  
								 if(err) {  
									 response.writeHeader(500, {"Content-Type": "text/plain"});  
									 response.write(err + "\n");  
									 response.end();  
									 console.log("error " + f);
					
								 }  
								 else{
									response.writeHeader(200);  
									response.write(file); 
									//response.write("EOF"); 
									response.end();
									console.log("file " + file.length);
								}
							
							});	 
							 
						}
			});
			return;
		}
		  
		response.on('error', function(err) {
		  console.error(err);
		});

 		path.exists(full_path,function(exists){
			sys.puts("full path" + full_path);
			if(!exists){
					response.writeHeader(404, {"Content-Type": "text/plain"});  
					response.write("node sez 404 Not Found\n");  
					response.end();
			}
			else{
			
				
			
				filesys.readFile(full_path, "binary", function(err, file) {  
					 if(err) {  
						 response.writeHeader(500, {"Content-Type": "text/plain"});  
						 response.write(err + "\n");  
						 response.end();  
					
					 }  
					 else{
						response.writeHeader(200);  
						response.write(file, "binary");  
						response.end();
					}
						  
				});
			}
    	});
    // Note: the 2 lines above could be replaced with this next one:
    // response.end(JSON.stringify(responseBody))

    // END OF NEW STUFF
  });
  
  if (request.method === 'POST' && request.url === '/writeObj') {
    writeOBJ(".", body);
  } 
  
}).listen(8080);
sys.puts("yay, Server Running on 8080");  

function getOBJFiles(path, sendBack){
	// options is optional
	return glob("assets/doodleverse/*.obj", function (er, files) {
  	
  		sys.puts("files are " + files);
  		sendBack(files);
  		})
}

function writeOBJ(path, data){
		  if (data == null)
		  	console.log('There has been an error getting your data.');
	
		//probably shoudl do some kind of checking here...
		
		console.log('data ' + data);
		  filesys.writeFile('test.obj', data, function (err) {
			if (err) {
			  console.log('There has been an error saving your obj.');
			  console.log(err.message);
			  return;
			}
			console.log('OBJ saved successfully.')
		  });
		}		
		
		
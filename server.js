var sys = require("sys"),
my_http = require("http"),
path = require("path"),
url = require("url"),
filesys = require("fs");
glob = require("glob");
var php = require("node-php"); 

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
		console.log("urlparts are" + JSON.stringify(url_parts));
		if (request.url === '/writeObj' || url_parts.href.indexOf('/writeObj') > -1) { 
			//writeObjFiles()
			echo("writing files simulation");
		}
		else if (request.url === '/getObjFiles' || url_parts.href.indexOf('/getUserFiles') > -1) {   //this is only used for my local server.  php for web server
			
			
			var files = getOBJFiles("assets/doodleverse/grapes/obj" ,function(files){ //should get real dir
					 console.log("length " + files.length);
						 for (f = 0; f< files.length; f++){
						 	var file = files[f];
						 	
						 	//what is this local drive name?? read local file else write file from path assets/doodleverse
							 filesys.readFile("/Users/csbishop/Sites/360/vrdoodler/" + file, "binary", function(err, file) {  
								 if(err) {  
									 response.writeHeader(500, {"Content-Type": "text/plain"});  
									 response.write(err + "\n");  
									 response.end();  
									 console.log("error " + f);
					
								 }  
								 else{
									response.writeHeader(200);  
									//response.write(file); 
									//response.write("EOF"); 
									response.end();
									console.log("file " + file.length);
								}
							
							});	 
							 
						}
			});
			return;
		}
		if(url_parts.href.indexOf("/getImageFiles") >-1){
		
			console.log("getImageFiles received");
			var files = getImageFiles("assets/doodleverse/wendi",function(files){
					 console.log("length " + files.length);
						 for (f = 0; f< files.length; f++){
						 	var file = files[f];
						 	
						 	//what is this local drive name?? read local file else write file from path assets/doodleverse
							 filesys.readFile("/Users/csbishop/Sites/360/vrdoodler/" + file, function(err, file) {  
								 if(err) {  
									 response.writeHeader(500, {"Content-Type": "image/jpg"});  
									 response.write(err + "\n");  
									 response.end();  
									 console.log("error " + f);
					
								 }  
								 else{
								  response.contentType = 'image/jpg';
								 

									response.writeHeader(200);  
								//	response.write(); 
									//response.write("EOF"); 
									response.end(file, 'binary');
									console.log("file " + file.length);
								}
							
							});	 
							 
						}
			});
        return;
    
    
   		 }
   		
		if(url_parts.href.indexOf("/xyzpdq") >-1){
			//php.cgi(url_parts)();
			console.log("tried php");
		}  
		response.on('error', function(err) {
		  console.error(err);
		});

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

    // Note: the 2 lines above could be replaced with this next one:
    // response.end(JSON.stringify(responseBody))

    // END OF NEW STUFF
  });
  
  if (request.method === 'POST' && request.url === '/writeObj') {
    writeOBJ(".", body);
  } 
  
}).listen(8080);
console.log("yay, Server Running on 8080");  

function getImageFiles(path, sendBack){
	// options is optional
	console.log("path is " + path + "/*.jpg");
	return glob(path + "/*.jpg", function (er, files) {
  		console.log("files are " + files);
  		sendBack(files);
  	});
}


function getOBJFiles(path, sendBack){
	// options is optional
	console.log("path is " + path + "/*.obj");
	return glob(path + "/*.obj", function (er, files) {
  	
  		console.log("files are " + files);
  		sendBack(files);
  		});
}

function writeObjFiles(path, data){
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
		  });*/
		}		
		
		
var sys = require("sys"),
my_http = require("http"),
path = require("path"),
url = require("url"),
filesys = require("fs");
glob = require("glob");



my_http.createServer(function(request,response){
    var my_path = url.parse(request.url).pathname;
    var url_parts = url.parse(request.url);
    var full_path = path.join(process.cwd(),my_path);
    
   
    if(my_path=="/getconfig"){
       sys.puts("request recieved");
        var string = readJSONConfig("/assets/"); //TODO get path param
        sys.puts("string '" + JSON.stringify(string) + "' chosen");
		response.writeHeader(200,{'Content-Type':'application/json', 'Content-Length':JSON.stringify(string).length});
		//response.setHeader("Cache-control", "");
		//response.setHeader("Pragma", "");
		response.write(JSON.stringify(string));
  		
        response.end();
        sys.puts("string sent");
    }
    else if(my_path=="/getPics"){
    	sys.puts("getpics received");
        var files = getImageFiles("/assets/haunted/",function(files){
					 sys.puts("string '" + JSON.stringify(files) + "' chosen");
							response.writeHeader(200,{'Content-Type':'application/json', 'Content-Length':JSON.stringify(files).length});
							response.write(JSON.stringify(files));
							response.end();
							sys.puts("string sent");
					}); //TODO get path param
        
    
    
    }else if(my_path=="/getTwitchIFrame"){
    	sys.puts("client iframe received");
      //'http://twitch.tv/cindyloo477/chat?popout=' });
		//needs www to work.  also still errors with api cross-domain stuff
		//what if I saved this as a file, then pointed to it from local server?
		//still kinda confused how to handle all dependencies
		//document.domain stuff?
			var destParams = url.parse('http://www.twitch.tv/cindyloo477/chat/');

			var reqOptions = {
				host : destParams.host,
				port : 80,
				path : destParams.pathname,
				method : "GET"
			};
		
			var req = my_http.request(reqOptions, function(res) {
				var headers = res.headers;
				headers['Access-Control-Allow-Origin'] = '*';
				headers['Access-Control-Allow-Headers'] = '*';
		
				response.writeHead(200, headers);
		
				res.on('data', function(chunk) {
					response.write(chunk);
				});
		
				res.on('end', function() {
					response.end();
				});
			});
		
			req.on('error', function(e) {
				console.log('An error occured: ' + e.message);
				response.writeHead(503);
				response.write("Error!");
				response.end();
			});
			req.end();
			
    }
    else {
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
    }
    
    
}).listen(8080);
sys.puts("yay, Server Running on 8080");  




function getImageFiles(path, sendBack){
	// options is optional
	return glob("assets/haunted/*.jpg", function (er, files) {
  	
  		sys.puts("files are " + files);
  		sendBack(files);
  		})
}

function readJSONConfig(path){
				var data = filesys.readFileSync(process.cwd() + "/" + path + 'config.json'),
				 myObj;
		
			  try {
				myObj = JSON.parse(data);
				console.dir(myObj);
			  }
			  catch (err) {
				console.log('There has been an error parsing your JSON.')
				console.log(err);
			  }
			  
			  return myObj;
}
		
function writeJSONConfig(path, data){
		  if (data == null)
		  	data = {
				name: 'Person',
				object: 'box',
				width: '20',
				height: '10',
				depth: '20',
				addressX: '100',
				addressY: '100',
				addressZ: '100'
		  };
		
		  var data = JSON.stringify(myOptions);
		
		  filesys.writeFile(path + 'config.json', data, function (err) {
			if (err) {
			  console.log('There has been an error saving your configuration data.');
			  console.log(err.message);
			  return;
			}
			console.log('Configuration saved successfully.')
		  });
		}		
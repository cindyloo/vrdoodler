

/* imports ************/

var MINIMUM_OBJ_LENGTH = 10;




/*load user's objs and narration */
	function loadUserStory(userDir){
		    var xhrImg = new XMLHttpRequest();
 
       		xhrImg.onreadystatechange=function() {
				if (xhrImg.readyState==4 && xhrImg.status==200) {	
				
					if (xhrImg.responseText.indexOf("?PHP")> -1){  //in case we don't have php on the localhost
						
						
						user = "assets/doodleverse/" + userDir + "/obj";
						var images = [dir + "cindarella.obj"];// + dir +"house.jpg",dir +"sun.jpg" ];
						 handleImport(images);
					}
					else{
						var objects =  xhrImg.responseText.split('EOF');    
						var objectsReduced = objects.reduce(function(obj){
							if (obj.length > MINIMUM_OBJ_LENGTH)
								return obj;
						});
						var cameraPathVectors = setupCameraDolly(objects.length); //setup camera path
						var i = 1;
						objects.forEach(function(object){
							var cleanedobj = object.replace(/EOF/,'');
							obj = new THREE.OBJLoader().parse(cleanedobj);				
			
							obj.name = "linedoodleverse";
							importScene(obj, cameraPathVectors[i++]);
						});		
						//if (sound && sound1.buffer) //how bad is this to do?
						//	sound1.start(0); //start audio when images load	
						
				  		raycastGazeForDollyCam();
				  		var pathToSound =  "assets/doodleverse/" + userDir + "/narration.wav";               
						sound1 = new WebAudioAPISound(pathToSound, null, 
						function(){
							$("#loading").removeClass("has-spinner");
							//$("#loading").css("display","none");
							if (sound1.hasOwnProperty("url"))
				 				toggleSound();
				 				
				 				
				 			if (inMobileMode())
				 				$("#blocker").css("display","none");
				 			else
				 				$("#instructions").click();
						}); 
				  	}
				}else{
					if (xhrImg.responseText== ""){  //in case we don't have php on the localhost
							console.log("can't get file for loadUserStory");			
						
					}
				}
			} 
			//var fatcowhostpath = "/home/users/web/b285/moo.vrdoodlercom/";
			if (location.hostname == "localhost") //debugging
				xhrImg.open("GET", "/getUserFiles?q=" + userDir);//easier to use node to get all the files in there even for debugging..);					
			else
				xhrImg.open("GET", "phpsessions/getObjFiles.php?q=" + "../assets/doodleverse/" + userDir + "/obj");
	 
			xhrImg.send(); 
			
			

    	}

/*load user's objs and narration */
	function loadUserImages(userDir){
		    var xhrImg = new XMLHttpRequest();
 
       		xhrImg.onreadystatechange=function() {
				if (xhrImg.readyState==4 && xhrImg.status==200) {	
				
					if (xhrImg.responseText.indexOf("?PHP")> -1){  //in case we don't have php on the localhost
						
						
						user = "assets/doodleverse/" + userDir;
						var images = [dir + "image.jpg"];// + dir +"house.jpg",dir +"sun.jpg" ];
						 handleImport(images);
					}
					else{
							//loadImages();
						var image= new Image();
						var image2 = new Image();
						image.height = 1000;
						//image.title = f.name;
						
						image.src = location.origin + "/assets/doodleverse/" + userDir + "/" + xhrImg.responseText;
						image2.height = 100;
						//image2.title = f.name;
						image2.src = location.origin + "/assets/doodleverse/" + userDir + "/" + xhrImg.responseText;
						$("#preview").append( image2);
						//$("#preview").css("margin-bottom",120);
	
						var texture = new THREE.Texture( image );
						//texture.name=f.name;
						texture.needsUpdate = true;
						
						if (isPhotosphereStory()){
							var psphere = makePhotoSphere(texture,15, 300);
						}
						else{
							var pplane = makePhotoPlane(texture,10,10);
						}
						$("a.imgclose").css("visibility","visible");
				  	}
				}else{
					if (xhrImg.responseText== ""){  //in case we don't have php on the localhost
							console.log("can't get file for loadUserImages");			
						
					}
				}
			} 
			//var fatcowhostpath = "/home/users/web/b285/moo.vrdoodlercom/";
			if (location.hostname == "localhost") //debugging
				xhrImg.open("GET", "/getImageFiles?q=" + userDir);//easier to use node to get all the files in there even for debugging..);					
			else
				xhrImg.open("GET", "phpsessions/getImageFiles.php?q=" + "../assets/doodleverse/" + userDir);
	 
			xhrImg.send(); 
			
			

    	}

	function loadImages(imgArray){
	
			loadedImages = imgArray;
			//create filelist or something to hand to handleImport
			
		}
	
	function handleImport() {
  			var fileList = this.files; /* now you can work with the file list */
  			
  			for (var i = 0; i < fileList.length; i++) {
  			
  				f = fileList[i];		 
				var reader  = new FileReader();
				var extension;
				if (f.name)
					extension = f.name.split( '.' ).pop().toLowerCase();
				else
					extension = f.split( '.' ).pop().toLowerCase();

				
				switch(extension){
					case 'json':
					case '3geo':
					case '3mat':
					case '3obj':
					case '3scn':
	
					reader.addEventListener( 'load', function ( event ) {
						
						var contents = event.target.result;
						try {
							data = JSON.parse( contents );
						} catch ( error ) {
							alert( error );
							return;
						}
						importJSONObject( f.name, data );
	
					}, false );
					reader.readAsText( f );	
					break;
	
				case 'obj':
				case 'txt':
	
					reader.addEventListener( 'load', function ( event ) {
						var contents = event.target.result;
						var object = new THREE.OBJLoader().parse( contents );
						object.name = f.name;
						importScene(object);					
					}, false );
					reader.readAsText( f );
						
					
					break;
					
				case 'jpg':
				case 'png':
					var photo;
					var preview = document.querySelector('#preview');
					
				 	reader.addEventListener("load", function () {
						var image= new Image();
						var image2 = new Image();
						image.height = 1000;
						image.title = f.name;
						image.src = this.result;
						image2.height = 100;
						image2.title = f.name;
						image2.src = this.result;
						preview.appendChild( image2);
						$("#preview").css("margin-bottom",120);
	
						var texture = new THREE.Texture( image );
						texture.name=f.name;
						texture.needsUpdate = true;
						
						if ($("#photosphere").prop("checked")){
							var psphere = makePhotoSphere(texture,15, 100);
						}
						else{
							var pplane = makePhotoPlane(texture,10,10);
						}
						$("a.imgclose").css("visibility","visible");
					});
			
				  	reader.readAsDataURL(f);
					break;
				}	
  			} //for
		}
	
	
	function importScene(object, cameraPathVector){  //if in a group, we want to preserve it... have to change initNewLine...
			
				object.traverse( function ( child ) {						
						if ( child instanceof THREE.Line ) { //THREE.Line
									//initNewLine(null, null, child.geometry, child.geometry.attributes.position);
									initNewLine(cameraPathVector, null, child);
						}
					 });
					 
					
		

	}

	
	/* right outta the three.js editor. thanks @mrdoob! */
	function importJSONObject(fn,data){
		var material;
				
	    var loader = new THREE.JSONLoader();
		var result = loader.parse( data );
		if ( result.materials !== undefined ) {

				if ( result.materials.length > 1 ) {
					material = new THREE.MultiMaterial( result.materials );
				} else {
					material = result.materials[ 0 ];
				}
		} else {
			material = new THREE.MeshStandardMaterial();
		}

		var geo = result.geometry;
		geo.sourceType = "ascii";
		geo.sourceFile = fn;

		var mesh;

		if ( geo.animation && geo.animation.hierarchy ) {
			mesh = new THREE.SkinnedMesh( geo, material );
		} else {
			mesh = new THREE.Mesh( geo, material );
		}
		
		var pos = new THREE.Vector3(0,0,0);	
		if (currentIntersected)
			pos = currentIntersected.position.copy();
		mesh.position.set(pos);
	
		mesh.userData.name = "fromjson";		
		objContainer.add( mesh );
	
	}



	var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};

	var onError = function ( xhr ) {
	};
	


	
	
	function onWindowResize() {
		  if (effect) effect.setSize(window.innerWidth, window.innerHeight);
		  camera.aspect = window.innerWidth / window.innerHeight;
		  camera.updateProjectionMatrix();
	}



/*  camera path creation *********/

	function makePathGeo( pathGeo, color ) {
	
				// 3d shape
	
		pathMesh = THREE.SceneUtils.createMultiMaterialObject( pathGeo, [
			new THREE.MeshLambertMaterial({
				color: 0x0000ff,
				wireframe: true,
				transparent: false
			}),
		new THREE.MeshBasicMaterial({
				color: 0x0000ff,
				wireframe: true,
				transparent: false
		})]);
		pathMesh.scale = 1
		pathMesh.name="cameraPath";
		pathMesh.visible = false;
		scene.add( pathMesh );
		return pathMesh;		
	}
	


function makePath(howManyObjects){  //will use path later
	
		var neighborhoodcurve = new THREE.CatmullRomCurve3([
			new THREE.Vector3(0, 0, 15 ),

			new THREE.Vector3(0, 0, -15 )
		
		] );
		var segments = howManyObjects ; // see if this helps
		
		if (segments > 0){
			var radiusSegments = 1;  //just a single line, no volume needed
			tube = new THREE.TubeGeometry(neighborhoodcurve	, segments, 2, radiusSegments, false);
			makePathGeo(tube, 0xff00ff);
		}
		var ptsPos = neighborhoodcurve.getPoints(segments);
		return ptsPos;
	}
	
	function setupCameraDolly(howManyObjects){

		cameraDollyPathVecArray = makePath(howManyObjects);
		//playback should follow cameraPath ...
		return cameraDollyPathVecArray;
	}

  
/*  line creation *********/
	/* setup buffer geometry to store drawn vertices*/
	function initDrawnLine(lineImported,mv){
		
		var linename;
		var newOrImportedLine;
		if (!lineImported){  //freehand or snap, doesn't matter, init the line
			geometry = new THREE.BufferGeometry();
			positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
			countVertices = 0;
			if (mv){
				positions[0] = mv.x;
				positions[1] = mv.y;
				positions[2] = mv.z;
				countVertices = 1;
			}
			geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );	
			geometry.setDrawRange( 0, 1 );	
			linename = "line";
			
			linematerial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: getCurrentLineWidth() } );
			newOrImportedLine = new THREE.Line( geometry,  linematerial );
            newOrImportedLine.planeTransform = plane.matrixWorld;
			drawnline.push(newOrImportedLine); //to store line	
			mostRecentDrawnLine().position = mv; //for later...
		
		}else{ //loaded from OBJ file
			
			//lineImported.geometry.addAttribute( 'position', positions )
			//lineImported.setDrawRange( 0, geometry.attributes.position.count-1 );
			linename = "lineimported";
            // we've lost the original transform, use bounding box center and ignore rotation
            var box = new THREE.Box3().setFromObject(lineImported);
            lineImported.geometry.computeBoundingBox();
            var center = box.min.lerp(box.max, .5);
            for (var i=0, child; child = lineImported.parent.children[i]; i++) {
                //child.planeTransform = new THREE.Matrix4().makeTranslation(center.x, 0, center.z);                
            }
			newOrImportedLine = lineImported;//.clone();
			newOrImportedLine.material.linewidth = 2;
			drawnline.push(newOrImportedLine); //to store line
			if (mv) 
				mostRecentDrawnLine().position.copy(mv); 
		}
	
		
		
	    //linematerial = new THREE.ShaderMaterial(THREE.LineDisplacementShader); 
	    
		
		
		//mostRecentDrawnLine().position.copy(mv); //do I need this? hm no..
		mostRecentDrawnLine().name = linename;
		//mostRecentDrawnLine().geometry.attributes.position.slice(0, countVertices *3);
		mostRecentDrawnLine().geometry.attributes.position.needsUpdate = true; 
	
	
	console.log("init new Line");
	}
	

	function addToContainer(newline, group){
	
		//create new group or add to pre-existing 
		
		var lineGroup; 
		if (group != null && group.parent.name != "linegroup") {
			    group.parent.name="linegroup";
			    objContainer.add(group.parent);
            }
        else if (lastLineIntersection && lastLineIntersection.name == "line"){
			newline.planeTransform = lastLineIntersection.planeTransform;
			
			lastLineIntersection.parent.add(newline);  //drew off of a pre-existing line, effectively adding to a group here...
			lastLineIntersection.parent.name="linegroup";
		    lastLineIntersection = null;
		
		}else{
		
			lineGroup = new THREE.Object3D();
			lineGroup.add(newline);  
			lineGroup.name="linegroup";
			objContainer.add(lineGroup);
			
			
		}
	
	
	
	}
	
		
	//called from mouseDown
	//works for importing from file or if using mouse to start line
	function initNewLine(mouseVec, bUnproject, lineImported){

		
		if (!lineImported){
			 var vNow = new THREE.Vector3(mouseVec.x, mouseVec.y, mouseVec.z);
			 if (bUnproject)
				vNow.unproject(camera);
		
			initDrawnLine(null, vNow);  //freehand or snap...

		}else //from import
		 	initDrawnLine(lineImported, mouseVec);
		
		addToContainer( mostRecentDrawnLine(), lineImported );
		
		
	
	}


	function mostRecentDrawnLine(){
		if (drawnline && drawnline.length > 0){
			CURRENTspline = drawnline.length -1;
			return drawnline[CURRENTspline];
		}
		return null;
	}




/*  playback routines **********/
	
	function aggregateVertexCount(){
		var count = 0;
		if (drawnline && drawnline.length > 0){
			for (var i=0;i< drawnline.length;i++){
				count += drawnline[i].geometry.attributes.position.count;
			}
		}
		return count;				
		
	}
	
		
	function pb_drawOneAtATime(){
		
		PB_LINE_VERTEX_COUNT_MAX =aggregateVertexCount(); 
	
		var verticesYetToBeDrawn = PB_LINE_VERTEX_COUNT_MAX - playBackCount;
		
		var linesLeftToDraw = playBackCount;
		for (var i=0;i< drawnline.length;i++){
			
			
			var howManyLinesToDraw = linesLeftToDraw;
			var thisLineDrawn = (howManyLinesToDraw > drawnline[i].geometry.attributes.position.count)? drawnline[i].geometry.attributes.position.count:howManyLinesToDraw;
			
			
			
			//count = verticesYetToBeDrawn > (drawnline[i].geometry.attributes.position.count/3)? drawnline[i].geometry.attributes.position.count/3:verticesYetToBeDrawn;
			for (var vertex=0;vertex< thisLineDrawn;vertex++){  //either the full lenght of the line or partial
				drawnline[i].geometry.setDrawRange( 0, vertex * 3);
				drawnline[i].geometry.attributes.position.needsUpdate = true; 
				
			}
			linesLeftToDraw -=  thisLineDrawn; //take this line off
			}
		
	}
	function pb_drawAllAtOnce(){
		for (var i=0;i< drawnline.length;i++){
				if (drawnline[i] === undefined){  //if any weirdness, clean it up
					drawnline.splice(i,1);
					continue;
				}
				if ((drawnline[i].geometry.attributes.position.count/3) > PB_LINE_VERTEX_COUNT_MAX) 
					PB_LINE_VERTEX_COUNT_MAX = (drawnline[i].geometry.attributes.position.count/3);
				var count = playBackCount;
				//determine what should be drawn
				//count from 0 to length vertices of line..
				//right now we are just going to animate each line at the same time....
				
				//truncate the count b/c playBackCount is the long pole
				if (playBackCount > drawnline[i].geometry.attributes.position.count)  //what?
					count =	drawnline[i].geometry.attributes.position.count;
				drawnline[i].geometry.setDrawRange( 0, (count) * 3);
				drawnline[i].geometry.attributes.position.needsUpdate = true; // required after the first render
			}
	
	}
	
	function drawBack(){
		//if (){
		//	pb_drawAllAtOnce();
		//} else {
		if (drawnline && drawnline.length > 0)
			pb_drawOneAtATime();
		//}
	
	}
	
	function setPlayBack(mode){ //on, off
		PLAYBACK = mode;
		if (mode) {
			pbclock.start(); //pbclock = setInterval(updatePB, 500);
			clearLines();

			
		}else{

			pbclock.stop(); //clearInterval(pbtimer);
			for (var i=0;i< drawnline.length;i++){
				drawnline[i].geometry.setDrawRange( 0, drawnline[i].geometry.attributes.position.count-1);
			}
		}
		return mode;
	
	}
	
	
	function togglePlayBackMode(evt){
		if (evt !== undefined) evt.preventDefault();
		PLAYBACK = PLAYBACK?0:1;
		setPlayBack(PLAYBACK);
		return PLAYBACK;
	
	}
	
	
	function clearLines(){
		var count = 0;
		
		if (drawnline && drawnline.length > 0){
			for (var i=0;i< drawnline.length;i++){
					drawnline[i].geometry.setDrawRange( 0, 1);
					drawnline[i].geometry.attributes.position.needsUpdate = true; 
			}
		}

		return count;				
		
	}
	function runLinesPlayBack(){
	
		if (PLAYBACK){
		
			drawBack();
			
			if (pbclock.getDelta() > PLAYBACKSPEED){
				playBackCount+= PLAYBACKCOUNT;
			}		
			if (playBackCount > PB_LINE_VERTEX_COUNT_MAX >0){
	
				playBackCount = 0;
				clearLines();
				/*if (sound1){
					sound1.stop(); 
					sound1.play(); 
				}	*/	

			}
		}	
		
		
		return PLAYBACK;
		
	}
	
	
	function updateSimpleCameraPath(ctrls, cameraSpeed){
	
		camera.position.setZ(camera.position.z - cameraSpeed);
		var tgt = new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z - .002);
		if (DOLLY){
			camera.lookAt(tgt);
			ctrls.target = tgt;
		}
		if (camera.position.z < -20)
			camera.position.setZ(20);
	}
	
	function runCameraPlayBack(ctrls, cameraSpeed){
		//what kind of camera playback is it?
		if (PLAYBACK){
			if (isPhotosphereStory()){
				raycastGazeForDollyCam();
			}else if (isPhotoplaneStory()){
				updateSimpleCameraPath(ctrls, cameraSpeed);
			}
		}
	}
	
	
	
	
	



/* browser checks ********/
// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
	isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	// Firefox 1.0+
	isFirefox = typeof InstallTrigger !== 'undefined';
	// At least Safari 3+: "[object HTMLElementConstructor]"
	isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
	// At least IE6
	isIE = /*@cc_on!@*/false || !!document.documentMode;
	// Edge 20+
	isEdge = !isIE && !!window.StyleMedia;
	// Chrome 1+
	isChrome = !!window.chrome && !!window.chrome.webstore;
	// Blink engine detection
	isBlink = (isChrome || isOpera) && !!window.CSS;
	
	isChromeIOS = navigator.userAgent.match('CriOS');

	isFFIOS = navigator.userAgent.match('Firefox');
	
	isIPAD = navigator.userAgent.match(/iPad/i); //necessary it seems
	
	if(isChrome || isFirefox || isChromeIOS || isFFIOS || isIPAD){
	   // is Google Chrome on IOS
	} else { 
	  alert("VRDoodler requires Chrome or FF on Mac OS. For mobile devices you must have ios 9.3.1");
	 } 
	 
	 
	 
	 function isMobBrowser() { 
		 if( navigator.userAgent.match(/Android/i)
		 || navigator.userAgent.match(/webOS/i)
		 || navigator.userAgent.match(/iPhone/i)
		 || navigator.userAgent.match(/iPad/i)
		 || navigator.userAgent.match(/iPod/i)
		 || navigator.userAgent.match(/BlackBerry/i)
		 || navigator.userAgent.match(/Windows Phone/i)
		 ){
		 
			return true;
		  }
		 else {
			return false;
		  }
	}
	 
	var getParams = (function() {

		var _get = {};
		var re = /[?&]([^=&]+)(=?)([^&]*)/g;
		while (m = re.exec(location.search))
			_get[decodeURIComponent(m[1])] = (m[2] == '=' ? decodeURIComponent(m[3]) : true);
		return _get;
	})();
	
	
	function inMobileMode(){
	
		if (isMobBrowser() || getParams["mobile"] == 1)
			return true;
		else
			return false;
	
	}
	
	function isPhotosphereStory(){
		return (getParams["photosphere"] == 1);
	}
	
	function isPhotoplaneStory(){
		return (getParams["photoplane"] == 1);
	}		
	
	function whichUser(){
		return (getParams["user"]);
	}
	
	
	function makePhotoSphere( tex, w, h){
	
	
			var mesh;
			var sphereGeo = new THREE.SphereGeometry(w,h,h);				
			mesh = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({map:tex, color:0xffffff, side:THREE.DoubleSide}));
			mesh.name="photosphere";
			mesh.position.set(0,8,0);
			if (objContainer)
				objContainer.add(mesh);	
			else
				scene.add(mesh);	
			
			return mesh;
	}
	

	
	
	
	function makePhotoPlane( tex, w, h){
			var mesh;
			var planePhotoGeo = new THREE.PlaneGeometry(w,h);				
			mesh = new THREE.Mesh(planePhotoGeo, new THREE.MeshBasicMaterial({map:tex, color:0xffffff, side:THREE.FrontSide}));
			mesh.name="photoplane";
			mesh.position.set(0,0,0);
			if (objContainer)
				objContainer.add(mesh);	
			else
				scene.add(mesh);	
			return mesh;
	}
	
	
	
		
/* web audio *************/
try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.audioContext = new window.AudioContext();
} catch (e) {
    console.log("No Web Audio API support");
}

/*
 * WebAudioAPISoundManager Constructor
 */
 var WebAudioAPISoundManager = function (context) {
    this.context = context;
    this.bufferList = {};
    this.playingSounds = {};
};

/*
 * WebAudioAPISoundManager Prototype
 */
WebAudioAPISoundManager.prototype = {
     addSound: function (url, startPlayingIfLoaded) {
        // Load buffer asynchronously
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        var self = this;

        request.onload = function () {
            // Asynchronously decode the audio file data in request.response
            self.context.decodeAudioData(
                request.response,

                function (buffer) {
                    if (!buffer) {
                        alert('error decoding file data: ' + url);
                        return;
                    }
                    self.bufferList[url] = buffer;
                    startPlayingIfLoaded();
  
                });
        };

        request.onerror = function () {
            alert('BufferLoader: XHR error');
        };

        request.send();
    },
    stopSoundWithUrl: function(url) {
        if(this.playingSounds.hasOwnProperty(url)){
            for(var i in this.playingSounds[url]){
                if(this.playingSounds[url].hasOwnProperty(i))
                    this.playingSounds[url][i].stop(0);
            }
        }
    }
};

/*
 * WebAudioAPISound Constructor
 */
 var WebAudioAPISound = function (url, options, afterLoad) {
    this.settings = {
        loop: false
    };

    for(var i in options){
        if(options.hasOwnProperty(i))
            this.settings[i] = options[i];
    }

    this.url = url ;
    window.webAudioAPISoundManager = window.webAudioAPISoundManager || new WebAudioAPISoundManager(window.audioContext);
    this.manager = window.webAudioAPISoundManager;
    this.manager.addSound(this.url, afterLoad);
    
};

/*
 * WebAudioAPISound Prototype
 */
WebAudioAPISound.prototype = {
    play: function () {
    	
        var buffer = this.manager.bufferList[this.url];
        //Only play if it's loaded yet
        if (typeof buffer !== "undefined") {
            var source = this.makeSource(buffer);
            source.loop = this.settings.loop;
            source.start(0);

            if(!this.manager.playingSounds.hasOwnProperty(this.url))
                this.manager.playingSounds[this.url] = [];
            this.manager.playingSounds[this.url].push(source);
            this.playbackState = "playing";
        }
    },
    stop: function () {
        this.manager.stopSoundWithUrl(this.url);
        this.playbackState = "stopped";
    },
    getVolume: function () {
        return this.translateVolume(this.volume, true);
    },
    //Expect to receive in range 0-100
    setVolume: function (volume) {
        this.volume = this.translateVolume(volume);
    },
    translateVolume: function(volume, inverse){
        return inverse ? volume * 100 : volume / 100;
    },
    makeSource: function (buffer) {
        var source = this.manager.context.createBufferSource();
        var gainNode = this.manager.context.createGain();
        gainNode.gain.value = this.volume ? this.volume: 0.5;
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(this.manager.context.destination);
        return source;
    }
};










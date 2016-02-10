THREE.LineDisplacementShader = {

	linewidth:5,
	uniforms: { 
      color: { 
			  type: "f", 
			  value: 1.0 },
        time: { // float initialized to 0
            type: "f", 
            value: 0.0 
        }
    },
    


	 vertexShader: document.getElementById( 'vertexShader' ).text,
    fragmentShader: document.getElementById( 'fragmentShader' ).text

};
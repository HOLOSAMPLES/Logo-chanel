 var windowWidth = window.innerWidth, windowHeight = window.innerHeight;
 var camera,renderer,scene;
 var mesh1, mesh2;
 var newMeshReady = false;
 var sizeMesh1 = 25;
 var sizeMesh2 = 30;
 Init();
 animate();

function Init(){
        scene = new THREE.Scene();
  
       //setup camera
 		camera = new LeiaCamera();
        camera.position.copy(_camPosition);
        camera.lookAt(_tarPosition);
        scene.add(camera);
  
       //setup rendering parameter
 		renderer = new LeiaWebGLRenderer({
         antialias:true, 
 		renderMode: _renderMode, 
		shaderMode: _nShaderMode,
		devicePixelRatio: 1 
        } );
 		renderer.Leia_setSize( windowWidth, windowHeight );
 		document.body.appendChild( renderer.domElement );
  
       //add object to Scene
        var bgpic = "resource/curvedclosetwall.jpg";
        var backgroundPlaneTexture = new THREE.ImageUtils.loadTexture( bgpic );
          backgroundPlaneTexture.wrapS = backgroundPlaneTexture.wrapT = THREE.RepeatWrapping; 
        backgroundPlaneTexture.repeat.set( 1, 1 );
        var backgroundPlaneMaterial = new THREE.MeshLambertMaterial( { map: backgroundPlaneTexture, side:       THREE.DoubleSide } );
        var backgroundPlaneGeometry;
          backgroundPlaneGeometry = new THREE.PlaneGeometry(40, 30, 10, 10);
          backgroundPlane = new THREE.Mesh(backgroundPlaneGeometry, backgroundPlaneMaterial);
          backgroundPlane.position.z = -8;
          scene.add(backgroundPlane);
        readSTLs('resource/2014-09-05-Chanel-logo-extruded.stl', 'resource/2014-09-05-Chanel-name-extruded.stl');
  
        //add Light
 		var xl = new THREE.DirectionalLight( 0x555555 );
 		xl.position.set( 1, 0, 2 );
 		scene.add( xl );
 		var pl = new THREE.PointLight(0x111111);
 		pl.position.set(-20, 10, 20);
 		scene.add(pl);
 		var ambientLight = new THREE.AmbientLight(0x111111);	
 		scene.add(ambientLight);
 }

 function animate() 
 {
 	requestAnimationFrame( animate );
    if (newMeshReady) {
		mesh1.position.set(0, 0, 3); 
		mesh2.position.set(0, 0, -3); 
		mesh1.rotation.y = 1.032*Date.now() * 0.001;
	}
    renderer.setClearColor(new THREE.Color().setRGB(1.0, 1.0, 1.0)); 
	renderer.Leia_render(scene, camera,undefined,undefined,_holoScreenScale,_camFov,_messageFlag);
 }
function readSTLs(filename1, filename2) 
{
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
	if ( xhr.readyState == 4 ) {
		if ( xhr.status == 200 || xhr.status == 0 ) {
			var rep = xhr.response; // || xhr.mozResponseArrayBuffer;
			mesh1 = parseStlBinary(rep);
			mesh1.scale.set(sizeMesh1, sizeMesh1, sizeMesh1);
			scene.add(mesh1);
			newMeshReady = true;
			}
		}
	};
	xhr.onerror = function(e) {
		console.log(e);
	};
	xhr.open( "GET", filename1, true );
	xhr.responseType = "arraybuffer";
	xhr.send( null );
	

	var xhr2 = new XMLHttpRequest();
	xhr2.onreadystatechange = function () {
	if ( xhr2.readyState == 4 ) {
		if ( xhr2.status == 200 || xhr.status == 0 ) {
			var rep = xhr2.response;
			mesh2 = parseStlBinary(rep);
			mesh2.scale.set(sizeMesh2, sizeMesh2, sizeMesh2);
			scene.add(mesh2);
			newMeshReady = true;
			}
		}
	};
	xhr2.onerror = function(e) {
		console.log(e);
	};
	xhr2.open( "GET", filename2, true );
	xhr2.responseType = "arraybuffer";
	xhr2.send( null );
}
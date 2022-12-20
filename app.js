
import * as THREE from '/libs/three/three.module.js';
import { GLTFLoader } from '/libs/three/jsm/GLTFLoader.js';
import { DRACOLoader } from '/libs/three/jsm/DRACOLoader.js';
import { RGBELoader } from '/libs/three/jsm/RGBELoader.js';
import { Stats } from '/libs/stats.module.js';
import { LoadingBar } from '/libs/LoadingBar.js';
import { VRButton } from '/libs/VRButton.js';
import { CanvasUI } from '/libs/CanvasUI.js';
import { JoyStick } from '/libs/Toon3D.js';
import { XRControllerModelFactory } from '/libs/three/jsm/XRControllerModelFactory.js';

class App{
	constructor(){
		// create a new div element and add it to the body
        const container = document.createElement( 'div' );
		document.body.appendChild( container );

		// Create variable that contains the path for assets
        this.assetsPath = '/assets/';
        
        // Create Scene
        this.scene = new THREE.Scene();

        // Create Camera
		this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 500 );
		this.camera.position.set( 0, 1.6, 0 );
        
        // Create Dolly and dummy cam
        this.dolly = new THREE.Object3D(  );
        this.dolly.position.set(0, 0, 10);
        this.dolly.add( this.camera );
        this.dummyCam = new THREE.Object3D();
        this.camera.add( this.dummyCam );		
        this.scene.add( this.dolly );
        
        // Create Ambient Light
		const ambient = new THREE.HemisphereLight(0x000000, 0x000000, 1.0);
		this.scene.add(ambient);
		
        // Create Directional Light
		const directional = new THREE.DirectionalLight(0xFFFFFF, 1.0);
		this.scene.add(directional);

        /* // Load background Texture
         const textureloader = new THREE.TextureLoader().setPath(this.assetsPath);
        const bgTexture = textureloader.load('Background.png');
        this.scene.background = bgTexture;  */
  
    const loader2 = new THREE.CubeTextureLoader().setPath(this.assetsPath);;
  const texture = loader2.load([
    'XPos.png',
    'XMin.png',
    'YPos.png',
    'YMin.png',
    'ZPos.png',
    'ZMin.png',
  ]);
  this.scene.background = texture;  


		// Create Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		container.appendChild( this.renderer.domElement );
        
        // Call set Environment method
        this.setEnvironment();
	
        // We add the method resize to the "resize" event called by the window
        window.addEventListener( 'resize', this.resize.bind(this) );
        

        this.clock = new THREE.Clock();
        this.up = new THREE.Vector3(0,1,0);
        this.origin = new THREE.Vector3();
        this.workingVec3 = new THREE.Vector3();
        this.workingQuaternion = new THREE.Quaternion();
        this.raycaster = new THREE.Raycaster();
        
        this.stats = new Stats();
		container.appendChild( this.stats.dom );
        
		this.loadingBar = new LoadingBar();
		
        // We load the glb model
		this.loadCollege();
        
        const self = this;
        
        //Fetch the college json file
        fetch('./college.json')
            .then(response => response.json())
            .then(obj =>{
                self.boardShown = '';
                self.boardData = obj;
            });
	}
	
    // set Environment basically loads the 360 image
    setEnvironment(){
        const loader = new RGBELoader().setDataType( THREE.UnsignedByteType );
        const pmremGenerator = new THREE.PMREMGenerator( this.renderer );
        pmremGenerator.compileEquirectangularShader();
        
        const self = this;
        
        loader.load( '/assets/hdr/venice_sunset_1k.hdr', ( texture ) => {
          const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
          pmremGenerator.dispose();

          self.scene.environment = envMap;

        }, undefined, (err)=>{
            console.error( 'An error occurred setting the environment');
        } );
    }
    
    // resize rendering size  if window size changes
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	 loadCollege(){
        
		const loader = new GLTFLoader( ).setPath(this.assetsPath);
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( '/libs/three/js/draco/' );
        loader.setDRACOLoader( dracoLoader );
        
        const self = this;
		
		// Load a glTF resource
		loader.load(
			// resource URL
			'Room.glb',
			// called when the resource is loaded
			function ( gltf ) {

                const room = gltf.scene.children[0];
				//const material = new THREE.MeshStandardMaterial()
                room.material =  new THREE.MeshStandardMaterial({color : 0xEBEBEB, roughness: 0.5, metalness: 0.0, emissive: 0x000000, side : THREE.DoubleSide})
                self.scene.add( room );
				
				room.traverse(function (child) {
    				if (child.isMesh){
						 if (child.name.indexOf("PROXY")!=-1){
							child.material.visible = false;
							self.proxy = child;
                            console.log("Wall found");
						}                                               
                         else if (child.material.name.indexOf('Glass')!=-1){
                            child.material.opacity = 0.1;
                            child.material.transparent = true;
                        }else if (child.material.name.indexOf("SkyBox")!=-1){
                            const mat1 = child.material;
                            const mat2 = new THREE.MeshBasicMaterial({map: mat1.map});
                            child.material = mat2;
                            mat1.dispose();
                        } 
					}
				});
                       
                /* const door1 = room.getObjectByName("LobbyShop_Door__1_");
                const door2 = room.getObjectByName("LobbyShop_Door__2_");
                const pos = door1.position.clone().sub(door2.position).multiplyScalar(0.5).add(door2.position);
                const obj = new THREE.Object3D();
                obj.name = "LobbyShop";
                obj.position.copy(pos);
                room.add( obj ); */
                
                self.loadingBar.visible = false;
			
                self.setupXR();
			},
			// called while loading is progressing
			function ( xhr ) {

				self.loadingBar.progress = (xhr.loaded / xhr.total);
				
			},
			// called when loading has errors
			function ( error ) {

				console.log( 'An error happened' );

			}
		);
	} 
    

    /* loadCollege(){

        // Instantiate a loader
        const loader = new GLTFLoader( ).setPath(this.assetsPath);

            // Load a glTF resource
        loader.load(
        // resource URL
        'college.glb',
        // called when the resource is loaded
        function ( gltf ) {

            scene.add( gltf.scene );
        },
        // called while loading is progressing
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
);

    } */
    onMove( forward, turn ){
        if (this.dolly){
            this.dolly.userData.forward = forward;
            this.dolly.userData.turn = -turn;
        }
    }
    
    setupXR(){
        this.renderer.xr.enabled = true;

        const self = this;
 

        const btn = new VRButton( this.renderer, { vrStatus } );
        
        function vrStatus( available ){
            if (available){
        
                function onSelectStart( event ) {

                    this.userData.selectPressed = true;

                }

                function onSelectEnd( event ) {

                    this.userData.selectPressed = false;

                }

                self.controllers = self.buildControllers( self.dolly );

                self.controllers.forEach( ( controller ) =>{
                    controller.addEventListener( 'selectstart', onSelectStart );
                    controller.addEventListener( 'selectend', onSelectEnd );
                });
                
            }else{
                
                self.joystick = new JoyStick({
                    onMove: self.onMove.bind(self)
                });
                
            }
        }
        
        
        
        const config = {
            panelSize: { height: 0.5 },
            height: 256,
            name: { fontSize: 50, height: 70 },
            info: { position:{ top: 70, backgroundColor: "#ccc", fontColor:"#000" } }
        }
        const content = {
            name: "name",
            info: "info"
        }
        
        this.ui = new CanvasUI( content, config );
        this.scene.add( this.ui.mesh );
        
        this.renderer.setAnimationLoop( this.render.bind(this) );
    }
    
    buildControllers( parent = this.scene ){
        const controllerModelFactory = new XRControllerModelFactory();

        const geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -1 ) ] );

        const line = new THREE.Line( geometry );
        line.scale.z = 0;
        
        const controllers = [];
        
        for(let i=0; i<=1; i++){
            const controller = this.renderer.xr.getController( i );
            controller.add( line.clone() );
            controller.userData.selectPressed = false;
            parent.add( controller );
            controllers.push( controller );
            
            const grip = this.renderer.xr.getControllerGrip( i );
            grip.add( controllerModelFactory.createControllerModel( grip ) );
            parent.add( grip );
        }
        
        return controllers;
    }
    
    moveDolly(dt){
        if (this.proxy === undefined) return;
        
        const wallLimit = 1.3;
        const speed = 2;
		let pos = this.dolly.position.clone();
        pos.y += 1;
        
		let dir = new THREE.Vector3();
        let quaternion, q = new THREE.Quaternion();
        
        if (this.joystick === undefined){
            //Store original dolly rotation
            quaternion = this.dolly.quaternion.clone();
            //Get rotation for movement from the headset pose
            this.dolly.quaternion.copy( this.dummyCam.getWorldQuaternion(q) );
            this.dolly.getWorldDirection(dir);
            dir.negate();
        }else{
            this.dolly.getWorldDirection(dir);
            if (this.dolly.userData.forward>0){
                dir.negate();
            }else{
                dt = -dt;
            }
        }
		this.raycaster.set(pos, dir);
		
        let blocked = false;
		
		let intersect = this.raycaster.intersectObject(this.proxy);
        if (intersect.length>0){
            if (intersect[0].distance < wallLimit) blocked = true;
        }
		
		if (!blocked){
            this.dolly.translateZ(-dt*speed);
            pos = this.dolly.getWorldPosition( this.origin );
		}
		
        //cast left
        dir.set(-1,0,0);
        dir.applyMatrix4(this.dolly.matrix);
        dir.normalize();
        this.raycaster.set(pos, dir);

        intersect = this.raycaster.intersectObject(this.proxy);
        if (intersect.length>0){
            if (intersect[0].distance<wallLimit) this.dolly.translateX(wallLimit-intersect[0].distance);
        }

        //cast right
        dir.set(1,0,0);
        dir.applyMatrix4(this.dolly.matrix);
        dir.normalize();
        this.raycaster.set(pos, dir);

        intersect = this.raycaster.intersectObject(this.proxy);
        if (intersect.length>0){
            if (intersect[0].distance<wallLimit) this.dolly.translateX(intersect[0].distance-wallLimit);
        }

        //cast down
        dir.set(0,-1,0);
        pos.y += 1.5;
        this.raycaster.set(pos, dir);
        
        intersect = this.raycaster.intersectObject(this.proxy);
        if (intersect.length>0){
            this.dolly.position.copy( intersect[0].point );
        }

        //Restore the original rotation
        if (this.joystick === undefined) this.dolly.quaternion.copy( quaternion );
	}
		
    get selectPressed(){
        return ( this.controllers !== undefined && (this.controllers[0].userData.selectPressed || this.controllers[1].userData.selectPressed) );    
    }
    
    showInfoboard( name, info, pos ){
        if (this.ui === undefined ) return;
        this.ui.position.copy(pos).add( this.workingVec3.set( 0, 1.3, 0 ) );
        const camPos = this.dummyCam.getWorldPosition( this.workingVec3 );
        this.ui.updateElement( 'name', info.name );
        this.ui.updateElement( 'info', info.info );
        this.ui.update();
        this.ui.lookAt( camPos )
        this.ui.visible = true;
        this.boardShown = name;
    }

	render( timestamp, frame ){
        const dt = this.clock.getDelta();
        
        let moved = false;
        
        if (this.renderer.xr.isPresenting && this.selectPressed){
            this.moveDolly(dt);
            moved = true;
        }
        
        if (this.joystick !== undefined){
            if (this.dolly.userData.forward !== undefined){
                if (this.dolly.userData.forward != 0){
                    this.moveDolly(dt);
                    moved = true;
                }
                this.dolly.rotateY(this.dolly.userData.turn*dt);
            }
        }
        
        if (this.boardData && moved){
            const scene = this.scene;
            const dollyPos = this.dolly.getWorldPosition( new THREE.Vector3() );
            let boardFound = false;
            Object.entries(this.boardData).forEach(([name, info]) => {
                const obj = scene.getObjectByName( name );
                if (obj !== undefined){
                    const pos = obj.getWorldPosition( new THREE.Vector3() );
                    if (dollyPos.distanceTo( pos ) < 3){
                        boardFound = true;
                        if ( this.boardShown !== name) this.showInfoboard( name, info, pos );
                    }
                }
            });
            if (!boardFound){
                this.boardShown = "";
                this.ui.visible = false;
            }
        }
        
        this.stats.update();
		this.renderer.render(this.scene, this.camera);
	}
}

export { App };

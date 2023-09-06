import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';
import * as YUKA from 'yuka';

import smile from '../images/smile.jpg';
import s from '../images/1.jpg';
import grass from '../images/grass.jpg';
import sky from '../images/sky.jpg';
import balloon from '../images/neon.jpg';


import BlimpMovement from './physical/BlimpMovement.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const group = new THREE.Group();

renderer.shadowMap.enabled=true;

const camera = new THREE.PerspectiveCamera(
 100, window.innerWidth / window.innerHeight, 0.1, 1000);

//to see the box from diffrent angles
const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-10, 30, 30)
    // must put the update after the postion 
orbit.update();

//create a scene..........
const scene = new THREE.Scene();
//////// loading screen ..........
const loadmanger = new THREE.LoadingManager();

//const textureloader = new THREE.TextureLoader();
//scene.background= textureloader.load(sky);
const hdr = new URL('../images/sky.hdr',import.meta.url);
const loaderr = new RGBELoader();
loaderr.load(hdr,function(texture){
    scene.background = texture;
});
// create path following for models or vehicle.........

const loader = new GLTFLoader();

//const ambientLight = new THREE.AmbientLight(0x333333);
//scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(-10, 30, 30);
scene.add(directionalLight);

const directionalLight1 = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight1.position.set(300, 1, 400);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight1.position.set(-50, 40, 5);
scene.add(directionalLight2);



const modelContainer = new THREE.Object3D();

const city = new URL('../assets/city.glb',import.meta.url);
loader.load (city.href,function(gltf){
    const model = gltf.scene;
   
   model.scale.set(21,32, 50);
   model.position.set(1100,3,-140);
   scene.add(model);
});



const sea = new URL('../assets/sea_house.glb',import.meta.url);
loader.load (sea.href,function(gltf){
    const model = gltf.scene;
   model.scale.set(2,2,2);
   model.position.set(-550,0,-120);
   scene.add(model);
});

const city2 = new URL('../assets/city2.glb',import.meta.url);
loader.load (city2.href,function(gltf){
    const model = gltf.scene;
   model.scale.set(20, 20, 20);
   model.position.set(300,1,400);
   model.rotation.y=6.3;
   scene.add(model);
});

const anc = new URL('../assets/anchor.glb',import.meta.url);
loader.load (anc.href,function(gltf){
    const model = gltf.scene;
   model.scale.set(7, 7, 7);
   model.position.set(210,0,-250);
   model.rotation.y=-2;
   scene.add(model);
});





const vehicle = new YUKA.Vehicle();

function sync(entity, renderComponent) {
    renderComponent.matrix.copy(entity.worldMatrix);
}

const path = new YUKA.Path();
path.add(new YUKA.Vector3(-120, 90, 250));
path.add(new YUKA.Vector3(-240, 90, 300));
path.add(new YUKA.Vector3(-140, 90, 350));
path.add(new YUKA.Vector3(-0, 90, 325));
path.add(new YUKA.Vector3(120, 90,300));
path.add(new YUKA.Vector3(160, 90, 375));
path.add(new YUKA.Vector3(100, 90, 400));
path.add(new YUKA.Vector3(0, 90, 350));

path.loop = true;

vehicle.position.copy(path.current());

vehicle.maxSpeed = 25;

const followPathBehavior = new YUKA.FollowPathBehavior(path, 3);
vehicle.steering.add(followPathBehavior);

const onPathBehavior = new YUKA.OnPathBehavior(path);
//onPathBehavior.radius = 2;
vehicle.steering.add(onPathBehavior);

const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);



const clash = new URL('../assets/clash.glb',import.meta.url);
loader.load (clash.href,function(gltf){
    const model = gltf.scene;
   //model.scale.set(5, 5, 5);
   model.position.set(-25,25,310);
  
   scene.add(model);
   model.matrixAutoUpdate = false;
   vehicle.scale = new YUKA.Vector3(20, 20, 20);
   vehicle.setRenderComponent(model, sync);
});



// create the ground plane
//ground on the right ,have the city
const ground_geometry = new THREE.PlaneGeometry(1500, 1500);
const ground_texture = new THREE.TextureLoader().load(grass);
ground_texture.wrapS = ground_texture.wrapT = THREE.RepeatWrapping;
ground_texture.repeat.set( 15, 15);

const ground_material = new THREE.MeshBasicMaterial({ 
  
   map:ground_texture,
   color:0x888888
});
const ground_plane = new THREE.Mesh(ground_geometry, ground_material);
ground_plane.rotation.x = -Math.PI / 2; // rotate to lay flat on ground
ground_plane.position.set(700,0,-150);
scene.add(ground_plane);


// the ground for sea house....

const ground_geometry2 = new THREE.PlaneGeometry(800, 1400);
const ground_texture2 = new THREE.TextureLoader().load(s);
ground_texture2.wrapS = ground_texture2.wrapT = THREE.RepeatWrapping;
ground_texture2.repeat.set( 1, 1);

const ground_material2 = new THREE.MeshBasicMaterial({ 
  
   map:ground_texture2,
   color:0x888888
});
const ground_plane2 = new THREE.Mesh(ground_geometry2, ground_material2);
ground_plane2.rotation.x = -Math.PI / 2; // rotate to lay flat on ground
ground_plane2.position.set(-450,0,-150);

scene.add(ground_plane2);


//ground for the balloon .........
const geometry = new THREE.CircleGeometry( 180, 32 ); 
const circleg = new THREE.TextureLoader().load(smile);
circleg.wrapS = circleg.wrapT = THREE.RepeatWrapping;
circleg.repeat.set( 1, 1);
const material = new THREE.MeshBasicMaterial( { 
   map:circleg
 } ); 
const circle = new THREE.Mesh( geometry, material ); scene.add( circle );
circle.rotation.x = -Math.PI / 2; // rotate to lay flat on ground
circle.position.set(325,0.2,-165);

//clynders for the anchor...............

// clynder 1111........

    const geometry1 = new THREE.CylinderGeometry( 0.5,0.5, 50); 
    const material1 = new THREE.MeshBasicMaterial( {color:0xA52A2A,
    } ); 
    const cylinder = new THREE.Mesh( geometry1, material1 ); 
    cylinder.position.set(251,5,-231);
    cylinder.rotation.z=5;
scene.add( cylinder );
// clynder 2222...
const geometry2 = new THREE.CylinderGeometry( 0.5,0.5, 60); 
const material2 = new THREE.MeshBasicMaterial( {color:0xA52A2A,
} ); 
const cylinder1 = new THREE.Mesh( geometry2, material2 ); 
cylinder1.position.set(249,5,-246);
cylinder1.rotation.z=5;
scene.add( cylinder1 );
// clynder 33333...
const geometry3 = new THREE.CylinderGeometry( 0.5,0.5, 82); 
const material3 = new THREE.MeshBasicMaterial( {color:0xA52A2A,
} ); 
const cylinder2 = new THREE.Mesh( geometry3, material3 ); 
cylinder2.position.set(245,20,-250);
cylinder2.rotation.z=4.5;
scene.add( cylinder2 );
// 
//blimp .....................
const blimpTexture = new THREE.TextureLoader().load(balloon);
blimpTexture.wrapS = blimpTexture.wrapT = THREE.RepeatWrapping;
blimpTexture.repeat.set( 1, 1 );
const points = [];
for ( let i = 0; i < 19; i ++ ) {
	points.push( new THREE.Vector2( Math.sin( i * 0.22 ) * 10 + 10, ( i - 5 ) * 2 ) );
}
const geometryl = new THREE.LatheGeometry( points );
const materiall = new THREE.MeshBasicMaterial( { 
map:blimpTexture,

} );
const lathe = new THREE.Mesh( geometryl, materiall );
lathe.position.set(0,70,-10);
lathe.rotation.x=600
// const numSegments = 30;
// const circleRadius = points[0].y; // Assumes the first point defines the outer radius
// const circleArea = Math.PI * Math.pow(circleRadius, 2);
// const crossSectionalArea = circleArea * numSegments;
// console.log( crossSectionalArea)

group.add( lathe );
//2-create a top of blimp
const circleGeometry = new THREE.CircleGeometry( 11.3, 10);
const circleMaterial = new THREE.MeshBasicMaterial( {
    map:blimpTexture
    } );
const circleMesh = new THREE.Mesh( circleGeometry, circleMaterial);
circleMesh.position.set(0,79,-10)
circleMesh.rotation.x = -Math.PI / 2;
group.add( circleMesh );
// 2-top
const circleGeometry2 = new THREE.CircleGeometry( 11.3, 10,0,5);
const circleMaterial2 = new THREE.MeshBasicMaterial( {
    map:blimpTexture
    } );
const circleMesh2 = new THREE.Mesh( circleGeometry2, circleMaterial2);
circleMesh2.position.set(0,79,-10)
circleMesh2.rotation.x = -Math.PI / 2;

//3- create a rops
//1
const cylinderr = new THREE.CylinderGeometry( 0.3, 0.3, 35 ); 
const cylinderr1 = new THREE.MeshBasicMaterial( { 
    map:blimpTexture,
    color:0xf
} );
const Meshr1 = new THREE.Mesh( cylinderr, cylinderr1 );
Meshr1.position.set(-2,35,-10);
group.add( Meshr1 );
//2
const cylinderr2 = new THREE.CylinderGeometry( 0.3, 0.3, 35 ); 
const Materialr2 = new THREE.MeshBasicMaterial( { 
    map:blimpTexture,
    color:0xf
    
} );
const Meshr2 = new THREE.Mesh( cylinderr2, Materialr2 );
Meshr2.position.set(2,35,-10);
group.add( Meshr2 );

//4- create a box
//1-create a basic
const woodTexture = new THREE.TextureLoader().load(balloon);

const pointss = [];
for (let i = 0; i < 22; ++i) {
  pointss.push(new THREE.Vector2(Math.sin(i * 0.17) * 8 + 8, i));
}
const latheGeometrys = new THREE.LatheGeometry(pointss, 18, 30, 9.2);
const materials = new THREE.MeshBasicMaterial({
  
    map:woodTexture });

const meshs = new THREE.Mesh(latheGeometrys, materials);
meshs.position.set(0,21,-10);
meshs.rotation.x = -Math.PI ;
group.add(meshs);
//2-create a bootom
/*const circleGeometryb = new THREE.CircleGeometry( 15, 10 );
  const circleMaterialb = new THREE.MeshBasicMaterial( {
 color: 0xffff00 ,
 map:woodTexture
 } );
const circleMeshb = new THREE.Mesh( circleGeometryb, circleMaterialb );
circleMeshb.position.set(0,0,-10);
circleMeshb.rotation.x = -Math.PI /2;
group.add( circleMeshb );*/
//fire
const geometryf = new THREE.CylinderGeometry( 0, 5, 25, 32 ); 
const materialf = new THREE.MeshBasicMaterial( {color: 0xFFA500} ); 
const cylinderf = new THREE.Mesh( geometryf, materialf );
cylinderf.position.set(0,25,-10);
scene.add( group);
group.position.set(290,0,-225);
//camera.position.set(-100, 100, -20);
camera.lookAt(group.position);





////////////////////////////////display information/////////////////////////////////////
const text2 = document.createElement('div');
text2.style.position = 'absolute';
text2.style.width = "100";
text2.style.height = "100";
text2.style.backgroundColor = 0xffffff00;
text2.style.top = "10" + 'px';
text2.style.left = "5" + 'px';
text2.style.fontSize = "20px";
document.body.appendChild(text2);
let generateTextOnScreen = (myBlimp) => {
    let text = 'blimp location X  =   ' +group.position.x.toFixed(2)
    text += '<br>';
    text += '<br>';
    text += 'blimp location Y  =   ' +group.position.y.toFixed(2)
    text += '<br>';
    text += '<br>';
    text += 'blimp location Z  =   ' +group.position.z.toFixed(2)
    text += '<br>';
    text += '<br>';
    text += 'temperature       = '+ temperature
    text += '<br>';
    text += '<br>';
    text += 'status       = '  + status
    text += '<br>';
    text += '<br>';
    text += 'time       = '  + time3.toFixed(1)+"          s"
    text += '<br>';
    text += '<br>';
    text += 'volume       = '  + myBlimp.calculateVolume().toFixed(1);
    text += '<br>';
    text += '<br>';
    text += 'mas       = '  + myBlimp.calculateMass().toFixed(1);
    text += '<br>';
    text2.innerHTML = text;
}
////////////////////////////set up keyboard////////////////////////////////
const keys = {};
document.addEventListener('keydown', (event) => {
  keys[event.keyCode] = true;
});
document.addEventListener('keyup', (event) => {
  keys[event.keyCode] = false;
});
/////////////////////////////////gui///////////////////////////////////////////////////

const gui1 = new dat.GUI();
// const gui2 = new dat.GUI();
const blimpController = {
temperature: 1000,
payload: 800,
Q: -180,
P: 0,
velocity:20,
cross_sectional_area:200,
M:4,
n:16206,
pressure:101325,
air_density_outer:1.225,
};
gui1.add(blimpController, "temperature").min(500).max(3000).step(50);
gui1.add(blimpController, "payload").min(100).max(5000).step(50);
gui1.add(blimpController, "velocity").min(10).max(150).step(10);
gui1.add(blimpController, "air_density_outer").min(1).max(10).step(1);
gui1.add(blimpController, "cross_sectional_area").min(10).max(500).step(25);
gui1.add(blimpController, "M").min(1).max(20).step(1);
gui1.add(blimpController, "n").min(500).max(100000).step(50);
gui1.add(blimpController, "pressure").min(1000).max(1000000).step(100);
gui1.add(blimpController, "Q").min(-180).max(180).step(5);
gui1.add(blimpController, "P").min(0).max(90).step(5);
gui1.width=300

//////////////////////////////////var///////////////////////////////////////////
camera.position.set(200,50,0);
camera.lookAt(group.position);
let start=0;
let start2=0;
let temperature=293;
let status="the plimb on the ground";
let time=0
time3=0
var clock = new THREE.Clock();


////////////////////// function phsical ///////////////////////////////////////////////////

  function rise_up(blimp,start) {
    if(start==1){
function temperaturee(){
    if(temperature<blimpController.temperature){
        
        temperature+=1
    }
    if(temperature>blimpController.temperature){
        
            temperature-=1
        }}
        temperaturee();
        
        if(blimp.calculateMass()>blimp.calculateAirDensity()*blimp.calculateVolume()&& group.position.y<=0)
    {
            status="the plimb on the ground"
    }
        if(blimp.calculateMass()>blimp.calculateAirDensity()*blimp.calculateVolume()  && blimp.calculateWindForce() * Math.sin(THREE.MathUtils.degToRad(blimpController.P))==0       && group.position.y>0)
    {
            status="the plimb is going down"
        }
        if(blimp.calculateMass()<blimp.calculateAirDensity()*blimp.calculateVolume())
        {
            blimp.updatePositionY();
            group.position.y=blimp.position.y
    
        status="the plimb is  rise up"
        
    }

    if(group.position.y<=0){
        group.position.y=0
    }
   
   

}
}

  function windforce(blimp,start) {
      var delta = clock.getDelta();
    if(start!=0 ){
     
        time3+=delta;}

            if(start!=0 && group.position.y>0){
                time+=delta;
            blimp.updatePositionXZ();
            group.position.x=blimp.position.x
            group.position.z=blimp.position.z
    }

}

  function land(blimp,start) {
    if(start==2){
function temperaturee(){
    if(temperature>293){
        
            temperature-=20
        }}
        temperaturee();
        
        if(blimp.calculateMass()>blimp.calculateAirDensity()*blimp.calculateVolume()&& group.position.y<=0)
    {
            status="the plimb on the ground"
    }
        if(blimp.calculateMass()>blimp.calculateAirDensity()*blimp.calculateVolume()&& blimp.calculateWindForce() * Math.sin(THREE.MathUtils.degToRad(blimpController.P))==0 && group.position.y>0)
    {
            status="the plimb is goging dowm"
        }
        if(blimp.calculateMass()<blimp.calculateAirDensity()*blimp.calculateVolume())
        {
            blimp.updatePositionY();
            group.position.y=blimp.position.y
        
        status="the plimb is  rise up"
        
    }
    if(group.position.y<=0){
        group.position.y=0
    }
    else{
        blimp.updatePositionY();
        group.position.y=blimp.position.y

    }


}
}
/////////////////////////camera///////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function updaeCamera(start2)
 {
    if(start2==1){
camera.position.x=group.position.x-100
camera.position.y=group.position.y+50
camera.position.z=group.position.z+200
camera.lookAt(group.position)
}
}
//////////////////////////////animate//////////////////////////////////////////////////////
const time2 = new YUKA.Time();
function animate() {
    if (keys[37]) {
        group.add( cylinderf );
        group.add( circleMesh );
        start=1;
        gui1.hide()
        scene.remove( cylinder );
        scene.remove( cylinder1 );
        scene.remove( cylinder2 );
    }
    if (keys[38]) {
       
        group.remove( cylinderf );
        group.add( circleMesh2 );
        group.remove( circleMesh );   
        start=2;
    }
    if (keys[39]) {
    
        start2=1;
    }
    updaeCamera(start2)
    const d = time2.update().getDelta();
    entityManager.update(d);
    const myBlimp = new BlimpMovement
    (   temperature
        , blimpController.payload
        , {x: group.position.x, y:group.position.y, z:group.position.z}
    ,blimpController.velocity
    ,time
    ,THREE.MathUtils.degToRad(blimpController.Q)
    ,THREE.MathUtils.degToRad(blimpController.P)
    ,blimpController.cross_sectional_area
    ,blimpController.M
    ,blimpController.n
    ,blimpController.pressure
    ,blimpController.air_density_outer
    );

        rise_up(myBlimp,start); 
        land(myBlimp,start); 
        windforce(myBlimp,start); 
    generateTextOnScreen(myBlimp)
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
 
}
animate();


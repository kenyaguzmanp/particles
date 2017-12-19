window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(/* function */ callback, /* DOMElement */ element){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  var WIDTH,
  HEIGHT,
  VIEW_ANGLE,
  ASPECT,
  FAR,
  $container,
  renderer,
  camera,
  scene,
  particleCount,
  particles,
  pMaterial,
  pX,
  PY,
  pZ,
  particleSystem;

  
function init(){
    // set the scene size
    WIDTH = 600,
    HEIGHT = 600,
    
    // set some camera attributes
    VIEW_ANGLE = 65,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

    // get the DOM element to attach to
    // - assume we've got jQuery to hand
   $container = $('#container');

    // create a WebGL renderer, camera
    // and a scene
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.Camera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene = new THREE.Scene();

    // the camera starts at 0,0,0 so pull it back
    camera.position.z = 300;

    // start the renderer - set the clear colour
    // to a full black
    renderer.setClearColor(new THREE.Color(0, 1));
    renderer.setSize(WIDTH, HEIGHT);

    // attach the render-supplied DOM element
    $container.append(renderer.domElement);

    // create the particle variables
    particleCount = 1,
    particles = new THREE.Geometry(),

    pMaterial = new THREE.ParticleBasicMaterial({
        color: 0xFFFFFF,
        size: 50,
        /*
        map: THREE.ImageUtils.loadTexture(
            "images/particle.png"
        ),
        blending: THREE.AdditiveBlending,*/
        transparent: true
    });

    createIndividualParticles();
}  

function createIndividualParticles(){
    // now create the individual particles

    // create a particle with random
    // position values, -250 -> 250
    
    pX = Math.random() * 200 - 100,
    pY = Math.random() * 200 - 100,
    pZ = Math.random() * 200 - 100,

    particle = new THREE.Vertex(
        new THREE.Vector3(pX, pY, pZ)
    );
    
    // create a velocity vector
    particle.velocity = new THREE.Vector3(0, 0, 0);
    
    // add it to the geometry
    particles.vertices.push(particle);
    
    // create the particle system
    particleSystem = new THREE.ParticleSystem(particles, pMaterial);

    particleSystem.sortParticles = true;
      
    // add it to the scene
    scene.addChild(particleSystem);
      
    update();   
}


  // animation loop
  function update() {
      
    // add some rotation to the system
    //particleSystem.rotation.y -= 0.01;
    var xBound = 200;    

    var pCount = particleCount;

    // get the particle
    var particle = particles.vertices[pCount];

    if(particle.position.x < -1 * xBound) {
        particle.position.x = xBound/2;
        particle.velocity.x = 0;
    }

    // update the velocity
    particle.velocity.x -= Math.random() * .1;
    // and the position
    particle.position.addSelf(particle.velocity);
      
    // flag to the particle system that we've
    // changed its vertices. This is the
    // dirty little secret.
    particleSystem.geometry.__dirtyVertices = true;
      
    renderer.render(scene, camera);
      
    // set up the next call
    requestAnimFrame(update);
  }

  init();

  // Converts from degrees to radians.
function toRadians(degrees) {
    return degrees * Math.PI / 180;
  };
   
  // Converts from radians to degrees.
function toDegrees(radians) {
    return radians * 180 / Math.PI;
  };
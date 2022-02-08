const canvas = document.getElementById("renderCanvas");
var engine = null;
var scene = null;
var sceneToRender = null;

BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
  if (document.getElementById("customLoadingScreenDiv")) {
    document.getElementById("customLoadingScreenDiv").style.display = "initial";
    return;
  }
  this._loadingDiv = document.createElement("div");
  this._loadingDiv.id = "customLoadingScreenDiv";
  this._loadingDiv.innerHTML = "LOADING YOUR STUFFSSSS";
  var customLoadingScreenCss = document.createElement('style');
  customLoadingScreenCss.type = 'text/css';
  customLoadingScreenCss.innerHTML = `
    #customLoadingScreenDiv{
        background-color: #3797a4;
        color: white;
        font-size:50px;
        text-align:center;
    }
    `;
  document.getElementsByTagName('head')[0].appendChild(customLoadingScreenCss);
  this._resizeLoadingUI();
  window.addEventListener("resize", this._resizeLoadingUI);
  document.body.appendChild(this._loadingDiv);
};

BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function(){
  document.getElementById("customLoadingScreenDiv").style.display = "none";
};
var t = 0
var s = 8
var pos = t

var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
var createScene = function() {
  movementamount = 6;
  var scene   = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(.216, .592, .643);
  var scale   = 0.1, MeshWriter, text;
  var camera  = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI/6, 130, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), scene);
  light.intensity = 0.5;
  write();
  d = new Date();
  t = d.toLocaleTimeString();
  console.log(d.toLocaleTimeString());
  Writer2 = BABYLON.MeshWriter(scene, {scale:scale,defaultFont:"Arial"});
  timeposition = position;
  time = new Writer2(
    t,
    {
      "anchor": "center",
      "letter-height": 70,
      "color": "#95b4ed",
      "letter-thickness": 8,
      "position": {
        "z": timeposition
      }
    }
  );
  keys = []
  var textKeys = []
  for (i = 0; i < writermeshes.length; i++) {
    keys.push(new BABYLON.Animation("textAnimation", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE));
    // set keys based on position (start at 70 and su)
    textKeys = [];
    val = pos;
    textKeys.push({
      frame: 0,
      value: val
    });
    val = pos + linenumber*movementamount
    textKeys.push({
      frame: 750,
      value: val
    });
    keys[i].setKeys(textKeys);
    pos = pos - s
  }
  console.log(keys)
  anims = []
  for (i = 0; i < writermeshes.length; i++) {
    writermeshes[i].animations = [];

    writermeshes[i].animations.push(keys[i]);
    anims.push(scene.beginAnimation(writermeshes[i], 0, 750, false));
  }
  //updating clock while moving is too computationally difficult to run on my machine at least, so I just start updating after the animation is done
  //it's also easier to code, so that makes me happy
  const animtext2 = new BABYLON.Animation("textAnimation2", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

  var textKeys2 = [];
  textKeys2.push({
    frame: 0,
    value: timeposition/10 -movementamount*2
  });

  textKeys2.push({
    frame: 750,
    value: timeposition/10 + linenumber*movementamount - movementamount *2
  });
  animtext2.setKeys(textKeys2);
  timemesh = time.getMesh();
  timemesh.animations = [];
  timemesh.animations.push(animtext2);
  setTimeout (async () => {
    var anim2 = scene.beginAnimation(timemesh, 0, 750, false);
    await anims[writermeshes.length -1].waitAsync();
    update_time();
  });
  timemesh = time.getMesh();
  timepos = timemesh.position.z - movementamount*movementamount*10 + movementamount*2;
  function update_time () {
    var handle = window.setInterval(() => {

      console.log(timepos);
      time.dispose();
      d = new Date();
      t = d.toLocaleTimeString();
      Writer3= BABYLON.MeshWriter(scene, {scale:scale,defaultFont:"Arial"});
      time = new Writer3(
        t,
        {
          "anchor": "center",
          "letter-height": 70,
          "color": "#95b4ed",
          "letter-thickness": 8,
          "position": {
            "z": timepos
          }
        }
      );
    }, 100);
  }

  return scene;

  function write () {
    Writer = BABYLON.MeshWriter(scene, {scale:scale,defaultFont:"Arial"});
    done = false;
    index = 0;
    writers = [];
    var startindex = 0;
    position = 70;
    linenumber = 0;
    while (!done){
      space = false;
      startindex = index;
      index = index + 35;
      linenumber ++;
      console.log(linenumber);
      if (index >= abouttext.length) {
        index = abouttext.length - 1;
        done = true;
      }
      else{
        while (!space) {
          index ++;
          if (abouttext[index] == ' ') {
            space = true;
          }
        }
      }
      position = position - 80;
      writers.push(new Writer(
        abouttext.slice(startindex, index),
        {
          "anchor": "center",
          "letter-height": 70,
          "color": "#95b4ed",
          "letter-thickness": 8,
          "position": {
	    "x": 0,
	    "y": 0,
            "z": position
          }
        }
      ));


    }
    writermeshes = [];
    for (i = 0; i < writers.length; i++) {
      writermeshes.push(writers[i].getMesh());
    }
    // for (i = 0; i < writermeshes.length; i++) {
    //   writermeshes[i].position = new BABYLON.Vector3(1, 4, 0);
    // }
    // console.log(writermeshes)
    // finaltext = BABYLON.Mesh.MergeMeshes(writermeshes, true, true, undefined, false, true);
    // finaltext = BABYLON.Mesh.MergeMeshes(writermeshes, true, true);
  }

  engine.runRenderLoop(function () {
    scene.render();
  });
  window.addEventListener("resize", function () {
    engine.resize();
  });
};

fetch('https://sachiniyer.github.io/mywebsitetext/about.txt')
  .then(response => response.text())
  .then(function (data) {
    abouttext = data;
  })
  .then (function (){
    initFunction = async function() {
      var asyncEngineCreation = async function() {
        try {
          return createDefaultEngine();
        } catch(e) {
          console.log("the available createEngine function failed. Creating the default engine instead");
          return createDefaultEngine();
        }
      };

      engine = await asyncEngineCreation(); if (!engine) throw 'engine should not be null.'; scene = createScene();};
    initFunction().then(() => {
      engine.runRenderLoop(function () {
        scene.render();
      });
    });
    // Resize
    window.addEventListener("resize", function () {
      engine.resize();
    });

  });

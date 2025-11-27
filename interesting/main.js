var playing = false;
var audionum = Math.floor(Math.random() * 10);
var audiostring = "./" + audionum.toString() + ".mp3";
var lonval = -74.00597;
var latval = 40.71427;
var audio = new Audio(audiostring);
var zoom = 15;

const play_music = () => {
  if (!playing) {
    audio.play();
    playing = true;
  } else {
    audio.pause();
    playing = false;
  }
};

const sachiniyer = () => {
  window.open("https://sachiniyer.com");
};

const email = () => {
  window.open("mailto:sachinjiyer@gmail.com");
};

const github = () => {
  window.open("https://github.com/sachiniyer");
};

const secret = () => {
  window.open("https://youtu.be/DLzxrzFCyOs");
};

const music = () => {
  play_music();
};

const about = () => {
  window.open("https://sachiniyer.com/about");
};

function createlontile(lon, zoom) {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}

function createlattile(lat, zoom) {
  return Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  );
}

var xTileBase = createlontile(lonval, zoom);
var yTileBase = createlattile(latval, zoom);

BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
  if (document.getElementById("customLoadingScreenDiv")) {
    document.getElementById("customLoadingScreenDiv").style.display = "initial";
    return;
  }
  this._loadingDiv = document.createElement("div");
  this._loadingDiv.id = "customLoadingScreenDiv";
  this._loadingDiv.innerHTML = "LOADING YOUR STUFFSSSS (scroll/drag to move)";
  var customLoadingScreenCss = document.createElement("style");
  customLoadingScreenCss.type = "text/css";
  customLoadingScreenCss.innerHTML = `
    #customLoadingScreenDiv{
        background-color: #3797a4
        color: white
        font-size:50px
        text-align:center
    }
    `;
  document.getElementsByTagName("head")[0].appendChild(customLoadingScreenCss);
  this._resizeLoadingUI();
  window.addEventListener("resize", this._resizeLoadingUI);
  document.body.appendChild(this._loadingDiv);
};

BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function () {
  document.getElementById("customLoadingScreenDiv").style.display = "none";
};
window.onload = function () {
  const canvas = document.getElementById("renderCanvas");
  document
    .getElementById("renderCanvas")
    .setAttribute("style", "width:100vw;height:100vh");
  const engine = new BABYLON.Engine(canvas, true);
  document
    .getElementById("renderCanvas")
    .setAttribute("style", "width:100vw;height:100vh");
  const createScene = function () {
    //loading
    engine.displayLoadingUI();

    //scene
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.216, 0.592, 0.643);

    //camera shit
    var camera = new BABYLON.FollowCamera(
      "Camera1",
      new BABYLON.Vector3(0, 0, -750),
      scene
    );
    var camera2 = new BABYLON.FollowCamera(
      "Camera1",
      new BABYLON.Vector3(0, 50, -10),
      scene
    );
    camera.heightOffset = 50;
    camera.radius = 1.2;
    camera.rotationOffset = 90;
    camera.cameraAcceleration = 0.05;
    camera.maxCameraSpeed = 2;
    camera2.lowerHeightOffsetLimit = 0;
    camera.attachControl(canvas, true);
    camera2.heightOffset = 10;
    camera2.radius = 1;
    camera2.rotationOffset = 180;
    camera2.cameraAcceleration = 0.05;
    camera2.maxCameraSpeed = 2;
    camera2.lowerHeightOffsetLimit = -5;
    camera2.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 0, 0)
    );

    //skybox
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000 }, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
      "./skybox",
      scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode =
      BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    //box gen
    const box = BABYLON.MeshBuilder.CreateBox("box", {});
    box.position.y = 6;
    camera2.lockedTarget = box;

    //button sizing stuff
    var buttonwidth = 1;
    var buttonscaling = 1.01;
    var fontsize = 100;

    //buttons
    var plane1 = BABYLON.Mesh.CreatePlane("plane1", 2);
    plane1.parent = box;
    plane1.position.z = -buttonscaling;
    var advancedTexture1 =
      BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane1);

    var button1 = BABYLON.GUI.Button.CreateImageWithCenterTextButton(
      "but1",
      "About",
      "./about.jpeg"
    );
    button1.width = buttonwidth;
    button1.height = buttonwidth;
    button1.color = "white";
    button1.fontSize = fontsize + 50;
    button1.background = "blue";
    button1.onPointerUpObservable.add(function () {
      about();
    });
    advancedTexture1.addControl(button1);

    var plane2 = BABYLON.Mesh.CreatePlane("plane2", 2);
    plane2.parent = box;
    plane2.position.z = buttonscaling;
    plane2.rotation.x = Math.PI;
    plane2.rotation.z = Math.PI;
    var advancedTexture2 =
      BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane2);

    var button2 = BABYLON.GUI.Button.CreateImageWithCenterTextButton(
      "but2",
      "",
      "./github.png"
    );
    button2.width = buttonwidth;
    button2.height = buttonwidth;
    button2.color = "white";
    button2.fontSize = fontsize;
    button2.background = "blue";
    button2.onPointerUpObservable.add(function () {
      github();
    });
    advancedTexture2.addControl(button2);

    var plane3 = BABYLON.Mesh.CreatePlane("plane3", 2);
    plane3.parent = box;
    plane3.position.x = buttonscaling;
    plane3.rotation.y = Math.PI / 2;
    plane3.rotation.x = Math.PI;
    plane3.rotation.z = Math.PI;
    var advancedTexture3 =
      BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane3);

    var button3 = BABYLON.GUI.Button.CreateImageWithCenterTextButton(
      "but3",
      "",
      "./mail.jpeg"
    );
    button3.width = buttonwidth;
    button3.height = buttonwidth;
    button3.color = "white";
    button3.fontSize = fontsize;
    button3.background = "blue";
    button3.onPointerUpObservable.add(function () {
      email();
    });
    advancedTexture3.addControl(button3);

    var plane4 = BABYLON.Mesh.CreatePlane("plane4", 2);
    plane4.parent = box;
    plane4.position.x = -buttonscaling;
    plane4.rotation.y = Math.PI / 2;
    var advancedTexture4 =
      BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane4);

    var button4 = BABYLON.GUI.Button.CreateImageWithCenterTextButton(
      "but4",
      "",
      "./music.png"
    );
    button4.width = buttonwidth;
    button4.height = buttonwidth;
    button4.color = "black";
    button4.fontSize = fontsize;
    button4.background = "blue";
    button4.onPointerUpObservable.add(function () {
      music();
    });
    advancedTexture4.addControl(button4);

    var plane5 = BABYLON.Mesh.CreatePlane("plane5", 2);
    plane5.parent = box;
    plane5.position.y = buttonscaling;
    plane5.rotation.x = Math.PI / 2;
    var advancedTexture5 =
      BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane5);

    var button5 = BABYLON.GUI.Button.CreateImageWithCenterTextButton(
      "but5",
      "",
      "./sachiniyer.jpg"
    );
    button5.width = buttonwidth;
    button5.height = buttonwidth;
    button5.color = "white";
    button5.fontSize = fontsize;
    button5.background = "blue";
    button5.onPointerUpObservable.add(function () {
      sachiniyer();
    });
    advancedTexture5.addControl(button5);

    var plane6 = BABYLON.Mesh.CreatePlane("plane6", 2);
    plane6.parent = box;
    plane6.position.y = -buttonscaling;
    plane6.rotation.x = Math.PI / 2;
    plane6.rotation.z = Math.PI;
    var advancedTexture6 =
      BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane6);

    var button6 = BABYLON.GUI.Button.CreateImageWithCenterTextButton(
      "but6",
      "",
      "./secret.jpeg"
    );
    button6.width = buttonwidth;
    button6.height = buttonwidth;
    button6.color = "white";
    button6.fontSize = fontsize;
    button6.background = "blue";
    button6.onPointerUpObservable.add(function () {
      secret();
    });
    advancedTexture6.addControl(button6);

    var assetsManager = new BABYLON.AssetsManager(scene);

    var meshTask = assetsManager.addMeshTask(
      "tesla task",
      "",
      "",
      "./tesla.glb"
    );

    meshTask.onSuccess = function (task) {
      var tesla = task.loadedMeshes[0];
      tesla.rotation = new BABYLON.Vector3(0, Math.PI + Math.PI / 2, 0);
      tesla.scaling = new BABYLON.Vector3(0.03, 0.03, 0.03);
      tesla.position = new BABYLON.Vector3(0, 0, -1000 / +10);
      var teslaMat = new BABYLON.StandardMaterial("teslaMat", scene);
      teslaMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
      camera.lockedTarget = tesla;
      //telsa.material = telsaMat
      const animtla = new BABYLON.Animation(
        "carAnimation",
        "position.z",
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
      );

      var tlaKeys = [];
      tlaKeys.push({
        frame: 0,
        value: -1000 / 2 + 5,
      });
      tlaKeys.push({
        frame: 65,
        value: -1000 / 2 + 5,
      });
      tlaKeys.push({
        frame: 200,
        value: 0,
      });
      animtla.setKeys(tlaKeys);
      tesla.animations = [];
      tesla.animations.push(animtla);
      setTimeout(async () => {
        var anim = scene.beginAnimation(tesla, 0, 200, false);
        await anim.waitAsync();
        scene.activeCamera = camera2;
        camera2.attachControl(canvas, true);
        tlaKeys = [];
        tlaKeys.push({
          frame: 0,
          value: 0,
        });
        tlaKeys.push({
          frame: 50,
          value: 0,
        });
        tlaKeys.push({
          frame: 200,
          value: 1050 / 2,
        });
        animtla.setKeys(tlaKeys);
        tesla.animations = [];
        tesla.animations.push(animtla);
        var anim2 = scene.beginAnimation(tesla, 0, 200, false);
      });
    };

    assetsManager.onFinish = function (tasks) {
      engine.runRenderLoop(function () {
        scene.render();
      });
    };

    assetsManager.load();

    var xmin = -500;
    var zmin = -500;
    var xmax = 500;
    var zmax = 500;
    var precision = {
      w: 8,
      h: 8,
    };
    var subdivisions = {
      h: 16,
      w: 16,
    };

    var tiledGround = new BABYLON.Mesh.CreateTiledGround(
      "Tiled Ground",
      xmin,
      zmin,
      xmax,
      zmax,
      subdivisions,
      precision,
      scene
    );
    var whiteMaterial = new BABYLON.StandardMaterial("White", scene);
    whiteMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
    var blackMaterial = new BABYLON.StandardMaterial("Black", scene);
    blackMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);

    var multimat = new BABYLON.MultiMaterial("multi", scene);

    for (var row = 0; row < subdivisions.h; row++) {
      for (var col = 0; col < subdivisions.w; col++) {
        var material = new BABYLON.StandardMaterial(
          "material" + row + "-" + col,
          scene
        );
        material.diffuseTexture = new BABYLON.Texture(
          "https://tile.openstreetmap.org/" +
            zoom +
            "/" +
            (xTileBase + col) +
            "/" +
            (yTileBase - row) +
            ".png",
          scene
        );
        material.diffuseTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
        material.diffuseTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
        material.specularColor = new BABYLON.Color4(0, 0, 0, 0);
        material.backFaceCulling = false;
        multimat.subMaterials.push(material);
      }
    }

    tiledGround.material = multimat;
    var verticesCount = tiledGround.getTotalVertices();
    var tileIndicesLength =
      tiledGround.getIndices().length / (subdivisions.w * subdivisions.h);
    tiledGround.subMeshes = [];
    var index = 0;
    var base = 0;
    for (var row = 0; row < subdivisions.h; row++) {
      for (var col = 0; col < subdivisions.w; col++) {
        var submesh = new BABYLON.SubMesh(
          index++,
          0,
          verticesCount,
          base,
          tileIndicesLength,
          tiledGround
        );
        tiledGround.subMeshes.push(submesh);
        base += tileIndicesLength;
      }
    }

    return scene;
  };

  function success(position) {
    lonval = position.coords.longitude;
    latval = position.coords.latitude;
    console.log(
      "This is localized tiling, so the map that you see is based off your browser's longitude and latitude. If you get red and black squares, it's cause you not cool enough to be drawn by stamen watercolor map"
    );
    console.log(lonval);
    console.log(latval);
    xTileBase = createlontile(lonval, zoom);
    yTileBase = createlattile(latval, zoom);
    console.log(xTileBase);
    console.log(yTileBase);

    const scene = createScene();
    engine.runRenderLoop(function () {
      scene.render();
    });
    window.addEventListener("resize", function () {
      engine.resize();
    });
  }

  function error(err) {
    console.log(
      "Hey, I see that you have blocked location tracking. If you want to turn it on I pinky promise not to track it. I only use it to do some localized tiling cool stuff. I defaulted it to new york, cause new york is cool"
    );
    const scene = createScene();
    engine.runRenderLoop(function () {
      scene.render();
    });
    window.addEventListener("resize", function () {
      engine.resize();
    });
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  navigator.geolocation.getCurrentPosition(success, error, options);
};

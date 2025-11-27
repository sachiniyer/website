async function run() {
  console.log("loading");
  BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
    if (document.getElementById("customLoadingScreenDiv")) {
      document.getElementById("customLoadingScreenDiv").style.display =
        "initial";
      return;
    }
    this._loadingDiv = document.createElement("div");
    this._loadingDiv.id = "customLoadingScreenDiv";
    this._loadingDiv.innerHTML = "LOADING TAKES A LONG TIME";
    var customLoadingScreenCss = document.createElement("style");
    customLoadingScreenCss.innerHTML = `
    #customLoadingScreenDiv{
        background-color: #3f3f3f;
        color: white;
        font-size:50px;
        text-align:center;
    }
    `;
    document
      .getElementsByTagName("head")[0]
      .appendChild(customLoadingScreenCss);
    this._resizeLoadingUI();
    window.addEventListener("resize", this._resizeLoadingUI);
    document.body.appendChild(this._loadingDiv);
  };

  BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function () {
    document.getElementById("customLoadingScreenDiv").style.display = "none";
  };

  const canvas = document.getElementById("renderCanvas");
  var engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
  var scene = null;
  var sceneToRender = null;
  document
    .getElementById("renderCanvas")
    .setAttribute("style", "width:100vw;height:100vh");
  engine.resize();

  var t = 0;
  var s = 8;
  var pos = t;

  var createScene = async function () {
    movementamount = 6;
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.216, 0.592, 0.643);
    var scale = 0.1,
      MeshWriter,
      text;
    var camera = new BABYLON.ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      Math.PI / 6,
      130,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
    var light = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(0, 10, 0),
      scene
    );
    light.intensity = 0.5;
    await write();
    d = new Date();
    t = d.toLocaleTimeString();
    console.log(d.toLocaleTimeString());
    Writer2 = BABYLON.MeshWriter(scene, { scale: scale, defaultFont: "Arial" });
    timeposition = position;
    time = new Writer2(t, {
      anchor: "center",
      "letter-height": 70,
      color: "#95b4ed",
      "letter-thickness": 8,
      position: {
        z: timeposition,
      },
    });
    keys = [];
    var textKeys = [];
    for (i = 0; i < writermeshes.length; i++) {
      keys.push(
        new BABYLON.Animation(
          "textAnimation",
          "position.z",
          30,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        )
      );
      // set keys based on position (start at 70 and su)
      textKeys = [];
      val = pos;
      textKeys.push({
        frame: 0,
        value: val,
      });
      val = pos + abouttext.length * movementamount;
      textKeys.push({
        frame: 750,
        value: val,
      });
      keys[i].setKeys(textKeys);
      pos = pos - s;
    }
    console.log(keys);
    anims = [];
    for (i = 0; i < writermeshes.length; i++) {
      writermeshes[i].animations = [];

      writermeshes[i].animations.push(keys[i]);
      anims.push(scene.beginAnimation(writermeshes[i], 0, 750, false));
    }
    //updating clock while moving is too computationally difficult to run on my machine at least, so I just start updating after the animation is done
    //it's also easier to code, so that makes me happy
    const animtext2 = new BABYLON.Animation(
      "textAnimation2",
      "position.z",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    var textKeys2 = [];
    textKeys2.push({
      frame: 0,
      value: timeposition / 10 - movementamount * 2,
    });

    textKeys2.push({
      frame: 750,
      value:
        timeposition / 10 +
        abouttext.length * movementamount -
        movementamount * 2,
    });
    animtext2.setKeys(textKeys2);
    timemesh = time.getMesh();
    timemesh.animations = [];
    timemesh.animations.push(animtext2);
    setTimeout(async () => {
      var anim2 = scene.beginAnimation(timemesh, 0, 750, false);
      await anims[writermeshes.length - 1].waitAsync();
      update_time();
    });
    timemesh = time.getMesh();
    timepos =
      timemesh.position.z -
      movementamount * movementamount * 10 +
      movementamount * 2;
    function update_time() {
      var handle = window.setInterval(() => {
        console.log(timepos);
        time.dispose();
        d = new Date();
        t = d.toLocaleTimeString();
        Writer3 = BABYLON.MeshWriter(scene, {
          scale: scale,
          defaultFont: "Arial",
        });
        time = new Writer3(t, {
          anchor: "center",
          "letter-height": 70,
          color: "#95b4ed",
          "letter-thickness": 8,
          position: {
            z: timepos,
          },
        });
      }, 100);
    }

    return scene;

    async function write() {
      console.log("abouttext length:", abouttext ? abouttext.length : 0);
      console.log("abouttext content:", abouttext);
      if (!abouttext || abouttext.length === 0) {
        console.error("abouttext is empty or undefined!");
        writermeshes = [];
        return;
      }
      Writer = BABYLON.MeshWriter(scene, {
        scale: scale,
        defaultFont: "Arial",
      });
      writers = [];
      position = 70;

      for (var i = 0; i < abouttext.length; i++) {
        console.log("Line", i + 1, ":", abouttext[i]);
        position = position - 80;
        writers.push(
          new Writer(abouttext[i], {
            anchor: "center",
            "letter-height": 70,
            color: "#95b4ed",
            "letter-thickness": 8,
            position: {
              x: 0,
              y: 0,
              z: position,
            },
          })
        );
      }
      writermeshes = [];
      for (i = 0; i < writers.length; i++) {
        writermeshes.push(writers[i].getMesh());
      }
      const element = document.getElementById("loadingText");
      if (element) {
        element.remove();
      }
    }
  };

  function parseText(html) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;

    const mainDiv = tempElement.querySelector("#main");
    if (!mainDiv) {
      return "";
    }

    function breakIntoLines(text, maxLength) {
      const words = text.split(" ");
      const lines = [];
      let currentLine = "";

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine ? currentLine + " " + word : word;

        if (testLine.length <= maxLength) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            lines.push(currentLine);
          }
          currentLine = word;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    }

    var result = [];
    const children = mainDiv.children;

    for (var i = 0; i < children.length; i++) {
      const element = children[i];
      const tagName = element.tagName.toLowerCase();
      const text = element.textContent || element.innerText;

      if (text.includes("Fun Version")) {
        break;
      }

      if (tagName.match(/^h[1-6]$/)) {
        continue;
      }

      const normalizedText = text.replace(/\s+/g, " ").trim();

      const lines = breakIntoLines(normalizedText, 60);
      result.push(...lines);
    }

    console.log(`Found ${result.length} lines`);
    return result;
  }

  fetch("/about/index.html")
    .then((response) => response.text())
    .then(function (data) {
      abouttext = parseText(data);
      console.log("Parsed abouttext:", abouttext);
    })
    .then(async function () {
      scene = await createScene();
      engine.runRenderLoop(function () {
        scene.render();
      });
      // Resize
      window.addEventListener("resize", function () {
        console.log("here");
        document
          .getElementById("renderCanvas")
          .setAttribute("style", "width:100vw;height:100vh");
        engine.resize();
      });
    });
}

window.addEventListener("DOMContentLoaded", run);

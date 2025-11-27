const move = (cam) => {
  if (cam == "1-") {
    document.getElementById("key").innerHTML = "d";
    moveexec("1", "-5");
  } else if (cam == "1+") {
    document.getElementById("key").innerHTML = "a";
    moveexec("1", "5");
  } else if (cam == "0-") {
    document.getElementById("key").innerHTML = "s";
    moveexec("0", "-5");
  } else {
    document.getElementById("key").innerHTML = "w";
    moveexec("0", "5");
  }
};

const moveexec = (cam, amount) => {
  const Http = new XMLHttpRequest();
  const url = "https://sachiniyer.com/cameraexec?camera=".concat(
    cam,
    "&amount=",
    amount
  );
  console.log(url);
  Http.open("GET", url);
  Http.send();
};

document.addEventListener("keypress", logKey);

function logKey(e) {
  if (event.code == "KeyD") {
    console.log("d pressed.");
    move("1+");
  } else if (event.code == "KeyA") {
    console.log("a pressed.");
    move("1-");
  } else if (event.code == "KeyS") {
    console.log("s pressed.");
    move("0-");
  } else if (event.code == "KeyW") {
    console.log("w pressed.");
    move("0+");
  }
}

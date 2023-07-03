function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var converter = new showdown.Converter();
      var html = converter.makeHtml(this.responseText);
      document.getElementById("main").innerHTML = html;
    }
  };
  xhttp.open("GET", "about.md", true);
  xhttp.send();
}

addEventListener("load", loadDoc);

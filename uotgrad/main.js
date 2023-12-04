function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var converter = new showdown.Converter();
      var html = converter.makeHtml(this.responseText);
      document.getElementById("main").innerHTML = html;
    }
  };
  xhttp.open(
    "GET",
    "https://share.sachiniyer.com/api/public/dl/WyNT9PJU?inline=true",
    true,
  );
  xhttp.send();
}

addEventListener("load", loadDoc);

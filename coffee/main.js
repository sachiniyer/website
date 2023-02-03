function formsubmit() {
  var d = new Date();
  var grams = document.getElementById("grams").value;
  var mlb = document.getElementById("mlb").value;
  var ml1 = document.getElementById("ml1").value;
  var ml2 = document.getElementById("ml2").value;
  var notes = document.getElementById("notes").value;
  var date = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
  console.log(date);
  console.log(grams);
  console.log(mlb);
  console.log(ml1);
  console.log(ml2);
  console.log(notes);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "date": date,
    "grams": grams,
    "mlb": mlb,
    "ml1": ml1,
    "ml2": ml2,
    "notes": notes
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://api.sachiniyer.com/coffee", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

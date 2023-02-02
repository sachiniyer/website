/* jshint esversion: 8 */

const url = "https://api.github.com/users/sachiniyer/repos";
const weight_url = "https://d2gvczs6qb9wf0.cloudfront.net/weights.csv";
//const weight_url = "http://127.0.0.1:8000/weights.json";
var weights = [];
var blackweights = [];
var reporaw;
var reponames = [];
var retain = {};

const classMap = {
  h1: 'hidden',
  a: 'reallink'
};

const bindings = Object.keys(classMap)
                       .map(key => ({
                         type: 'output',
                         regex: new RegExp(`<${key}(.*)>`, 'g'),
                         replace: `<${key} class="${classMap[key]}" $1>`
                       }));
const conv = new showdown.Converter({
  extensions: [...bindings]
});

conv.setFlavor('github');

// check if webcontent.md exists and display that
// if it does not exists just display readme.md
// then append head and body to dict that has weights.


async function processrepos(repos){

  var elements = {};
  for (let i = 0; i < repos.length; i++) {
    var name = repos[i].name;
    var branch = repos[i].default_branch;

    var repourl = "https://raw.githubusercontent.com/sachiniyer/" + name + "/" + branch + "/webcontent.md";
    var repourl_back = "https://raw.githubusercontent.com/sachiniyer/" + name + "/" + branch + "/README.md";

    var flag = false;
    await fetch(repourl)
      .then((response) => {
        if (response.status == 200) {
          flag = true;
        }
        return response.text();
      })
      .then((data) => {
        if (flag) {
          elements[name] = {href: "https://github.com/sachiniyer" + name,
                            title: name,
                            body: data};
        }
      })
      .catch((err) => {
        console.log("webcontent.md not found for: " + name);
      });


    if (!flag) {
      await fetch(repourl_back)
        .then((response) => {
          flag = true;
          return response.text();
        })
        .then((data) => {
          elements[name] = {href: "https://github.com/sachiniyer" + name,
                            title: name,
                            body: data};
        })
        .catch((err) => {
          console.log("README.md not found for: " + name);
        });
    }
  }

  var final_list = [];
  for (var w of weights) {
    if (elements[w] != null) {
      final_list.push(elements[w]);
    }
  }
  var test_final = (e) => { for (let k of final_list) { if (k.title == e) { return false; } } return true; };

  for (var e in elements) {
    if (test_final(e) && !(blackweights.includes(e))) {
      final_list.push(elements[e]);
    }
  }


  for (var i of final_list) {
    var newhead = document.createElement('h1');
    var a = document.createElement('a');
    a.href = "https://github.com/sachiniyer/" + i.title;
    a.innerHTML = i.title;
    newhead.appendChild(a);
    console.log(i.title);
    var newbod = conv.makeHtml(i.body);
    var div = document.createElement("div");
    div.innerHTML = newbod;
    document.getElementById("repos").appendChild(newhead);
    document.getElementById("repos").appendChild(div);
  }
}

options =  {
  headers: {
    "user-Agent": "sachiniyer"
  },
  method: "GET",
};

async function set_weights() {
  let response = await fetch(weight_url, options);
  let data = await response.text();
  console.log(data);
  var temp = "";
  var color = true;
  for (var a of data) {
    if (a == "|") {
      color = false;
      continue;
    }
    if(a == ',') {
      if (temp != "") {
        if (color) {
          weights.push(temp);
          temp = "";
        }
        else {
          blackweights.push(temp);
          temp = "";
        }
      }

    }
    else {
      temp += a;
    }
  }
  console.log(weights);
  console.log(blackweights);
}


async function run() {
  await set_weights();
  fetch(url, options)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      reporaw = JSON.parse(data.toString());
      processrepos(reporaw);
    });
}

run();

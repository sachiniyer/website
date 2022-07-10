/* jshint esversion: 8 */

const url = "https://api.github.com/users/sachiniyer/repos";
//const weight_url = "https://d2gvczs6qb9wf0.cloudfront.net/weights.json";
const weight_url = "http://127.0.0.1:8000/weights.json";
var weights;
var reporaw;
var reponames = [];

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
  for (let i = 0; i < repos.length; i++) {
    var name = repos[i].name;
    var branch = repos[i].default_branch;

    var repourl = "https://raw.githubusercontent.com/sachiniyer/" + name + "/" + branch + "/webcontent.md";
    var repourl_back = "https://raw.githubusercontent.com/sachiniyer/" + name + "/" + branch + "/README.md";

    var elements = {};
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
          var newhead = document.createElement('h1');
          var a = document.createElement('a');
          a.href = "https://github.com/sachiniyer/" + name;
          a.innerHTML = name;
          newhead.appendChild(a);
          console.log(name);
          var newbod = conv.makeHtml(data);
          var div = document.createElement("div");
          div.innerHTML = newbod;
          elements[name] = (newhead, div);
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
          var newhead = document.createElement('h1');
          var a = document.createElement('a');
          a.href = "https://github.com/sachiniyer/" + name;
          a.innerHTML = name;
          newhead.appendChild(a);
          console.log(name);
          var newbod = conv.makeHtml(data);
          var div = document.createElement("div");
          div.innerHTML = newbod;

          elements[name] = (newhead, div);
        })
        .catch((err) => {
          console.log("README.md not found for: " + name);
        });

    }
    console.log(elements);
  }
}

options =  {
  headers: {
    "user-Agent": "sachiniyer"
  },
  method: "GET",
  mode:'no-cors'
};

async function set_weights() {
  let response = await fetch(weight_url, options);
  let data = await response.text();
  console.log(response);
  console.log(data);
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

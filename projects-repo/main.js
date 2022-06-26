const url = "https://api.github.com/users/sachiniyer/repos"
const weight_url = ""
var weights
var reporaw
var reponames = new Array()

const classMap = {
  h1: 'hidden',
  a: 'reallink'
}

const bindings = Object.keys(classMap)
                       .map(key => ({
                         type: 'output',
                         regex: new RegExp(`<${key}(.*)>`, 'g'),
                         replace: `<${key} class="${classMap[key]}" $1>`
                       }));
const conv = new showdown.Converter({
  extensions: [...bindings]
});

conv.setFlavor('github')

// check if webcontent.md exists and display that
// if it does not exists just display readme.md
// then append head and body to dict that has weights.

async function processrepos(repos){
  for (let i = 0; i < repos.length; i++) {
    var name = repos[i].name
    var branch = repos[i].default_branch

    var repourl = "https://raw.githubusercontent.com/sachiniyer/" + name + "/" + branch + "/webcontent.md"
    var repourl_back = "https://raw.githubusercontent.com/sachiniyer/" + name + "/" + branch + "/README.md"

    var elements = {}
    var flag = false
    await fetch(repourl)
      .then((response) => {
        if (response.status == 200) {
          flag = true
        }
        return response.text()
      })
      .then((data) => {
        if (flag) {
          var newhead = document.createElement('h1')
          var a = document.createElement('a')
          a.href = "https://github.com/sachiniyer/" + name
          a.innerHTML = name
          newhead.appendChild(a)
          console.log(name)
          var newbod = conv.makeHtml(data)
          var div = document.createElement("div")
          div.innerHTML = newbod
          document.getElementById("repos").appendChild(newhead)
          document.getElementById("repos").appendChild(div)
        }
      })
      .catch((err) => {
        console.log("webcontent.md not found for: " + name)
      })



    if (!flag) {
      await fetch(repourl_back)
        .then((response) => {
          flag = true
          return response.text()
        })
        .then((data) => {
          var newhead = document.createElement('h1')
          var a = document.createElement('a')
          a.href = "https://github.com/sachiniyer/" + name
          a.innerHTML = name
          newhead.appendChild(a)
          console.log(name)
          var newbod = conv.makeHtml(data)
          var div = document.createElement("div")
          div.innerHTML = newbod
          document.getElementById("repos").appendChild(newhead)
          document.getElementById("repos").appendChild(div)
        })
        .catch((err) => {
          console.log("README.md not found for: " + name)
        })
    }
  }

}

options =  {
  headers: {
    "User-Agent": "sachiniyer"
  },
  method:"GET"
}

fetch(url, options)
  .then((response) => {
    return response.text()
  })
  .then((data) => {
    weights = JSON.parse(data.toString())
  })

fetch(url, options)
  .then((response) => {
    return response.text()
  })
  .then((data) => {
    reporaw = JSON.parse(data.toString())
    processrepos(reporaw)
  })

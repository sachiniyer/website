const url = "https://api.github.com/users/sachiniyer/repos"
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


async function processrepos(repos){
	for (let i = 0; i < repos.length; i++) {
		var name = repos[i].name
		var branch = repos[i].default_branch
		var repourl = "https://raw.githubusercontent.com/sachiniyer/" + name + "/" + branch + "/README.md"
		await fetch(repourl)
			.then((response) => {
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
		reporaw = JSON.parse(data.toString())
		processrepos(reporaw)
	})

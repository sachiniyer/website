let PROJECTS_API = "https://api.github.com/repos/sachiniyer/resume/contents/projects?ref=master";
let RESUME_LINK = "https://raw.githubusercontent.com/sachiniyer/resume/master/resume.tex"

async function createElements() {
  let loading_elem = document.createElement("p");
  loading_elem.setAttribute('font-size', '1.5em');
  loading_elem.innerHTML = "Loading...";
  document.getElementById("projects").append(loading_elem);
  let projectsRaw = await getProjectsRaw();
  let projects = parseProjects(projectsRaw);
  let order = await getOrder(projects);
  let sorted_projects = sortProjects(projects, order);
  addProjects(sorted_projects);
  loading_elem.remove();
}

async function getProjectsRaw() {
  let urls = [];
  let names = [];
  await fetch(PROJECTS_API)
    .then(response => response.json())
    .then(function (data) {
      for (let i = 0; i < data.length; i++) {
        urls.push(data[i].download_url);
        names.push(data[i].name.slice(0, -4))
      }
    });
  let res = [];
  let futures = [];
  for (let i = 0; i < urls.length; i++) {
    futures.push(
      fetch(urls[i])
        .then(response => response.text())
        .then(function (data) {
          res.push({ "data": data, "name": names[i] });
        }));
  }
  await Promise.all(futures);
  return res;
}

function parseProjects(raw) {
  let res = [];
  for (let i = 0; i < raw.length; i++) {
    let parsed = fixHref(raw[i]["data"]);
    let str = parsed.split("{");
    let title = str[1];
    let desc = str[2]
    res.push({
      title: title.trim().split("}")[0],
      desc: desc.trim().split("}")[0],
      name: raw[i]["name"]
    });
  }
  return res;
}

function fixHref(str) {
  return str.replace(/\\href\{(.*?)\}\{(.*?)\}/g, (_, url, text) => {
    return `<a href="${url}">${text.trim()}</a>`;
  });
}

async function getOrder(_names) {
  let res = [];
  await fetch(RESUME_LINK)
    .then(response => response.text())
    .then(function (data) {
      let lines = data.split("\n");
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.includes("./projects/")) {
          res.push(line.split("./projects/")[1].split("}")[0]);
        }
      }
    });
  return res;
}

function sortProjects(projects, order) {
  let res = [];
  for (let name in order) {
    let index = projects.findIndex(x => x.name === order[name]);
    res.push(projects[index]);
    projects.splice(index, 1);
  }
  res = res.concat(projects);
  return res;
}

function addProjects(projects) {
  let container = document.getElementById("projects");
  for (let i = 0; i < projects.length; i++) {
    let project = projects[i];
    let title = project.title;
    let desc = project.desc;
    let add = document.createElement("tr")
    let titleElement = document.createElement("td");
    titleElement.innerHTML = title;
    let descElement = document.createElement("td");
    descElement.innerHTML = desc;
    add.append(titleElement)
    add.append(descElement)
    container.append(add)
  }
}

window.addEventListener('load', createElements);

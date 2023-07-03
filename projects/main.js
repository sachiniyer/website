let PROJECTS_API = "https://api.github.com/repos/sachiniyer/resume/contents/projects?ref=master";

async function createElements() {
  let projectsRaw = await getProjectsRaw();
  let projects = parseProjects(projectsRaw);
  addProjects(projects);
}

async function getProjectsRaw() {
  let urls = [];
  await fetch(PROJECTS_API)
    .then(response => response.json())
    .then(function (data) {
      for (let i = 0; i < data.length; i++) {
        urls.push(data[i].download_url);
      }
    });
  let res = [];
  let futures = [];
  for (let i = 0; i < urls.length; i++) {
    futures.push(
      fetch(urls[i])
        .then(response => response.text())
        .then(function (data) {
          res.push(data);
        }));
  }
  await Promise.all(futures);
  return res;
}

function parseProjects(raw) {
  let parsed = fixHref(raw);
  for (let i = 0; i < parsed.length; i++) {
    let str = parsed[i].split("{");
    let title = str[1];
    let desc = str[2]
    parsed[i] = {
      title: title.trim().split("}")[0],
      desc: desc.trim().split("}")[0]
    }
  }
  return parsed;
}

function fixHref(raw) {
  let res = [];
  for (let i = 0; i < raw.length; i++) {
    let str = raw[i];
    const convertedString = str.replace(/\\href\{(.*?)\}\{(.*?)\}/g, (match, url, text) => {
      return `<a href="${url}">${text.trim()}</a>`;
    });
    res.push(convertedString);
  }
  return res;
}

function addProjects(projects) {
  let container = document.getElementById("projects");
  for (let i = 0; i < projects.length; i++) {
    let project = projects[i];
    let title = project.title;
    let desc = project.desc;
    let projectElement = document.createElement("div");
    projectElement.classList.add("project");
    let titleElement = document.createElement("h2");
    titleElement.innerHTML = title;
    let descElement = document.createElement("p");
    descElement.innerHTML = desc;
    projectElement.appendChild(titleElement);
    projectElement.appendChild(descElement);
    container.appendChild(projectElement);
  }
}


window.addEventListener('load', createElements);

import {
  pipeline,
  env,
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.1";

let PROJECTS_API =
  "https://api.github.com/repos/sachiniyer/resume/contents/projects?ref=master";
let RESUME_LINK =
  "https://raw.githubusercontent.com/sachiniyer/resume/master/resume.tex";
let TOPICS = [
  "Web Development",
  "Machine Learning",
  "Dev Ops",
  "Embedded Systems",
  "Challenges/Certificates",
];

env.allowLocalModels = false;

export async function createElements() {
  let loading_elem = document.createElement("p");
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
    .then((response) => response.json())
    .then(function (data) {
      for (let i = 0; i < data.length; i++) {
        urls.push(data[i].download_url);
        names.push(data[i].name.slice(0, -4));
      }
    });
  let res = [];
  let futures = [];
  for (let i = 0; i < urls.length; i++) {
    futures.push(
      fetch(urls[i])
        .then((response) => response.text())
        .then(function (data) {
          res.push({ data: data, name: names[i] });
        }),
    );
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
    let desc = str[2];
    res.push({
      title: title.trim().split("}")[0],
      desc: desc.trim().split("}")[0],
      name: raw[i]["name"],
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
    .then((response) => response.text())
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
    let index = projects.findIndex((x) => x.name === order[name]);
    res.push(projects[index]);
    projects.splice(index, 1);
  }
  res = res.concat(projects);
  return res;
}

function addProjectList(projects, container) {
  for (let i = 0; i < projects.length; i++) {
    let project = projects[i];
    let title = project.title;
    let desc = project.desc;
    let add = document.createElement("tr");
    let titleElement = document.createElement("td");
    let titleP = document.createElement("p");
    titleElement.appendChild(titleP);
    titleP.innerHTML = title;
    let descElement = document.createElement("td");
    let descP = document.createElement("p");
    descElement.appendChild(descP);
    descP.innerHTML = desc;
    add.append(titleElement);
    add.append(descElement);
    container.append(add);
  }
}

function addTopicList(projects, topic, container) {
  let addTopic = document.createElement("tr");
  let topicElement = document.createElement("th");
  let topicH = document.createElement("h2");
  topicElement.appendChild(topicH);
  topicH.innerHTML = topic;
  topicElement.setAttribute("colspan", "2");
  topicElement.appendChild(topicH);
  addTopic.append(topicElement);
  container.append(addTopic);
  addProjectList(projects, container);
}

function addProjects(projects) {
  let container = document.getElementById("projects");
  addProjectList(projects, container);
}

async function load_model() {
  return await pipeline(
    "zero-shot-classification",
    "Xenova/nli-deberta-v3-xsmall",
  );
}

async function classifyProject(project, classifier) {
  const title = project.title;
  const desc = project.desc;
  const output = await classifier(
    `title: ${title} description ${desc}`,
    TOPICS,
  );
  return output;
}

async function addTopics(projects) {
  let container = document.getElementById("projects");
  // for each projects spawn a future to classify the project
  // aggregate all of the results
  // create the topic project lists
  // use addTopicList to create the topics themselves
}

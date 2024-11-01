let PROJECTS_API =
  "https://api.github.com/repos/sachiniyer/resume/contents/projects?ref=master";
let RESUME_LINK =
  "https://raw.githubusercontent.com/sachiniyer/resume/master/resume.tex";

let cpu_count = navigator.hardwareConcurrency;

const workerArray = [];
for (let i = 0; i < cpu_count; i++)
  workerArray.push(new Worker("worker.js", { type: "module" }));

let topicedResults = [];

for (let worker of workerArray) {
  worker.onmessage = function (e) {
    topicedResults.push(e.data);
  };

  worker.onerror = function (e) {
    console.log(e);
  };
}

export async function createElements() {
  let loading_elem = document.createElement("p");
  loading_elem.innerHTML = "Loading...";
  document.getElementById("projects").append(loading_elem);
  let projectsRaw = await getProjectsRaw();
  let projects = parseProjects(projectsRaw);
  let order = await getOrder(projects);
  let sorted_projects = sortProjects(projects, order);
  addProjects(sorted_projects);
  addTopics(sorted_projects);
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

function addHeader(container) {
  let add = document.createElement("tr");
  let titleElement = document.createElement("th");
  let titleH = document.createElement("h2");
  titleElement.appendChild(titleH);
  titleH.innerHTML = "Project";
  let descElement = document.createElement("th");
  let descH = document.createElement("h2");
  descElement.appendChild(descH);
  descH.innerHTML = "Description";
  add.append(titleElement);
  add.append(descElement);
  container.append(add);
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
  addHeader(container);
  addProjectList(projects, container);
}

/*
 * want to cluster the projects on my site together automatically inside of the browser. To do this, I will do with the following:
 *  - Pull https://github.com/huggingface/transformers.js
 *  - Load up a LLM
 *  - Do the inference through the LLM and format back the results
 *  - Display the information back through the browser
 *
 * I will do everything around the actual inference before the interview. During the interview, we could pair program
 * to do the actual inference (estimated time 10min) and bugfix anything that comes up (estimated time 10min). At a base goal,
 * I hope that we are at least getting output from the llm. As an extension, we could add a feature to have the
 * llm expand/improve the project descriptions before displaying them.
 *
 * Everything is written in plain javascript so it should hopefully be easy to understand.
 *
 * Also just as a quick sidenote, I tried this once before using both k-means and lda to cluster the topics and cosine similarity
 * to apply labels. Unfortunately, there is not enough information encoded in the actual project descriptions to use classical techniques. Now,
 * I want to try to use the information encoded in an llm to try and do the clustering/labeling for us.
 */
// task 1: get the basic classification and display it in the UI
// task 2: parallelize the functionality through futures
// task 3: add another model to expand on the descriptions before publishing to the browser
// task 4: use web workers to decrease processing computer even further
async function addTopics(projects) {
  let projects_len = projects.length;
  let projects_per_worker = Math.ceil(projects_len / cpu_count);
  for (let i = 0; i < cpu_count; i++) {
    let start = i * projects_per_worker;
    let end = Math.min((i + 1) * projects_per_worker, projects_len);
    for (let project of projects.slice(start, end)) {
      workerArray[i].postMessage(project);
    }
    console.log(
      `sent ${projects.slice(start, end).length} projects to worker ${i}`,
    );
  }

  let interval = setInterval(() => {
    console.log(
      `processed ${topicedResults.length} out of ${projects_len} projects`,
    );
    if (topicedResults.length === projects_len) {
      clearInterval(interval);
      console.log(topicedResults);
      let topics = {};
      for (let project of topicedResults) {
        let topic = project["topic"];
        if (topic in topics) {
          topics[topic].push(project["project"]);
        } else {
          topics[topic] = [project["project"]];
        }
      }
      let container = document.getElementById("projects");
      container.innerHTML = "";
      addHeader(container);
      for (const [topic, projects] of Object.entries(topics)) {
        addTopicList(projects, topic, container);
      }
    }
  }, 1000);
}

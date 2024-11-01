import {
  pipeline,
  env,
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.1";

console.log("Worker loaded");
let loading_lock = false;
let loaded = false;

env.allowLocalModels = false;
let classifier;

let TOPICS = [
  "Web Development",
  "Machine Learning",
  "Dev Ops",
  "Embedded Systems",
  "Challenges/Certificates",
];

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

function maxIndex(scores) {
  let val = 0;
  let topic = 0;
  for (let i in scores) {
    if (scores[i] > val) {
      topic = i;
    }
  }
  return topic;
}

onmessage = async function (e) {
  if (!classifier && !loading_lock) {
    console.log("Loading model");
    loading_lock = true;
    classifier = await load_model();
    loaded = true;
  }
  if (!loaded) {
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (loaded) {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });
  }
  const project = e.data;
  const output = await classifyProject(project, classifier);
  const topic = maxIndex(output.scores);
  const result = { topic: TOPICS[topic], project: project };
  postMessage(result);
};

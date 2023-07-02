let outer_web = {
  "Github": "https://github.com/sachiniyer",
  "Linkedin": "https://www.linkedin.com/in/sachin-iyer-8b2735217/",
  "Mastodon": "https://mastodon.social/@ripe_mango",
  "Lemmy": "https://lemmy.world/u/ripe_banana"
};
let inner_web = {
  "Resume": "https://sachiniyer.com/resume",
  "Email": "https://sachiniyer.com/email",
  "Projects": "https://sachiniyer.com/projects",
  "About": "https://sachiniyer.com/about",
  "Fun Page": "https://sachiniyer.com/interesting"
};

let sub_web_exclude = ["tunnel.sachiniyer.com", "sachiniyer.com"];

function getRandomColor() {
  var colors = ['#7F9F7F', '#F0DFAF', '#DC8CC3'];
  var randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}


function resizeColumnLists() {
  var columnLists = document.getElementsByClassName('list');
  var widthOutput = document.documentElement.clientWidth;
  var columnCount = Math.floor(widthOutput / 600);
  for (var i = 0; i < columnLists.length; i++) {
    columnLists[i].style.columnCount = columnCount;
  }
}

window.addEventListener('load', resizeColumnLists);
window.addEventListener('resize', resizeColumnLists);
window.addEventListener('orientationchange', resizeColumnLists);



function createInnerElements() {
  var innerElements = document.getElementById('innerElements');

  for (var key in inner_web) {
    var value = inner_web[key];
    var li = document.createElement('li');
    var a = document.createElement('a');
    var p = document.createElement('p');

    li.appendChild(a);
    a.appendChild(p);

    a.setAttribute('class', 'btn');
    a.setAttribute('href', value);
    a.setAttribute('type', 'button');

    p.setAttribute('class', 'general-text responsive-text');
    let color = getRandomColor();
    p.style.setProperty('--hover-color', color);
    p.innerHTML = key;

    innerElements.appendChild(li);
  }
}

function createOuterElements() {
  var outerElements = document.getElementById('outerElements');

  for (var key in outer_web) {
    var value = outer_web[key];
    var li = document.createElement('li');
    var a = document.createElement('a');
    var p = document.createElement('p');

    li.appendChild(a);
    a.appendChild(p);

    a.setAttribute('class', 'btn');
    a.setAttribute('href', value);
    a.setAttribute('type', 'button');

    p.setAttribute('class', 'general-text responsive-text');
    p.style.setProperty('--hover-color', getRandomColor());
    p.innerHTML = key;

    outerElements.appendChild(li);
  }
}


function findSubElements() {
  return new Promise(function (resolve, _) {
    let request = new XMLHttpRequest();
    request.open('GET', 'https://status.sachiniyer.com', true);
    request.send(null);
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        let type = request.getResponseHeader('Content-Type');
        if (type.indexOf("text") !== 1) {
          let sub_web = request.responseText;
          let sub_web_json = JSON.parse(sub_web);
          resolve(Object.keys(sub_web_json))
        }
      }
    }
  });
}

function testSite(url) {
  return new Promise(function (resolve, _) {
    let request = new XMLHttpRequest();
    // allow cors
    request.withCredentials = true;
    request.open('GET', url, true);
    request.send(null);
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    }
  });
}


function createSubElements(elems) {
  var subElements = document.getElementById('subElements');

  for (var key of elems) {
    let url = 'http://' + key;
    testSite(url)
      .then(function (f) {
        if (f) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          var p = document.createElement('p');

          p.style.setProperty('--hover-color', getRandomColor());
          li.appendChild(a);
          a.appendChild(p);

          a.setAttribute('class', 'btn');
          a.setAttribute('href', url);
          a.setAttribute('type', 'button');

          p.setAttribute('class', 'general-text responsive-text');
          p.innerHTML = key;

          subElements.appendChild(li);
        }
      });
  }
}

function toggleDisplay(e) {
  let elem = document.getElementById(e + "Elements");
  let right = document.getElementById(e + "HeadingRight")
  let left = document.getElementById(e + "HeadingLeft")
  if (elem.style.display === 'none') {
    elem.style.display = 'block';
    left.innerHTML = '↡';
    right.innerHTML = '↡';
  } else {
    elem.style.display = 'none';
    left.innerHTML = '↠';
    right.innerHTML = '↞';
  }

}

function createElements() {
  createInnerElements();
  createOuterElements();
  findSubElements()
    .then(function (f) {
      createSubElements(f);
    })
}

window.addEventListener('load', createElements);


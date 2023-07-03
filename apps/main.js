let sub_web_exclude = ["tunnel.sachiniyer.com", "sachiniyer.com"];

function getRandomColor() {
  var colors = ['#7F9F7F', '#F0DFAF', '#DC8CC3'];
  var randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}


function resizeColumnLists() {
  var columnLists = document.getElementsByClassName('list');
  for (var i = 0; i < columnLists.length; i++) {
    var widthOutput = columnLists[i].offsetWidth;
    var columnCount = Math.floor(widthOutput / 600);
    columnLists[i].style.columnCount = columnCount;
  }
}

function createElements() {
  createSubElements();
}

function createElement(elem, key, value) {
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

  elem.appendChild(li);

}


function createSubElements() {
  var subElements = document.getElementById('subElements');
  let socket = new WebSocket("wss://status.sachiniyer.com/ws");
  socket.onmessage = function (event) {
    createElement(subElements, event.data.substring(8), event.data)
  };
}


window.addEventListener('load', resizeColumnLists);
window.addEventListener('resize', resizeColumnLists);
window.addEventListener('orientationchange', resizeColumnLists);

window.addEventListener('load', createElements);

var API = {
  counter: 10
};

setInterval(function() {
  API.counter--;
  document.querySelector('#counter').innerText = API.counter;
  if (API.counter < 1) {
    API.counter = 0;
    window.location = 'index.html';
  }
}, 1000);

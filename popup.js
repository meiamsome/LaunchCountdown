"use strict";

window.addEventListener('load', function() {
  let container = document.querySelector('#launches');
  let launch_template = "";
  let template_view = null;
  let launches = [];

  chrome.storage.local.get('launches', function(l) {
    launches = l.launches;
    rerender();
  });

  fetch(chrome.runtime.getURL("launch_template.html"))
    .then(r => r.text())
    .then(function(r) {
      launch_template = paperclip.template(r);
      template_view = launch_template.view({
        launches: []
      });
      document.body.appendChild(template_view.render());
      rerender();
    });

  let rerender = function() {
    if(template_view != null) {
      document.body.classList.add('load');
      template_view.setProperties({
        launches: launches
      });
    }
  }

  let difference = function(start, end) {
    let delta = end - start;
    if(delta > 48 * 60 * 60 * 1000) return null;
    let seconds = ("00" + Math.floor(delta / 1000) % 60).substr(-2);
    let minutes = ("00" + Math.floor(delta / 60000) % 60).substr(-2);
    let hours = Math.floor(delta / 3600000);
    return [hours, minutes, seconds].join(":");
  }


  setInterval(function() {
    if(launches.map(function(launch, id) {
      let editted = false;
      let cd = difference(Date.now(), launch.wsstamp * 1000);
      if(cd !== null && cd !== launch.countdown) {
        launch.countdown = cd;
        editted = true;
      }
      let winlen = difference(launch.wsstamp * 1000, launch.westamp * 1000);
      if(launch.wsstamp !== launch.westamp && winlen !== launch.window_length) {
        launch.window_length = winlen;
        editted = true;
      }
      return editted;
    }).some(x => x)) {
      rerender();
    }
  }, 100);
});

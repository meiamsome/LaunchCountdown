"use strict";

let refetch = function() {
  fetch("https://launchlibrary.net/1.1/launch/next/10")
    .then(r => r.json())
    .then(data => {
      chrome.storage.local.set({
        'launches': data.launches
      });
    });
};

// Alarms
function initAlarms() {
  chrome.alarms.create("refetchLaunches", {
    when: Date.now(),
    periodInMinutes: 60
  });
}


chrome.alarms.onAlarm.addListener(function(fired_alarm) {
  if(fired_alarm.name === "refetchLaunches") {
    refetch();
  }
})

initAlarms();

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'START_POMODORO') {
    startPomodoro(message.workDuration, message.breakDuration);
  } else if (message.type === 'STOP_POMODORO') {
    stopPomodoro();
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "startTimer",
    title: chrome.i18n.getMessage("startTimer"),
    contexts: ["all"]
  });

  chrome.contextMenus.create({
    id: "stopTimer",
    title: chrome.i18n.getMessage("stopTimer"),
    contexts: ["all"]
  });

  chrome.contextMenus.create({
    id: "addTask",
    title: chrome.i18n.getMessage("addTask"),
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "startTimer") {
    // Logic to start the timer
    chrome.runtime.sendMessage({ action: "startTimer" });
  } else if (info.menuItemId === "stopTimer") {
    // Logic to stop the timer
    chrome.runtime.sendMessage({ action: "stopTimer" });
  } else if (info.menuItemId === "addTask") {
    // Logic to add a task
    chrome.runtime.sendMessage({ action: "addTask" });
  }
});

function startPomodoro(workDuration, breakDuration) {
  chrome.alarms.create('pomodoroWork', { delayInMinutes: workDuration });
  chrome.storage.sync.set({ currentSession: 'work', endTime: Date.now() + workDuration * 60000 });

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'pomodoroWork') {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: chrome.i18n.getMessage("pomodoroComplete"),
        message: chrome.i18n.getMessage("takeBreak", { breakDuration })
      });
      chrome.alarms.create('pomodoroBreak', { delayInMinutes: breakDuration });
      chrome.storage.sync.set({ currentSession: 'break', endTime: Date.now() + breakDuration * 60000 });
    } else if (alarm.name === 'pomodoroBreak') {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: chrome.i18n.getMessage("breakOver"),
        message: chrome.i18n.getMessage("timeToFocus")
      });
      chrome.storage.sync.set({ currentSession: 'stopped' });
      chrome.browserAction.setBadgeText({ text: '' });
    }
  });

  updateBadge();
}

function stopPomodoro() {
  chrome.alarms.clearAll();
  chrome.storage.sync.set({ currentSession: 'stopped' });
  chrome.browserAction.setBadgeText({ text: '' });
}

function updateBadge() {
  chrome.storage.sync.get(['endTime', 'currentSession'], (result) => {
    if (result.currentSession === 'work' || result.currentSession === 'break') {
      const remainingTime = Math.max(0, result.endTime - Date.now());
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);
      const badgeText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      chrome.browserAction.setBadgeText({ text: badgeText });
      chrome.browserAction.setBadgeBackgroundColor({ color: result.currentSession === 'work' ? '#FF0000' : '#00FF00' });

      if (remainingTime > 0) {
        setTimeout(updateBadge, 1000);
      }
    }
  });
}
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'START_POMODORO') {
      startPomodoro(message.workDuration, message.breakDuration);
    } else if (message.type === 'STOP_POMODORO') {
      stopPomodoro();
    } else if (message.type === 'ADD_TASK') {
      addTask(message.taskText);
    }
  });
  
  function startPomodoro(workDuration, breakDuration) {
    const workTimeMs = workDuration * 60 * 1000;
    chrome.alarms.create('pomodoroWork', { delayInMinutes: workDuration });
    chrome.storage.local.set({ currentSession: 'work' });
  
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'pomodoroWork') {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'Pomodoro Complete',
          message: `Take a ${breakDuration} minute break!`
        });
        chrome.alarms.create('pomodoroBreak', { delayInMinutes: breakDuration });
        chrome.storage.local.set({ currentSession: 'break' });
      } else if (alarm.name === 'pomodoroBreak') {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'Break Over',
          message: 'Time to focus again!'
        });
        chrome.alarms.create('pomodoroWork', { delayInMinutes: workDuration });
        chrome.storage.local.set({ currentSession: 'work' });
      }
    });
  }
  
  function stopPomodoro() {
    chrome.alarms.clearAll();
    chrome.storage.local.set({ currentSession: 'stopped' });
  }
  
  function addTask(taskText) {
    chrome.storage.local.get(['tasks'], (result) => {
      const tasks = result.tasks || [];
      tasks.push({ text: taskText, completed: false });
      chrome.storage.local.set({ tasks });
    });
  }
  
document.getElementById('startPomodoro').addEventListener('click', () => {
    const workDuration = parseInt(document.getElementById('workDuration').value);
    const breakDuration = parseInt(document.getElementById('breakDuration').value);
    chrome.runtime.sendMessage({ type: 'START_POMODORO', workDuration, breakDuration });
    document.getElementById('status').innerText = `Pomodoro started for ${workDuration} minutes.`;
  });
  
  document.getElementById('stopPomodoro').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'STOP_POMODORO' });
    document.getElementById('status').innerText = "Pomodoro stopped.";
  });
  
  // Task management
  document.getElementById('addTask').addEventListener('click', () => {
    const taskText = document.getElementById('newTask').value;
    if (taskText) {
      chrome.runtime.sendMessage({ type: 'ADD_TASK', taskText });
      document.getElementById('newTask').value = '';
      loadTasks();
    }
  });
  
  function loadTasks() {
    chrome.storage.local.get(['tasks'], (result) => {
      const taskList = document.getElementById('taskList');
      taskList.innerHTML = '';
      const tasks = result.tasks || [];
      tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.innerText = task.text;
        if (task.completed) {
          listItem.classList.add('completed');
        }
        taskList.appendChild(listItem);
      });
    });
  }
  
  loadTasks();
  
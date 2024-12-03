import { addTask, getTasks, toggleTaskCompletion } from '../storage/focusData.js';

// Load dark mode setting
chrome.storage.sync.get(['darkMode'], (result) => {
  if (result.darkMode) {
    document.body.classList.add('dark-mode');
    document.getElementById('darkModeToggle').checked = true;
  }
});

// Dark mode toggle
document.getElementById('darkModeToggle').addEventListener('change', (event) => {
  const darkMode = event.target.checked;
  chrome.storage.sync.set({ darkMode }, () => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });
  ga('send', 'event', 'Dark Mode', 'toggle', darkMode ? 'enabled' : 'disabled');
});

// Pomodoro Controls
document.getElementById('startPomodoro').addEventListener('click', () => {
  const workDuration = parseInt(document.getElementById('workDuration').value);
  const breakDuration = parseInt(document.getElementById('breakDuration').value);
  chrome.runtime.sendMessage({ type: 'START_POMODORO', workDuration, breakDuration });
  document.getElementById('status').innerText = `Pomodoro started for ${workDuration} minutes.`;
  ga('send', 'event', 'Pomodoro', 'start', `Work: ${workDuration} min, Break: ${breakDuration} min`);
});

document.getElementById('stopPomodoro').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'STOP_POMODORO' });
  document.getElementById('status').innerText = "Pomodoro stopped.";
  ga('send', 'event', 'Pomodoro', 'stop');
});

// Task Management
document.getElementById('addTask').addEventListener('click', () => {
  const taskText = document.getElementById('newTask').value;
  const category = document.getElementById('taskCategory').value;
  const priority = document.getElementById('taskPriority').value;
  const deadline = document.getElementById('taskDeadline').value;
  if (taskText) {
    addTask(taskText, category, priority, deadline);
    document.getElementById('newTask').value = '';
    document.getElementById('taskCategory').value = '';
    document.getElementById('taskPriority').value = '';
    document.getElementById('taskDeadline').value = '';
    loadTasks();
    ga('send', 'event', 'Task', 'add', `Task: ${taskText}, Category: ${category}, Priority: ${priority}, Deadline: ${deadline}`);
  }
});

function loadTasks() {
  getTasks((tasks) => {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const listItem = document.createElement('li');
      listItem.innerText = `${task.text} - ${task.category} - ${task.priority} - ${task.deadline}`;
      listItem.onclick = () => toggleTaskCompletion(index);
      if (task.completed) listItem.classList.add('completed');
      taskList.appendChild(listItem);
    });
  });
}

loadTasks();

// Ambient Sound Controls
const whiteNoiseAudio = new Audio('../sounds/white-noise.mp3');
const rainAudio = new Audio('../sounds/rain.mp3');

whiteNoiseAudio.loop = true;
rainAudio.loop = true;

document.getElementById('playWhiteNoise').addEventListener('click', () => {
  stopAllSounds();
  whiteNoiseAudio.play();
  ga('send', 'event', 'Sound', 'play', 'White Noise');
});

document.getElementById('playRain').addEventListener('click', () => {
  stopAllSounds();
  rainAudio.play();
  ga('send', 'event', 'Sound', 'play', 'Rain');
});

document.getElementById('stopSound').addEventListener('click', () => {
  stopAllSounds();
  ga('send', 'event', 'Sound', 'stop');
});

function stopAllSounds() {
  whiteNoiseAudio.pause();
  rainAudio.pause();
  whiteNoiseAudio.currentTime = 0;
  rainAudio.currentTime = 0;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startTimer") {
    startTimer();
  } else if (request.action === "stopTimer") {
    stopTimer();
  } else if (request.action === "addTask") {
    addTask();
  }
});

function startTimer() {
  console.log("Timer started");
}

function stopTimer() {
  console.log("Timer stopped");
}

function addTask() {
  console.log("Task added");
}

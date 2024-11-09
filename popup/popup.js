import { addTask, getTasks, toggleTaskCompletion } from '../storage/focusData.js';

// Pomodoro Controls
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

// Task Management
document.getElementById('addTask').addEventListener('click', () => {
  const taskText = document.getElementById('newTask').value;
  if (taskText) {
    addTask(taskText);
    document.getElementById('newTask').value = '';
    loadTasks();
  }
});

function loadTasks() {
  getTasks((tasks) => {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const listItem = document.createElement('li');
      listItem.innerText = task.text;
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
});

document.getElementById('playRain').addEventListener('click', () => {
  stopAllSounds();
  rainAudio.play();
});

document.getElementById('stopSound').addEventListener('click', stopAllSounds);

function stopAllSounds() {
  whiteNoiseAudio.pause();
  rainAudio.pause();
  whiteNoiseAudio.currentTime = 0;
  rainAudio.currentTime = 0;
}

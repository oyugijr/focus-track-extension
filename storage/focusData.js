export function addTask(taskText, category, priority, deadline) {
  chrome.storage.sync.get(['tasks'], (result) => {
    const tasks = result.tasks || [];
    tasks.push({ text: taskText, category, priority, deadline, completed: false });
    chrome.storage.sync.set({ tasks });
  });
}

export function toggleTaskCompletion(taskIndex) {
  chrome.storage.sync.get(['tasks'], (result) => {
    const tasks = result.tasks || [];
    if (tasks[taskIndex]) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      chrome.storage.sync.set({ tasks });
    }
  });
}

export function getTasks(callback) {
  chrome.storage.sync.get(['tasks'], (result) => {
    callback(result.tasks || []);
  });
}
export function addTask(taskText) {
    chrome.storage.local.get(['tasks'], (result) => {
      const tasks = result.tasks || [];
      tasks.push({ text: taskText, completed: false });
      chrome.storage.local.set({ tasks });
    });
  }
  
  export function toggleTaskCompletion(taskIndex) {
    chrome.storage.local.get(['tasks'], (result) => {
      const tasks = result.tasks || [];
      if (tasks[taskIndex]) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        chrome.storage.local.set({ tasks });
      }
    });
  }
  
  export function getTasks(callback) {
    chrome.storage.local.get(['tasks'], (result) => {
      callback(result.tasks || []);
    });
  }
  
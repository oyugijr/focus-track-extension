document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('options-form');

  // Load saved options
  chrome.storage.sync.get(['pomodoroDuration', 'breakDuration', 'darkMode'], (result) => {
    document.getElementById('pomodoro-duration').value = result.pomodoroDuration || 25;
    document.getElementById('break-duration').value = result.breakDuration || 5;
    document.getElementById('dark-mode').checked = result.darkMode || false;
    if (result.darkMode) {
      document.body.classList.add('dark-mode');
    }
  });

  // Save options
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const pomodoroDuration = document.getElementById('pomodoro-duration').value;
    const breakDuration = document.getElementById('break-duration').value;
    const darkMode = document.getElementById('dark-mode').checked;
    chrome.storage.sync.set({ pomodoroDuration, breakDuration, darkMode }, () => {
      alert('Options saved!');
      if (darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });
  });
});
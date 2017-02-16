let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');
const form = document.customForm;

function timer(seconds) {
  // clear existing timers
  clearInterval(countdown);

  // use Date.now(), because setInterval doesn't
  // update each second on all
  const now = Date.now();
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);
  displayEndTime(then);


  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    if(secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }

    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  let remainderSeconds = seconds % 60;
  const display = `${minutes}:${remainderSeconds < 10 ? '0' + remainderSeconds : remainderSeconds}`;
  document.title = display;
  timerDisplay.textContent = display;
  console.log(minutes);
}

function displayEndTime(timestamp) {
  const endDate = new Date(timestamp);
  const hours = endDate.getHours();
  const minutes = endDate.getMinutes();

  endTime.textContent = `Be back at: ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}

buttons.forEach(button => button.addEventListener('click', function() {
  timer(parseInt(this.dataset.time));
}));

form.addEventListener('submit', function(e) {
  e.preventDefault();
  timer(parseInt(this.minutes.value * 60));
  this.reset();
});

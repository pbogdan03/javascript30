const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

let rangeActive = false;
let scrubActive = false;

function togglePlay() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

function updateButton() {
  const icon = this.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function toggleRangeState() {
  rangeActive = !rangeActive;
};

function handleProgress() {
  const percent = video.currentTime / video.duration * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubPos = e.offsetX / progress.offsetWidth * 100;
  progressBar.style.flexBasis = `${scrubPos}%`;
}

function updateVideo(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;

  scrubActive = false;
}

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);

skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('mousedown', toggleRangeState));
ranges.forEach(range => range.addEventListener('mouseup', toggleRangeState));
ranges.forEach(range => range.addEventListener('mousemove', function(e) {
  rangeActive && handleRangeUpdate.call(this, e);
}));

progress.addEventListener('mousedown', () => scrubActive = true);
progress.addEventListener('mouseup', updateVideo);
progress.addEventListener('mousemove', (e) => scrubActive && scrub(e));

const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const checkboxes = document.querySelectorAll('[type="checkbox"]');

let colorFilter = 'NONE';

function getVideo() {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  })
    .then(localMediaStream => {
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => {
      console.error(`OH NO! You need to provide access to the webcam for this to work`, err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(video, 0, 0, width, height);
  let pixels = ctx.getImageData(0, 0, width, height);
  switch(colorFilter) {
    case 'red-effect':
      pixels = redEffect(pixels);
      break;
    case 'rgb-split':
      pixels = rgbSplit(pixels);
      break;
    case 'green-screen':
      pixels = greenScreen(pixels);
      break;
  }
  ctx.putImageData(pixels, 0, 0);

  requestAnimationFrame(paintToCanvas);
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src='${data}' alt=Handsome man />`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for(let i = 0, j = pixels.data.length; i < j; i+=4) {
    pixels.data[i] = pixels.data[i] + 100;          // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50;   // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5;  // BLUE
  }

  return pixels;
}

function rgbSplit(pixels) {
  for(let i = 0, j = pixels.data.length; i < j; i+=4) {
    pixels.data[i - 150] = pixels.data[i];       // RED
    pixels.data[i + 100] = pixels.data[i + 1];   // GREEN
    pixels.data[i - 150] = pixels.data[i + 2];   // BLUE
  }

  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for(let i = 0, j = pixels.data.length; i < j; i += 4) {
    const red = pixels.data[i],
          green = pixels.data[i + 1],
          blue = pixels.data[i + 2];

    if(red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function(e) {
    checkboxes.forEach((checkbox) => {
      if(checkbox !== e.target) checkbox.checked = false;
    });
    colorFilter = e.target.name;
  });
});

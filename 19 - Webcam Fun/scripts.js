const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

const getVideo = async () => {
    try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({video: true});
    console.log(mediaStream);
    video.srcObject = mediaStream;
    video.play();
    } catch (err) {
        alert(err);
    }
    
}

const paintToCanvas = () => {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        //take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        //mess with them
        // pixels = redEffect(pixels);
        
        // pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.1;

        pixels = greenScreen(pixels);
        //put them back
        ctx.putImageData(pixels, 0, 0);
    }, 16)
}

const takePhoto = () => {
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'pretty');
    link.innerHTML = `<img src="${data}" alt="pretty girl" />`
    strip.insertBefore(link, strip.firstChild);
}

const redEffect = (pixels) => {
    for(let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i] = pixels.data[i] + 100; //r
        pixels.data[i+1] = pixels.data[i+1] - 50; //g
        pixels.data[i+2] = pixels.data[i+2] * 0.5; //b
    }
    return pixels;
}

const rgbSplit = (pixels) => {
    for(let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i]; //r
        pixels.data[i + 100] = pixels.data[i+1]; //g
        pixels.data[i - 150] = pixels.data[i+2]; //b
    }
    return pixels;
}

const greenScreen = (pixels) => {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];

      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
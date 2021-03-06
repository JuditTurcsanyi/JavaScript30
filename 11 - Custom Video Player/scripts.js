const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreenButton = player.querySelector('.screen_toggle');

const togglePlay = () => {
    video.paused ? video.play() : video.pause();
}

const updateButton = () => {
    const icon = video.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

const skip = (e) => {
   video.currentTime += parseFloat(e.target.dataset.skip);
}

const handleRangeUpdate = (e) =>{
    video[e.target.name] = e.target.value;
}

const handleProgress = () => {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

const scrub = (e) =>{
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

const handleFullscreen = () => {
    player.classList.toggle('fullscreen');
}

video.addEventListener('click', togglePlay);
video.addEventListener('click', updateButton);
video.addEventListener('timeupdate', handleProgress);
toggle.addEventListener('click', togglePlay);
toggle.addEventListener('click', updateButton);
fullscreenButton.addEventListener('click', handleFullscreen);

skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
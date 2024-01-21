document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:3001");
    const responseData = await response.json(); // Parse the response as JSON
    const info = responseData.info;
    const music = responseData.musicInfo;
    const musiclist = responseData.list;

    displayData(info);
    displaymusic(musiclist);
    playmusic(music);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

function displayData(info) {
  const cardContainer = document.querySelector(".cardcontainer");
  cardContainer.innerHTML = info.join("");
}
function displaymusic(musiclist) {
  const cards = document.querySelectorAll(".card");
  const list = document.getElementById("list");
  cards.forEach((card, i) => {
    card.addEventListener("click", () => {
      list.innerHTML = "";

      console.log(musiclist[i]);
      musiclist[i].forEach((e) => {
        let divElement = document.createElement("div");
        divElement.className = "songInfo";
        divElement.innerHTML = ` <h4>${e}</h4>
                           <span><img style="cursor: pointer;" id="img" src="./assets/img/play.svg" alt=""></span>`;
        list.appendChild(divElement);
      });
    });
  });
}

function playmusic(music) {
  let play = "./assets/img/play.svg";
  let pause = "./assets/img/pause.svg";
  const cards = document.querySelectorAll(".card");

  cards.forEach((card, i) => {
    card.addEventListener("click", () => {
      const songInfo = document.querySelectorAll(".songInfo");
      next(songInfo, music[i]);
      songInfo.forEach((e, j, arr) => {
        e.addEventListener("click", () => {
          let source = music[i][j];

          const audio = document.getElementById("myAudio");
          const play = document.getElementById("playButton");
          audio.src = source;
          audio.play();
          play.innerHTML = `<img src="./assets/img/pause.svg" />`;
        });
      });
    });
  });
}
function wave() {
  const audio = document.getElementById("myAudio");
  const seekbar = document.getElementById("seekbar");
  const volume = document.getElementById("volume");
  const play = document.getElementById("playButton");
  const timeInput = document.getElementById("timeInput");
  const totalDuration = document.getElementById("totalDuration");

  //this timeupdate funtion tells abouts the real time ditali of audio seek bar
  audio.addEventListener("timeupdate", () => {
    if (!isNaN(audio.duration) && isFinite(audio.duration)) {
      const value = (audio.currentTime / audio.duration) * 100;
      console.log(value);

      seekbar.value = value;

      timeInput.value = formatTime(audio.currentTime);
      totalDuration.textContent = `/ ${formatTime(audio.duration)}`;
    }
  });
  audio.addEventListener("input", () => {
    const value = audio.volume * 100 + 2;
    console.log(value);
    volume.value = value;
  });
  audio.addEventListener("ended", () => {
    audio.currentTime = 0; // Reset playback to the beginning
    audio.play(); // Start playing again
  });
  volume.addEventListener("input", () => {
    const value = volume.value / 100;
    console.log(value);
    audio.volume = value;
  });
  //opp of what we have done
  seekbar.addEventListener("input", () => {
    const value = (seekbar.value / 100) * audio.duration;
    console.log(value);
    audio.currentTime = value;
  });
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    console.log(`${minutes}:${seconds < 10 ? 0 : " "}:${seconds}`);
    return `${minutes}:${seconds < 10 ? 0 : " "}${seconds}`;
  }
  play.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();

      play.innerHTML = `<img src="./assets/img/pause.svg" />`;
    } else {
      audio.pause();
      play.innerHTML = `<img src="./assets/img/play.svg"/>`;
    }
  });
}
wave();

function speaker() {
  const volume = document.getElementById("volume");
  let Tagvol = document.querySelector(".fa-volume-high");
  let bool = true;
  Tagvol.addEventListener("click", () => {
    if (bool) {
      volume.style.opacity = 1;
      volume.style.width = "50px";
      volume.style.position = "relative";
      console.log("hi");
      bool = false;
    } else {
      volume.style.opacity = 0;
      volume.style.width = "0";
      volume.style.position = "relative";
      console.log("hi");
      bool = true;
    }
  });
}
speaker();

function next(info, music) {
  info.forEach((e, idx) => {
    e.addEventListener("click", () => {
      Change(idx, music);
    });
  });
}

function Change(i, music) {
  let playprev = document.getElementById("playprev");
  let playnext = document.getElementById("playnext");
  let len = music.length;

  playprev.addEventListener("click", () => {
    if (i > 0 && i < len) {
      const audio = document.getElementById("myAudio");
      i--; // Decrease 'i' only if it's greater than 0
      audio.src = music[i];
      audio.play();
    }
  });

  playnext.addEventListener("click", function go() {
    if (i >= 0 && i < len - 1) {
      const audio = document.getElementById("myAudio");
      i++; // Increase 'i' only if it's less than len - 1
      audio.src = music[i];
      audio.play();
    }
  });
}

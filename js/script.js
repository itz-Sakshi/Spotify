console.log("Spotify Clone by Sakshi");
let currentSong = new Audio();
let songs;
let index;
let currFolder;

function secondsToMinutes(seconds) {
  seconds = Math.floor(seconds);

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Add leading zero to minutes and seconds if necessary
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  // Return the formatted time
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/songs/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  // console.log(response);
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songNames = element.href.split(`/songs/${folder}/`)[1];
      songs.push(songNames.split("_128")[0]);
    }
  }
  console.log(songs);

  // Show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
              <img class="invert" src="images/music.svg" alt="music">
              <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>           
              </div>
              <div class="playNow flex">
                <span>Play Now</span>
              <img class="invert" src="images/play.svg" alt="play now">
              </div>
      </li>`;
  }

  // Attach an event listener to each song;
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
}

const playMusic = (track, pause = false) => {
  const songURL = `/songs/${currFolder}/${track}_128-PagalWorld.Ink.mp3`;
  console.log(`Playing music from URL: ${songURL}`);
  currentSong.src = songURL;

  if (!pause) {
    currentSong.play();
    play.src = "images/pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  let a = await fetch("/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let cardContainer = document.querySelector(".cardContainer")
  let anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors);
  for (let i = 0; i < array.length; i++){
    const e = array[i];
    if(e.href.includes("/songs") && !e.href.includes(".htacess")){
      let folder = e.href.split("/songs/")[1].split("/")[0];
      // Get the meta-data of the URL
      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML = cardContainer.innerHTML +  `<div data-folder="${folder}" class="card">
              <div class="play">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="60"
                  height="60"
                  color="#000000"
                  fill="none"
                >
                  <circle cx="12" cy="12" r="12" fill="#1fdf64" />
                  <path
                    d="M9.5 11V13C9.5 14.5 9.5 15.5 10 16C10.5 16.5 11.5 16 12.8 15.3L14.5 14.4C16 13.5 17 13 17 12C17 11 16 10.5 14.5 9.6L12.8 8.7C11.5 8 10.5 7.5 10 8C9.5 8.5 9.5 9.5 9.5 11Z"
                    fill="black"
                  />
                </svg>
              </div>
              <img src="songs/${folder}/playlist.jpeg" alt="playlist" />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`; 
          }}

          attachCardListeners();
      
    
}

function attachCardListeners() {
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    console.log("Adding event listener to card:", e);
    e.addEventListener("click", async function (item) {
      // console.log("Card clicked:", item);
      // console.log("this:", this);
      // console.log("item.currentTarget:", item.currentTarget);
      songs = await getSongs(`${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  await getSongs("Karan_Aujla");
  playMusic(songs[0], true);
  console.log(songs);

  // Display all the albums on the page
  await displayAlbums();

  // Attach an event listener to play song
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      console.log(currentSong.src);
      currentSong.play();
      play.src = "images/pause.svg";
    } else {
      currentSong.pause();
      play.src = "images/play.svg";
    }
  });
  // listen for time update event
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songTime").innerHTML = `${secondsToMinutes(
      currentSong.currentTime
    )}/${secondsToMinutes(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
    if(currentSong.currentTime == currentSong.duration){
      let currentSongName = currentSong.src
      .split("/")
      .slice(-1)[0]
      .split("_128")[0];
      index = songs.indexOf(currentSongName);
      if (index + 1 < songs.length) {
        playMusic(songs[index + 1]);
      } else {
        playMusic(songs[0]);
      }
    }
  });
  // Add an event listener to the seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });

  // Add an event listener for the close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Add an event listener for prev and next
  previous.addEventListener("click", () => {
    currentSong.pause();
    console.log("previous clicked");
    let currentSongName = currentSong.src
      .split("/")
      .slice(-1)[0]
      .split("_128")[0];
    index = songs.indexOf(currentSongName);
    console.log("currentSongName:", currentSongName, "index:", index);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    } else {
      playMusic(songs[songs.length - 1]);
    }
  });

  next.addEventListener("click", () => {
    currentSong.pause();
    console.log("next clicked");
    console.log(currentSong);
    let currentSongName = currentSong.src
      .split("/")
      .slice(-1)[0]
      .split("_128")[0];
    index = songs.indexOf(currentSongName);
    console.log("currentSongName:", currentSongName, "index:", index);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    } else {
      playMusic(songs[0]);
    }
    // console.log(currentSong.src);
  });

  
  
}

main();

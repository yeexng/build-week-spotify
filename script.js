const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "77cded920amsh41bb67a07527abep12c202jsn008eae99c17c",
    "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
  },
};
let globalTracks = [];
let audioPlayer = null;
let selectedTrackIndex = null;
const getTrackDetails = async (searchQuery) => {
  try {
    let res = await fetch(
      "https://striveschool-api.herokuapp.com/api/deezer/search?q=" +
        searchQuery,
      options
    );
    let tracks = await res.json();
    console.log(tracks);
    return tracks.data;
  } catch (err) {
    console.log(err);
  }
};

const renderCards = (tracks, section, playable) => {
  let container = document.getElementById(section);
  let trackCards;
  if (!playable) {
    trackCards = tracks.map((track) => {
      globalTracks.push(track);
      return `<div class="col mb-4">
        <div class="card h-100" id="${track.album.id}" onclick = "onCardClick(event)">
          <img src="${track.album.cover_medium}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${track.album.title}</h5>
            <p class="card-text">${track.artist.name}</p>
          </div>
        </div>
      </div>`;
    });
  } else {
    trackCards = tracks.map((track) => {
      globalTracks.push(track);
      return `<div class="col mb-4">
        <div class="card h-100" id="${track.album.id}">
        <div class="play-btn-container">
          <img src="${track.album.cover_medium}" class="card-img-top" alt="...">
          <span class="play-btn text-success" onclick ="playTrack(${track.id})"><i class="bi bi-play-circle-fill"></i></span>
        </div>
          <div class="card-body">
            <h5 class="card-title">${track.album.title}</h5>
            <p class="card-text">${track.artist.name}</p>
          </div>
        </div>
      </div>`;
    });
  }

  container.innerHTML = trackCards.join("");
};

const playTrack = (trackId) => {
  selectedTrackIndex = globalTracks.findIndex((track) => track.id === trackId);
  let selectedTrack = globalTracks[selectedTrackIndex];
  loadTrack(selectedTrack);
};

const onClickNext = () => {
  selectedTrackIndex++;
  let selectedTrack = globalTracks[selectedTrackIndex];
  loadTrack(selectedTrack);
};

const onClickPrev = () => {
  selectedTrackIndex--;
  let selectedTrack = globalTracks[selectedTrackIndex];
  loadTrack(selectedTrack);
};

const onPlayPause = (event) => {
  let button = event.target;
  if (button.classList.contains("fa-play")) {
    button.classList.remove("fa-play");
    button.classList.add("fa-pause");
    loadTrack(globalTracks[selectedTrackIndex]);
  } else {
    button.classList.remove("fa-pause");
    button.classList.add("fa-play");
    audioPlayer.pause();
  }
};

const loadTrack = (selectedTrack) => {
  let image = document.getElementById("album-art");
  let title = document.getElementById("album-title");
  let artistName = document.getElementById("album-artist");
  let time = document.getElementById("time-over");
  let duration = document.getElementById("time-remaining");

  image.src = selectedTrack.album.cover_small;
  title.innerText = selectedTrack.album.title;
  artistName.innerText = selectedTrack.artist.name;
  duration.innerText = formatTime(selectedTrack.duration);
  console.log(selectedTrack);
  console.log(selectedTrack.preview);
  if (audioPlayer != null) {
    audioPlayer.pause();
  }

  let button = document.getElementById("play-pause-btn");
  button.classList.remove("fa-play");
  button.classList.add("fa-pause");
  audioPlayer = new Audio(selectedTrack.preview);
  audioPlayer.play();
};

const formatTime = (duration) => {
  let minutes = Math.floor(duration / 60);
  let seconds = duration % 60;

  return `${minutes}:${seconds}`;
};

const renderGoodMorning = (arrayOfSongs) => {
  let container = document.querySelector(".good-morning-div");
  container.innerHTML = "";
  arrayOfSongs.slice(0, 10).forEach((singleSong) => {
    container.innerHTML += `
      <div class="col-2 m-3 p-0 good-morning-content d-flex align-items-center">
      <img class="col-5 pl-0 good-morning-img " src="${singleSong.album.cover_medium}" alt="">
      <div>${singleSong.artist.name}r</div>
      </div>
      `;
  });
};

const getSection = async (searchQuery, section, playable) => {
  let tracks = await getTrackDetails(searchQuery);
  renderCards(tracks.slice(0, 5), section, playable);
};

const onCardClick = (event) => {
  let selectedAlbumId = event.target.closest(".card").id;
  window.location.href = `./album.html?id=${selectedAlbumId}`;
};

const loadSections = async () => {
  getSection("pop", "recent-played", false);
  getSection("podcasts", "show-to-try", true);
  getSection("mix", "spotify", true);

  const goodMorningTracks = await getTrackDetails("hits");
  renderGoodMorning(goodMorningTracks);
};

window.onload = () => {
  loadSections();
};

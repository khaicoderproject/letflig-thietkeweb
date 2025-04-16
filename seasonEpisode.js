const searchResultDiv = document.querySelector(".search_result_div");
const searchBtn = document.querySelector(".search");
const searchHeader = document.getElementById("search_header");
const hamburgerPhone = document.querySelector(".hamburgerphone");
const hamburger = document.querySelector(".hamburger");
const overlaySideNavabar = document.querySelector(".overlay_side_navabar");
const lightDarkmode = document.querySelector(".light_darkmode");
const arrowLeft = document.querySelector(".arrow_left");
const sidenavChildContainer = document.querySelector(
  ".sidenav_child_container"
);
const numberOFSeasons = document.querySelector(".number_of_seasons");
const EpisodesContainer = document.querySelector(".Episodes_container");
const currentSeason = document.querySelector(".current_season");
const menuulLI = document.querySelectorAll(".menu_ul li");
const titleoftvshow = document.querySelector(".titleoftvshow");
const movieDetailnavContainer = document.querySelector(
  ".movieDetailnavContainer"
);
const searchbox = document.querySelector(".search");
const msgEpisodeContainer = document.querySelector(".msg_episode_container");

// Toggle active class for mobile sidenav
hamburgerPhone.addEventListener("click", () => {
  sidenavChildContainer.classList.add("sidenav_container_active");
  overlaySideNavabar.classList.add("sidenav_container_active");
  hamburgerPhone.classList.add("hamburgerphonedeactive");
});

// Hide mobile sidenav on overlay click
overlaySideNavabar.addEventListener("click", () => {
  sidenavChildContainer.classList.remove("sidenav_container_active");
  overlaySideNavabar.classList.remove("sidenav_container_active");
  document.body.classList.remove("minimize_siderbar");
  hamburgerPhone.classList.remove("hamburgerphonedeactive");
});

// Hide message after 60 seconds
const hideMsg = () => {
  msgEpisodeContainer.style.display = "none";
};
setTimeout(hideMsg, 60000);

// Add background to movie detail nav on scroll
window.addEventListener("scroll", () => {
  const intiCon = titleoftvshow.getBoundingClientRect();
  movieDetailnavContainer.classList.toggle("bgadd", window.scrollY > intiCon.height);
});

// Remove minimize sidebar class
arrowLeft.addEventListener("click", () => {
  document.body.classList.remove("minimize_siderbar");
});

// Toggle light/dark mode
lightDarkmode.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
});

// Add minimize sidebar class
hamburger.addEventListener("click", () => {
  document.body.classList.add("minimize_siderbar");
});

// Set theme on page load
const settheme = () => {
  const currtheme = localStorage.getItem("theme");
  document.body.classList.toggle("light", currtheme === "light");
};
settheme();

// Add hovered class to active menu item
menuulLI.forEach((item) => {
  item.addEventListener("click", () => {
    menuulLI.forEach((i) => i.classList.remove("hovered"));
    item.classList.add("hovered");
  });
});
menuulLI[2].classList.add("hovered");

const myApi = "6b2dec73b6697866a50cdaef60ccffcb";
const url = document.location.href;
const fetcid = url.slice(url.indexOf("=") + 1);
const numberOfSeason = Number(url.slice(url.indexOf("Z") + 1, url.indexOf("-")));

// Generate HTML for season buttons
const seasonsnoFun = () => {
  let seasonhtml = "";
  for (let i = 1; i <= numberOfSeason; i++) {
    seasonhtml += `<li class="season">${i}</li>`;
  }
  return ` <ol class="seasonul">${seasonhtml}</ol>`;
};
numberOFSeasons.innerHTML = seasonsnoFun();
const Seseason = document.querySelectorAll(".season");
Seseason[0].classList.add("seasonBtnactive");

// Handle click on season buttons to load episodes
numberOFSeasons.addEventListener("click", (e) => {
  const element = e.target;
  if (element.classList.contains("season")) {
    Seseason.forEach((i) => i.classList.remove("seasonBtnactive"));
    element.classList.add("seasonBtnactive");
    EpisodesContainer.innerHTML = "";
    seasonnumfun(element.innerText);
  }
});

// Fetch TV show details
const CurrTvshow = async (id) => {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${myApi}`);
  const data = await res.json();
  return data;
};

// Fetch episode details
const CurrEpisode = async (tv_id, currSea, currEpiso) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${tv_id}/season/${currSea}/episode/${currEpiso}?api_key=${myApi}`
  );
  const data = await res.json();
  EpisodesContainer.insertAdjacentHTML("beforeend", episodefun(data));
};

// HTML for released episode card
const releasedEpisode = (curre) => `<div><img class="episode_image"
    src="https://image.tmdb.org/t/p/w500/${curre.still_path}" alt="${curre.name}">
    <span class="runtime">${timeCon(curre.runtime)}</span>
<div class="playsvg_container"><img class="playsvg" src="./resources/play-circle-fill.svg"
        alt=""></div>
</div>
<div class="episode_detail">
<h2 class="episode_title"> <span class="episodenumm">${curre.episode_number}.</span> ${curre.name}</h2>
<p class="episode_description">${curre.overview}</p>
</div>`;

// HTML for unreleased episode card
const unreleasedEpisodev = (curre) => `<a class="unreleased_link" href=" https://www.2embed.to/embed/tmdb/tv?id=${fetcid}&s=${curre.season_number}&e=${curre.episode_number}"><img class="episode_image unreleased_image"
    src="./resources/D moviesand tv show.png" alt="${curre.name}">
    <span class="runtime">${timeCon(curre.runtime)}</span>
<div class="playsvg_container"><img class="playsvg" src="./resources/play-circle-fill.svg"
        alt=""></div>
</a>
<div class="episode_detail">
<h2 class="episode_title"> <span class="episodenumm">${curre.episode_number}.</span> ${curre.name}</h2>
<p class="episode_description">${curre.overview}</p>
</div>`;

// Determine episode card HTML based on still path
const episodefun = (currepsh) => `<div class="epishodes_card">
    ${currepsh.still_path == null ? unreleasedEpisodev(currepsh) : releasedEpisode(currepsh)}
    </div>`;

// Convert runtime to HH:MM:SS format
const timeCon = (oldtime) => {
  if (oldtime > 60 && oldtime < 120) {
    const time = oldtime - 60;
    return `1:${time < 10 ? '0' + time : time}:00`;
  }
  if (oldtime > 120) {
    const time = Math.floor(oldtime / 60);
    return `2:${time < 10 ? '0' + time : time}:00`;
  }
  if (oldtime === 0 || oldtime === null) {
    return "";
  }
  if (oldtime <= 60) {
    return `${oldtime}:00`;
  }
};

// Load episodes for the selected season
const seasonnumfun = (seasoncc) => {
  EpisodesContainer.innerHTML = "";
  CurrTvshow(fetcid).then((dat) => {
    document.title = `${dat.name} | Seasons`;
    titleoftvshow.innerText = dat.name;
    const numseasons = dat.seasons;
    const currsea = async (seasonNO) => {
      for (const item of numseasons) {
        if (seasonNO == item.season_number) {
          currentSeason.innerText = `Season ${seasonNO}`;
          const numOfEpisodes = item.episode_count;
          for (let i = 1; i <= numOfEpisodes; i++) {
            await CurrEpisode(fetcid, seasonNO, i);
          }
          break; // Stop iterating once the correct season is found
        }
      }
    };
    currsea(seasoncc);
  });
};
seasonnumfun(1);

// Redirect to search page
searchbox.addEventListener("click", () => {
  location.replace("./search.html");
});
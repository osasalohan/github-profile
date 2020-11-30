const avatar = document.querySelectorAll(".avatar > img");
const user = document.querySelectorAll(".user");
const name = document.querySelectorAll(".full-name");
const bio = document.querySelectorAll(".bio");
const navBarToggle = document.querySelector(".navbar-toggle");
const navbarItems = document.querySelector(".navbar-items-left");
const input = document.querySelector(".nav-input");
const inputIcon = document.querySelector(".nav-input-icon");
const inputWrapper = document.querySelector(".nav-input-wrapper");
const repoNavProfile = document.querySelector(
  ".repo-navbar-profile .repo-nav-item"
);
const pull = document.querySelector(".pull");
const repoDropdown = document.querySelector(".repo-dropdown");
const repoDropdownContent = document.querySelector(".repo-dropdown-content");
const profileDropdown = document.querySelector(".profile-dropdown");
const profileDropdownContent = document.querySelector(
  ".profile-dropdown-content"
);
const repoList = document.querySelector(".repos-list");
const reposCount = document.querySelector(".repos-count");
const githubAPI = "https://api.github.com/graphql";

//event Listeners
document.onclick = hideDropdowns;
repoDropdown.onclick = repoDropdownToggle;
profileDropdown.onclick = profileDropdownToggle;
navBarToggle.onclick = navBarToggler;
document.onscroll = onScroll;
input.onfocus = onFocus;
input.onblur = onBlur;
window.onresize = setPullText;
window.onload = setPullText;

//fetch data from github API and populate page
fetch(githubAPI, {
  method: "post",
  headers: {
    "Content-Type": "application/json",
    Authorization: "token 5fb10bcb1acf2543665f27d23e799855c668fe0c",
  },
  body: JSON.stringify({
    query: `query { 
        viewer { 
          login 
          bio 
          name 
          avatarUrl 
          repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) { 
            nodes { 
              primaryLanguage { 
                color 
                name 
              } 
              updatedAt 
              name 
              description 
            } 
          } 
        } 
      }`,
  }),
})
  .then((res) => res.json())
  .then((res) => res.data.viewer)
  .then((data) => {
    setUserDetails(data.avatarUrl, data.login, data.name, data.bio);
    let repos = data.repositories.nodes;
    reposCount.innerHTML = repos.length;
    repos = repos.map((repo) => repoToHTML(repo));
    repos.forEach((repo) => {
      repoList.insertAdjacentHTML("beforeend", repo);
    });
  });

//takes repo data and renders it as html
function repoToHTML(repo) {
  return `
    <div class="repo">
      <div class="repo-info">
        <div class="repo-info-main">
          <div class="repo-title"><h3>${repo.name}</h3></div>
          <div class="repo-desc">
            <p>
              ${repo.description || ""}
            </p>
          </div>
          <div class="repo-sub-info">
            <div class="repo-lang">
              <div class="lang-color" style="background: ${
                repo.primaryLanguage.color
              }"></div>
              <div class="lang-name">
                ${repo.primaryLanguage.name}
              </div>
            </div>
            <div class="repo-history">Updated ${updatedAt(repo.updatedAt)}</div>
          </div>
        </div>
        <div class="repo-star">
          <div class="star-icon">
            <i class="far fa-star"></i><span>Star</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

//gets time since last updated
function updatedAt(date) {
  date = new Date(date);
  let currentDate = new Date();
  let timeDiff = Math.ceil(Math.abs(date - currentDate) / 1000);
  if (timeDiff < 60) {
    return `${timeDiff} second${timeDiff > 1 ? "s" : ""} ago`;
  } else if (Math.ceil(timeDiff / 60) < 60) {
    return `${Math.ceil(timeDiff / 60)} minute${
      Math.ceil(timeDiff / 60) > 1 ? "s" : ""
    } ago`;
  } else if (Math.ceil(timeDiff / (60 * 60)) < 24) {
    return `${Math.ceil(timeDiff / (60 * 60))} hour${
      Math.ceil(timeDiff / (60 * 60)) > 1 ? "s" : ""
    } ago`;
  } else if (Math.ceil(timeDiff / (60 * 60 * 24)) < 30) {
    return `${Math.ceil(timeDiff / (60 * 60 * 24))} day${
      Math.ceil(timeDiff / (60 * 60 * 24)) > 1 ? "s" : ""
    } ago`;
  }
  return `on ${date.toLocaleString("default", {
    month: "short",
  })} ${date.getDate()}${
    date.getFullYear() === currentDate.getFullYear()
      ? ""
      : ", " + date.getFullYear()
  }`;
}

//sets avatar, username, fullname and bio
function setUserDetails(url, username, fullname, biography) {
  avatar.forEach((avatar) => {
    avatar.src = url;
  });
  user.forEach((user) => {
    user.innerHTML = username;
  });
  name.forEach((name) => {
    name.innerHTML = fullname;
  });
  bio.forEach((bio) => {
    bio.innerHTML = biography;
  });
}

//manipulate input on focus
function onFocus() {
  input.style.background = "#FAFBFC";
  inputIcon.style.display = "none";
  let width = inputWrapper.offsetWidth;
  if (window.innerWidth > 768) {
    inputWrapper.style.width = `${2 * width}px`;
    input.style.width = "94%";

    if (window.innerWidth < 1090) {
      pull.innerHTML = "Pulls";
      if (window.innerWidth < 1055) {
        inputWrapper.style.width = `${1.1 * width}px`;
      }
    }
  }
}

//revert input styles
function onBlur() {
  input.style.background = "inherit";
  inputIcon.style.display = "block";
  inputWrapper.style.width = window.innerWidth > 768 ? "272px" : "100%";
  input.style.width = window.innerWidth > 768 ? "246px" : "100%";
}

//show mini profile on scroll
function onScroll() {
  let height = window.scrollY;
  height >= 400
    ? repoNavProfile.classList.remove("scroll-hide")
    : repoNavProfile.classList.add("scroll-hide");
}

//toggle repo dropdown
function repoDropdownToggle() {
  if (profileDropdownContent.classList.contains("show")) {
    profileDropdownContent.classList.remove("show");
  } else {
    repoDropdownContent.classList.toggle("show");
  }
}

//toggle profile dropdown
function profileDropdownToggle() {
  if (repoDropdownContent.classList.contains("show")) {
    repoDropdownContent.classList.remove("show");
  } else {
    profileDropdownContent.classList.toggle("show");
  }
}

//hide dropdowns on document click
function hideDropdowns(e) {
  let dropdowns = Array.from(document.querySelectorAll(".dropdown"));
  if (!dropdowns.includes(e.target.parentNode)) {
    if (
      repoDropdownContent.classList.contains("show") ||
      profileDropdownContent.classList.contains("show")
    ) {
      repoDropdownContent.classList.remove("show");
      profileDropdownContent.classList.remove("show");
    }
  }
}

//toggle navbar
function navBarToggler() {
  navbarItems.classList.toggle("navbar-toggle-show");
}

//set pull text
function setPullText() {
  if (window.innerWidth > 767 && window.innerWidth < 1013) {
    pull.textContent = "Pulls";
  } else {
    pull.textContent = "Pull requests";
  }
}

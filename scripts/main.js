let itemData = {};
/**
 * Gets API items.
 */
function getItems() {
  fetch("https://api.lib.byu.edu/leaflet/item")
    .then((res) => {
      if (res.ok) {
        console.log("SUCCESS");
        return res.json();
      } else {
        console.log("NOT SUCCESSFUL");
      }
    })
    .then((data) => {
      console.log(data);
      console.log(data.id);
      itemData = data;
      console.log(
        `Stored in variable itemData: ID: ${itemData.id} Title:${itemData.title}`
      );
    })
    .catch((error) => console.log("ERROR"));
}

// Hard coded value for user id.
const USER_ID = 2;
/**
 * Returns x raised to the n-th power.
 *
 * @param {boolean} rating The user's selection (like or dislike)
 * @return {json object} Json response after successful post creation.
 */
function postReview(rating) {
  fetch(`https://api.lib.byu.edu/leaflet/users/${USER_ID}/ratings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      itemId: itemData.id,
      rating: rating,
    }),
  })
    .then((res) => {
      if (res.ok) {
        console.log("Response ok.");
        return res.json();
      } else console.log("Post not created.");
    })
    .then((data) => console.log(data))
    .then(getItems())
    .then(loadApp())
    .catch((error) => console.log("ERROR"));
}

/**
 * Shortens displayed item if too long into expandable tag.
 *
 * @param {json object} itemData retrieved from get request stored in object.
 * @return {string} String of HTML
 */
function exceedsLength(itemData) {
  if (itemData.description.length > 700) {
    return `<div class="descriptionContainer">
                  <p id="description" class="description">${itemData.description.substr(
                    0,
                    655
                  )}...</p>
                  <details>
                    <summary>Read more</summary>
                    <p>${itemData.description.substr(655, itemData.lenth)}</p>
                  </details></div>`;
  } else
    return `<p id="description" class="description">${itemData.description}</p>`;
}

/**
 * Creates HTML for book items.
 *
 * @param {json object} itemData retrieved from get request stored in object.
 * @return {string} String of HTML for a book.
 */
function bookMarkup(itemData) {
  return `
      <div class="itemContainer">
      <h1 class="titleQuestion">Would you read this?</h1>
        <div class="imageContainer">
          <img class="itemImage" src="${itemData.thumbnail}" alt="${
    itemData.title
  } Book Cover">
        </div>
        <div class="itemSummary">
          <h2 class="itemTitle">${itemData.title}</h2>
          <h3 class="author">${itemData.author}</h3>
          <h4 class="book"><i class="fas fa-book"></i>Book</h4>
          ${exceedsLength(itemData)}
        </div>
        <div class="buttonsContainer">
        <button class="noButton" onclick="postReview(false)"><i class="fas fa-thumbs-down"></i>No</button>
        <button class="yesButton" onclick="postReview(true)"><i class="fas fa-thumbs-up"></i>Yes</button>
        </div>
      <div>
    `;
}

/**
 * Creates HTML for film items.
 *
 * @param {json object} itemData retrieved from get request stored in object.
 * @return {string} String of HTML for a film.
 */
function filmMarkup(itemData) {
  return `
      <div class="itemContainer">
      <h1 class="titleQuestion">Would you watch this?</h1>
      <div class="imageContainer">
      <img class="itemImage" src="${itemData.thumbnail}" alt="${
    itemData.title
  } Book Cover">
      </div>
      <div class="itemSummary">
        <h2 class="itemTitle">${itemData.title}</h2>
        <h3 class="film"><i class="fas fa-compact-disc"></i>Film</h3>
        <p id="description" class="description">${itemData.description.substr(
          0,
          714
        )}</p>
      </div>
      <div class="buttonsContainer">
      <button class="noButton" onclick="postReview(false)"><i class="fas fa-thumbs-down"></i>No</button>
      <button class="yesButton" onclick="postReview(true)"><i class="fas fa-thumbs-up"></i>Yes</button>
        </div>
      <div>
    `;
}

const appMarkup = document.getElementById("app");
/**
 * Loads app with book or film HTML based on itemData type.
 *
 */
function loadApp() {
  setTimeout(function () {
    if (itemData.type === "BOOK") {
      appMarkup.innerHTML = bookMarkup(itemData);
    } else if (itemData.type === "FILM") {
      appMarkup.innerHTML = filmMarkup(itemData);
    }
  }, 700);
}

/**
 * Sets classes to be called on body load.
 *
 */
function setClass() {
  document.getElementById("toggle").style.display = "none";
}

/**
 * Toggles API relevant buttons on and off for testing.
 *
 */
function toggleButtons() {
  let toggle = document.getElementById("toggle");
  let toggleButton = document.getElementById("toggleButton");
  let toggleIcon = document.getElementById("toggleIcon");

  if (toggle.style.display == "none") {
    toggle.style.display = "flex";
    toggleIcon.classList.remove("fa-toggle-off");
    toggleIcon.classList.add("fa-toggle-on");
    console.log("Toggle on.");
  } else {
    toggle.style.display = "none";
    toggleButton.style.display = "flex";
    toggleIcon.classList.add("fa-toggle-off");
    toggleIcon.classList.remove("fa-toggle-on");
    console.log("Toggle off.");
  }
}

/**
 * Functions to be called once HTML body has loaded.
 *
 */
function onLoadMethods() {
  getItems();
  loadApp();
  setClass();
}

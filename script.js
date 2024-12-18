const switchBtn = document.querySelector("#switchBtn");
const bodyRef = document.querySelector("body");
const toggleText = document.querySelector("#toggle-text");
const lightModeKey = "light-theme";
const lightModeValue = "active";

const inputSpacename = document.querySelector("#spacename");
const btnSubmit = document.querySelector("#btn-submit");
const displayName = document.querySelector("#display-name");
const iconPen = document.querySelector("#icon");

const errorText = document.querySelector("#error");
const apiUrlNasa =
  "https://api.nasa.gov/mars-photos/api/v1/rovers/Curiosity/photos?earth_date=2017-3-6&camera=NAVCAM&api_key=LNf5ga51hX8naHewaj3YOgyTJJ0ByviSKlDKafj2";

if (localStorage.getItem(lightModeKey) === lightModeValue) {
  enabledLightMode();
} else {
  disabledLightMode();
}

switchBtn.addEventListener("click", () => {
  toogleLightMode();
});

function toogleLightMode() {
  if (bodyRef.classList.contains("light-theme")) {
    disabledLightMode();
  } else {
    enabledLightMode();
  }
}

function disabledLightMode() {
  switchBtn.checked = false;
  bodyRef.classList.remove("light-theme");
  toggleText.textContent = "Light mode";
  removeLocalStorage();
}

function enabledLightMode() {
  switchBtn.checked = true;
  bodyRef.classList.add("light-theme");
  toggleText.textContent = "Dark mode";
  setLocalStorage();
}

function setLocalStorage() {
  localStorage.setItem(lightModeKey, lightModeValue);
}

function removeLocalStorage() {
  localStorage.removeItem(lightModeKey);
}

//Jag har använt input-händelsen istället för keyup eftersom användaren kan klistra in text som inte genererar keyup-händelser.
inputSpacename.addEventListener("input", () => {
  const spaceName = inputSpacename.value;
  if (spaceName.length > 3) {
    btnSubmit.disabled = false;
    //Eftersom knappen är satt till disabled är den true, vid mer än tre tecken är den false.
  } else {
    btnSubmit.disabled = true;
  }
});

btnSubmit.addEventListener("click", (clickevent) => {
  clickevent.preventDefault();
  const spaceName = inputSpacename.value;
  displayName.innerHTML = `<span>Welcome</span><span class="display-name">${spaceName}</span>`;
  inputSpacename.value = "";
  btnSubmit.disabled = true;
});

inputSpacename.addEventListener("focus", () => {
  console.log("Står i rutan");
  inputSpacename.classList.toggle("focusBorder");
});
inputSpacename.addEventListener("blur", () => {
  console.log("Står utanför rutan");
  inputSpacename.classList.toggle("focusBorder");
});

// Hämtar data från Nasa
fetch(apiUrlNasa)
  .then((response) => response.json()) //Det som kommer in är bara en dataström så måste göras om till json-format.
  .then((incomingData) => {
    console.log(incomingData.photos);
    const marsRover = incomingData.photos;
    const cardContainer = document.querySelector("#card-container");
    //Kontrollerar om jag har fått någon data i min array.
    if (marsRover.length !== 0) {
      //Loopar igenom alla
      marsRover.forEach((photo) => {
        const newCard = createCard(photo);
        cardContainer.append(newCard);
      });
    } else {
      errorText.textContent = "Sorry, no images from that day!";
      errorText.style.display = "block";
    }
  })
  .catch((error) => {
    console.log("Something went wrong!");
    errorText.textContent = "Sorry, something went wrong";
    errorText.style.display = "block";
    // .catch(error => console.log(`Det här är felet: ${error}`));
  });

// Funktion för att skapa upp cards.
function createCard(photo) {
  const article = document.createElement("article");
  article.classList.add("card");
  const h3 = document.createElement("h3");
  h3.textContent = `Rover: ${photo.rover.name}`;
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("image-container");
  const img = document.createElement("img");
  img.setAttribute("src", photo.img_src);
  const textContainer = document.createElement("div");
  textContainer.classList.add("text-container");
  const dateText = document.createElement("h4");
  dateText.textContent = photo.earth_date;
  const cameraText = document.createElement("h4");
  cameraText.textContent = `Camera: ${photo.camera.name}`;

  textContainer.append(dateText, cameraText);
  imageContainer.append(img);
  article.append(h3, imageContainer, textContainer);
  //För att kunna skriva ut måste jag retunera det jag får. Lägger det i en variabel(newCard)
  return article;
}

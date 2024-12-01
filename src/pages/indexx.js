import { enableValidation, settings, setEventListeners } from "../scripts/validation.js";
import Api from "../utils/Api.js";
import "../pages/index.css";

// const initialCards = [ 
//     { name: "Golden Gate bridge", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg" },
//     { name: "Restaurant terrace", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg" },
//     { name: "An outdoor cafe", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg" },
//     { name: "A very long bridge, over the forest and through the trees", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg" },
//     { name: "Tunnel with morning light", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg" },
//     { name: "Mountain house", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg" }
// ];


const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "892fb935-3ee6-41ed-8c27-3279f92898d8",
    "Content-Type": "application/json"
  }
});


api.getAppInfo().then(([cards, userInfo]) => {
  cards.forEach((item) => {
    const cardElement = getCardElement(item);
    cardsList.prepend(cardElement);
  });

  profileName.textContent = userInfo.name;
  profileDescription.textContent = userInfo.about;
  profileAvatar.src = userInfo.avatar;
})
.catch((err) => {
  console.error(err);
});


// Profile elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn")
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");

// Form modal & elements
const editModal = document.querySelector("#edit-modal");
const editFormElement = document.forms["edit-profile"];
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescInput = editModal.querySelector("#profile-desc-input");

// Card form elements
const cardModal = document.querySelector("#add-card-modal");
const cardForm = document.forms["add-card-form"];
const cardSubmitbtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

// Card related elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

// Preview elements
const previewModal = document.querySelector("#preview-modal");
const previewModalImgEl = previewModal.querySelector(".modal__image");
const previewModalCapEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector("#close-preview-modal");


// Avatar Elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");

// Delete Elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteCancel = deleteModal.querySelector(".modal__submit-btn_cancel");
const deleteClose = deleteModal.querySelector(".modal__close-btn"); 


function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImgEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardNameEl.textContent = data.name;
  cardImgEl.src = data.link;
  cardImgEl.alt = data.name;

  cardLikeBtn.addEventListener("click", (evt) => handleLikeBtn(evt, data._id));

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  cardDeleteBtn.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImgEl.addEventListener("click", () => {
    openModal(previewModal);

    previewModalCapEl.textContent = data.name;
    previewModalImgEl.src = data.link;
    previewModalImgEl.alt = data.name;
  });

  return cardElement;
}


// Card rendering
// function getCardElement(data) {   
//   const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);   
//   const cardNameEl = cardElement.querySelector(".card__title");
//   const cardImageEl = cardElement.querySelector(".card__image");
//   const cardLikeBtn = cardElement.querySelector(".card__like-btn");
//   const cardDelBtn = cardElement.querySelector(".card__del-btn");

//   cardNameEl.textContent = data.name;
//   cardImageEl.src = data.link;
//   cardImageEl.alt = data.name;

  // cardLikeBtn.addEventListener("click", handleLike);
  // cardDelBtn.addEventListener("click", handleDeleteCard);
  // cardImageEl.addEventListener("click", () => handleImgClick(data));

  // cardLikeBtn.addEventListener("click", () => {
  //     cardLikeBtn.classList.toggle("card__like-btn_liked");
  // });

  // cardDelBtn.addEventListener("click", (evt) => {

  //   handleDeleteCard(cardElement, data)
  // });

  // cardDelBtn.addEventListener("click", () => {
  //     cardElement.remove();
  // });

    // cardDelBtn.addEventListener("click", () =>
    // handleDeleteCard(cardElement, data._id)
  // );


  

//   cardImageEl.addEventListener("click", () => {
//       openModal(previewModal);
//       previewModalImgEl.src = data.link;
//       previewModalImgEl.alt = data.name;
//       previewModalCapEl.textContent = data.name;
//   });
  
//   return cardElement; 
// }


// Basic handlers
function handleImgClick(data) {
  previewModalImgEl.src = data.link;
  previewModalImgEl.alt = data.name;
  previewModalCapEl.textContent = data.name;

  openModal(previewModal);
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  // selectedCardId = cardId;
  console.log(data.id);
  openModal(deleteModal);
}

// function handleLike(evt, id) {
//   const isLiked = evt.target.classList.contains("card__like-btn_liked");

//   api
//     .handleLikeButton(id, isLiked)
//     .then(() => {
//       evt.target.classList.toggle("card__like-btn_liked");
//     })
//     .catch(console.error);
// }





// Open & close functions 
function handleEscapeKey(evt) {
    if (evt.key === "Escape") {
      const openModal = document.querySelector(".modal_opened");
      if (openModal) {
        closeModal(openModal);
      }
    }
  };

function handleModalOverlay(evt) {
    if (evt.target.classList.contains("modal_opened")) {
      closeModal(evt.target);
    }
  };

  // Open modal
function openModal(modal) {
    modal.classList.add("modal_opened");
    modal.addEventListener("mousedown", handleModalOverlay);
    document.addEventListener("keydown", handleEscapeKey);
};

 // Close modal
function closeModal(modal) {
    modal.classList.remove("modal_opened");
    modal.removeEventListener("mousedown", handleModalOverlay);
    document.removeEventListener("keydown", handleEscapeKey);
};


// Form submit
function handleEditFormSubmit(evt) {
    evt.preventDefault();

    api.editUserInfo({ name: editModalNameInput.value, about: editModalDescInput.value })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      cardSubmitbtn.textContent = "Save";
    });
}

// Avatar submit 
function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  api
    .editAvatarInfo({
      avatar: avatarLinkInput.value,
    })
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

// Card submit
function handleAddCardSubmit(evt) {
    evt.preventDefault();
    const inputValues = {
        name: cardNameInput.value,
        link: cardLinkInput.value
      };      
    const cardElement = getCardElement(inputValues);
    cardsList.prepend(cardElement);
    closeModal(cardModal);
    cardForm.reset();
    // disableButton(cardSubmitbtn, settings);
    
};

// Delete Submit
function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  submitBtn.textContent = "Deleting...";

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Delete";
    });
}


// Opening & closing modals
const closeButtons = document.querySelectorAll('.modal__close-btn');
const cancelBtn = document.querySelector('.modal__submit-btn_cancel');

closeButtons.forEach((button) => {
  const popup = button.closest('.modal');
  button.addEventListener('click', () => closeModal(popup));
});

profileEditButton.addEventListener("click", () => {
    openModal(editModal);

    editModalNameInput.value = profileName.textContent;
    editModalDescInput.value = profileDescription.textContent;
    // resetValidation(editFormElement, [editModalNameInput, editModalDescInput], settings);
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

cancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});



// Submit clicks
editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
// deleteForm.addEventListener("submit", handleDeleteSubmit);
 

// setEventListenrs(settings);
enableValidation(settings);



      

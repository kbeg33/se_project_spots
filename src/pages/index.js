import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableBtn,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";


const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "892fb935-3ee6-41ed-8c27-3279f92898d8",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo().then(([cards, userInfo]) => {
    cards.forEach((cardItem) => {
      const cardElement = getCardElement(cardItem);
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
  const profileEditBtn = document.querySelector(".profile__edit-btn");
  const profileAddBtn = document.querySelector(".profile__add-btn");
  const avatarModalBtn = document.querySelector(".profile__avatar-btn")
  const profileName = document.querySelector(".profile__name");
  const profileDescription = document.querySelector(".profile__description");
  const profileAvatar = document.querySelector(".profile__avatar");


// Edit elements
const editModal = document.querySelector("#edit-modal");
const editModalForm = document.forms["edit-profile"];
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescInput = editModal.querySelector("#profile-desc-input");

// Card Elements
const cardModal = document.querySelector("#add-card-modal");
const cardModalForm = document.forms["add-card-form"];
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const profileCardCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardNameInput = cardModal.querySelector("#add-card-name-input");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard;
let selectedCardId;

// Preview elements
const previewModal = document.querySelector("#preview-modal");
const previewModalImgEl = document.querySelector(".modal__image");
const previewModalCapEl = document.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn_type_preview");

// Avatar elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = document.forms["edit-avatar-form"];
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");

// Delete elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = document.forms["edit-delete-form"];
const deleteCancel = deleteModal.querySelector(".modal__submit-btn_cancel");
const deleteClose = deleteModal.querySelector(".modal__close-btn");



// Card creation
function getCardElement(data) {
  const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImgEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__del-btn");

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

// Modal handlers
function handleModalOverlay(evt) {
  if (evt.target.classList.contains("modal_opened")) {
    closeModal(evt.target);
  }
}

function handleModalEscape(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
    closeModal(openModal);
    }
  }
};


// Opens modal
function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("click", handleModalOverlay);
  document.addEventListener("keydown", handleModalEscape);
}

// Closes modal
function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("click", handleModalOverlay);
  document.removeEventListener("keydown", handleModalEscape);
}

// Profile submit 
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      cardSubmitBtn.textContent = "Save";
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

  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  api
    .addCards({
      name: cardNameInput.value,
      link: cardLinkInput.value,
    })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      closeModal(cardModal);
      cardModalForm.reset();
      disableBtn(cardSubmitBtn, settings);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

// Delete submit
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

//Generates Card id
function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;

  openModal(deleteModal);
}

// Like Btn
function handleLikeBtn(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-btn_liked");

  api
    .handleLikeBtn(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-btn_liked");
    })
    .catch(console.error);
}

// Edit btn listener
profileEditBtn.addEventListener("click", () => {
  openModal(editModal);

  editModalNameInput.value = profileName.textContent;
  editModalDescInput.value = profileDescription.textContent;
  resetValidation(
    editModalForm,
    [editModalNameInput, editModalDescInput],
    settings
  );
});

// Btn listener
// editModalCloseBtn.addEventListener("click", () => {
//   closeModal(editModal);
// });

profileAddBtn.addEventListener("click", () => {
  openModal(cardModal);
});

// profileCardCloseBtn.addEventListener("click", () => {
//   closeModal(cardModal);
// });

// previewModalCloseBtn.addEventListener("click", () => {
//   closeModal(previewModal);
// });

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

// avatarCloseBtn.addEventListener("click", () => {
//   closeModal(avatarModal);
// });

deleteCancel.addEventListener("click", () => {
  closeModal(deleteModal);
});

// deleteClose.addEventListener("click", () => {
//   closeModal(deleteModal);
// });

const closeBtn = document.querySelectorAll('.modal__close-btn');

closeBtn.forEach((button) => {
  const modal = button.closest('.modal');
  button.addEventListener('click', () => closeModal(modal));
});

// Submit listeners
editModalForm.addEventListener("submit", handleProfileFormSubmit);
cardModalForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

enableValidation(settings);

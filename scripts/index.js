const initialCards = [ 
    { name: "Golden Gate bridge", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg" },
    { name: "Restaurant terrace", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg" },
    { name: "An outdoor cafe", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg" },
    { name: "A very long bridge, over the forest and through the trees", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg" },
    { name: "Tunnel with morning light", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg" },
    { name: "Mountain house", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg" }
];

// Profile elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Form modal & elements
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescInput = editModal.querySelector("#profile-desc-input");

// Card form elements
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitbtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

// Card related elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// Preview modal
const previewModal = document.querySelector("#preview-modal");
const previewModalImgEl = previewModal.querySelector(".modal__image");
const previewModalCapEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector("#close-preview-modal");

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

function openModal(modal) {
    modal.classList.add("modal_opened");
    modal.addEventListener("mousedown", handleModalOverlay);
    document.addEventListener("keydown", handleEscapeKey);
    disableButton(cardSubmitbtn);
};

function closeModal(modal) {
    modal.classList.remove("modal_opened");
    modal.removeEventListener("mousedown", handleModalOverlay);
    document.removeEventListener("keydown", handleEscapeKey);
    cardForm.reset();
};

// Form submit function
function handleEditFormSubmit(evt) {
    evt.preventDefault();
    profileName.textContent = editModalNameInput.value;
    profileDescription.textContent = editModalDescInput.value;
    closeModal(editModal);
};

// Adding a new card
function handleAddCardSubmit(evt) {
    evt.preventDefault();
    const inputValues = {
        name: cardNameInput.value,
        link: cardLinkInput.value
      };      
    const cardElement = getCardElement(inputValues);
    cardsList.prepend(cardElement);
    evt.target.reset();
    disableButton(cardSubmitbtn, settings);
    closeModal(cardModal);
};

// complete image rendering 
function getCardElement(data) {   
    const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);   
    const cardNameEl = cardElement.querySelector(".card__title");
    const cardImageEl = cardElement.querySelector(".card__image");
    const cardLikeBtn = cardElement.querySelector(".card__like-btn");
    const cardDelBtn = cardElement.querySelector(".card__del-btn");

    cardNameEl.textContent = data.name;
    cardImageEl.src = data.link;
    cardImageEl.alt = data.name;

    cardLikeBtn.addEventListener("click", () => {
        cardLikeBtn.classList.toggle("card__like-btn_liked");
    });

    cardDelBtn.addEventListener("click", () => {
        cardElement.remove();
    });

    cardImageEl.addEventListener("click", () => {
        openModal(previewModal);
        previewModalImgEl.src = data.link;
        previewModalImgEl.alt = data.name;
        previewModalCapEl.textContent = data.name;
    });
    
    return cardElement; 
};

// Opening & closing modals
profileEditButton.addEventListener("click", () => {
    openModal(editModal);

    editModalNameInput.value = profileName.textContent;
    editModalDescInput.value = profileDescription.textContent;
    resetValidation(editFormElement, [editModalNameInput, editModalDescInput]);
});

editModalCloseBtn.addEventListener("click", () => {
    closeModal(editModal);
});

cardModalBtn.addEventListener("click", () => {
    openModal(cardModal);
    resetValidation(cardForm, [cardNameInput, cardLinkInput]);

});

cardModalCloseBtn.addEventListener("click", () => {
    closeModal(cardModal);
    cardForm.reset();
});

previewModalCloseBtn.addEventListener("click", () => {
    closeModal(previewModal);
});

// Submit clicks
editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

// Generate cards
initialCards.forEach((item) => {
    const cardElement = getCardElement(item);
    cardsList.append(cardElement); 
});





      

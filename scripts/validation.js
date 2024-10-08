const settings = {
    formSelector: ".modal__form",
    inputSelector: ".modal__input",
    submitButtonSelector: ".modal__submit-btn",
    inactiveButtonClass: "button_inactive",
    inputErrorClass: "modal__input_type_error",
    errorClass: "modal__error_visible"
  }

const showInputError = (formElement, inputElement, errorMessage, config) => {
    const errorMessageEl = formElement.querySelector(`#${inputElement.id}-error`);
    errorMessageEl.textContent = errorMessage;
    inputElement.classList.add(config.inputErrorClass);
  };

  const hideInputError = (formElement, inputElement, config) => {
    const errorMessageEl = formElement.querySelector(`#${inputElement.id}-error`);
    errorMessageEl.textContent = "";
    inputElement.classList.remove(config.inputErrorClass);
  };

  const hasInvalidInput = (inputList, config) => {
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
    });
};

const checkInputValidity = (formElement, inputElement, config) => {
    if (!inputElement.validity.valid) {
      showInputError(formElement, inputElement, inputElement.validationMessage, config);
    } else {
      hideInputError(formElement, inputElement, config);
    }
  };
  
  const toggleButtonState = (inputList, buttonElement, config) => {
    if (hasInvalidInput(inputList)) {
        disableButton(buttonElement, config);
    } else {
      buttonElement.classList.remove(config.inactiveButtonClass);
      buttonElement.disabled = false;
    }
  };

  const disableButton = (buttonElement, config) => {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  };

  // OPTIONAL
  const resetValidation = (formElement, inputList, config) => {
    inputList.forEach((input) => {
        hideInputError(formElement, input, config);
    });
  };

const setEventListenrs = (formElement, config) => {
    const buttonElement = formElement.querySelector(config.submitButtonSelector);
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));

    toggleButtonState(inputList, buttonElement, config);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener("input", function () {
            checkInputValidity(formElement, inputElement, config);
            toggleButtonState(inputList, buttonElement, config);
        });
    });
};

const enableValidation = (config) => {
    const formList = document.querySelectorAll(config.formSelector);
    formList.forEach((formElement) => {
        setEventListenrs(formElement, config);
    });
};

enableValidation(settings);
/**
 * Setup link between inputs and error message
 * @param {*} errMsg jQuery error message element
 * @param {*} submitFormBtn jQuery button to submit form 
 */
function linkInputsWithErrMsg(errMsg, submitFormBtn) {

    // Look for attribute with linked input IDs
    const inputsId = errMsg
        .attr("data-linked-inputs")
        .split(" ");

    // Look for linked inputs by IDs
    let inputs = [];
    inputsId.forEach(function (inputId) {
        const input = $(`#${inputId}`);
        inputs.push(input);
    });

    listenForInputs(errMsg, inputs);
}

// Validate linked inputs
function isInputsValid(inputs) {
    return inputs.every(input => input[0].checkValidity());
}

// Hide / Show error message
function switchVisibilityErrMsg(errMsg, inputs) {
    if (isInputsValid(inputs)) {
        errMsg.removeClass("credit-card-form__input-error-msg--manual");
    } else {
        errMsg.addClass("credit-card-form__input-error-msg--manual");
    }
}

/*
Manual validate input value after: 
    1. Some value typed into input
    2. Send form
*/
function listenForInputs(errMsg, inputs) {
    inputs.forEach(input => {
        input.on("keyup", () => switchVisibilityErrMsg(errMsg, inputs));
    });

    submitFormBtn.on("click", () => {
        switchVisibilityErrMsg(errMsg, inputs)
    });
}

/**
 *  
 * @param {*} value Value to validate
 * @param {*} input jQuery input element
 * @param {*} OnEmptyValue Action if field has empty value 
 * @param {*} onValidation Action for validation field value
 * @param {*} onFieldUpdate Action after update field value 
 * @returns 
 */
function fieldValidation(
    value,
    input,
    OnEmptyValue,
    onValidation,
    onFieldUpdate) {

    // Nothing to validate
    if (value == "") {
        OnEmptyValue();
        return;
    }

    // Validate and format value
    value = onValidation(value);

    // Nothing to validate
    if (value == "") {
        OnEmptyValue(value);
    }

    // Update input
    input.val(value);

    if (onFieldUpdate !== undefined) {
        onFieldUpdate();
    }
}

/**
 * Remove all except characters
 * @param {*} value Source string
 * @returns String with only characters
 */
function removeExceptChars(value) {
    const regexOnlyChars = /[^\p{Letter}\p{Mark}\s]+/gu;
    return value.replace(regexOnlyChars, "");
}

/**
 * Remove all except digits
 * @param {*} value Source string 
 * @returns String with only digits
 */
function removeExceptDigits(value) {
    const regexOnlyDigits = /[^\d]/g;
    return value.replace(regexOnlyDigits, "");
}

function range(value, min, max) {
    value = Math.max(value, min);
    value = Math.min(value, max);

    return value;
}
/**
 * Setup link inputs with error message
 * @param {*} errMsg jQuery error message element
 * @param {*} submitFormBtn jQuery button for sumbit form 
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

    listenForInputs();

    // Check validity of all inputs
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

    // Manual validity check after input update OR send form  
    function listenForInputs() {
        inputs.forEach(input => {
            input.on("keyup", () => switchVisibilityErrMsg(errMsg, inputs));
        });

        submitFormBtn.on("click", () => {
            switchVisibilityErrMsg(errMsg, inputs)
        });
    }

}

/**
 *  
 * @param {*} value Value to validate
 * @param {*} field jQuery $(input) element
 * @param {*} OnEmptyValue Actions for empty value 
 * @param {*} onValidation Actions for validation
 * @param {*} onFieldUpdate Actions for update field value 
 * @returns 
 */
function fieldValidation(
    value,
    field,
    OnEmptyValue,
    onValidation,
    onFieldUpdate) {

    // Get fallback value
    if (value == "") {
        OnEmptyValue();
        return;
    }

    let caretPosition = field[0].selectionStart;

    // Validate and format value
    value = onValidation(value);

    // Get fallback value
    if (value == "") {
        OnEmptyValue(value);
    }

    // Update input
    field.val(value);

    if (onFieldUpdate !== undefined) {
        onFieldUpdate();
    }
}

/**
 * Remove all except characters
 * @param {*} value 
 * @returns
 */
function validateChars(value) {
    const regexOnlyChars = /[^\p{Letter}\p{Mark}\s]+/gu;
    return value.replace(regexOnlyChars, "");
}

/**
 * Remove all except digits
 * @param {*} value 
 * @returns 
 */
function validateDigits(value) {
    const regexOnlyDigits = /[^\d]/g;
    return value.replace(regexOnlyDigits, "");
}

function range(value, min, max) {
    value = Math.max(value, min);
    value = Math.min(value, max);

    return value;
}
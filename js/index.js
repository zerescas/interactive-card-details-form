// ### Init
let card = {
    number: "",
    cardholderName: "",
    cvc: "",
    expDate: {
        mm: "00",
        yy: "00"
    }
}
$(".credit-card-form-success").hide();
// ### Init

// Input validation for cardholder-name
$("#cardholder-name").on("input", function () {
    let input = $(this);
    let value = $(this).val();

    fieldValidation(
        value,
        input,
        () => card.cardholderName = "Jane Appleseed",
        (cardholderName) => {
            card.cardholderName = removeExceptChars(cardholderName);
            return card.cardholderName;
        });

    // Update front card info
    $(".credit-card--front__holder-name").text(card.cardholderName);
});

// Input validation for card-number
$("#card-number").on("input", function (ev) {
    let input = $(this);
    let value = $(this).val();

    let updateCaretPosistion = () => { };

    fieldValidation(
        value,
        input,
        () => card.number = "0000 0000 0000 0000",
        (cardNumber) => {
            cardNumber = removeExceptDigits(cardNumber);
            let cardNumberFormatted = "";
            let insertedSpaces = 0;

            for (let i = 0; i < cardNumber.length; i += 4) {
                let cardNumberChunk = cardNumber.substring(i, i + 4);

                if (cardNumberChunk.length === 4) {
                    cardNumberFormatted += cardNumberChunk + " ";
                    insertedSpaces++;
                } else {
                    cardNumberFormatted += cardNumberChunk + "";
                }
            }

            let caretPosition = input[0].selectionStart + (input[0].selectionStart % 5 === 0 ? 1 : 0);
            updateCaretPosistion = () => {
                input[0].selectionStart = input[0].selectionEnd = caretPosition;
            };

            // Limit card number to 16 digits + insertedSpaces (3)
            card.number = cardNumberFormatted.slice(0, 16 + insertedSpaces - 1);
            return card.number;
        },
        () => {
            updateCaretPosistion();
        });

    // Update front card info
    $(".credit-card--front__card-number").text(card.number);
});

// Input validation for card expiry month
$("#card-exp-date-mm").on("input", function () {
    let input = $(this);
    let value = input.val();

    fieldValidation(
        value,
        input,
        () => card.expDate.mm = "00",
        (expDateMM) => {
            expDateMM = removeExceptDigits(expDateMM);;
            if (expDateMM != "") {
                expDateMM = range(expDateMM, 0, 12);
            }

            card.expDate.mm = expDateMM;
            return card.expDate.mm;
        });

    // Update front card info
    $(".credit-card--front__exp-date").text(`${card.expDate.mm}/${card.expDate.yy}`);
});

// Input validation for card expiry year
$("#card-exp-date-yy").on("input", function () {
    let input = $(this);
    let value = input.val();

    fieldValidation(
        value,
        input,
        () => card.expDate.yy = "00",
        (expDateYY) => {
            card.expDate.yy = removeExceptDigits(expDateYY);
            return card.expDate.yy;
        });

    // Update front card info
    $(".credit-card--front__exp-date").text(`${card.expDate.mm}/${card.expDate.yy}`);
});

// Input validation for card-cvc
$("#card-cvc").on("input", function () {
    let input = $(this);
    let value = input.val();

    fieldValidation(
        value,
        input,
        () => card.cvc = "000",
        (cardCvc) => {
            card.cvc = removeExceptDigits(cardCvc);
            return card.cvc;
        });

    // Update back card info
    $(".credit-card--back__cvc").text(`${card.cvc}`);
});

/*
Setup link between:
    1. Inputs: Expiry date MM / YY
    2. Error message 
*/
const errMsgExpDate = $("#error-msg-exp-date");
const submitFormBtn = $(".credit-card-form .btn--submit");
linkInputsWithErrMsg(errMsgExpDate, submitFormBtn);

// Validation for credit-card-form
$(".credit-card-form .btn--submit").on("click", function () {
    const isValid = $(".credit-card-form")[0].checkValidity();

    if (isValid) {
        //Switch content
        $(".credit-card-form").fadeOut();
        setTimeout(() => {
            $(".credit-card-form-success").fadeIn();
        }, 500);
    } else {
        // Unhide invalid inputs
        $(".credit-card-form").addClass("credit-card-form--submitted");

        // Flash error messages
        $(`.credit-card-form--submitted .credit-card-form__input:invalid+.credit-card-form__input-error-msg,
            .credit-card-form__input-error-msg--manual`)
            .fadeOut(200)
            .fadeIn(200);
    }

    // Avoid an execution the form
    return false;
});
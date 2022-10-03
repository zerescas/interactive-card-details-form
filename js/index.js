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

// cardholder name - input validation
$("#cardholder-name").on("input", function () {
    let field = $(this);
    let value = $(this).val();

    fieldValidation(
        value,
        field,
        () => card.cardholderName = "Jane Appleseed",
        (cardholderName) => {
            card.cardholderName = validateChars(cardholderName);
            return card.cardholderName;
        });

    // Update front card info
    $(".credit-card--front__holder-name").text(card.cardholderName);
});

// card number - input validation
$("#card-number").on("input", function (ev) {
    let field = $(this);
    let value = $(this).val();

    let updateCaretPosistion = () => { };

    fieldValidation(
        value,
        field,
        () => card.number = "0000 0000 0000 0000",
        (cardNumber) => {
            cardNumber = validateDigits(cardNumber);
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

            let caretPosition = field[0].selectionStart + (field[0].selectionStart % 5 === 0 ? 1 : 0);
            updateCaretPosistion = () => {
                field[0].selectionStart = field[0].selectionEnd = caretPosition;
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

// card expiry date month - input validation
$("#card-exp-date-mm").on("input", function () {
    let field = $(this);
    let value = field.val();

    fieldValidation(
        value,
        field,
        () => card.expDate.mm = "00",
        (expDateMM) => {
            expDateMM = validateDigits(expDateMM);;
            if (expDateMM != "") {
                expDateMM = range(expDateMM, 0, 12);
            }

            card.expDate.mm = expDateMM;
            return card.expDate.mm;
        });

    // Update front card info
    $(".credit-card--front__exp-date").text(`${card.expDate.mm}/${card.expDate.yy}`);
});

// card expiry date year - input validation
$("#card-exp-date-yy").on("input", function () {
    let field = $(this);
    let value = field.val();

    fieldValidation(
        value,
        field,
        () => card.expDate.yy = "00",
        (expDateYY) => {
            card.expDate.yy = validateDigits(expDateYY);
            return card.expDate.yy;
        });

    // Update front card info
    $(".credit-card--front__exp-date").text(`${card.expDate.mm}/${card.expDate.yy}`);
});

// card-cvc - input validation
$("#card-cvc").on("input", function () {
    let field = $(this);
    let value = field.val();

    fieldValidation(
        value,
        field,
        () => card.cvc = "000",
        (cardCvc) => {
            card.cvc = validateDigits(cardCvc);
            return card.cvc;
        });

    // Update back card info
    $(".credit-card--back__cvc").text(`${card.cvc}`);
});

// switch error message for linked expiry date MM + YY  
const errMsgExpDate = $("#error-msg-exp-date");
const submitFormBtn = $(".credit-card-form .btn--submit");
linkInputsWithErrMsg(errMsgExpDate, submitFormBtn);

// credit-card-form validation
$(".credit-card-form .btn--submit").on("click", function () {
    const isValid = $(".credit-card-form")[0].checkValidity();

    if (isValid) {
        //Switch content
        $(".credit-card-form").fadeOut();
        setTimeout(() => {
            $(".credit-card-form-success").fadeIn();
        }, 500);
    } else {
        // Show validation messages under trouble inputs
        $(".credit-card-form").addClass("credit-card-form--submitted");

        $(`.credit-card-form--submitted .credit-card-form__input:invalid+.credit-card-form__input-error-msg,
            .credit-card-form__input-error-msg--manual`)
            .fadeOut(200)
            .fadeIn(200);
    }

    // Avoid to execute the form
    return false;
});
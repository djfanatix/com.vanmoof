var webService;
var customerData;

if(getCookie("encryptionKey") != null) {
    location.href = "main.html";
}

$(document).ready(function() {
    $('#bike0 .button').click(function() {
        selectBike(0);
    })

    // Login handling
    $("#login").click(function() {
        var email = $("#email_input").val().trim();
        var password = $("#password_input").val().trim();
        var ok = true;

        resetForm();

        if(email != "") {
            if(!validateEmail(email)) {
                $("#email_input").addClass('is-danger');
                $("#email_help").text("Please enter a valid email address!");
                ok = false;
            }
        }else {
            $("#email_input").addClass('is-danger');
            $("#email_help").text("Please enter a valid email address!");
            ok = false;
        }
        if(password == "") {
            $("#password_input").addClass('is-danger');
            $("#password_help").text("Please enter a valid password!");
            ok = false;
        }
        if(!ok)
            return;

        // ok. Handle Login
        $("#login").addClass('is-loading');
        $("#email_input").prop("disabled", true);
        $("#password_input").prop("disabled", true);

        auth(email, password);

    })
})

async function auth(email, password) {
    webService = new VanBikeLib.WebService();
    const success = await webService.authenticate(email, password);
    if(success) {
        customerData = await webService.getCustomerData();
        $("#bike0 .card-header-title").text(customerData.data.bikeDetails[0].name + " - " + customerData.data.bikeDetails[0].controller)

        if(customerData.data.bikeDetails.length > 1) {
            for(var i = 1; i < customerData.data.bikeDetails.length; i++) {
                cloneBikeDiv(customerData.data.bikeDetails[i].name, customerData.data.bikeDetails[i].controller);
            }
        }
        $("#chooseBike").addClass('is-active');
    }else {
        $("#error_notification").removeClass('is-hidden');
        resetForm();
    }
}

async function selectBike(bikeIndex) {
    $("#chooseBike").removeClass('is-active');
    createCookie("bikeModel", customerData.data.bikeDetails[bikeIndex].modelName);
    var encryptionKey = await webService.getEncryptionKey();
    createCookie("encryptionKey", encryptionKey);
    createCookie("bikeName", customerData.data.bikeDetails[bikeIndex].name);
    console.log("done!..?");
    window.location.href = "main.html";
}

function cloneBikeDiv(bikeName, bikeModel) {
    var $div = $('div[id^="bike"]:last');
    var num = parseInt($div.prop("id").match(/\d+/g), 10) +1;
    var $clone = $div.clone().prop('id', 'bike'+num);
    $div.after($clone);
    $clone.before("<br>");
    $('#bike' + num + " .card-header-title").text(bikeName + " - " + bikeModel);

    $('#bike' + num + " .button").click(function() {
        selectBike(num);
    })
}

function resetForm() {
    $("#email_input").removeClass('is-danger');
    $("#email_help").text("");
    $("#password_input").removeClass('is-danger');
    $("#password_help").text("");
    $("#login").removeClass('is-loading');
    $("#email_input").prop("disabled", false);
    $("#password_input").prop("disabled", false);
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
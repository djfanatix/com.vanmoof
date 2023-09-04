if(getCookie("encryptionKey") == null) {
    window.location.href = "index.html";
}

async function setParameters(parameters) {
    console.log(parameters);
}

//#region Connecting
$(document).ready(function() {
    $("#bikeName").text(getCookie("bikeName"));
    $("#bikeModel").text(getCookie("bikeModel"));
})

document.querySelector("#connectButton").addEventListener('click', async () => {
    $("#connectButton").addClass("is-loading");
    connect();
});

$("#clearButton").click(function() {
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    window.location.href = "index.html";
})

async function connect() {
    var bikeProfile = new VanBikeLib.ElectrifiedSX1Profile();
    var encryptionKey = getCookie("encryptionKey");
    window.vanBikeService = new VanBikeLib.VanBikeService(bikeProfile, encryptionKey);
    vanBikeService.subscribe((parameters) => {
        setParameters(parameters);
    });
    try {
        await vanBikeService.connect();
    }catch(e) {
        console.log(e);
        $("#error_notification").removeClass("is-hidden");
        $("#connectButton").removeClass("is-loading");
        return;
    }
    vanBikeService.authenticate();
    // Connected
    $("#connecting").removeClass("is-active");
}
//#endregion

//#region Unlocking
var unlocking = "";

document.querySelector("#unlock").addEventListener('click', async () => {
    if(unlocking != "")
        return;
    unlocking = $("#unlock-text").text();
    $("#unlock").addClass("is-loading");
    $("#unlock-text").text("");
    // Unlock bike
    const moduleState = new VanBikeLib.ModuleStateEntity();
    moduleState.setState(moduleState.STATE_ON);
    await vanBikeService.setModuleState(lockState);
    const lockState = new VanBikeLib.LockStateEntity();
    lockState.setState(lockState.STATE_UNLOCKED);
    await vanBikeService.setLockState(lockState);
    unlockAnimation();
});

async function unlockAnimation() {
    $("#unlock").removeClass("is-loading");
    await sleep(500);
    $("#unlock-icon").removeClass();
    $("#unlock-icon").addClass("fas fa-unlock");
    await sleep(5000);
    $("#unlock-icon").removeClass();
    $("#unlock-icon").addClass("fas fa-lock");
    $("#unlock-text").text(unlocking);
    unlocking = "";
}
//#endregion
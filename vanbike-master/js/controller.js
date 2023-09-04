var showingBikeInfo = false;

$(document).ready(function() {
	loader.initialize();
	$("#disconnect").hide();
	$("#buttonControls").hide();
	$("#bike-info").hide();
	console.log("Ready!");
})

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

//Bike Details Button
document.querySelector("#bike-info-button").addEventListener('click', async () => {
	const button = $("#bike-info-button");
	if(showingBikeInfo) {
		button.innerText = "Show Bike Info";
		$("#bike-info").show();
	}else {
		button.innerText = "Hide Bike Info";
		$("#bike-info").hide();
	}
	showingBikeInfo = !showingBikeInfo;
});

//Connect Button
document.querySelector("#connect").addEventListener('click', async () => {
	$("#connect").remove();
	loader.showLoader();
	connect();
});

//Disconnect Button
document.querySelector("#disconnect").addEventListener('click', async () => {
	await vanBikeService.disconnect();
	location.reload();
});

//Module On Button
document.querySelector("#moduleOn").addEventListener('click', async () => {
	const moduleState = new VanBikeLib.ModuleStateEntity();
	moduleState.setState(moduleState.STATE_ON);
	await vanBikeService.setModuleState(moduleState);
});

//Unlock Button
document.querySelector("#unlock").addEventListener('click', async () => {
	const lockState = new VanBikeLib.LockStateEntity();
	lockState.setState(lockState.STATE_UNLOCKED);
	await vanBikeService.setLockState(lockState);
});

//Light Setting
$(document).on('change', '#lightSetting', async function() {
	const lightningState = new VanBikeLib.LightningStateEntity();
	lightningState.setState(new Uint8Array([document.querySelector('#lightSetting').value]));
	await vanBikeService.setLightningState(lightningState);
});

//Region Setting
$(document).on('change', '#regionSetting', async function() {
	const regionState = new VanBikeLib.RegionStateEntity();
	regionState.setState(new Uint8Array([document.querySelector('#regionSetting').value]));
	const powerLevelState = new VanBikeLib.PowerLevelStateEntity();
	powerLevelState.setState(powerLevelState.STATE_LEVEL_4);
	await vanBikeService.setPowerLevelState(powerLevelState, regionState);
});

function handleError(error, stackTrace) {
	request = $.ajax({
		url: "handle/handle_error.php",
		type: "post",
		data: "error=" + error + " <small>(" + stackTrace.toString() + ")</small>"
	});
	request.done(function() {
		location.reload();
	});
}

async function setVariables() {
	$("#isconnected").text(vanBikeService.isConnected().toString());
	$("#firmware").text(await vanBikeService.getFirmwareRevision());
	$("#hardware").text(await vanBikeService.getHardwareRevision());
	$("#software").text(await vanBikeService.getSoftwareRevision());
	$("#modelnumber").text(await vanBikeService.getModelNumber());
}

async function setParameterVariables(parameters) {
	$("#bikeBatteryLevel").text(parameters.bikeBatteryLevel.getState()[0] + "%");
	$("#moduleBatteryLevel").text(parameters.moduleBatteryLevel.getState()[0] + "%");
	$("#bikeBatteryLevelBar").width(parameters.bikeBatteryLevel.getState()[0] + "%");
	$("#moduleBatteryLevelBar").width(parameters.moduleBatteryLevel.getState()[0] + "%");
	console.log(parameters);
}

async function connect() {
	var bikeProfile = null;
	var bm = getCookie("BikeModel");
	var enc = getCookie("EncryptionKey");
	if(bm == "1") {
		console.log("Using Electrified SX1 Profile");
		bikeProfile = new VanBikeLib.ElectrifiedSX1Profile();
	}else {
		console.log("Using Electrified SX2 Profile");
		bikeProfile = new VanBikeLib.ElectrifiedSX2Profile();
	}
	window.vanBikeService = new VanBikeLib.VanBikeService(bikeProfile, enc);
	vanBikeService.subscribe((parameters) => {
		setParameterVariables(parameters);
	});
	try {
		await vanBikeService.connect();
	}catch (e) {
		handleError("Could not connect via Bluetooth.", e);
		return;
	}
	await vanBikeService.authenticate();
	$("#disconnect").show();
	$("#buttonControls").show();
	await setVariables();
	$("#bikeBatteryLevelBar, #moduleBatteryLevelBar").removeClass("indeterminate");
	$("#bikeBatteryLevelBar, #moduleBatteryLevelBar").addClass("determinate");
	loader.hideLoader();
}
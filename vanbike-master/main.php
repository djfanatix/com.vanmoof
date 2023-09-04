  <!DOCTYPE html>
  <html>
    <head>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <link type="text/css" rel="stylesheet" href="css/materialize.min.css"  media="screen,projection"/>
      <link type="text/css" rel="stylesheet" href="css/spinner.css" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>VanBike</title>
    </head>
    <div class="container">
        <h2>VanBike - Control</h2>
        <div class="row">
            <div class="s12 m6">
                <p><b>Your Model:</b> <?php echo $_COOKIE["BikeModel"]; ?></p>
                <p><b>Your Encryption:</b> ********************************</p>
                <a href="index.php?change=true" class="btn waves-effect waves-light">Change</a>
            </div>
            <br />
            <div class="s12 m6">
                <h5>Bike Info:</h5>
                <small><p><b>Connected:</b> <span id="isconnected">false</span></p>
                <button class="btn waves-effect waves-light" id="bike-info-button">Show Bike Info</button>
                <div id="bike-info">
                    <p><b>Firmware:</b> <span id="firmware"></span></p>
                    <p><b>Hardware:</b> <span id="hardware"></span></p>
                    <p><b>Software:</b> <span id="software"></span></p>
                    <p><b>Model:</b> <span id="modelnumber"></span></p>
                    <p><b>Bike Battery Level:</b> <span id="bikeBatteryLevel">unknown</span></p>
                    <div class="progress">
                        <div id="bikeBatteryLevelBar" class="indeterminate" style="width: 70%"></div>
                    </div>
                    <p><b>Module Battery Level:</b> <span id="moduleBatteryLevel">unknown</span></p>
                    <div class="progress">
                        <div id="moduleBatteryLevelBar" class="indeterminate" style="width: 70%"></div>
                    </div>
                    <p><b>Module State:</b> <span id="moduleState"></span></p>
                    <p><b>Unlock Request:</b> <span id="unlockRequest"></span></p>
                    <p><b>Speed:</b> <span id="speed"></span></p>
                    <p><b>Lightning:</b> <span id="lightning"></span></p>
                    <p><b>Power Level:</b> <span id="powerLevel"></span></p>
                    <p><b>Region:</b> <span id="region"></span></p>
                    <p><b>Unit:</b> <span id="unit"></span></p>
                    <p><b>Distance:</b> <span id="distance"></span></p>
                    <p><b>Error Code:</b> <span id="errorCode"></span></p>
                    <p><b>Run Mode:</b> <span id="runMode"></span></p>
                    <p><b>Tracking State:</b> <span id="trackingState"></span></p>
                    <p><b>Sleep State:</b> <span id="sleepState"></span></p>
                    <p><b>Alarm State:</b> <span id="alarmState"></span></p>
                </div>
                
            </div>
            <hr />
            <br />
            <?php
            session_start();
            if(isset($_SESSION["error"])) {
            ?>
            <div class="card-panel red">
                <span class="white-text">
                    <?php echo $_SESSION["error"]; ?>
                </span>
            </div>
            <br />
            <?php
                unset($_SESSION["error"]);
            }
            ?>
            <div class="s12 m6">
                <button class="btn waves-effect waves-light" id="connect">Connect</button>
                <button class="btn waves-effect waves-light red" id="disconnect">Disconnect</button>
            </div>
            <div class="s12 m6" id="buttonControls">
                <br />
                <button class="btn waves-effect waves-light green" id="moduleOn">Module On</button>
                <button class="btn waves-effect waves-light yellow" id="unlock">Unlock</button>
            </div>
            <br />
            <label>Region Setting: <small>(Not implemented)</small></label>
            <select class="browser-default" id="regionSetting">
                <option value="" disabled selected>Region Setting</option>
                <option value="0">Europe</option>
                <option value="1">United States</option>
                <option value="2">Offroad</option>
                <option value="3">Japan</option>
            </select>
            <br />
            <label>Light Setting:</label>
            <select class="browser-default" id="lightSetting">
                <option value="" disabled selected>Light Setting</option>
                <option value="0">Auto</option>
                <option value="1">Always On</option>
                <option value="2">Off</option>
                <option value="3">Rear Flash</option>
                <option value="4">Rear Flash Stopped</option>
            </select>
            <hr />
        </div>
    </div>
    <body>

      <!--JavaScript at end of body for optimized loading-->
      <script type="text/javascript" src="js/materialize.min.js"></script>
      <script type="text/javascript" src="js/jquery.min.js"></script>
      <script type="text/javascript" src="js/loading.js"></script>
      <script type="text/javascript" src="js/vanbike-lib.js"></script>
      <script type="text/javascript" src="js/controller.js"></script>
    </body>
  </html>
<?php

if(isset($_COOKIE['EncryptionKey'])) {
    header('Location: main.php');
    exit();
}

?>
<!DOCTYPE html>
<html>
    <head>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <link type="text/css" rel="stylesheet" href="css/materialize.min.css"  media="screen,projection"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <script type="text/javascript" src="js/select.js"></script>
      <title>VanBike</title>
    </head>
    <div class="container">
        <h2>VanBike</h2>
        <div class="row">
            <div class="s12 m6">
                <p>This site uses cookies to store your encryption key and bike model, please only continue if you are okay with this! <a href="#"><small>(More info)</small></a></p>
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
                <form action="handle/handle_register.php" method="POST">
                    <div class="input-field">
                        <select id="bike_model" name="bike_model">
                            <option value="" disabled selected>Your Bike Model</option>
                            <option value="1">Electrified S/X</option>
                            <option value="2">Electrified S2/X2</option>
                        </select>
                        <label for="bike_model">Your Bike Model</label>
                    </div>
                    <br />
                    <h5>Login to your Vanmoof account</h5>
                    <br />
                    <div class="input-field">
                        <input placeholder="Email" id="account_email" name="account_email" type="email" class="validate">
                        <label for="account_email">Email address</label>
                    </div>
                    <div class="input-field">
                        <input placeholder="Password" id="account_password" name="account_password" type="password" class="validate">
                        <label for="account_password">Password</label>
                    </div>
                    <button class="btn waves-effect waves-light" type="submit">Continue</button>
                </form>
            </div>
        </div>
    </div>
    <body>

      <!--JavaScript at end of body for optimized loading-->
      <script type="text/javascript" src="js/materialize.min.js"></script>
    </body>
</html>
<?php

session_start();

if(!isset($_POST["account_email"]) || empty($_POST["account_email"])
    || !isset($_POST["account_password"]) || empty($_POST["account_password"])
    || !isset($_POST["bike_model"]) || empty($_POST["bike_model"])) {
        $_SESSION["error"] = "Please fill in your bike model and Vanmoof account info!";
        header('Location: ../index.php');
}

setcookie("BikeModel", $_POST["bike_model"], time() + (10 * 365 * 24 * 60 * 60), "/");
?>

    <script type="text/javascript" src="../js/jquery.min.js"></script>
    <script type="text/javascript" src="../js/vanbike-lib.js"></script>
    <script type="text/javascript">

        function createCookie(name,value,days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                var expires = "; expires="+date.toGMTString();
            }
            else var expires = "";
            document.cookie = name+"="+value+expires+"; path=/;";
        }

        async function auth() {
            const webService = new VanBikeLib.WebService();
            const success = await webService.authenticate('<?php echo $_POST["account_email"]; ?>', '<?php echo $_POST["account_password"]; ?>');
            if(success) {
                createCookie("EncryptionKey", await webService.getEncryptionKey(), 365);
                refer();
            }else {
                $.post("handle_session_write.php", { error: "Invalid credentials!" });
                window.location.href = "../index.php";
            }
        }

        auth()
        function refer() {
            window.location.href = "../main.php";
        }


    </script>

<!--Loading screen UX-->
<!DOCTYPE html>
<html>
<head>
    <!--Import Google Icon Font-->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!--Import materialize.css-->
    <link type="text/css" rel="stylesheet" href="../css/materialize.min.css"  media="screen,projection"/>

    <!--Let browser know website is optimized for mobile-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>

<body>
<center>
    <br />
    <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-blue">
            <div class="circle-clipper left">
                <div class="circle"></div>
            </div><div class="gap-patch">
                <div class="circle"></div>
            </div><div class="circle-clipper right">
                <div class="circle"></div>
            </div>
        </div>

        <div class="spinner-layer spinner-red">
            <div class="circle-clipper left">
                <div class="circle"></div>
            </div><div class="gap-patch">
                <div class="circle"></div>
            </div><div class="circle-clipper right">
                <div class="circle"></div>
            </div>
        </div>

        <div class="spinner-layer spinner-yellow">
            <div class="circle-clipper left">
                <div class="circle"></div>
            </div><div class="gap-patch">
                <div class="circle"></div>
            </div><div class="circle-clipper right">
                <div class="circle"></div>
            </div>
        </div>

        <div class="spinner-layer spinner-green">
            <div class="circle-clipper left">
                <div class="circle"></div>
            </div><div class="gap-patch">
                <div class="circle"></div>
            </div><div class="circle-clipper right">
                <div class="circle"></div>
            </div>
        </div>
    </div>
    <h2>Connecting to VanMoof</h2>
</center>

<!--JavaScript at end of body for optimized loading-->
<script type="text/javascript" src="../js/materialize.min.js"></script>
</body>
</html>

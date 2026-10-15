<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Coaches | Operational Excellence Portal</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Operational Excellence Portal">
        <meta name="keywords" content="Lean Six Sigma, Dashboard, Green Belt">
        <meta name="author" content="Mark Daniel Tabor">
        <link href="./css/global.css" rel="stylesheet"/>
        <link href="./css/coaches.css" rel="stylesheet"/>
    </head>

    <body>
        <nav>
            <div class="navbar">
                <div class="brand">
                    <img class="logo" src="./assets/images/logo2.png" alt="logo">
                    <span class="name"><a href="./index.php" rel="prefetch">OPERATIONAL EXCELLENCE</a></span>
                </div>

                <ul class="nav-menu">
                    <li><a href="./index.php" rel="prefetch">Home</a></li>

                    <li class="dp"><a>Experts</a>
                        <ul class="dp-list">
                            <li><a href="./coaches.php" rel="prefetch">Coaches</a></li>
                            <li><a href="./greenbelts.php" rel="prefetch">Lean Six Sigma Green Belts</a></li>
                            <li><a href="./blackbelts.php" rel="prefetch">Lean Six Sigma Black Belts</a></li>
                        </ul>
                    </li>

                    <li class="dp"><a>Knowledge Center</a>
                        <ul class="dp-list">
                            <li><a href="./future.php" rel="prefetch">Business Metrics of OpEx</a></li>
                            <li><a href="./lean.php" rel="prefetch">Lean Six Sigma</a></li>
                            <li><a href="./cit.php" rel="prefetch">Lean CIT</a></li>
                            <li><a href="./about.php" rel="prefetch">About</a></li>                         
                        </ul>
                    </li>

                    <li class="dp"><a>LSS Hub</a>
                        <ul class="dp-list">
                            <li><a href="./dashboard.php" rel="prefetch">Dashboard</a></li>
                            <li><a href="./training.php" rel="prefetch">Trainings</a></li>
                            <li><a href="./coaching.php" rel="prefetch">Coaching</a></li>
                            <li><a href="./login.php" rel="prefetch">Login</a></li>
                            <li><a href=".//register.php" rel="prefetch">Register</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>

        <main>
            <section>
                <div class="jumbotron">
                    <div class="image">
                        <img src="./assets/images/M' Thess.png" alt="">
                    </div>
                    <div class="caption">
                        <h2>Coaching & Consulting</h2>
                        <p>Turn ideas into impact with personalized coaching, project support, <br> and data-driven improvement strategies.</p>
                        <div class="button">
                            <button>Start Project Coaching   →</button>
                        </div>
                    </div>                    
                </div>
            </section>

            <section>
                <div class="coaches">
                    <div class="coaches-title">
                        <h1>Coaches</h1>
                    </div>

                    <div class="site-selector">
                        <button class="active" onclick="showGallery('mphil1', this)">MPHIL1</button>
                        <button onclick="showGallery('mphil3', this)">MPHIL3</button>
                    </div>

                    <div class="coaches-gallery active" id="mphil1">
                        <div class="coachrow">
                            <div class="coach-card">  <!--placeholder (will remove contents later)-->
                                <img src="./assets/images/sample.jpg" alt="">
                                <div class="coach-caption">
                                    <h2>Name T. Name</h2>
                                    <p>Details about the person</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="coaches-gallery" id="mphil3">
                        <div class="coachrow">
                      <!--      <div class="coach-card">  <!--placeholder (will remove contents later)
                                <img src="./assets/images/sample.jpg" alt="">
                                <div class="coach-caption">
                                    <h2>Name T. Name</h2>
                                    <p>Details about the person</p>
                                </div>
                            </div> -->

                            <div class="uc">  <!--placeholder (will remove contents later)-->
                                <img src="./assets/ico/warning.png" alt="">
                                <div class="coach-caption">
                                    <h2>UNDER CONSTRUCTION</h2>
                                    <p></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        <script src="./js/coaches.js"></script>
        <script src="./js/global.js"></script>
    </body>
    <footer>© 2026 Microchip Philippines</footer>
</html>
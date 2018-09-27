// window.onload est charger dès le lancement de notre page html
window.onload = function () {
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 20;
    var ctx;
    var delay = 100;
    var serpent;
    var pomme;
    var widthInBlock = canvasWidth / blockSize;
    var heightInBlock = canvasHeight / blockSize;
    var score;
    var timeout;
    var isGameOver;
    var vitesse;




    init();


// Initialisation des composants
    function init() {
        var canvas = document.createElement("canvas");
        canvas.height = canvasHeight;
        canvas.width = canvasWidth;
        canvas.style.border = "20px solid grey";
        /*
        UN PEU DE STYLE AU JEU
        */
        canvas.style.backgroundColor = "#ddd";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";

        //attacher les elements dessiner a notre html
        document.body.appendChild(canvas);

        //le context est pour dire dans quel element et dimenssion nous voulons dessiner
        ctx = canvas.getContext('2d');

        serpent = new Snake([
            [6, 4],
            [5, 4],
            [4, 4],
            [3, 4],
            [2, 4]
        ], "right");
        pomme = new Apple([10, 10]);
        score = 0;
        vitesse =1;
        refreshCanvas();
    }


    function refreshCanvas() {
        serpent.advance(vitesse);
        //verifion si le serpent est a la bonne position
        if (serpent.checkCollision()) {
            console.log("Game OVER");
            gameOver();
        } else {
            if (serpent.isEatingApple(pomme)) {
                console.log("serpent manger la pomme");
                serpent.ateApple = true;
                score++;

                do {
                    pomme.setNewPosition();
                } while (pomme.isOnSnake(serpent));

            }

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawScore();
            serpent.draw();
            pomme.draw();
            drawUI();

            //executer une fonction a chaque fois en fonction d'un delais
            timeout = setTimeout(refreshCanvas, delay);

        }

    }

    function gameOver() {
        ctx.save();
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.baseLine = "middle";
        ctx.textAlign = "center";
        ctx.font = "bold 50px sans-serif";
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.strokeText("FIN DU JEU", centreX, centreY - 180);
        ctx.fillText("FIN DU JEU", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur Espace pour rejouer", centreX, centreY - 120);
        ctx.fillText("Appuyer sur Espace pour rejouer", centreX, centreY - 120);
        ctx.restore();
        isGameOver = true;
    }

    function restart() {


        if (isGameOver){
            serpent = new Snake([
                [6, 4],
                [5, 4],
                [4, 4],
                [3, 4],
                [2, 4]
            ], "right");
            pomme = new Apple([10, 10]);
            score = 0;
            clearTimeout(timeout);
            refreshCanvas();
            isGameOver = false;
        }
        }


    function drawScore() {
        ctx.save();
        ctx.font = "bold 100px sans-serif";
        ctx.fillStyle = "grey";
        ctx.textAlign = "center";
        ctx.baseLine = "middle";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }

    function drawBlock(ctx, position) {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }
    function drawUI() {
        ctx.save();
        ctx.font = "bold 10px sans-serif";
        ctx.fillStyle = "black";
       // var centreX = canvasWidth / 2;
        //var centreY = canvasHeight / 2;
        ctx.fillText("Made By Innocent Kacou with JavaScript", 10, canvasHeight-10);
        ctx.restore();
      }

    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function () {
            ctx.save(); // sauvegarde le contex comme il etait avant
            ctx.fillStyle = "green";

            for (var i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };

        this.advance = function (vitesse) {
            var nextPosition = this.body[0].slice(); // permet de cree un nouvelle element en format copy en coupant la partie necesaire
            //nextPosition[0]++; //Faire avancer le serpent d'une case ver la droite
            switch (this.direction) {
                case "left":
                    nextPosition[0]-=vitesse;
                    break;
                case "right":
                    nextPosition[0]+=vitesse;
                    break;
                case "down":
                    nextPosition[1]+=vitesse;
                    break;
                case "up":
                    nextPosition[1]-=vitesse;
                    break;
                default:
                    throw "direction non valide";
            }
            //unshift ajouter une nouvelle valeur a la tete du tableau
            this.body.unshift(nextPosition);

            if (!this.ateApple) {
                //Pop retirer une valeur a un tableau
                this.body.pop();
            } else
                this.ateApple = false;

        };

        this.setDirection = function (newDirection) {
            var allowedDirection; // direction permise
            switch (this.direction) {
                case "left":
                case "right":
                    allowedDirection = ["up", "down"];
                    break;
                case "up":
                case "down":
                    allowedDirection = ["left", "right"];
                    break;
                default:
                    throw ("direction invalide");
            }
            if (allowedDirection.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        };

        this.checkCollision = function () {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlock - 1;
            var maxY = heightInBlock - 1;
            var horDesMursHorizontaux = snakeX < minX || snakeX > maxX;
            var horDesMursVerticaux = snakeY < minY || snakeY > maxY;

            if (horDesMursHorizontaux || horDesMursVerticaux) {
                wallCollision = true;
            }

            for (var i = 0; i < rest.length; i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                    snakeCollision = true;
                }
            }

            return wallCollision || snakeCollision;

        };

        this.isEatingApple = function (appleToEat) {

            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else
                return false;


        };
    }



    //Pome du serpent

    function Apple(position) {
        this.position = position;
        //methode
        this.draw = function () {
            ctx.save(); // enregistre l'ancien etat du canvas
            ctx.fillStyle = "red";
            //desssiner un rond
            ctx.beginPath();
            var radius = blockSize / 2;
            //pour trouver la position du centre du cercle avant de remplir la celule contenant le cercle
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius; //on y ajoute le rayon car sans lui le point sera a l'extreme gauche du care dans lequel le point est inscrit
            //puis on dessine le cercle
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore(); //restaure en l'etat au lieu de dissiner plusier fois la meme chose
        };
        this.setNewPosition = function () {
            var newX = Math.round(Math.random() * (widthInBlock - 1));
            var newY = Math.round(Math.random() * (heightInBlock - 1));
            this.position = [newX, newY];
        };
        this.isOnSnake = function (snakeToCheck) {
            var isOnSnake = false;

            for (var i = 0; i < snakeToCheck.body.length; i++) {
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[0] === snakeToCheck.body[i][1]) {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };

    }



    //trouver la direction dans laquelle le serpent doit partir
    document.onkeydown = function handleDeyDown(e) {
        var key = e.keyCode;
        var newDirection;
        switch (key) {

            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        serpent.setDirection(newDirection);
    };
};
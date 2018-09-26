// window.onload est charger dès le lancement de notre page html
window.onload = function () {
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 20;
    var ctx;
    var delay = 100;
    var serpent;




    init();



    function init() {
        var canvas = document.createElement("canvas");
        canvas.height = canvasHeight;
        canvas.width = canvasWidth;
        canvas.style.border = "1px solid red";
        //attacher les elements dessiner a notre html
        document.body.appendChild(canvas);

        //le context est pour dire dans quel element et dimenssion nous voulons dessiner
        ctx = canvas.getContext('2d');

        serpent = new Snake([
            [6, 4],
            [5, 4],
            [4, 4]
        ], "right");
        refreshCanvas();
    }


    function refreshCanvas() {

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        serpent.advance();
        serpent.draw();

        //executer une fonction a chaque fois en fonction d'un delais
        setTimeout(refreshCanvas, delay);

    }

    function drawBlock(ctx, position) {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.draw = function () {
            ctx.save(); // sauvegarde le contex comme il etait avant
            ctx.fillStyle = "green";

            for (var i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };

        this.advance = function () {
            var nextPosition = this.body[0].slice(); // permet de cree un nouvelle element en format copy en coupant la partie necesaire
            //nextPosition[0]++; //Faire avancer le serpent d'une case ver la droite
            switch (this.direction) {
                case "left":
                    nextPosition[0]--;
                    break;
                case "right":
                    nextPosition[0]++;
                    break;
                case "down":
                    nextPosition[1]++;
                    break;
                case "up":
                    nextPosition[1]--;
                    break;
                default:
                    throw "direction non valide";
            }
            this.body.unshift(nextPosition);
            this.body.pop();
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
            default:
                return;
        }
        serpent.setDirection(newDirection);
    };
};
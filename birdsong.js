
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'birdsong', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('forest', 'assets/forest.png');
    game.load.audio('sfx', [ 'assets/birds.mp3' ]);
}


var fx;
var t;
var forest;
var taps;
var baseSpeed;
var started;
var score;
var tooFast;

function create() {

    Number.prototype.format = function(n, x) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
    };

    fx = game.add.audio('sfx');
    fx.override = true;

    fx.addMarker('bird1', 1, .85);
    fx.addMarker('bird2', 6.5, 1.00);
    fx.addMarker('bird3', 9, 1.50);
    fx.addMarker('bird4', 14.75, 1.10);

    taps = [];
    baseSpeed = 0;
    started = false;
    score = 0;

    forest = game.add.tileSprite(0, 0, 800, 600, 'forest');

    game.input.onDown.add(goFaster, this);

    function goFaster(pointer) {
        if (!started){
            start();
        }
        taps.push(pointer.timeDown);
    }

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    var style = { font: "20px Arial", fill: "#FFFFFF", align: "center" };

    t = game.add.text(5, 5, '', style);
    t2 = game.add.text(5, 25, '', style);
}

function start(){

    started = true;
    baseSpeed = 3;

    game.scale.startFullScreen();

}

function update() {

    //play bird sound?
    if (started){
        if (!tooFast){
            if ((Math.random() * 400) > (399 - (taps.length) ) ){
                score++;
                fx.play('bird' + (Math.floor((Math.random() * 4) + 1)).toString())
            }
        }

        t.setText('BBirds heard: ' + score.format());
        t2.setText(tooFast? 'Too fast to hear birds!': '')

        var d = new Date();
        var timeNow = d.getTime();

        for (var i = 0; i < taps.length; i++) {
            if (taps[i] + 2000 < timeNow){
                taps.splice(i, 1);
            }
        }

        if (taps.length < 7){
            tooFast = false;
        }
        else{
            tooFast = true;
        }

        forest.tilePosition.y -= (taps.length + 1) + baseSpeed;

    }
}

function render() {

}

function restart () {

}

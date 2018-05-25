var mainState = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function mainState ()
    {
        Phaser.Scene.call(this, { key: 'mainState' });
        this.bird;
        this.pipes;
        this.gameOver=false;//定义游戏终止
    },
    preload: function ()
    {
        this.load.image('bird','assets/bird.png');
        this.load.image('pipe','assets/pipe.png');
        this.load.audio('jump', 'assets/jump.wav');//加载声音
    },

    create: function ()
    {
        bird = this.physics.add.sprite(100, 250, 'bird');
        bird.setGravityY(1000);
        pipes = this.physics.add.group();
        this.input.on('pointerdown', this.jump , this);//点击进行跳跃
		// 延时1500后，重复产生管子
        timedEvent =this.time.addEvent({ delay: 1500, callback: this.addRowOfPipes,
		callbackScope: this, loop: true });
		score=0;
	 	labelScore = this.add.text(20, 20 , "0", {font:"30px Arial",fill:"#ffffff"} );//左上角的分数
        jumpSound = this.sound.add('jump');
    },
    update: function ()
    {
        // 检测是否碰到
        this.physics.add.overlap(bird, pipes, this.restartGame, null, this)
    },
    restartGame: function()
    {
        //这里应该是重新开始，但只写了终止游戏
        this.physics.pause();
        bird.setTint(0xff0000);
        this.gameOver = true;
    },
    jump: function()
    {
        //  进行跳跃，处理两件事  向上一个速度和播放音乐
        bird.setVelocity(0,-350);
        jumpSound.play();
    },

    addOnePipe: function(x, y)
    {
        // 产生一根管子
        var pipe = this.physics.add.sprite(x, y, 'pipe');
        pipes.add(pipe);
        pipe.setVelocity(-200,0);
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function()
    {
        if(this.gameOver) return ;
    	var hole = Math.floor(Math.random() * 5) + 1;
    	for (var i = 0; i < 8; i++)
        	if (i != hole && i != hole + 1  )//这里为两个空间，可以设置三个空，以减少难度  && i != hole + 2
            this.addOnePipe(400, i * 60 + 30);
        score ++;
        labelScore.setText(score);
    },

});

var config = {
    type: Phaser.AUTO,
    width: 400,
    height: 490,
    backgroundColor: '#71c5cf',
    physics: {
        default: 'arcade'
    },
    scene:[mainState]
};
var game= new Phaser.Game(config);
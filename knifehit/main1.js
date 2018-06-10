var game;
var gameOptions={

	// 设置旋转速度，即每一帧转动的角度
	rotationSpeed: 3, 
	// 刀飞出去的速度, 即一秒中内移动像素
	throwSpeed: 150	
}

// 窗口第一次加载...
window.onload = function(){
	// 游戏的参数设置
	var gameConfig={
		type: Phaser.CANVAS,
		width: 750,
		height: 1334,
		backgroundColor: 0x444444,
		scene: [playGame]
	};
	game = new Phaser.Game(gameConfig);
	window.focus();//获得窗口焦点
	resize();//调整窗口
	window.addEventListener("resize",resize,false);
}
class playGame extends Phaser.Scene{

	constructor(){
		super("playGame");
	}
	// 预加载
	preload(){

		// 加载各种资源
		this.load.image("target","assets/target.png");
		this.load.image("knife","assets/knife.png");

	}
	// 游戏开始运行
	create(){

		// 在游戏开始时设置可以扔刀
		this.canThrow = true;

		// 将旋转的刀组成一个组
		this.knifeGroup=this.add.group();


		// 加载刀和圆木
		this.knife = this.add.sprite(game.config.width/2, game.config.height/5*4,"knife");
		this.target = this.add.sprite(game.config.width/2,400,"target");

 		// 将圆木放在第一层,即最上层
		this.target.depth = 1;

		// 点击后飞出刀
		this.input.on("pointerdown", this.throwKnife, this);
	}

	// 飞出刀动作
	throwKnife(){

		// 检查是否要飞出
		if(this.canThrow){
			
			this.canThrow = false;

			// 飞刀的补间动画
			this.tweens.add({
				// 刀
				targets:[this.knife],
				// 到达的位置
				y: this.target.y+this.target.width/2,

				 // 补间速度
				duration: gameOptions.throwSpeed,

				// 回传范围
				callbackScope: this,

				 // 执行后的回调函数
				onComplete: function(tween){
					// 玩家现可以再次扔刀
					this.canThrow= true;

					// 将飞出的刀插在圆木上
					var knife = this.add.sprite(this.knife.x, this.knife.y, "knife");
					this.knifeGroup.add(knife);

					this.knife.y = game.config.height/5*4;
				}

			});
		}

	}

	// 游戏每一帧执行
	update(){

		//使目标转动起来
		this.target.angle += gameOptions.rotationSpeed;

		// 获取旋转的刀成员
		var children = this.knifeGroup.getChildren();

		// 对于刀的每个成员
		for (var i=0; i<children.length; i++){

			// 刀旋转的速度设置与圆木的速度一致
			children[i].angle += gameOptions.rotationSpeed;

			 // 将角度转化为弧度
			var radians = Phaser.Math.DegToRad(children[i].angle + 90);

			// 再用弧度转化为相应刀的坐标
			children[i].x = this.target.x + (this.target.width/2)*Math.cos(radians);
            children[i].y = this.target.y + (this.target.width/2)*Math.sin(radians);
		}

	}
}


// 按比例调整窗口
function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
} 
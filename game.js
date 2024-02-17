var gameEnded = false; // 游戏状态标志

var player;
var cursors;
var obstacles;
var speed = 100;
var lastObstacleTime = 0;
var obstacleInterval = 2500;

class MyGameScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'MyGameScene'
		});
		this.restartButton = null; // 初始化为null，但在这里声明为类的属性

	}

	preload() {
		// 这里你可以加载图像，例如:
		this.load.image('player', 'src/爱心.png');
		this.load.image('obstacle', 'src/kiss.png');
	}


	create() {
		// 创建玩家
		player = this.physics.add.sprite(400, 550, 'player').setScale(0.3);

		// 创建障碍物组
		obstacles = this.physics.add.group();

		// 创建光标键控制
		cursors = this.input.keyboard.createCursorKeys();

		// 碰撞检测
		this.physics.add.collider(player, obstacles, this.hitObstacle, null, this);

		// 创建重新开始游戏的按钮，但是默认是隐藏的
		this.restartButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY,
			'Restart Game', {
				fontSize: '32px',
				fill: '#ffffff'
			})
			.setOrigin(0.5)
			.setInteractive()
			.on('pointerdown', () => this.restartGame())
			.setVisible(false); // 设置为不可见
	}

	restartGame() {
		// 重置游戏状态
		obstacles.clear(true, true); // 清除现有障碍物
		player.setPosition(400, 550); // 重置玩家位置
		player.clearTint(); // 清除玩家的变色效果，如果有的话
		player.setVelocity(0, 0); // 重置玩家速度
		speed = 100; // 重置障碍物速度
		lastObstacleTime = 0; // 重置障碍物生成的时间
		obstacleInterval = 2500; // 重置障碍物生成间隔
		gameEnded = false; // 重置游戏状态标志

		// 重新启动物理系统
		this.physics.resume(); // 确保此行未被注释

		// 确保玩家可以移动和生成障碍物
		obstacles.children.iterate(function(child) {
			if (child) {
				child.setVelocityY(speed); // 为每个障碍物设置初始下落速度
			}
		});

		// 移除重新开始按钮
		this.restartButton.setVisible(false);
	}

	update(time) {
		// 玩家控制
		if (cursors.left.isDown && player.x > 0) {
			player.setVelocityX(-160);
		} else if (cursors.right.isDown && player.x < 800) {
			player.setVelocityX(160);
		} else {
			player.setVelocityX(0);
		}

		// 创建障碍物
		if (time > lastObstacleTime + obstacleInterval) {
			var obstacle = obstacles.create(Phaser.Math.Between(0, 800), 0, 'obstacle').setScale(0.3);
			obstacle.setVelocityY(speed);
			lastObstacleTime = time;
			// 随时间增加障碍物速度
			speed += 5;
			// 调整生成时间使障碍物不要太密集
			obstacleInterval *= 0.95;
		}

		// 清除超出屏幕的障碍物
		obstacles.children.iterate(function(child) {
			if (child && child.y > 600) {
				child.destroy(); // 使用 destroy 方法替代 remove

			}
		})

		if (gameEnded) {
			return; // 如果游戏已结束，直接返回不执行后续代码
		};
	}


	hitObstacle(player, obstacle) {
		// 游戏结束逻辑，例如:
		player.setTint(0xff0000); // 给玩家一个效果，比如变色
		player.setVelocity(0, 0); // 停止玩家移动
		obstacles.setVelocityX(0); // 停止所有障碍物移动
		// 停止后续障碍物的生成
		this.physics.pause(); // 暂停物理系统
		// 显示重新开始游戏的按钮
		this.restartButton.setVisible(true);
		gameEnded = true; // 设置游戏状态为结束

	}

}

// Phaser配置对象
var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {
				y: 0
			},
			debug: false
		}
	},
	scene: MyGameScene // 使用场景类
};

var game = new Phaser.Game(config);
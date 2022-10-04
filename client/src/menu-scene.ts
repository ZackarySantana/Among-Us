import Phaser from "phaser";
import { io, Socket } from "socket.io-client";

import shipImg from "/assets/ship.png";
import playerSprite from "/assets/player.png";
import {
    PLAYER_SPRITE_HEIGHT,
    PLAYER_SPRITE_WIDTH,
    PLAYER_HEIGHT,
    PLAYER_WIDTH,
    PLAYER_START_X,
    PLAYER_START_Y,
} from "./utils/constants";
import { movePlayer } from "./utils/movement";
import { animateMovement } from "./utils/animation";
import {
    getQueryParameter,
    getRandomRoomCode,
    setQueryParameter,
} from "./utils/misc";

export type PlayerInfo = {
    sprite: Phaser.GameObjects.Sprite;
    moving: boolean;
    movedLastFrame: boolean;
};

const player = {} as PlayerInfo;
const otherPlayer = {} as PlayerInfo;
let socket: Socket;
let pressedKeys = [] as string[];

const roomQP = getQueryParameter("room");
const room = roomQP == "" ? getRandomRoomCode() : roomQP;
if (roomQP == "") {
    window.history.replaceState(
        {},
        document.title,
        setQueryParameter({ room })
    );
}

export class MenuScene extends Phaser.Scene {
    // private startKey!: Phaser.Input.Keyboard.Key;
    // private sprites: { s: Phaser.GameObjects.Image; r: number }[] = [];

    constructor() {
        super({
            key: "MenuScene",
        });
    }

    preload(): void {
        // this.startKey = this.input.keyboard.addKey(
        //     Phaser.Input.Keyboard.KeyCodes.S
        // );
        // this.startKey.isDown = false;
        socket = io("localhost:3000?room=" + room);
        this.load.image("ship", shipImg);
        this.load.spritesheet("player", playerSprite, {
            frameWidth: PLAYER_SPRITE_WIDTH,
            frameHeight: PLAYER_SPRITE_HEIGHT,
        });
        this.load.spritesheet("otherPlayer", playerSprite, {
            frameWidth: PLAYER_SPRITE_WIDTH,
            frameHeight: PLAYER_SPRITE_HEIGHT,
        });
    }

    create(): void {
        const ship = this.add.image(0, 0, "ship");
        player.sprite = this.add.sprite(
            PLAYER_START_X,
            PLAYER_START_Y,
            "player"
        );
        player.sprite.displayHeight = PLAYER_HEIGHT;
        player.sprite.displayWidth = PLAYER_WIDTH;
        otherPlayer.sprite = this.add.sprite(
            PLAYER_START_X,
            PLAYER_START_Y,
            "otherPlayer"
        );
        otherPlayer.sprite.displayHeight = PLAYER_HEIGHT;
        otherPlayer.sprite.displayWidth = PLAYER_WIDTH;

        this.anims.create({
            key: "running",
            frames: this.anims.generateFrameNumbers("player", {}),
            frameRate: 24,
            repeat: -1,
        });

        this.input.keyboard.on("keydown", (e: KeyboardEvent) => {
            if (!pressedKeys.includes(e.code)) {
                pressedKeys.push(e.code);
            }
        });
        this.input.keyboard.on("keyup", (e: KeyboardEvent) => {
            pressedKeys = pressedKeys.filter((key) => key !== e.code);
        });

        socket.on("move", ({ x, y }) => {
            console.log("revieved move");
            if (otherPlayer.sprite.x > x) {
                otherPlayer.sprite.flipX = true;
            } else if (otherPlayer.sprite.x < x) {
                otherPlayer.sprite.flipX = false;
            }
            otherPlayer.sprite.x = x;
            otherPlayer.sprite.y = y;
            otherPlayer.moving = true;
        });
        socket.on("moveEnd", () => {
            console.log("revieved moveend");
            otherPlayer.moving = false;
        });
        // this.add.text(0, 0, "Press S to restart scene", {
        //     fontSize: "60px",
        //     fontFamily: "Helvetica",
        // });
        // this.add.image(100, 100, "particle");
        // for (let i = 0; i < 300; i++) {
        //     const x = Phaser.Math.Between(-64, 800);
        //     const y = Phaser.Math.Between(-64, 600);
        //     const image = this.add.image(x, y, "particle");
        //     image.setBlendMode(Phaser.BlendModes.ADD);
        //     this.sprites.push({ s: image, r: 2 + Math.random() * 6 });
        // }
    }

    update(): void {
        this.scene.scene.cameras.main.centerOn(
            player.sprite.x,
            player.sprite.y
        );
        const playerMoved = movePlayer(pressedKeys, player.sprite);
        if (playerMoved) {
            socket.emit("move", { x: player.sprite.x, y: player.sprite.y });
            player.movedLastFrame = true;
        } else {
            if (player.movedLastFrame) {
                socket.emit("moveEnd");
            }
            player.movedLastFrame = false;
        }
        animateMovement(pressedKeys, player.sprite);
        // Aninamte other player
        if (otherPlayer.moving && !otherPlayer.sprite.anims.isPlaying) {
            otherPlayer.sprite.play("running");
        } else if (!otherPlayer.moving && otherPlayer.sprite.anims.isPlaying) {
            otherPlayer.sprite.stop();
        }
        // if (this.startKey.isDown) {
        //     this.sound.play("gasp");
        //     this.scene.start(this);
        // }
        // for (let i = 0; i < this.sprites.length; i++) {
        //     const sprite = this.sprites[i].s;
        //     sprite.y -= this.sprites[i].r;
        //     if (sprite.y < -256) {
        //         sprite.y = 700;
        //     }
        // }
    }
}

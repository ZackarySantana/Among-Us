export const animateMovement = (
    keys: string[],
    playerSprite: Phaser.GameObjects.Sprite
) => {
    const runningKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (
        keys.some((key) => runningKeys.includes(key)) &&
        !playerSprite.anims.isPlaying
    ) {
        playerSprite.play("running");
    } else if (
        !keys.some((key) => runningKeys.includes(key)) &&
        playerSprite.anims.isPlaying
    ) {
        playerSprite.stop();
    }
};

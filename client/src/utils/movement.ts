import { PLAYER_SPEED, SHIP_HEIGHT, SHIP_WIDTH } from "./constants";
import { mapBounds } from "./mapBounds";

const isWithinMovementBoundaries = (x: number, y: number) => {
    return !mapBounds[y] ? true : !mapBounds[y].includes(x);
};

export const movePlayer = (
    keys: string[],
    playerSprite: Phaser.GameObjects.Sprite
) => {
    let playerMoved = false;
    const absPlayerX = playerSprite.x + SHIP_WIDTH / 2;
    const absPlayerY = playerSprite.y + SHIP_HEIGHT / 2 + 20;
    if (
        keys.includes("ArrowUp") &&
        isWithinMovementBoundaries(absPlayerX, absPlayerY - PLAYER_SPEED)
    ) {
        playerMoved = true;
        playerSprite.y = playerSprite.y - PLAYER_SPEED;
    }
    if (
        keys.includes("ArrowDown") &&
        isWithinMovementBoundaries(absPlayerX, absPlayerY + PLAYER_SPEED)
    ) {
        playerMoved = true;
        playerSprite.y = playerSprite.y + PLAYER_SPEED;
    }
    if (
        keys.includes("ArrowLeft") &&
        isWithinMovementBoundaries(absPlayerX - PLAYER_SPEED, absPlayerY)
    ) {
        playerMoved = true;
        playerSprite.x = playerSprite.x - PLAYER_SPEED;
        playerSprite.flipX = true;
    }
    if (
        keys.includes("ArrowRight") &&
        isWithinMovementBoundaries(absPlayerX + PLAYER_SPEED, absPlayerY)
    ) {
        playerMoved = true;
        playerSprite.x = playerSprite.x + PLAYER_SPEED;
        playerSprite.flipX = false;
    }
    return playerMoved;
};

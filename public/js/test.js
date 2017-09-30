/* global MultiPlayer:true Providers:true */

let player = new MultiPlayer("player");

player.addProvider("youtube", Providers.youtube);

player.playback("youtube", "bHQqvYy5KYo");
player.playback("youtube", "oBu_-1uMQKg");

player.on("ready", () => {
    console.log("ready");
    player.setCurrentTime(50);
    player.play();
    //player.destroy();
});
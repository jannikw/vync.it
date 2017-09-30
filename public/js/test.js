/* global MultiPlayer:true Providers:true */

let player = new MultiPlayer("player");

player.addProvider("youtube", Providers.youtube);
player.addProvider("vimeo", Providers.vimeo);

//player.playback("youtube", "bHQqvYy5KYo");
//player.playback("youtube", "oBu_-1uMQKg"), "oBu_-1uMQKg";
player.playback("vimeo", 54989781);

player.on("ready", () => {
    console.log("ready");
    //player.playback("youtube", "oBu_-1uMQKg");
    player.setCurrentTime(50)
        //.then(player.play)
        .done();
    //player.playback("vimeo", 54989781)
    //    .then(() => player.play())
    //    .done();

        /*
        .then(() => {
            player.setCurrentTime(50);
        })
        .done();
        */
});
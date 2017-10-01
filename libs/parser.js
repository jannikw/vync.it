function parseInput(media) {
    var youtubeRegExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var youtubeMatch = media.match(youtubeRegExp);
    if (youtubeMatch && youtubeMatch[7].length==11) {
        return { provider: "youtube", media: youtubeMatch[7] };
    }

    var vimeoRegExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
    var vimeoMatch = media.match(vimeoRegExp);
    if (vimeoMatch) {
        return { provider: "vimeo", media: vimeoMatch[5] };
    }
}

module.exports = parseInput;
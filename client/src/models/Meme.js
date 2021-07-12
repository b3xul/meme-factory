class Meme {
    /**
     * Constructs a new Meme object
     * @param {Number} memeId memeId
     * @param {Number} imageId memeId
     * @param {Number} creatorId memeId
     * @param {String} creatorUsername username of the creator of the meme
     * @param {String} title meme description
     * @param {Boolean} isProtected true=protected, false=public
     * @param {String} fontFamily font-family for all the sentences
     * @param {Number} fontSize fontSize in px for all the sentences
     * @param {String} color font color for all the sentences
     * @param {Array.String} sentences 1, 2, or 3 sentences to fill the predefined textAreas with
     */
    constructor(memeId, imageId, creatorId, creatorUsername, title, isProtected, fontFamily, fontSize, color, sentences) {
        this.memeId = memeId;
        this.imageId = imageId;
        this.creatorId = creatorId;
        this.creatorUsername = creatorUsername;
        this.title = title;
        this.isProtected = isProtected;
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.color = color;
        this.sentences = sentences;
    }

}

export default Meme;
class Meme {
    /**
     * Constructs a new Meme object
     * @param {Number} memeId memeId
     * @param {String} title meme description
     * @param {BackgroundImage} BackgroundImage object containing path and number of sentences
     * @param {Array} sentences 1,2 or 3 phrases to place on the background image
     * @param {String} author username of the author of the meme
     * @param {Boolean} isProtected true=protected, false=public
     */
    constructor(memeId, title, background, sentences, author, isProtected) {
        this.memeId = memeId;
        this.title = title;
        this.background = background;
        this.sentences = sentences;
        this.author = author;
        this.isProtected = isProtected;
    }

    /**
     * Construct an Meme from a plain object
     * @param {{}} json 
     * @return {Meme} the newly created Meme object
     */
    static from(json) {
        return new Meme(json.memeId, json.title, json.background, json.sentences, json.author, json.isProtected);
    }
}

export default Meme;
class Meme {
    /**
     * Constructs a new Meme object
     * @param {Number} memeId memeId
     * @param {String} title meme description
     * @param {BackgroundImage} background  BackgroundImage object containing path and number of sentences
     * @param {Array.memeTextArea} textAreas 1,2 or 3 textAreas to place on the background image
     * @param {String} creator username of the creator of the meme
     * @param {Boolean} isProtected true=protected, false=public
     */
    constructor(memeId, title, creator, isProtected, background, textAreas, memeText, font, fontSize, color) {
        this.memeId = memeId;
        this.title = title;
        this.background = background;
        this.textAreas = textAreas;
        this.font = font;
        this.fontSize = fontSize;
        this.color = color;
        this.creator = creator;
        this.isProtected = isProtected;
    }

    /**
     * Construct an Meme from a plain object
     * @param {{}} json 
     * @return {Meme} the newly created Meme object
     */
    static from(json) {
        // return new Meme(json.memeId, json.title, json.background, json.sentences, json.creator, json.isProtected);
    }
}

class memeTextArea {
    /**
     * 
     * @param {Number} top offset of textarea from div containing background image
     * @param {Number} left offset of textarea from div containing background image
     * @param {Number} width size of textarea from div containing background image
     * @param {Number} height size of textarea from div containing background image
     */
    constructor(top, left, width, height) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
    }

}
export default Meme;
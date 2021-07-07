class BackgroundImage {
    /**
     * Constructs a new Meme object
     * @param {Number} imageId memeId
     * @param {String} path path of the background image
     * @param {Number} numberOfSentences can be 1, 2 or 3
     */
    constructor(imageId, path, numberOfSentences) {
        this.imageId = imageId;
        this.path = path;
        this.numberOfSentences = numberOfSentences;
    }

    /**
     * Construct an BackgroundImage from a plain object
     * @param {{}} json 
     * @return {BackgroundImage} the newly created BackgroundImage object
     */
    static from(json) {
        return new BackgroundImage(json.imageId, json.path, json.numberOfSentences);
    }
}

export default BackgroundImage;
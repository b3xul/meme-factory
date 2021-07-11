class BackgroundImage {
    /**
     * Constructs a new v object
     * @param {Number} imageId background image Id
     * @param {String} path path of the background image
     * @param {Array.memeTextArea} textAreas 1, 2 or 3 textAreas on the background image to be filled
     */
    constructor(imageId, path, numberOfAreas, textAreas) {
        this.imageId = imageId;
        this.path = path;
        this.numberOfAreas = numberOfAreas;
        this.textAreas = textAreas;
    }

    /**
     * Construct an BackgroundImage from a plain object
     * @param {{}} json 
     * @return {BackgroundImage} the newly created BackgroundImage object
     */
    static from(json) {
        return new BackgroundImage(json.imageId, json.path, json.numberOfAreas, json.textAreas);
    }
}

class MemeTextArea {
    /**
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

export { BackgroundImage, MemeTextArea };
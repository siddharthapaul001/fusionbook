/**
  * Validate size and splits into number and unit.
  * This function converts size into a easy to handle object
  *
  * @param   {string} size
  *          size in string or a number to validate and digest
  * @param   {string} str
  *          str is the string to concat with the error message for easy understanding
  * @returns {object} resolvedSize
  *          returns resolvedSize which contains num to store numeric size value and unit to store its unit
*/
function _pluckSize(size, str) {
    str = str ? 'of ' + str : '';
    let num = +(size + '').replace(/px$/g, '');
    // let num = (size + '').match(/\d+/g),
    //     unit = (size + '').match(/px|%|vh|vw/g) || [''];

    // if (!num || ((size + '').trim().startsWith('-'))) {
    //     if (size) {
    //         console.error("Error in size value " + str);
    //     }
    //     return {
    //         num: null,
    //         unit: ''
    //     };
    // }
    if (!+num || num < 0) {
        if (size) {
            console.error("Error in size value " + str + ": " + size);
        }
        return {
            num: null,
            unit: ''
        }
    }

    return {
        num,  // +num[0],
        unit: 'px' // unit[0]
    };
}

/**
  * Validate color if color is in hexcode or rgb otherwise.
  * Used to check if the given fill / stroke color code is valid
  * 
  * @param   {string} color
  *          size in string or a number to validate and digest
  * @returns {boolean} isValid
  *          returns true if color is valid otherwise false
*/
function _validateColorCode(color) {
    if (!color) {
        return false;
    }
    if (typeof color === 'number') {
        console.error("Incorrect color specified");
        return false;
    }
    if (color.startsWith('#')) {
        if (!color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/g)) {
            console.error("Incorrect hex color code");
            return false;
        }
    } else if (color.startsWith('rgb(')) {
        if (!color.replace(/\s/g, '').match(/^rgb\((\d+),(\d+),(\d+)\)$/g)) {
            console.error("Incorrect rgb color code");
            return false;
        }
    }
    return true;
}


/**
  * Checks if number is fractional or not.
  * Required to set gradient for fractunal rating
  * 
  * @param   {number} num
  *          num denotes the number to check
  * @returns {boolean} isFraction
  *          returns true if input num is in fraction otherwise false
*/
function _isFraction(num) {
    return !(Math.abs(num - Math.floor(num)) < Number.EPSILON);
}

/**
* 
* generates the path string for d attribute of star's path
* 
* 
* @param    {number} side
*           side denotes the size of a side of inner bounding box (i.e square)
* @param    {number} X
*           X denotes the absolute horizontal displacement for horizontal middle of the star
* @param    {number} Y
*           Y denotes the absolute horizontal displacement for the star
* 
* @returns {string} path
*           path holds the path string for star
*          
*/
function _getPathString(side) {
    let str,
        ax = 0.15,
        bx = (1 - 2 * ax) / 2,
        cx = 0.3,
        dx = 0.5,
        ex = 0.3,
        ay = 0.3, by = 0.3,
        cy = (1 - ay - by),
        dy = 0.25,
        am = ax / ay;
    cx = (am * cy);
    ex = ex * am;
    str = " l" + (ax * side) + "," + (ay * side)
        + " h" + (bx * side)
        + " l-" + (cx * side) + "," + (by * side)
        + " l" + (cx * side) + "," + (cy * side)
        + " l-" + (dx * side) + ",-" + (dy * side)
        + " l-" + (dx * side) + "," + (dy * side)
        + " l" + (cx * side) + ",-" + (cy * side)
        + " l-" + (cx * side) + ",-" + (by * side)
        + " h" + (bx * side)
        + " z";
    return str;
}

class SVGElement {
    constructor(tag) {
        this._elem = document.createElementNS("http://www.w3.org/2000/svg", tag);
        this.attrs = {};
    }

    getNode() {
        return this._elem;
    }

    removeNode() {
        this._elem.parentNode.removeChild(this._elem);
    }

    appendChild(child) {
        if (child instanceof Node) {
            this._elem.appendChild(child);
        } else if (child instanceof SVGElement) {
            this._elem.appendChild(child.getNode());
        } else {
            console.error("Child must be Node or SVGElement");
        }
    }

    removeChild(child) {
        if (child instanceof Node) {
            this._elem.removeChild(child);
        } else if (child instanceof SVGElement) {
            this._elem.removeChild(child.getNode());
        } else {
            console.error("Child must be Node or SVGElement");
        }
    }

    setAttributes(attrs) {
        let hasChange = false;
        for (let attrName in attrs) {
            if (this.attrs[attrName] !== attrs[attrName]) {
                this._elem.setAttribute(attrName, attrs[attrName]);
                this.attrs[attrName] = attrs[attrName];
                hasChange = true;
            }
        }
        return hasChange;
    }
}




/**
* 
* Generates linear gradient in svg definitions 
* This class is used for partial color filling for fractional rating 
*          
*/
class Definition {
    constructor(svg) {
        this.defs = new SVGElement("defs");
        this.linearGradient = new SVGElement("linearGradient"),
            this.strokeLinearGradient = new SVGElement("linearGradient"),
            this.Rated = new SVGElement("stop"),
            this.NonRated = new SVGElement("stop"),
            this.strokeRated = new SVGElement("stop"),
            this.strokeNonRated = new SVGElement("stop");

        this.linearGradient.appendChild(this.Rated);
        this.linearGradient.appendChild(this.NonRated);

        this.strokeLinearGradient.appendChild(this.strokeRated);
        this.strokeLinearGradient.appendChild(this.strokeNonRated);

        this.defs.appendChild(this.linearGradient);
        this.defs.appendChild(this.strokeLinearGradient);
        this.config = {};
        svg.addDefinition(this);
    }

    update(rating, ratedFill, nonratedFill, ratedStroke, nonratedStroke, direction, flow) {
        let ratingFraction = (rating - Math.floor(rating)).toFixed(2),
            commonLinearGradient = {
                "x1": "0%",
                "x2": direction == 'row' ? "100%" : "0%",
                "y1": "0%",
                "y2": direction == 'column' ? "100%" : "0%"
            };
        if(ratingFraction === this.config.ratingFraction && this.config.ratedFill === ratedFill && this.config.nonratedFill === nonratedFill && this.config.ratedStroke === ratedStroke && this.config.direction === direction && this.config.flow === flow){
            return;
        }else{
            this.config.ratingFraction = ratingFraction;
            this.config.ratedFill = ratedFill;
            this.config.nonratedFill = nonratedFill;
            this.config.ratedStroke = ratedStroke;
            this.config.direction = direction;
            this.config.flow = flow;
        }


        this.linearGradient.setAttributes({
            "id": "partial-fill",
            ...commonLinearGradient
        });

        this.strokeLinearGradient.setAttributes({
            "id": "partial-stroke",
            ...commonLinearGradient
        });

        if (flow == 'reverse') {
            [ratedFill, nonratedFill] = [nonratedFill, ratedFill];
            [ratedStroke, nonratedStroke] = [nonratedStroke, ratedStroke];
        }

        this.Rated.setAttributes({
            "offset": (ratingFraction * 100) + "%",
            "style": "stop-color:" + ratedFill + ";stop-opacity:1;"
        });

        this.NonRated.setAttributes({
            "offset": (ratingFraction * 100) + "%",
            "style": "stop-color:" + nonratedFill + ";stop-opacity:1;"
        });

        this.strokeRated.setAttributes({
            "offset": (ratingFraction * 100) + "%",
            "style": "stop-color:" + ratedStroke + ";stop-opacity:1;"
        });

        this.strokeNonRated.setAttributes({
            "offset": (ratingFraction * 100) + "%",
            "style": "stop-color:" + nonratedStroke + ";stop-opacity:1;"
        });
    }
}

class SVGContainer extends SVGElement {
    constructor(parentElement, height, width) {
        super("svg");
        this.getNode().setAttribute("xmlns", "https://www.w3.org/2000/svg");
        parentElement.appendChild(this.getNode());
        this.setAttributes({ height, width });
        [height, width] = this.getSize();
        this.height = height;
        this.width = width;
    }

    getSize() {
        let rect = this.getNode().getBoundingClientRect();
        return [rect.height, rect.width]
    }

    getDefinition() {
        return this._def;
    }

    addDefinition(def) {
        if (def instanceof Definition) {
            this.appendChild(def.defs);
            this._def = def;
        }
    }

    update(height, width) {
        if (this.setAttributes({ height, width })) {
            //[height, width] = this.getSize();
            this.height = height;
            this.width = width;
        }
        return [this.height, this.width]
    }
}

/**
  * StarRating Class is the main class which needs to be instantiate in order to use star raring.
*/
class StarRating {

    /**
    * Constructor of StarRating
    * Sets all predefined defaults and run all requred steps to instantiate StarRating
    * 
    * @param   {HTMLElement} parentElement
    *          parentElement is the html element where the svg for starrating reside
    * @param   {object} attribs
    *          attribs stores all user given attributes
    * 
    * @returns {object} starRating
    *          returns instance of StarRating class
    */
    constructor(parentElement, attribs) {
        //check if parentElement is a HTMLElement otherwise show and error and stop execution
        if (!(parentElement instanceof HTMLElement)) {
            console.error("A HTML Element must be provided in the first argument");
            return null;
        }

        this.elements = {};
        this.config = {};
        this._internalConfig = {};
        this.elements.parentElement = parentElement;

        //setting defaults
        this.config.height = 400;
        this.config.width = 400;
        this.config.TotalStars = 5; //N denotes number of stars
        this.config.rating = undefined;
        this.config.orientation = 'left-to-right';
        this.config.padding = 1;
        this.config.justifyContent = 'center';
        this.config.alignItems = 'center';
        this.config.strokeWidth = 0;
        this.config.ratedFill = "#ff0";
        this.config.nonratedFill = "#ddd";
        this.config.ratedStroke = "none";
        this.config.nonratedStroke = "none";
        /*
        The styleset object structure to handle
        {
            "rated": {
                "fill": "#ff0",
                "stroke": "none"
            },
            "nonrated": {
                "fill": "#ddd",
                "stroke": "none"
            }
        };
        */

        //usefull internally
        this._internalConfig.direction = 'row';
        this._internalConfig.flow = '';
        this.elements.svg = new SVGContainer(parentElement, this.config.height, this.config.width);
        this.elements.stars = [];

        if (attribs) {
            if (this._validateAndSet(attribs)) {
                this._internalConfig.requestedAnimationFrame = true;
                window.requestAnimationFrame(() => {
                    this._draw();
                });
            } else {
                this.elements.svg.removeNode();
                console.error("Stopping execution");
                return null;
            }
        } else {
            this._internalConfig.sideOut = Math.min(this._internalConfig.direction == 'row' ? this.config.width / this.config.TotalStars : this.config.width, this._internalConfig.direction == 'column' ? this.config.height / this.config.TotalStars : this.config.height);
            this._internalConfig.side = this._internalConfig.sideOut - this.config.padding * 2 - this.config.strokeWidth * 2;
            this._draw();
        }
    }


    /**
    * 
    * Validate and then set all required attributes
    * This function validates and decides whether StarRating should render user provided attributes
    * or default / previously set attributes. It also determines whether StarRating should stop execution
    * 
    * @private
    * 
    * @memberof StarRating
    * 
    * @param   {object} attribs
    *          attribs stores all user given attributes
    * 
    * @returns {boolean} shouldContinue
    *           shouldContinue holds the decision whether to stop execution or not
    *          
    */
    _validateAndSet(attribs) {
        let height = _pluckSize(attribs['height'], 'Height'),
            width = _pluckSize(attribs['width'], 'Width'),
            N = attribs['stars'],
            rating = attribs['rating'],
            orientation = attribs['orientation'],
            padding = _pluckSize(attribs['padding'], 'Padding'),
            strokeWidth = _pluckSize(attribs['stroke-width'], 'Stroke Width'),
            justifyContent = attribs['justify-content'],
            alignItems = attribs['align-items'],
            styles = {
                "rated": attribs['rated'],
                "nonrated": attribs['nonrated']
            };
        let validOrientation = ['left-to-right', 'right-to-left', 'top-to-bottom', 'bottom-to-top'],
            validJustifyContent = ['center', 'space-evenly', 'start', 'end'],
            validAlignItems = ['center', 'start', 'end'],
            shouldContinue = true,
            side, sideOut,
            direction,
            flow;

        //check height and width
        width = width.num ? width.num : this.config.width;
        height = height.num ? height.num : this.config.height;
        //[height, width] = this.elements.svg.update(height, width);

        if (width < 20) {
            console.error("Minimum width value is 20");
            width = this.config.width;
        }

        if (height < 20) {
            console.error("Minimum width value is 20");
            height = this.config.height;
        }

        //[height, width] = this.elements.svg.update(height, width);

        //check if number of stars => N is ok otherwise set the default value 5
        if (!+N) {
            N = this.config.TotalStars;
        }
        if (N <= 0) {
            console.error("No of stars must be greater than 0");
            shouldContinue = false;
        }
        //If N is fraction no issue because it used to limit loops only

        //check if rating is given as number otherwise set the default value 5
        if (!+rating && rating != 0) {
            rating = this.config.rating;
        }

        if (rating && (rating > N || rating < 0)) {
            console.error("Rating should be greater than 0 and less than No of stars");
            shouldContinue = false;
        }

        //justify content
        if (!validJustifyContent.includes(justifyContent)) {
            if (justifyContent) {
                console.error("Incorrect value for justify-content");
            }
            justifyContent = this.config.justifyContent;
        }

        //Align items
        if (!validAlignItems.includes(alignItems)) {
            if (alignItems) {
                console.error("Incorrect value for align-items");
            }
            alignItems = this.config.alignItems;
        }

        //orientation
        if (!validOrientation.includes(orientation)) {
            if (orientation) {
                console.error("Incorrect value for orientation");
            }
            orientation = this.config.orientation;
        }

        //internal variables to ease of control
        direction = (orientation == 'left-to-right' || orientation == 'right-to-left') ? 'row' : 'column';
        flow = (orientation == 'right-to-left' || orientation == 'bottom-to-top') ? 'reverse' : '';

        //assign padding
        if (!padding.num) {
            if (attribs['padding']) {
                console.error("Incorrect padding value");
            }
            padding = this.config.padding;
        } else {
            padding = padding.num;
        }

        if (padding < 1) {
            console.error("Incorrect padding.");
            padding = this.config.padding;
        }

        //assign stroke-width
        if (!strokeWidth.num) {
            if (attribs['stroke-width']) {
                console.error("Incorrect stroke width value");
            }
            strokeWidth = this.config.strokeWidth;
        } else {
            strokeWidth = strokeWidth.num;
        }


        //validatind and adding styles
        if (!styles['rated']) {
            styles['rated'] = {};
        }
        if (!styles['nonrated']) {
            styles['nonrated'] = {};
        }

        styles['rated']['fill'] = _validateColorCode(styles['rated']['fill']) ? styles['rated']['fill'] : this.config.ratedFill;
        styles['rated']['stroke'] = _validateColorCode(styles['rated']['stroke']) ? styles['rated']['stroke'] : this.config.ratedStroke;

        styles['nonrated']['fill'] = _validateColorCode(styles['nonrated']['fill']) ? styles['nonrated']['fill'] : this.config.nonratedFill;
        styles['nonrated']['stroke'] = _validateColorCode(styles['nonrated']['stroke']) ? styles['nonrated']['stroke'] : this.config.nonratedStroke;

        //Do calculation to check managable conditions
        if (shouldContinue) {
            sideOut = Math.min(direction == 'row' ? width / N : width, direction == 'column' ? height / N : height);
            if (strokeWidth < 0 || strokeWidth > 0.10 * sideOut) {
                console.error("Incorrect stroke-width");
                strokeWidth = this.config.strokeWidth;
            }
            if (padding < 1 || padding > 0.10 * sideOut) {
                console.error("Incorrect padding");
                padding = this.config.padding;
            }
            side = sideOut - (padding * 2) - (strokeWidth * 2);
            //console.log(sideOut, side, padding, strokeWidth);
            if (sideOut < 16) {
                console.error("Could not acomodate so many stars. Reduce no of stars");
                shouldContinue = false;
            }
            if (side < 10) {
                if (padding > 2) {
                    console.error("Decrease padding.");
                    padding = this.config.padding;
                    side = sideOut - padding * 2 - strokeWidth * 2;
                } else if (strokeWidth > (0.10 * sideOut)) {
                    console.error("Decrease stroke-width.");
                    strokeWidth = this.config.strokeWidth;
                    side = sideOut - (padding * 2) - (strokeWidth * 2);
                }
            }

            //If still side is less than 10 set padding and stroke-width to 2 and 0
            //console.log(side);
            if (side < 10 && padding > 2) {
                console.warn("Automatically setting padding to default");
                padding = 2;
                side = sideOut - (padding * 2) - (strokeWidth * 2);
            }
            if (side < 10 && strokeWidth > 0) {
                console.warn("Automatically setting stroke-width to 0");
                strokeWidth = 0;
                side = sideOut - (padding * 2) - (strokeWidth * 2);
            }

            //If still side is less than 10 non-managable
            if (side < 10) {
                console.error("Non managable error. Try with different values");
                shouldContinue = false;
            }
        }

        //check if it is non-managable condition
        if (shouldContinue) {
            this.config.height = height;
            this.config.width = width;
            this.config.orientation = orientation;
            this.config.padding = padding;
            this.config.rating = rating;
            this.config.TotalStars = N;
            this.config.ratedFill = styles['rated']['fill'];
            this.config.ratedStroke = styles['rated']['stroke'];
            this.config.nonratedFill = styles['nonrated']['fill'];
            this.config.nonratedStroke = styles['nonrated']['stroke'];
            this.config.strokeWidth = strokeWidth;

            //Show a warning if stroke width is given but stroke-color is None as stroke is none show not visible
            if (this.config.strokeWidth > 0) {
                if (this.config.ratedStroke == 'none') {
                    console.warn("Provide stroke color along with stroke-width otherwise stroke not visible. setting rated stroke color as black");
                    this.config.ratedStroke = '#000';
                }
                if (this.config.nonratedStroke == 'none') {
                    console.warn("Provide stroke color along with stroke-width otherwise stroke not visible. setting nonrated stroke color as black");
                    this.config.nonratedStroke = '#000';
                }
            }

            this.config.justifyContent = justifyContent;
            this.config.alignItems = alignItems;
            this._internalConfig.side = side;
            this._internalConfig.sideOut = sideOut;
            //extracted direction and flow from orientation
            this._internalConfig.direction = direction;
            this._internalConfig.flow = flow;
        } 
        // else {
        //     this.elements.svg.update(this.config.height, this.config.width);
        // }
        return shouldContinue;
    }

    /**
    * 
    * Draw the stars with all the attributes
    * 
    * @private
    * 
    * @memberof StarRating
    *          
    */
    _draw() {
        this._internalConfig.requestedAnimationFrame = false;
        let i, j, baseY = 0, baseX = 0, xShift = 0, yShift = 0,
            rating = !this.config.rating && this.config.rating != 0 ? this.config.TotalStars : this.config.rating,
            currentStars = this.elements.stars.length,
            relativePath = _getPathString(this._internalConfig.side);

        //update svg height and width
        this.elements.svg.update(this.config.height, this.config.width);
        //remove def if exist
        let defs = this.elements.svg.getDefinition();

        if (_isFraction(rating)) {
            //this._createGradientDefinitions(defs);
            if (!defs) {
                defs = new Definition(this.elements.svg);
            }
            defs.update(rating, this.config.ratedFill, this.config.nonratedFill, this.config.ratedStroke, this.config.nonratedStroke, this._internalConfig.direction, this._internalConfig.flow);
        }

        if (this._internalConfig.direction == 'row') {
            xShift = this._internalConfig.sideOut;
            if (this.config.justifyContent == 'start') {
                baseX = (this._internalConfig.sideOut / 2);
            } else if (this.config.justifyContent == 'center') {
                baseX = (this._internalConfig.sideOut / 2) + ((this.config.width - (this._internalConfig.sideOut * this.config.TotalStars)) / 2);
            } else if (this.config.justifyContent == 'end') {
                baseX = (this.config.width - (this._internalConfig.sideOut * this.config.TotalStars)) + (this._internalConfig.sideOut / 2);
            } else if (this.config.justifyContent == 'space-evenly') {
                xShift = this.config.width / this.config.TotalStars;
                baseX = xShift / 2;
                //console.log('space-evenly');
            }
            if (this.config.alignItems == 'center') {
                baseY = ((this._internalConfig.sideOut - this._internalConfig.side) / 2) + ((this.config.height - this._internalConfig.sideOut) / 2);
            } else if (this.config.alignItems == 'start') {
                baseY = ((this._internalConfig.sideOut - this._internalConfig.side) / 2);
            } else if (this.config.alignItems == 'end') {
                baseY = (this.config.height - this._internalConfig.sideOut);
            }
        } else if (this._internalConfig.direction == 'column') {
            yShift = this._internalConfig.sideOut;
            if (this.config.justifyContent == 'start') {
                baseY = (this._internalConfig.sideOut - this._internalConfig.side) / 2;
            } else if (this.config.justifyContent == 'center') {
                baseY = ((this._internalConfig.sideOut - this._internalConfig.side) / 2);
            } else if (this.config.justifyContent == 'end') {
                baseY = (this.config.height - (this._internalConfig.sideOut * this.config.TotalStars));
            } else if (this.config.justifyContent == 'space-evenly') {
                yShift = this.config.height / this.config.TotalStars;
                baseY = (yShift - this._internalConfig.side) / 2;
            }

            //console.log(this.alignItems);
            if (this.config.alignItems == 'center') {
                baseX = (this._internalConfig.sideOut / 2) + ((this.config.width - this._internalConfig.sideOut) / 2);
            } else if (this.config.alignItems == 'start') {
                baseX = this._internalConfig.sideOut / 2;
            } else if (this.config.alignItems == 'end') {
                baseX = this.config.width - (this._internalConfig.sideOut / 2);
            }
        }

        for (i = 0; i < Math.max(currentStars, this.config.TotalStars); i++) {
            j = this._internalConfig.flow == 'reverse' ? this.config.TotalStars - i - 1 : i;
            if (i >= currentStars) {
                let star = new SVGElement("path");
                this.elements.stars.push(star);
                this.elements.svg.appendChild(star);
            } else if (i >= this.config.TotalStars) {
                this.elements.stars.pop().removeNode();
            }
            if (i < this.config.TotalStars) {
                if (_isFraction(rating) && Math.ceil(rating) == j + 1) {
                    this.elements.stars[i].setAttributes({
                        "fill": "url(#partial-fill)",
                        "stroke": "url(#partial-stroke)",
                        "stroke-width": this.config.strokeWidth + "px",
                        "d": 'M' + (baseX + (xShift * i)) + ',' + (baseY + (yShift * i)) + ' ' + relativePath
                    });
                } else {
                    this.elements.stars[i].setAttributes({
                        "fill": j < Math.ceil(rating) ? this.config.ratedFill : this.config.nonratedFill,
                        "stroke": j < Math.ceil(rating) ? this.config.ratedStroke : this.config.nonratedStroke,
                        "stroke-width": this.config.strokeWidth + "px",
                        "d": 'M' + (baseX + (xShift * i)) + ',' + (baseY + (yShift * i)) + ' ' + relativePath
                    });
                }
            }
        }
        if(typeof this.onDraw === 'function'){
            this.onDraw();
        }else if(this.onDraw){
            console.error('onDraw must be a function');
        }
    }

    /**
    * 
    * Update star rating with all changed attributes
    * 
    * 
    * @memberof StarRating
    * 
    * @param   {object} attribs
    *          attribs stores all user given attributes
    *          
    */
    update(attribs) {
        if (attribs) {
            if (this._validateAndSet(attribs)) {
                if(!this._internalConfig.requestedAnimationFrame){
                    window.requestAnimationFrame(() => {
                        this._draw();
                    });
                    this._internalConfig.requestedAnimationFrame = true;
                }
            } else {
                console.error("Stopping execution");
                return null;
            }
        }
        if(typeof this.onUpdate === 'function'){
            this.onUpdate(this.config);
        }else if(this.onUpdate){
            console.error('onUpdate must be a function');
        }
    }
}

export default StarRating;

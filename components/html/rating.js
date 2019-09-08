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
    let num = (size + '').match(/\d+/g),
        unit = (size + '').match(/px|%|vh|vw/g) || [''];
    if (!num || ((size + '').trim().startsWith('-'))) {
        if (size) {
            console.error("Error in size value " + str);
        }
        return {
            num: null,
            unit: ''
        };
    }

    return {
        num: +num[0],
        unit: unit[0]
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
function _getPathString(side, X, Y) {
    let str = "M" + X + "," + Y,
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
    str += " l" + (ax * side) + "," + (ay * side);
    str += " h" + (bx * side);
    str += " l-" + (cx * side) + "," + (by * side);
    str += " l" + (cx * side) + "," + (cy * side);
    str += " l-" + (dx * side) + ",-" + (dy * side);
    str += " l-" + (dx * side) + "," + (dy * side);
    str += " l" + (cx * side) + ",-" + (cy * side);
    str += " l-" + (cx * side) + ",-" + (by * side);
    str += " h" + (bx * side);
    str += " z";
    return str;
}

class SVGElement {
    constructor(tag) {
        this.elem = document.createElementNS("http://www.w3.org/2000/svg", tag);
        this.attrs = {};
    }

    getSize() {
        return [this.elem.clientHeight, this.elem.clientWidth]
    }

    getElement() {
        return this.elem;
    }

    removeElement() {
        this.elem.parentNode.removeChild(this.elem);
    }

    getAttributes() {
        return this.attrs;
    }

    appendChild(child) {
        if (child instanceof Node) {
            this.elem.appendChild(child);
        } else if (child instanceof SVGElement) {
            this.elem.appendChild(child.getElement());
        } else {
            console.error("Child must be Node or SVGElement");
        }
    }

    removeChild(child) {
        if (child instanceof Node) {
            this.elem.removeChild(child);
        } else if (child instanceof SVGElement) {
            this.elem.removeChild(child.getElement());
        } else {
            console.error("Child must be Node or SVGElement");
        }
    }

    setAttributes(attrs) {
        let hasChange = false;
        for (let attrName in attrs) {
            if (this.attrs[attrName] !== attrs[attrName]) {
                this.elem.setAttribute(attrName, attrs[attrName]);
                this.attrs[attrName] = attrs[attrName];
                hasChange = true;
            }
        }
        return hasChange;
    }
}

class Definition extends SVGElement {
    constructor() {
        super("defs");
        this.linearGradient = new SVGElement("linearGradient"),
        this.strokeLinearGradient = new SVGElement("linearGradient"),
        this.RatedStart = new SVGElement("stop"),
        this.RatedEnd = new SVGElement("stop"),
        this.NonRatedStart = new SVGElement("stop"),
        this.NonRatedEnd = new SVGElement("stop"),
        this.strokeRatedStart = new SVGElement("stop"),
        this.strokeRatedEnd = new SVGElement("stop"),
        this.strokeNonRatedStart = new SVGElement("stop"),
        this.strokeNonRatedEnd = new SVGElement("stop");

        this.linearGradient.appendChild(this.RatedStart);
        this.linearGradient.appendChild(this.RatedEnd);
        this.linearGradient.appendChild(this.NonRatedStart);
        this.linearGradient.appendChild(this.NonRatedEnd);

        this.strokeLinearGradient.appendChild(this.strokeRatedStart);
        this.strokeLinearGradient.appendChild(this.strokeRatedEnd);
        this.strokeLinearGradient.appendChild(this.strokeNonRatedStart);
        this.strokeLinearGradient.appendChild(this.strokeNonRatedEnd);

        this.appendChild(this.linearGradient);
        this.appendChild(this.strokeLinearGradient);
    }
}

class SVGContainer extends SVGElement {
    constructor(parentElement, height, width) {
        super("svg");
        parentElement.appendChild(this.elem);
        this.setAttributes({ height, width });
        [height, width] = this.getSize();
        this.height = height;
        this.width = width;
    }

    getDefinition() {
        return this.def;
    }

    addDefinition(def) {
        if (def instanceof Definition) {
            this.appendChild(def);
            this.def = def;
        }
    }

    update(height, width) {
        if (this.setAttributes({ height, width })) {
            [height, width] = this.getSize();
            this.height = height;
            this.width = width;
        }
        return [this.height, this.width]
    }
}

class Star extends SVGElement {
    constructor(side, X, Y) {
        super("path");
        this.setAttributes({ d: _getPathString(side, X, Y) });
        this.side = side;
        this.X = X;
        this.Y = Y;
    }

    update(side, X, Y) {
        return this.setAttributes({ d: _getPathString(side, X, Y) });
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
        this.parentElement = parentElement;

        //setting defaults
        this.height = 400;
        this.width = 400;
        this.TotalStars = 5; //N denotes number of stars
        this.rating = undefined;
        this.orientation = 'left-to-right';
        this.padding = 1;
        this.justifyContent = 'center';
        this.alignItems = 'center';
        this.strokeWidth = 0;
        this.ratedFill = "#ff0";
        this.nonratedFill = "#ddd";
        this.ratedStroke = "none";
        this.nonratedStroke = "none";
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
        this.direction = 'row';
        this.flow = '';
        this.svg = new SVGContainer(parentElement, this.height, this.width);
        this.stars = [];

        if (attribs) {
            if (this._validateAndSet(attribs)) {
                this._draw();
            } else {
                this.svg.removeElement();
                console.error("Stopping execution");
                return null;
            }
        } else {
            this.sideOut = Math.min(this.direction == 'row' ? this.width / this.TotalStars : this.width, this.direction == 'column' ? this.height / this.TotalStars : this.height);
            this.side = this.sideOut - this.padding * 2 - this.strokeWidth * 2;
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
        width = width.num ? width.num + width.unit : this.width;
        height = height.num ? height.num + height.unit : this.height;
        [height, width] = this.svg.update(height, width);

        if (width < 20) {
            console.error("Minimum width value is 20");
            width = this.width;
        }

        if (height < 20) {
            console.error("Minimum width value is 20");
            height = this.height;
        }

        [height, width] = this.svg.update(height, width);

        //check if number of stars => N is ok otherwise set the default value 5
        if (!+N) {
            N = this.TotalStars;
        }
        if (N <= 0) {
            console.error("No of stars must be greater than 0");
            shouldContinue = false;
        }
        //If N is fraction no issue because it used to limit loops only

        //check if rating is given as number otherwise set the default value 5
        if (!+rating && rating != 0) {
            rating = this.rating;
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
            justifyContent = this.justifyContent;
        }

        //Align items
        if (!validAlignItems.includes(alignItems)) {
            if (alignItems) {
                console.error("Incorrect value for align-items");
            }
            alignItems = this.alignItems;
        }

        //orientation
        if (!validOrientation.includes(orientation)) {
            if (orientation) {
                console.error("Incorrect value for orientation");
            }
            orientation = this.orientation;
        }

        //internal variables to ease of control
        direction = (orientation == 'left-to-right' || orientation == 'right-to-left') ? 'row' : 'column';
        flow = (orientation == 'right-to-left' || orientation == 'bottom-to-top') ? 'reverse' : '';

        //assign padding
        if (padding.unit == 'px' || padding.unit == '') {
            if (!padding.num) {
                if (attribs['padding']) {
                    console.error("Incorrect padding value");
                }
                padding = this.padding;
            } else {
                padding = padding.num;
            }
        } else {
            console.error("Paddding value allowed only as number or pixels");
        }
        if (padding < 1) {
            console.error("Incorrect padding.");
            padding = this.padding;
        }

        //assign stroke-width
        if (strokeWidth.unit == 'px' || strokeWidth.unit == '') {
            if (!strokeWidth.num) {
                if (attribs['stroke-width']) {
                    console.error("Incorrect stroke width value");
                }
                strokeWidth = this.strokeWidth;
            } else {
                strokeWidth = strokeWidth.num;
            }
        } else {
            console.error("Stroke width value allowed only as number or pixels");
        }

        //validatind and adding styles
        if (!styles['rated']) {
            styles['rated'] = {};
        }
        if (!styles['nonrated']) {
            styles['nonrated'] = {};
        }

        styles['rated']['fill'] = _validateColorCode(styles['rated']['fill']) ? styles['rated']['fill'] : this.ratedFill;
        styles['rated']['stroke'] = _validateColorCode(styles['rated']['stroke']) ? styles['rated']['stroke'] : this.ratedStroke;

        styles['nonrated']['fill'] = _validateColorCode(styles['nonrated']['fill']) ? styles['nonrated']['fill'] : this.nonratedFill;
        styles['nonrated']['stroke'] = _validateColorCode(styles['nonrated']['stroke']) ? styles['nonrated']['stroke'] : this.nonratedStroke;

        //Do calculation to check managable conditions
        if (shouldContinue) {
            sideOut = Math.min(direction == 'row' ? width / N : width, direction == 'column' ? height / N : height);
            if (strokeWidth < 0 || strokeWidth > 0.10 * sideOut) {
                console.error("Incorrect stroke-width");
                strokeWidth = this.strokeWidth;
            }
            if (padding < 1 || padding > 0.10 * sideOut) {
                console.error("Incorrect padding");
                padding = this.padding;
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
                    padding = this.padding;
                    side = sideOut - padding * 2 - strokeWidth * 2;
                } else if (strokeWidth > (0.10 * sideOut)) {
                    console.error("Decrease stroke-width.");
                    strokeWidth = this.strokeWidth;
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
            this.height = height;
            this.width = width;
            this.orientation = orientation;
            this.padding = padding;
            this.rating = rating;
            this.TotalStars = N;
            this.ratedFill = styles['rated']['fill'];
            this.ratedStroke = styles['rated']['stroke'];
            this.nonratedFill = styles['nonrated']['fill'];
            this.nonratedStroke = styles['nonrated']['stroke'];
            this.side = side;
            this.sideOut = sideOut;
            this.strokeWidth = strokeWidth;

            //Show a warning if stroke width is given but stroke-color is None as stroke is none show not visible
            if (this.strokeWidth > 0) {
                if (this.ratedStroke == 'none') {
                    console.warn("Provide stroke color along with stroke-width otherwise stroke not visible. setting rated stroke color as black");
                    this.ratedStroke = '#000';
                }
                if (this.nonratedStroke == 'none') {
                    console.warn("Provide stroke color along with stroke-width otherwise stroke not visible. setting nonrated stroke color as black");
                    this.nonratedStroke = '#000';
                }
            }

            this.justifyContent = justifyContent;
            this.alignItems = alignItems;
            //extract direction and flow from orientation
            this.direction = direction;
            this.flow = flow;
        } else {
            this.svg.update(this.height, this.width);
        }
        return shouldContinue;
    }


    /**
    * 
    * Generates linear gradient in svg definitions 
    * This function is used for partial color filling for fractional rating 
    * 
    * @private
    * 
    * @memberof StarRating
    *          
    */
    _createGradientDefinitions(defs) {
        let startFill = this.ratedFill, endFill = this.nonratedFill, startStroke = this.ratedStroke, endStroke = this.nonratedStroke,
            ratingFraction = this.rating ? (this.rating - Math.floor(this.rating)).toFixed(2) : 0
            ;

        if(!defs){
            defs = new Definition();
        }

        defs.linearGradient.setAttributes({
            "id": "partial-fill",
            "x1": "0%",
            "x2": this.direction == 'row' ? "100%" : "0%",
            "y1": "0%",
            "y2": this.direction == 'column' ? "100%" : "0%"
        });

        defs.strokeLinearGradient.setAttributes({
            "id": "partial-stroke",
            "x1": "0%",
            "x2": this.direction == 'row' ? "100%" : 0,
            "y1": "0%",
            "y2": this.direction == 'column' ? "100%" : 0
        });

        if (this.flow == 'reverse') {
            startFill = this.nonratedFill;
            endFill = this.ratedFill;
            startStroke = this.nonratedStroke;
            endStroke = this.ratedStroke;
        }

        defs.RatedStart.setAttributes({
            "offset": "0%",
            "style": "stop-color:" + startFill + ";stop-opacity:1;"
        });
        defs.RatedEnd.setAttributes({
            "offset": (ratingFraction * 100) + "%",
            "style": "stop-color:" + startFill + ";stop-opacity:1;"
        });

        defs.NonRatedStart.setAttributes({
            "offset": (ratingFraction * 100) + "%",
            "style": "stop-color:" + endFill + ";stop-opacity:1;"
        });

        defs.NonRatedEnd.setAttributes({
            "offset": "100%",
            "style": "stop-color:" + endFill + ";stop-opacity:1;"
        });

        defs.strokeRatedStart.setAttributes({
            "offset": "0%",
            "style": "stop-color:" + startStroke + ";stop-opacity:1;"
        });

        defs.strokeRatedEnd.setAttributes({
            "offset": (ratingFraction * 100) + "%",
            "style": "stop-color:" + startStroke + ";stop-opacity:1;"
        });

        defs.strokeNonRatedStart.setAttributes({
            "offset": (ratingFraction * 100) + "%",
            "style": "stop-color:" + endStroke + ";stop-opacity:1;"
        });

        defs.strokeNonRatedEnd.setAttributes({
            "offset": "100%",
            "style": "stop-color:" + endStroke + ";stop-opacity:1;"
        });

        this.svg.addDefinition(defs);
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
        let i, j, baseY = 0, baseX = 0, xShift = 0, yShift = 0,
            rating = !this.rating && this.rating != 0 ? this.TotalStars : this.rating,
            currentStars = this.stars.length; //to handle 0 check

        //remove def if exist
        let defs = this.svg.getDefinition();
        
        if (_isFraction(rating)) {
            this._createGradientDefinitions(defs);
        }else if(defs){
            defs.removeElement();
            delete this.svg.defs;
        }

        if (this.direction == 'row') {
            xShift = this.sideOut;
            if (this.justifyContent == 'start') {
                baseX = (this.sideOut / 2);
            } else if (this.justifyContent == 'center') {
                baseX = (this.sideOut / 2) + ((this.width - (this.sideOut * this.TotalStars)) / 2);
            } else if (this.justifyContent == 'end') {
                baseX = (this.width - (this.sideOut * this.TotalStars)) + (this.sideOut / 2);
            } else if (this.justifyContent == 'space-evenly') {
                xShift = this.width / this.TotalStars;
                baseX = xShift / 2;
                //console.log('space-evenly');
            }
            if (this.alignItems == 'center') {
                baseY = ((this.sideOut - this.side) / 2) + ((this.height - this.sideOut) / 2);
            } else if (this.alignItems == 'start') {
                baseY = ((this.sideOut - this.side) / 2);
            } else if (this.alignItems == 'end') {
                baseY = (this.height - this.sideOut);
            }
        } else if (this.direction == 'column') {
            yShift = this.sideOut;
            if (this.justifyContent == 'start') {
                baseY = (this.sideOut - this.side) / 2;
            } else if (this.justifyContent == 'center') {
                baseY = ((this.sideOut - this.side) / 2);
            } else if (this.justifyContent == 'end') {
                baseY = (this.height - (this.sideOut * this.TotalStars));
            } else if (this.justifyContent == 'space-evenly') {
                yShift = this.height / this.TotalStars;
                baseY = (yShift - this.side) / 2;
            }

            //console.log(this.alignItems);
            if (this.alignItems == 'center') {
                baseX = (this.sideOut / 2) + ((this.width - this.sideOut) / 2);
            } else if (this.alignItems == 'start') {
                baseX = this.sideOut / 2;
            } else if (this.alignItems == 'end') {
                baseX = this.width - (this.sideOut / 2);
            }
        }

        for (i = 0; i < Math.max(currentStars, this.TotalStars); i++) {
            j = this.flow == 'reverse' ? this.TotalStars - i - 1 : i;
            if (i >= currentStars) {
                this.stars.push(new Star(this.side, baseX + (xShift * i), baseY + (yShift * i)));
                this.svg.appendChild(this.stars[i]);
            } else if (i >= this.TotalStars) {
                this.stars.pop().removeElement();
            }
            if (i < this.TotalStars) {
                if (_isFraction(rating) && Math.ceil(rating) == j + 1) {
                    this.stars[i].setAttributes({
                        "fill": "url(#partial-fill)",
                        "stroke": "url(#partial-stroke)",
                        "stroke-width": this.strokeWidth + "px",
                        "d": _getPathString(this.side, baseX + (xShift * i), baseY + (yShift * i))
                    });
                } else {
                    this.stars[i].setAttributes({
                        "fill": j < Math.ceil(rating) ? this.ratedFill : this.nonratedFill,
                        "stroke": j < Math.ceil(rating) ? this.ratedStroke : this.nonratedStroke,
                        "stroke-width": this.strokeWidth + "px",
                        "d": _getPathString(this.side, baseX + (xShift * i), baseY + (yShift * i))
                    });
                }
            }
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
                this._draw();
            } else {
                console.error("Stopping execution");
                return null;
            }
        }
    }
}

export default StarRating;
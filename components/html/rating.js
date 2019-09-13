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
    if (!size) {
        console.error("Error in size value " + str + ": " + size);
        return null;
    }
    size += '';
    str = str ? 'of ' + str : '';
    //regex match reduces tests upto 80k
    let l = (size + '').length, unit = size.slice(-2);
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
    if (unit === 'px') {
        return +size.slice(l - 2);
    } else if (+unit !== NaN) {
        return +size;
    }
    return null;
}

function _pluckNumber(num, precision = 0) {
    if (num) {
        if (!+num && +num !== 0) {
            console.error("Incorrect value: " + num);
        } else {
            return (+num).toFixed(precision);
        }
    }
    return null;
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
    //Need optimization
    if (color.startsWith('#')) {
        if (isNaN(parseInt(color.slice(1), 16)) || (color.length !== 4 && color.length !== 7)) {
            console.error("Incorrect hex color code");
            return false;
        }
    } else if (color.startsWith('rgb(')) {
        if (!color.replace(/\s/g, '').match(/^rgb\((\d+),(\d+),(\d+)\)$/g)) {
            console.error("Incorrect rgb color code");
            return false;
        }
    }
    return color;
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
        this._config = {};
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
        if (ratingFraction === this._config.ratingFraction && this._config.ratedFill === ratedFill && this._config.nonratedFill === nonratedFill && this._config.ratedStroke === ratedStroke && this._config.direction === direction && this._config.flow === flow) {
            return;
        } else {
            this._config.ratingFraction = ratingFraction;
            this._config.ratedFill = ratedFill;
            this._config.nonratedFill = nonratedFill;
            this._config.ratedStroke = ratedStroke;
            this._config.direction = direction;
            this._config.flow = flow;
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

        this._elements = {};
        this._config = {};
        this._internalConfig = {};
        this._onDraw = {};
        this._drawnState = {};
        this._onDefinition = [];
        this._elements.parentElement = parentElement;

        //setting defaults
        this._config.height = 400;
        this._config.width = 400;
        this._config.TotalStars = 5; //N denotes number of stars
        this._config.rating = undefined;
        this._config.orientation = 'left-to-right';
        this._config.padding = 1;
        this._config.justifyContent = 'center';
        this._config.alignItems = 'center';
        this._config.strokeWidth = 0;
        this._config.ratedFill = "#ff0";
        this._config.nonratedFill = "#ddd";
        this._config.ratedStroke = "none";
        this._config.nonratedStroke = "none";
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
        this._elements.svg = new SVGContainer(parentElement, this._config.height, this._config.width);
        this._elements.stars = [];

        if (attribs) {
            if (this._validateAndSet(attribs)) {
                this._calculateSide(this._config.padding, this._config.strokeWidth);
                this._calculateBaseShift();
                this._internalConfig.requestedAnimationFrame = true;
                window.requestAnimationFrame(() => {
                    this._draw();
                });
            } else {
                this._elements.svg.removeNode();
                console.error("Stopping execution");
                return null;
            }
        } else {
            this._internalConfig.sideOut = Math.min(this._internalConfig.direction == 'row' ? this._config.width / this._config.TotalStars : this._config.width, this._internalConfig.direction == 'column' ? this._config.height / this._config.TotalStars : this._config.height);
            this._internalConfig.side = this._internalConfig.sideOut - this._config.padding * 2 - this._config.strokeWidth * 2;
            this._internalConfig.requestedAnimationFrame = true;
            window.requestAnimationFrame(() => {
                this._draw();
            });
        }
    }

    _calculateSide(padding, strokeWidth){
        let side, sideOut;
        sideOut = this._internalConfig.direction === 'row' ? this._config.width / this._config.TotalStars : this._config.width;
            side = this._internalConfig.direction === 'column' ? this._config.height / this._config.TotalStars : this._config.height;
            sideOut = side < sideOut ? side : sideOut;

            if (strokeWidth !== undefined) {
                if (strokeWidth < 0 || strokeWidth > 0.10 * sideOut) {
                    console.error("Incorrect strokeWidth setting to default");
                } else {
                    this._config.strokeWidth = strokeWidth;
                }
            }

            if (padding !== undefined) {
                if (padding < 1 || padding > 0.10 * sideOut) {
                    console.error("Incorrect padding setting to default");
                } else {
                    this._config.padding = 1;
                }
            }

            side = sideOut - (this._config.padding * 2) - (this._config.strokeWidth * 2);

            if (side < 10) {
                return false;
            }

            if (side !== this._internalConfig.side || sideOut !== this._internalConfig.sideOut) {
                this._internalConfig.side = side;
                this._internalConfig.sideOut = sideOut;
                this._onDraw['_calculateBaseShift'] = true;
                this._onDraw['_getRelativePath'] = true;
            }
    }

    _calculateBaseShift(){
        let xShift = 0, yShift = 0, baseX = 0, baseY = 0;
        if (this._onDraw._calculateBaseShift) {
            if (this._internalConfig.direction == 'row') {
                xShift = this._internalConfig.sideOut;
                if (this._config.justifyContent == 'start') {
                    baseX = (this._internalConfig.sideOut / 2);
                } else if (this._config.justifyContent == 'center') {
                    baseX = (this._internalConfig.sideOut / 2) + ((this._config.width - (this._internalConfig.sideOut * this._config.TotalStars)) / 2);
                } else if (this._config.justifyContent == 'end') {
                    baseX = (this._config.width - (this._internalConfig.sideOut * this._config.TotalStars)) + (this._internalConfig.sideOut / 2);
                } else if (this._config.justifyContent == 'space-evenly') {
                    xShift = this._config.width / this._config.TotalStars;
                    baseX = xShift / 2;
                }
                if (this._config.alignItems == 'center') {
                    baseY = ((this._internalConfig.sideOut - this._internalConfig.side) / 2) + ((this._config.height - this._internalConfig.sideOut) / 2);
                } else if (this._config.alignItems == 'start') {
                    baseY = ((this._internalConfig.sideOut - this._internalConfig.side) / 2);
                } else if (this._config.alignItems == 'end') {
                    baseY = (this._config.height - this._internalConfig.sideOut);
                }
            } else if (this._internalConfig.direction == 'column') {
                yShift = this._internalConfig.sideOut;
                if (this._config.justifyContent == 'start') {
                    baseY = (this._internalConfig.sideOut - this._internalConfig.side) / 2;
                } else if (this._config.justifyContent == 'center') {
                    baseY = ((this._internalConfig.sideOut - this._internalConfig.side) / 2);
                } else if (this._config.justifyContent == 'end') {
                    baseY = (this._config.height - (this._internalConfig.sideOut * this._config.TotalStars));
                } else if (this._config.justifyContent == 'space-evenly') {
                    yShift = this._config.height / this._config.TotalStars;
                    baseY = (yShift - this._internalConfig.side) / 2;
                }

                //console.log(this.alignItems);
                if (this._config.alignItems == 'center') {
                    baseX = (this._internalConfig.sideOut / 2) + ((this._config.width - this._internalConfig.sideOut) / 2);
                } else if (this._config.alignItems == 'start') {
                    baseX = this._internalConfig.sideOut / 2;
                } else if (this._config.alignItems == 'end') {
                    baseX = this._config.width - (this._internalConfig.sideOut / 2);
                }
            }
            if (this._internalConfig.baseX !== baseX) {
                this._internalConfig.baseX = baseX;
            }

            if (this._internalConfig.baseY !== baseY) {
                this._internalConfig.baseY = baseY;
            }

            if (this._internalConfig.xShift !== xShift) {
                this._internalConfig.xShift = xShift;
            }

            if (this._internalConfig.yShift !== yShift) {
                this._internalConfig.yShift = yShift;
            }
            this._onDraw['_reassignPath'] = true;
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
        let correctValue, onValidate = {}, side, sideOut, strokeWidth, padding;
        if (attribs.orientation !== undefined) {
            if (['left-to-right', 'right-to-left', 'top-to-bottom', 'bottom-to-top'].includes(attribs.orientation) && correctValue !== this._config.orientation) {
                this._config.orientation = attribs.orientation;
                onValidate["_calculateSide"] = true;
                attribs.direction = (attribs.orientation === 'top-to-bottom' || attribs.orientation === 'bottom-to-top') ? 'column' : 'row';
                if (this._internalConfig.direction !== attribs.direction) {
                    this._internalConfig.direction = direction;
                    onValidate["_calculateSide"] = true;
                }
                this._internalConfig.flow = (attribs.orientation === 'left-to-right' || attribs.orientation === 'top-to-bottom') ? '' : 'reverse';
            }
        }

        if (attribs.height !== undefined) {
            correctValue = _pluckSize(attribs.height);
            if (correctValue && correctValue > 20 && correctValue !== this._config.height) {
                this._config.height = correctValue;
                onValidate["_calculateSide"] = true;
                this._onDraw["_setSVGStyle"] = true;
            }
        }

        if (attribs.width !== undefined) {
            correctValue = _pluckSize(attribs.width);
            if (correctValue && correctValue > 20 && correctValue !== this._config.width) {
                this._config.width = correctValue;
                onValidate["_calculateSide"] = true;
                this._onDraw["_setSVGStyle"] = true;
            }
        }

        if (attribs.stars !== undefined) {
            correctValue = +attribs.stars;
            if (correctValue > 0 && correctValue !== this._config.TotalStars) {
                this._config.TotalStars = correctValue;
                onValidate['_calculateSide'] = true;
            } else if (!correctValue) {
                console.error("Incorrect value for stars: " + attribs.stars);
            }
        }

        if (attribs.padding !== undefined) {
            correctValue = _pluckSize(attribs.padding);
            if (correctValue && correctValue > 20 && correctValue !== this._config.padding) {
                padding = correctValue;
                onValidate["_calculateSide"] = true;
            }
        }

        if (attribs.strokeWidth !== undefined) {
            correctValue = _pluckSize(attribs.strokeWidth);
            if (correctValue && correctValue > 20 && correctValue !== this._config.strokeWidth) {
                strokeWidth = correctValue;
                onValidate["_calculateSide"] = true;
                this._onDraw['_updateStarStyle'] = true;
            }
        }

        if (attribs.rating !== undefined) {
            correctValue = +attribs.rating; //using toFixed reduces performance so do it later
            if (correctValue >= 0 && correctValue <= this._config.TotalStars && correctValue !== this._config.rating) {
                this._config.rating = correctValue;
                this._onDraw['_setDefinition'] = true;
            } else if (!correctValue) {
                console.log('Incorrect rating value: ' + attribs.rating);
            }
        }

        if (attribs.justifyContent !== undefined) {
            if (['start', 'end', 'center', 'space-evenly'].includes(attribs.justifyContent) && attribs.justifyContent !== this._config.justifyContent) {
                this._config.justifyContent = attribs.justifyContent;
                this._onDraw['_calculateBaseShift'] = true;
            }
        }

        if (attribs.alignItems !== undefined) {
            if (['start', 'end', 'center'].includes(attribs.alignItems) && attribs.alignItems !== this._config.alignItems) {
                this._config.alignItems = attribs.alignItems;
                this._onDraw['_calculateBaseShift'] = true;
            }
        }

        if (attribs.ratedFill !== undefined) {
            correctValue = _validateColorCode(attribs.ratedFill);
            if (correctValue && correctValue !== this._config.ratedFill) {
                this._config.ratedFill = correctValue;
                this._onDraw['_updateStarStyle'] = true;
                this._onDraw['_updateDefinitionFill'] = true;
            } else if (!correctValue) {
                console.error('Incorrect color for ratedFill: ' + attribs.ratedFill);
            }
        }


        if (attribs.nonratedFill !== undefined) {
            correctValue = _validateColorCode(attribs.nonratedFill);
            if (correctValue && correctValue !== this._config.nonratedFill) {
                this._config.nonratedFill = correctValue;
                this._onDraw['_updateStarStyle'] = true;
                this._onDraw['_updateDefinitionFill'] = true;
            } else if (!correctValue) {
                console.error('Incorrect color for ratedFill: ' + attribs.nonratedFill);
            }
        }


        if (attribs.ratedStroke !== undefined) {
            correctValue = _validateColorCode(attribs.ratedStroke);
            if (correctValue && correctValue !== this._config.ratedStroke) {
                this._config.ratedStroke = correctValue;
                this._onDraw['_updateStarStyle'] = true;
                this._onDraw['_updateDefinitionStroke'] = true;
            } else if (!correctValue) {
                console.error('Incorrect color for ratedFill: ' + attribs.ratedStroke);
            }
        }

        if (attribs.nonratedStroke !== undefined) {
            correctValue = _validateColorCode(attribs.nonratedStroke);
            if (correctValue && correctValue !== this._config.nonratedStroke) {
                this._config.nonratedStroke = correctValue;
                this._onDraw['_updateStarStyle'] = true;
                this._onDraw['_updateDefinitionStroke'] = true;
            } else if (!correctValue) {
                console.error('Incorrect color for ratedFill: ' + attribs.nonratedStroke);
            }
        }

        if (onValidate._calculateSide) {
            this._calculateSide(padding, strokeWidth);
        }


        return true;
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
        if (typeof this.onPreDraw === 'function') {
            this.onPreDraw();
        } else if (this.onDraw) {
            console.error('onDraw must be a function');
        }
        let i, j,
            rating = !this._config.rating && this._config.rating != 0 ? this._config.TotalStars : this._config.rating,
            currentStars = this._elements.stars.length;

        this._internalConfig.relativePath = _getPathString(this._internalConfig.side);
        //update svg height and width
        this._elements.svg.update(this._config.height, this._config.width);
        //remove def if exist
        let defs = this._elements.svg.getDefinition();

        if (_isFraction(rating)) {
            //this._createGradientDefinitions(defs);
            if (!defs) {
                defs = new Definition(this._elements.svg);
            }
            defs.update(rating, this._config.ratedFill, this._config.nonratedFill, this._config.ratedStroke, this._config.nonratedStroke, this._internalConfig.direction, this._internalConfig.flow);
        }

        this._calculateBaseShift();

        for (i = 0; i < Math.max(currentStars, this._config.TotalStars); i++) {
            j = this._internalConfig.flow == 'reverse' ? this._config.TotalStars - i - 1 : i;
            if (i >= currentStars) {
                let star = new SVGElement("path");
                this._elements.stars.push(star);
                this._elements.svg.appendChild(star);
            } else if (i >= this._config.TotalStars) {
                this._elements.stars.pop().removeNode();
            }
            if (i < this._config.TotalStars) {
                if (_isFraction(rating) && Math.ceil(rating) == j + 1) {
                    this._elements.stars[i].setAttributes({
                        "fill": "url(#partial-fill)",
                        "stroke": "url(#partial-stroke)",
                        "stroke-width": this._config.strokeWidth + "px",
                        "d": 'M' + (this._internalConfig.baseX + (this._internalConfig.xShift * i)) + ',' + (this._internalConfig.baseY + (this._internalConfig.yShift * i)) + ' ' + this._internalConfig.relativePath
                    });
                } else {
                    this._elements.stars[i].setAttributes({
                        "fill": j < Math.ceil(rating) ? this._config.ratedFill : this._config.nonratedFill,
                        "stroke": j < Math.ceil(rating) ? this._config.ratedStroke : this._config.nonratedStroke,
                        "stroke-width": this._config.strokeWidth + "px",
                        "d": 'M' + (this._internalConfig.baseX + (this._internalConfig.xShift * i)) + ',' + (this._internalConfig.baseY + (this._internalConfig.yShift * i)) + ' ' + this._internalConfig.relativePath
                    });
                }
            }
        }
        if (typeof this.onDraw === 'function') {
            this.onDraw();
        } else if (this.onDraw) {
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
                if (!this._internalConfig.requestedAnimationFrame) {
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
        if (typeof this.onUpdate === 'function') {
            this.onUpdate(this._config);
        } else if (this.onUpdate) {
            console.error('onUpdate must be a function');
        }
    }
}

export default StarRating;

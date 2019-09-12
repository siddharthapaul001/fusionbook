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

function _pluckNumber(num, precision = 0){
    if(num){
        if(!+num && +num !== 0){
            console.error("Incorrect value: " + num);
        }else{
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
        this._elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this._elements.stars = [];

        this._internalConfig.controller = [
            {
                "_config": ["orientation"],
                "checks": [/^(left-to-right|right-to-left|top-to-bottom|bottom-to-top)$/g],
                "onValidate": ["_getDirectionFlow"]
            },
            {
                "_config": ["height", "width"],
                "checks": [],
                "onValidate": ["_setSVGProps"]
            },
            {
                "_config": ["height", "width", "stars", "padding", "strokeWidth"],
                "_internalConfig": ["direction"],
                "checks": [_pluckSize, _pluckSize, _pluckNumber, _pluckSize, _pluckSize],
                "onValidate": ["_calculateSide", "_dynCheck"]
            },
            {
                "_internalConfig": ["side"],
                "onDraw": ["_getRelativePath"]
            },
            {
                "_config": ["justifyContent", "alignItems"],
                "checks": [/^(start|end|center|space-evenly)$/g, /^(start|end|center)$/g],
                "_internalConfig": ["side", "sideOut", "direction"],
                "onDraw": ["_calculateBaseShift"]
            },
            {
                "_internalConfig": ["baseX", "baseY", "shiftX", "shiftY", "relativePath"],
                "onDraw": ["_setFullPath"]
            },
            {
                "_config": ["rating"],
                "checks": [],
                "onValidate": ["_splitFraction"]
            },
            {
                "_internalConfig": ["ratingFraction", "flow"],
                "onDraw": ["_updateGradient"]
            },
            {
                "_config": ["ratedFill", "nonratedFill", "ratedStroke", "nonratedStroke"],
                "checks": [_validateColorCode, _validateColorCode, _validateColorCode, _validateColorCode],
                "onDraw": ["_updateGradientColor"]
            },
            {
                "_config": ["ratedFill", "nonratedFill", "ratedStroke", "nonratedStroke", "strokeWidth"],
                "checks": [],
                "onDraw": ["_updateStarStyle"]
            }
        ]

        if (attribs) {
            if (this._validateAndSet(attribs)) {
                this._internalConfig.requestedAnimationFrame = true;
                window.requestAnimationFrame(() => {
                    this._draw();
                });
            } else {
                this._elements.svg.parentNode.removeChild(this._elements.svg);
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
        let i, j, config, check, correctValue, errors = [], changes = {};
        // this._internalConfig.controller.forEach(dep => {
        //     if(dep["_config"]){
        //         dep["_config"].forEach(configName => {
        //             if(attribs[configName] === undefined){

        //             }
        //         });
        //     }
        //     if(dep["_internalConfig"]){
        //         dep["_internalConfig"].forEach(configName => {

        //         });
        //     }
        // });
        for(i = 0; i < this._internalConfig.controller.length; i++){
            if(this._internalConfig.controller[i]["_config"] !== undefined){
                for(j = 0; j < this._internalConfig.controller[i]["_config"].length; j++){
                    config = this._internalConfig.controller[i]["_config"][j];
                    check = this._internalConfig.controller[i]["checks"][j];
                    if(attribs[config] !== undefined){
                        if(check instanceof RegExp){
                            correctValue = attribs[config].match(check);
                            if(correctValue && correctValue[0] !== this._config[config]){
                                changes[config] = correctValue[0];
                            }
                        }else if(typeof check === 'function'){
                            correctValue = check(attribs[config]);
                            if(correctValue && correctValue !== this._config[config]){
                                changes[config] = correctValue;
                            }
                        }
                    }
                }
            }
            if(this._internalConfig.controller[i]["_internalConfig"] !== undefined){
                for(j = 0; j < this._internalConfig.controller[i]["_internalConfig"].length; j++){
                    
                }
            }
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
        //this._elements.svg.setAttribute("height", this._config.height);
        //this._elements.svg.setAttribute("width", this._config.width);
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

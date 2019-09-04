class StarRating {
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
        this.N = 5;
        this.rating = this.N;
        this.orientation = 'left-to-right';
        this.padding = 1;
        this.justifyContent = 'center';
        this.strokeWidth = 0;
        this.ratedFill = "#ff0";
        this.nonratedFill = "#ddd";
        this.ratedStroke = "none";
        this.nonratedStroke = "none";
        /*
        this.styles = {
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
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.parentElement.appendChild(this.svg);
        this.stars = [];

        if (attribs) {
            if (this._validateAndSet(attribs)) {
                this._draw();
            } else {
                this.parentElement.removeChild(this.svg);
                console.error("Stopping execution");
                return null;
            }
        } else {
            this.sideOut = Math.min(this.direction == 'row' ? this.width / this.N : this.width, this.direction == 'column' ? this.height / this.N : this.height);
            this.side = this.sideOut - this.padding * 4 - this.strokeWidth * 4;
            //this._validateAndSet({});
            this._draw();
        }
    }

    _validateAndSet(attribs) {
        let height = this._pluckSize(attribs['height'], 'Height'),
            width = this._pluckSize(attribs['width'], 'Width'),
            N = attribs['stars'],
            rating = attribs['rating'],
            orientation = attribs['orientation'],
            padding = this._pluckSize(attribs['padding'], 'Padding'),
            strokeWidth = this._pluckSize(attribs['stroke-width'], 'Stroke Width'),
            justifyContent = attribs['justify-content'],
            styles = {
                "rated": attribs['rated'],
                "nonrated": attribs['nonrated']
            };
        let validOrientation = ['left-to-right', 'right-to-left', 'top-to-bottom', 'bottom-to-top'],
            validJustifyContent = ['center', 'stretch', 'start', 'end'],
            shouldContinue = true,
            side, sideOut,
            direction,
            flow;

        //check height and width
        width = width.num ? width.num + width.unit : this.width;
        height = height.num ? height.num + height.unit : this.height;
        this.svg.setAttribute("width", width);
        this.svg.setAttribute("height", height);

        //get the height width from svg in dom
        height = this.svg.clientHeight;
        width = this.svg.clientWidth;

        if (width < 20) {
            console.error("Minimum width value is 20");
            width = this.width;
            this.svg.setAttribute("width", width);
        }

        if (height < 20) {
            console.error("Minimum width value is 20");
            height = this.height;
            this.svg.setAttribute("height", height);
        }

        //check if number of stars => N is ok otherwise set the default value 5
        if (!+N) {
            N = this.N;
        }
        if (N <= 0) {
            console.error("No of stars must be greater than 0");
            shouldContinue = false;
        }
        //If N is fraction no issue because it used to limit loops only

        //check if rating is given as number otherwise set the default value 5
        if (!+rating) {
            if (this.rating == this.N) {
                rating = N;
            } else {
                rating = this.rating;
            }
        }

        if (rating > N) {
            console.error("Rating must be greater than No of stars");
            shouldContinue = false;
        }

        //justify content
        if (!validJustifyContent.includes(justifyContent)) {
            if (justifyContent) {
                console.error("Incorrect value for justify-content");
            }
            justifyContent = this.justifyContent;
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

        styles['rated']['fill'] = this._validateColorCode(styles['rated']['fill']) ? styles['rated']['fill'] : this.ratedFill;
        styles['rated']['stroke'] = this._validateColorCode(styles['rated']['stroke']) ? styles['rated']['stroke'] : this.ratedStroke;

        styles['nonrated']['fill'] = this._validateColorCode(styles['nonrated']['fill']) ? styles['nonrated']['fill'] : this.nonratedFill;
        styles['nonrated']['stroke'] = this._validateColorCode(styles['nonrated']['stroke']) ? styles['nonrated']['stroke'] : this.nonratedStroke;

        //Do calculation to check managable conditions
        if (shouldContinue) {
            sideOut = Math.min(direction == 'row' ? width / N : width, direction == 'column' ? height / N : height);
            side = sideOut - (padding * 4) - (strokeWidth * 4);
            console.log(sideOut, side, padding, strokeWidth);
            if (sideOut < 16) {
                console.error("Could not acomodate so many stars. Reduce no of stars");
                shouldContinue = false;
            }
            if (side < 10) {
                if (padding > 2) {
                    console.error("Decrease padding.");
                    padding = this.padding;
                    side = sideOut - padding * 4 - strokeWidth * 4;
                } else if (strokeWidth > (0.10 * sideOut)) {
                    console.error("Decrease stroke-width.");
                    strokeWidth = this.strokeWidth;
                    side = sideOut - (padding * 2) - (strokeWidth * 4);
                }
            }

            //If still side is less than 10 set padding and stroke-width to 2 and 0
            if (side < 10) {
                if (padding > 2) {
                    console.warn("Automatically setting padding to default");
                    padding = 2;
                    side = sideOut - (padding * 4) - (strokeWidth * 4);
                } else if (strokeWidth > (0.10 * sideOut)) {
                    console.error("Automatically setting stroke-width to 0");
                    strokeWidth = 0;
                    side = sideOut - (padding * 4) - (strokeWidth * 4);
                }
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
            this.N = N;
            this.ratedFill = styles['rated']['fill'];
            this.ratedStroke = styles['rated']['stroke'];
            this.nonratedFill = styles['nonrated']['fill'];
            this.nonratedStroke = styles['nonrated']['stroke'];
            this.side = side;
            this.sideOut = sideOut;
            this.strokeWidth = strokeWidth;
            //extract direction and flow from orientation
            this.direction = direction;
            this.flow = flow;
        } else {
            this.svg.setAttribute("width", this.width);
            this.svg.setAttribute("height", this.height);
        }
        return shouldContinue;
    }

    _pluckSize(size, str) {
        str = str ? 'of ' + str : '';
        let num = (size + '').match(/\d+/g),
            unit = (size + '').match(/px|%|vh|vw/g) || [''];
        if (!num) {
            if (size) {
                console.error("Error in size value" + str);
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

    _validateColorCode(color) {
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

    _getPathString(side, X, Y) {
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

    _createGradientDefinitions() {
        let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs"),
            linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient"),
            strokeLinearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient"),
            RatedStart = document.createElementNS("http://www.w3.org/2000/svg", "stop"),
            RatedEnd = document.createElementNS("http://www.w3.org/2000/svg", "stop"),
            NonRatedStart = document.createElementNS("http://www.w3.org/2000/svg", "stop"),
            NonRatedEnd = document.createElementNS("http://www.w3.org/2000/svg", "stop"),
            strokeRatedStart = document.createElementNS("http://www.w3.org/2000/svg", "stop"),
            strokeRatedEnd = document.createElementNS("http://www.w3.org/2000/svg", "stop"),
            strokeNonRatedStart = document.createElementNS("http://www.w3.org/2000/svg", "stop"),
            strokeNonRatedEnd = document.createElementNS("http://www.w3.org/2000/svg", "stop");

        linearGradient.setAttribute("id", "partial-fill");
        linearGradient.setAttribute("x1", "0%");
        if (this.direction == 'row') {
            linearGradient.setAttribute("x2", "100%");
        } else if (this.direction == 'column') {
            linearGradient.setAttribute("x2", "0%");
        }
        linearGradient.setAttribute("y1", "0%");
        if (this.direction == 'column') {
            linearGradient.setAttribute("y2", "100%");
        } else if (this.direction == 'row') {
            linearGradient.setAttribute("y2", "0%");
        }

        strokeLinearGradient.setAttribute("id", "partial-stroke");
        strokeLinearGradient.setAttribute("x1", "0%");
        if (this.direction == 'row') {
            strokeLinearGradient.setAttribute("x2", "100%");
        } else if (this.direction == 'column') {
            strokeLinearGradient.setAttribute("x2", "0%");
        }
        strokeLinearGradient.setAttribute("y1", "0%");
        if (this.direction == 'column') {
            strokeLinearGradient.setAttribute("y2", "100%");
        } else if (this.direction == 'row') {
            strokeLinearGradient.setAttribute("y2", "0%");
        }

        if (this.flow == 'reverse') {
            RatedStart.setAttribute("offset", "0%");
            RatedEnd.setAttribute("offset", ((1 - (this.rating - Math.floor(this.rating))).toFixed(2) * 100) + "%");
            NonRatedStart.setAttribute("offset", ((1 - (this.rating - Math.floor(this.rating))).toFixed(2) * 100) + "%");
            NonRatedEnd.setAttribute("offset", "100%");
            RatedStart.setAttribute("style", "stop-color:" + this.nonratedFill + ";stop-opacity:1;");
            RatedEnd.setAttribute("style", "stop-color:" + this.nonratedFill + ";stop-opacity:1;");
            NonRatedStart.setAttribute("style", "stop-color:" + this.ratedFill + ";stop-opacity:1;");
            NonRatedEnd.setAttribute("style", "stop-color:" + this.ratedFill + ";stop-opacity:1;");
        } else {
            RatedStart.setAttribute("offset", "0%");
            RatedEnd.setAttribute("offset", ((this.rating - Math.floor(this.rating)).toFixed(2) * 100) + "%");
            NonRatedStart.setAttribute("offset", ((this.rating - Math.floor(this.rating)).toFixed(2) * 100) + "%");
            NonRatedEnd.setAttribute("offset", "100%");
            RatedStart.setAttribute("style", "stop-color:" + this.ratedFill + ";stop-opacity:1;");
            RatedEnd.setAttribute("style", "stop-color:" + this.ratedFill + ";stop-opacity:1;");
            NonRatedStart.setAttribute("style", "stop-color:" + this.nonratedFill + ";stop-opacity:1;");
            NonRatedEnd.setAttribute("style", "stop-color:" + this.nonratedFill + ";stop-opacity:1;");
        }

        if (this.flow == 'reverse') {
            strokeRatedStart.setAttribute("offset", "0%");
            strokeRatedEnd.setAttribute("offset", ((1 - (this.rating - Math.floor(this.rating))).toFixed(2) * 100) + "%");
            strokeNonRatedStart.setAttribute("offset", ((1 - (this.rating - Math.floor(this.rating))).toFixed(2) * 100) + "%");
            strokeNonRatedEnd.setAttribute("offset", "100%");
            strokeRatedStart.setAttribute("style", "stop-color:" + this.nonratedStroke + ";stop-opacity:1;");
            strokeRatedEnd.setAttribute("style", "stop-color:" + this.nonratedStroke + ";stop-opacity:1;");
            strokeNonRatedStart.setAttribute("style", "stop-color:" + this.ratedStroke + ";stop-opacity:1;");
            strokeNonRatedEnd.setAttribute("style", "stop-color:" + this.ratedStroke + ";stop-opacity:1;");
        } else {
            strokeRatedStart.setAttribute("offset", "0%");
            strokeRatedEnd.setAttribute("offset", ((this.rating - Math.floor(this.rating)).toFixed(2) * 100) + "%");
            strokeNonRatedStart.setAttribute("offset", ((this.rating - Math.floor(this.rating)).toFixed(2) * 100) + "%");
            strokeNonRatedEnd.setAttribute("offset", "100%");
            strokeRatedStart.setAttribute("style", "stop-color:" + this.ratedStroke + ";stop-opacity:1;");
            strokeRatedEnd.setAttribute("style", "stop-color:" + this.ratedStroke + ";stop-opacity:1;");
            strokeNonRatedStart.setAttribute("style", "stop-color:" + this.nonratedStroke + ";stop-opacity:1;");
            strokeNonRatedEnd.setAttribute("style", "stop-color:" + this.nonratedStroke + ";stop-opacity:1;");
        }

        linearGradient.appendChild(RatedStart);
        linearGradient.appendChild(RatedEnd);
        linearGradient.appendChild(NonRatedStart);
        linearGradient.appendChild(NonRatedEnd);

        strokeLinearGradient.appendChild(strokeRatedStart);
        strokeLinearGradient.appendChild(strokeRatedEnd);
        strokeLinearGradient.appendChild(strokeNonRatedStart);
        strokeLinearGradient.appendChild(strokeNonRatedEnd);

        defs.appendChild(linearGradient);
        defs.appendChild(strokeLinearGradient);
        this.svg.appendChild(defs);
    }

    _isFraction(num) {
        return !(Math.abs(num - Math.floor(num)) < Number.EPSILON);
    }

    _draw() {
        let i, baseY = this.sideOut / 2, baseX = (this.sideOut / 2), xShift = 0, yShift = 0;
        //Adjust no of star
        //Append if extra needed
        for (i = this.stars.length; i < this.N; i++) {
            let elem = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            //Improvement needed
            this.svg.appendChild(elem);
            this.stars.push(elem);
        }

        //remove def if exist
        let defs = this.svg.getElementsByTagName("defs");
        if(defs.length > 0){
            this.svg.removeChild(defs[0]);
        }
        if(this._isFraction(this.rating)){
            this._createGradientDefinitions();
        }

        if(this.direction == 'row'){
            xShift = this.side;
            /*if(this.justifyContent == 'center'){
                baseX = (this.width - (this.side * this.N));
            }*/
            baseY = ((this.height - this.sideOut) / 2);
        }else if(this.direction == 'column'){
            yShift = this.side;
            /*if(this.justifyContent == 'center'){
                baseY = (this.height - (this.sideOut * this.N)) / 2;
            }*/
            baseX = ((this.width - this.sideOut) / 2);
        }

        for(i = 0; i < this.stars.length; i++){
            this.stars[i].setAttribute('d', 
                this._getPathString(this.side, baseX + (xShift * i), baseY + (yShift * i))
            );
        }


        //setting colors
        for (i = 0; i < this.stars.length; i++) {
            if (this._isFraction(this.rating) && Math.ceil(this.rating) == i + 1) {
                this.stars[i].setAttribute("fill", "url(#partial-fill)");
                this.stars[i].setAttribute("stroke", "url(#partial-stroke)");
            } else {
                this.stars[i].setAttribute("fill", i < Math.ceil(this.rating) ? this.ratedFill : this.nonratedFill);
                this.stars[i].setAttribute("stroke", i < Math.ceil(this.rating) ? this.ratedStroke : this.nonratedStroke);
            }
            this.stars[i].setAttribute("stroke-width", this.strokeWidth + "px");
        }

        //Remove
        for (i = this.stars.length - 1; i >= this.N; i--) {
            this.svg.removeChild(this.stars.pop());
        }
    }

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
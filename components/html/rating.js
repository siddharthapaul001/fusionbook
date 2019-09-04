class StarRating{
    constructor(parentElement, attribs){
        //check if parentElement is a HTMLElement otherwise show and error and stop execution
        if(!parentElement instanceof HTMLElement){
            console.error("A HTML Element must be provided in the first argument");
            return;
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
        //this.strokeWidth = undefined;
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
    }

    _validateAndSet(attribs){
        let height = this._pluckSize(attribs['height'], 'Height'),
            width = this._pluckSize(attribs['width'], 'Width'),
            N = attribs['stars'],
            rating = attribs['rating'],
            orientation = attribs['orientation'],
            padding = this._pluckSize(attribs['padding'], 'Padding'),
            strokeWidth = this._pluckSize(attribs['padding'], 'Stroke Width'),
            justifyContent = attribs['justify-content'],
            styles = attribs['styles'];
        let validOrientation = ['left-to-right', 'right-to-left', 'top-to-bottom', 'bottom-to-top'],
            validJustifyContent = ['center', 'stretch', 'start', 'end'],
            shouldContinue = true;
        
        //check height and width
        width = width.num || this.width;
        height = width.num || this.height;
        width += width.unit;
        height += height.unit;

        this.svg.setAttribute("width", width);
        this.svg.setAttribute("height", height);

        //get the height width from svg in dom
        height = this.svg.clientHeight;
        width = this.svg.clientWidth;

        //check if number of stars => N is ok otherwise set the default value 5
        if(!+N){
            N = this.N;
        }
        if(N <= 0){
            console.error("No of stars must be greater than 0");
            shouldContinue = false;
        }
        //If N is fraction no issue because it used to limit loops only

        //check if rating is given as number otherwise set the default value 5
        if(!+rating){
            if(this.rating == this.N){
                rating = N;
            }else{
                rating = this.rating;
            }
        }

        if(rating > N){
            console.error("Rating must be greater than No of stars");
            shouldContinue = false;
        }

        //justify content
        if(!validJustifyContent.includes(justifyContent)){
            justifyContent = this.justifyContent;
            console.error("Incorrect value for justify-content");
        }

        //orientation
        if(!validOrientation.includes(orientation)){
            orientation = this.orientation;
            console.error("Incorrect value for orientation");
        }

        //assign padding
        padding = padding.num || this.padding;

        //assign stroke-width
        this.strokeWidth = strokeWidth.num || this.strokeWidth;
        
        //validatind and adding styles
        if(!styles){
            styles = this.styles;
        }
        if(!styles['rated']){
            styles['rated'] = {};
        }
        if(!styles['nonrated']){
            styles['nonrated'] = {};
        }
        this.styles = styles;

        //check if it is non-managable condition
        if(shouldContinue){
            this.height = height;
            this.width = width;
            this.orientation = orientation;
            //extract direction and flow from orientation
            this.direction = (orientation == 'left-to-right' || orientation == 'right-to-left') ? 'row' : 'column';
            this.flow = (orientation == 'right-to-left' || orientation == 'bottom-to-top') ? 'reverse' : '';
        }else{    
            this.svg.setAttribute("width", this.width);
            this.svg.setAttribute("height", this.height);
        }
    }

    _pluckSize(num){
        return {
            'num': num,
            'unit': ''
        }
    }

    _validateColorCode(color){
        color += '';
        if(color.starsWith('#')){
            if(!color.match(/^#([A-Fa-f0-9]{6}|^#[A-Fa-f0-9]{3})$/g)){
                return false;
            }
        }else if(color.starsWith('rgb(')){
            if(!color.replace(/\s/g, '').match(/^rgb\((\d+),(\d+),(\d+)\)$/g)){
                return false;
            }
        }
        return true;
    }

    _createOrUpdate(){

    }

    update(width = 400, height = 300, rating, N = 5, styles){

    }
}

export default StarRating;
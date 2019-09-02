var N = 5,
allowedStyles = [
    {
        "styleName": "stroke-width",
        "regex": /\d+(px)*$/g,
        "err": "stroke-width value unit must be in pixels."
    },
    {
        "styleName": "stroke",
        "regex": /(^#[A-Fa-f0-9]{6}|^#[A-Fa-f0-9]{3}|none)$/g,
        "err": "Only hex color code and none value is supported."
    },
    {
        "styleName": "fill",
        "regex": /(^#[A-Fa-f0-9]{6}|^#[A-Fa-f0-9]{3}|none)$/g,
        "err": "Only hex color code and none value is supported."
    }
],
customAttributes = [
    {
        "styleName": "justify-content",
        "regex": /^(streach|center)$/g,
        "error": "justify-content allowes only streach or center"
    }
];

function calculatePositions(parentWidth, parentHeight, strokeWidth, unit, xShift = 0, yShift = 0, direction = 'row'){
    if(unit == '%'){
        //strokeWidth = Math.min(parentWidth, parentHeight) * (strokeWidth / 25);
        throw new TypeError('Must provide stroke width in pixels');
    }
    let h = direction == 'row' ? parentWidth / N : parentWidth;
    let w = direction == 'column' ? parentHeight / N : parentHeight; 
    let side = Math.min(h, w) - Math.max(strokeWidth * 4, 4),
    str = "M" + (xShift + (parentWidth / 2)) + "," + (yShift + (parentHeight - side) / 2),
    ax = 0.15, 
    bx = (1 - 2 * ax)/2, 
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

function pluckSize(size){
    let num = (size+'').match(/\d+/g),
    unit = (size+'').match(/px|%|vh|vw/g) || [''];
    if(!num){
        throw new TypeError("error in size value");
    }
    return{
        num: +num[0],
        unit: unit[0]
    };
}


function createStar(parentElement, width, height, direction, styles){
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    stars = [],
    styleStr = '',
    xShift = 0, yShift = 0,
    strokeWidth = styles["stroke-width"] ? pluckSize(styles["stroke-width"]) : 0;

    if(!strokeWidth.num){
        strokeWidth = {
            "num": 0,
            "unit": ''
        }
    }

    console.log(strokeWidth.num);

    if(!(parentElement instanceof HTMLElement)){
        throw new TypeError("First argument must be a html element");
    }

    for(let i = 0; i < N; i++){
        stars.push(document.createElementNS("http://www.w3.org/2000/svg", "path"));
    }

    svg.setAttribute("height", height);
    svg.setAttribute("width", width);
    parentElement.appendChild(svg);

    for(let i in customAttributes){
        if(styles.hasOwnProperty(customAttributes[i].styleName)){
            if(!styles[customAttributes[i].styleName].match(customAttributes[i].regex)){
                throw new TypeError(customAttributes[i].err);
            }
        }
    }

    if(strokeWidth.num > Math.min(svg.clientWidth, svg.clientHeight) / (2*N)){
        console.log(strokeWidth.num, svg.clientWidth, svg.clientHeight);
        throw new TypeError("Incorrect value of stroke width");
    }

    if(direction == 'row'){
        if(styles["justify-content"] == "streach"){
            xShift = svg.clientWidth / N;
        }else{
            xShift = Math.min(svg.clientWidth / N, svg.clientHeight);
        }
    }else if(direction == 'column'){
        if(styles["justify-content"] == "streach"){
            yShift = svg.clientHeight / N;
        }else{ 
            // if(styles["justify-content"] == "center")
            yShift = Math.min(svg.clientHeight / N, svg.clientWidth);
        }
    }else{
        throw new TypeError('Incorrect direction');
    }

    for(let i = 0; i < stars.length; i++){
        stars[i].setAttribute("d", calculatePositions(svg.clientWidth, svg.clientHeight, strokeWidth.num, strokeWidth.unit, xShift * ((Math.floor(N/2)) - i), yShift * ((Math.floor(N/2)) - i), direction))
    }

    for(let i in allowedStyles){
        if(styles.hasOwnProperty(allowedStyles[i].styleName)){
            if(styles[allowedStyles[i].styleName].match(allowedStyles[i].regex)){
                styleStr += allowedStyles[i].styleName + ':' + styles[allowedStyles[i].styleName] + ';';
            }else{
                throw new TypeError(allowedStyles[i].err);
            }
        }
    }
    for(let i = 0; i < stars.length; i++){
        stars[i].setAttribute("style", styleStr);
        svg.appendChild(stars[i]);
    }
    parentElement.appendChild(svg);
}

export default createStar;
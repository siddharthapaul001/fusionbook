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
    if (!num || num < 0) {
        if (size) {
            console.error("Error in size value " + str + ": " + size);
        }
        return null;
    }

    return num;
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


let controller = [
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

onmessage = function (e) {
    // let [_config, attribs] = e.data.map(a => JSON.parse(a)), changes = {}, onDraw = [];
    // for(let i = 0, iLim = controller.length; i < iLim; i++){
    //     //() =>{
    //         if(controller[i]["_config"] !== undefined){
    //             for(let j = 0, jLim = controller[i]["_config"].length; j < jLim; j++){
    //                 let config = controller[i]["_config"][j];
    //                 let check = controller[i]["checks"][j];
                    
    //                 if(attribs[config] !== undefined){
    //                     if(check instanceof RegExp){
    //                         correctValue = attribs[config].match(check);
    //                         if(correctValue && correctValue[0] !== _config[config]){
    //                             changes[config] = correctValue[0];
    //                         }
    //                     }else if(typeof check === 'function'){
    //                         correctValue = check(attribs[config]);
    //                         if(correctValue && correctValue !== _config[config]){
    //                             changes[config] = correctValue;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //         if(controller[i]["_internalConfig"] !== undefined){
    //             for(let j = 0, jLim = controller[i]["_internalConfig"].length; j < jLim; j++){
                    
    //             }
    //         }
    //     //}
    // }
    
}
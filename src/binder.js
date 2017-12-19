/*---------------------------------------------------------------------------------------------------------*/
/* CLASS BEGINS */
/*---------------------------------------------------------------------------------------------------------*/



/**
 * Binder class.
 * 
 * @constructor
 * @param {Object} options - The options containing appName
 *								and data attributes for binding data to DOM.
 */

function Binder(options) {
    this.parentElem = null;
    this.binderModelRef = null;
    this.options = options;
    this.bind();
}


Binder.prototype.getElementsWithDataBind = function() {
    return this.parentElem.querySelectorAll(`[data-bind]`);
};

Binder.prototype.setParentElement = function() {
    if (this.options.appName == undefined) {
        this.parentElem = document.getElementsByTagName('body')[0];
        this.binderModelRef = binderModel;
    } else {
        var elems = document.querySelectorAll(`[appName="${this.options.appName}"]`);
        if (elems.length == 0)
            throw `No element with appName ${this.options.appName} exists.`;
        if (elems.length > 1)
            throw `Multiple elements with appName ${this.options.appName} exist. Option appName must be unique`;
        this.parentElem = elems[0];

        this.binderModelRef = this.options.data;
    }
};

Binder.prototype.bind = function() {
    if (this.options != undefined && this.options.data != undefined) {
        this.setParentElement();
        var elemsToBind = this.getElementsWithDataBind();
        // var that = this;
        elemsToBind.forEach(__bind_each_element__.bind(this));
    }
};

Binder.prototype.setAttributeValue = function(attributeToSet, value) {
    this.binderModelRef[attributeToSet] = value;
};

Binder.prototype.removeAttrFromRef = function(attributeToRemove) {
    return delete this.binderModelRef[attributeToRemove];
};

Binder.prototype.createProperty = function(elem, dataBinAttr) {

    var __eventHandler__ = function(e) {
        if (e.target.value != this.options.data[dataBinAttr])
            this.options.data[dataBinAttr] = e.target.value;
    };

    elem.addEventListener("change", __eventHandler__.bind(this));
    this.removeAttrFromRef(dataBinAttr);

    if (Object.getOwnPropertyNames(this.binderModelRef).contains(dataBinAttr)) {
        throw new new Error("data-bind attribute should be unique.");
    }
    var obj = Object.defineProperty(this.binderModelRef, dataBinAttr, {
        configurable: false,
        get: function() {
            return elem.value;
        },
        set: function(val) {
            elem.value = val;
            elem.dispatchEvent(new Event('change'));
            return val;
        }
    });

    this.setAttributeValue(dataBinAttr, elem.value);
    return obj;
};

/*---------------------------------------------------------------------------------------------------------*/
/* CLASS ENDS */
/*---------------------------------------------------------------------------------------------------------*/


/*---------------------------------------------------------------------------------------------------------*/
/* GLOBAL FUNCTIONS */
/*---------------------------------------------------------------------------------------------------------*/
function __bind_each_element__(elem, index) {
    var dataBinAttr = elem.getAttribute('data-bind');
    if (dataBinAttr != null && dataBinAttr != "") {
        if (this.options.data[dataBinAttr] != undefined) {
            elem.value = this.options.data[dataBinAttr];
            this.createProperty(elem, dataBinAttr);
        }
    }
}


Array.prototype.contains = function(value) {
    if (this.length === 0) return false;
    for (var key in this) {
        if (this[key] === value) return true;
    }
    return false;
};
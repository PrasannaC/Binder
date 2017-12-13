/**
 * Binder class.
 * 
 * @constructor
 * @param {Object} options - The options containing appName
 *								and data attributes for binding data to DOM.
 */

function Binder(options) {
    this.options = options;
    this.bind();
}

Binder.prototype.bind = function() {
    var parentElem = null;
    var binderModelRef = null;
    if (this.options != undefined && this.options.data != undefined) {
        if (this.options.appName == undefined) {
            parentElem = document.getElementsByTagName('body')[0];
            binderModelRef = binderModel;
        } else {
            var elems = document.querySelectorAll(`[appName="${this.options.appName}"]`);
            if (elems.length == 0)
                throw `No element with appName ${this.options.appName} exists.`;
            if (elems.length > 1)
                throw `Multiple elements with appName ${this.options.appName} exist. Option appName must be unique`;
            parentElem = elems[0];

            binderModelRef = this.options.data;
        }
        var elemsToBind = parentElem.querySelectorAll(`[data-bind]`);
        var that = this;

        elemsToBind.forEach(function(elem, index) {
            var dataBinAttr = elem.getAttribute('data-bind');
            if (dataBinAttr != null && dataBinAttr != "") {
                if (that.options.data[dataBinAttr] != undefined) {
                    elem.value = that.options.data[dataBinAttr];

                    elem.addEventListener("change", function(e) {
                        if (this.value != that.options.data[dataBinAttr])
                            that.options.data[dataBinAttr] = this.value;
                    });

                    delete binderModelRef[dataBinAttr];
                    var obj = Object.defineProperty(binderModelRef, dataBinAttr, {
                        configurable: false,
                        get: function() {
                            //debugger;
                            return elem.value;
                        },
                        set: function(val) {
                            //debugger;
                            elem.value = val;
                            elem.dispatchEvent(new Event('change'));
                            return val;
                        }
                    });
                    binderModelRef[dataBinAttr] = elem.value;
                }
            }
        });

    }
};
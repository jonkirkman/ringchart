
var LilSVG = function( type, attrs ) {
	// default to a root svg element no other type is supplied
	type = type || 'svg';

	// create the element
	var svg_el = document.createElementNS('http://www.w3.org/2000/svg', type);

	// if this is a root svg element we should set some defaults
	if (type == 'svg') {
		this.set( svg_el, { version: '1.2', baseProfile: 'tiny' });
	}

	// apply the supplied attributes
	this.set( svg_el, attrs );

	// return the new element
	return svg_el;
};

LilSVG.prototype.set = function( svg_el, attrs ) {
	if (typeof attrs == 'object') {
		for (var key in attrs ) {
			svg_el.setAttribute( key, attrs[key] );
		}
	}
};
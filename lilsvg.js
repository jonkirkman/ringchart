/*
 * LilSVG - A micro library for easily creating SVG elements
 *
 * @usage:
 *   var mySVG = new LilSVG();
 *   --> <svg version="1.1"></svg>
 *
 *   var yourSVG = new LilSVG('svg', { viewbox: '0 0 500 500' });
 *   --> <svg version="1.1" viewbox="0 0 500 500"></svg>
 *
 *   var myCircle = new LilSVG('circle', { cx: 250, cy: 250, r: 100 });
 *   yourSVG.appendChild( myCirle );
 *   --> <svg version="1.1" viewbox="0 0 500 500"> <circle cx="250" cy="250" r="100"/> </svg>
 */

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
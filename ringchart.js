
window.ring_chart = function( container ) {
	var rc = this;

	// Returns a coordinate set relative to the axis of the arc
	rc.pointOnArc = function( degrees, radius, center ) {
		// position is calculated from sine/cosine of 
		// radius and center are used to offset the position
		return {
			x: center.x + (radius * Math.cos( degrees * (Math.PI / 180) )),
			y: center.y + (radius * Math.sin( degrees * (Math.PI / 180) ))
		};
	};

	// Tools for drawing an SVG Path
	rc.draw = {
		// SVG MoveTo: M x,y
		moveTo: function( coord ) {
			return 'M ' + coord.x + ',' + coord.y + ' ';
		},
		
		// SVG LineTo: L x,y
		lineTo: function( coord ) {
			return 'L ' + coord.x + ',' + coord.y + ' ';
		},
		
		// SVG ArcTo:  A rx,ry xAxisRotate LargeArcFlag,SweepFlag x,y
		arcTo: function( radius, coord, largeArc, clockwise ) {
			var arc  = 'A ';
				arc += radius + ',' + radius + ' ';
				arc += '0 ';
				arc += largeArc + ',' + clockwise + ' ';
				arc += coord.x + ',' + coord.y;
			return arc;
		},
		
		// SVG close path: z
		close: function() {
			return 'z';
		}
	};


	// Settings for our svg wrapper element
	var svg = {
		w: container.clientWidth,
		h: container.clientHeight,
		center: {
			x: container.clientWidth / 2,
			y: container.clientHeight / 2
		}
	};
	svg.el = new LilSVG( 'svg', { width: svg.w, height: svg.h } );


	// The colored ring
	var ring = {
		val: String( container.dataset.value ),
		max: 100,
		radius: Math.min( svg.w, svg.h ) * 0.5,
		suffix: (container.dataset.suffix ? String( container.dataset.suffix ) : ''),
		prefix: (container.dataset.prefix ? String( container.dataset.prefix ) : '')
	};

	// make sure the data is workable
	if ( ring.val.indexOf('%') != -1 ) {
		ring.val = ring.val.replace('%', '');
		ring.suffix += '%';
	}
	else if ( ring.val.indexOf('/') != -1 ) {
		var temp = ring.val.split('/');
		ring.val = temp[0];
		ring.max = temp[1];
	}

	if ( ring.suffix.indexOf('%') != -1) {
		ring.max = 100;
	}

	ring.deg = Math.min( (ring.val / ring.max), 1 ) * 360;

	ring.segments = [];

	if (ring.deg > 0) {
		var filled = { className: 'filled', points: [] };

		filled.points.push( rc.pointOnArc( 0, ring.radius, svg.center ) );
		// if (ring.deg == 360)
			// filled.points.push( rc.pointOnArc( 179, ring.radius, svg.center ) );
		filled.points.push( rc.pointOnArc( ring.deg, ring.radius, svg.center ) );
		filled.points.push( rc.pointOnArc( ring.deg, ring.radius - 20, svg.center ) );
		// if (ring.deg == 360)
			// filled.points.push( rc.pointOnArc( 179, ring.radius - 20, svg.center ) );
		filled.points.push( rc.pointOnArc( 0, ring.radius - 20, svg.center ) );

		ring.segments.push( filled );
	}

	if (ring.deg < 360) {
		var empty = { className: 'empty', points: [] };

		empty.points.push( rc.pointOnArc( ring.deg, ring.radius, svg.center ) );
		// if (ring.deg == 360)
			// empty.points.push( rc.pointOnArc( 179, ring.radius, svg.center ) );
		empty.points.push( rc.pointOnArc( 0, ring.radius, svg.center ) );
		empty.points.push( rc.pointOnArc( 0, ring.radius - 20, svg.center ) );
		// if (ring.deg == 360)
			// empty.points.push( rc.pointOnArc( 179, ring.radius - 20, svg.center ) );
		empty.points.push( rc.pointOnArc( ring.deg, ring.radius - 20, svg.center ) );

		ring.segments.push( empty );
	}

	for (var i = 0; i < ring.segments.length; i++) {
		ring.segments[i].d = rc.draw.moveTo();
		ring.segments[i].d = rc.draw.arcTo();
	}

	/*
	var p = ring.filled.points;

	if (ring.deg > 0) {
		ring.filled.d += 'M ' + p[0].x + ',' + p[0].y + ' ';
		if (ring.deg == 360) {
			p.push( rc.pointOnArc( 179, ring.radius, svg.center ) );
			ring.filled.d += 'A ' + ring.radius + ',' + ring.radius + ' 0 0,1 ' + p[4].x + ',' + p[4].y + ' ';
		}
		ring.filled.d += 'A ' + ring.radius + ',' + ring.radius + ' 0 ' + (ring.deg < 180 ? 0 :1) + ',1 ' + p[1].x + ',' + p[1].y + ' ';
		ring.filled.d += 'L ' + p[2].x + ',' + p[2].y + ' ';
		if (ring.deg == 360) {
			p.push( rc.pointOnArc( 179, ring.radius - 20, svg.center ) );
			ring.filled.d += 'A ' + (ring.radius - 20) + ',' + (ring.radius - 20) + ' 0 1,0 ' + p[5].x + ',' + p[5].y + ' ';
		}
		ring.filled.d += 'A ' + (ring.radius - 20) + ',' + (ring.radius - 20) + ' 0 ' + (ring.deg < 180 ? 0 :1) + ',0 ' + p[3].x + ',' + p[3].y + ' ';
		ring.filled.d += 'z';

		ring.filled.el = new LilSVG( 'path', { 'class': 'filled', d: ring.filled.d, transform: 'rotate(-90 '+ svg.center.x +' ' + svg.center.y + ')' } );
		svg.el.appendChild( ring.filled.el );
	}

	if (ring.deg < 360) {
		ring.empty = { d: '' };
		ring.empty.d += 'M ' + p[0].x + ',' + p[0].y + ' ';
		if (ring.deg === 0) {
			p.push( rc.pointOnArc( 179, ring.radius, svg.center ) );
			ring.empty.d += 'A ' + ring.radius + ',' + ring.radius + ' 0 0,0 ' + p[4].x + ',' + p[4].y + ' ';
		}
		ring.empty.d += 'A ' + ring.radius + ',' + ring.radius + ' 0 ' + (ring.deg > 180 ? 0 :1) + ',0 ' + p[1].x + ',' + p[1].y + ' ';
		ring.empty.d += 'L ' + p[2].x + ',' + p[2].y + ' ';
		if (ring.deg === 0) {
			p.push( rc.pointOnArc( 179, ring.radius - 20, svg.center ) );
			ring.empty.d += 'A ' + (ring.radius - 20) + ',' + (ring.radius - 20) + ' 0 1,1 ' + p[5].x + ',' + p[5].y + ' ';
		}
		ring.empty.d += 'A ' + (ring.radius - 20) + ',' + (ring.radius - 20) + ' 0 ' + (ring.deg > 180 ? 0 :1) + ',1 ' + p[3].x + ',' + p[3].y + ' ';
		ring.empty.d += 'z';
		
		ring.empty.el = new LilSVG( 'path', { 'class': 'empty', d: ring.empty.d, transform: 'rotate(-90 '+ svg.center.x +' ' + svg.center.y + ')' } );
		svg.el.appendChild( ring.empty.el );
	}
	*/


	// The label in the middle
	var text = new LilSVG( 'text', {
			'class': 'label',
			'text-anchor': 'middle',
			'alignment-baseline': 'central',
			x: svg.center.x,
			y: svg.center.y
		});
		text.textContent = ring.val;

	var prefix = new LilSVG( 'tspan', {
			class: 'label-prefix'
		});
		prefix.textContent = ring.prefix;	
		text.insertBefore( prefix, text.firstChild );
	
	var suffix = new LilSVG( 'tspan', {
			class: 'label-suffix'
		});
		suffix.textContent = ring.suffix;
		text.appendChild(suffix);

	svg.el.appendChild( text );

	container.appendChild( svg.el );

	return rc;
};
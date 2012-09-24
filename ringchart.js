
window.ring_chart = function( container ) {
	var rc = this;

	// Returns a coordinate set relative to the axis of the arc
	rc.pointOnArc = function( degrees, radius, center ) {
		return {
			x: center.x + radius * Math.cos( degrees * (Math.PI / 180) ),
			y: center.y + radius * Math.sin( degrees * (Math.PI / 180) )
		};
	};

	// Settings for our svg
	var svg = {
		w: container.clientWidth,
		h: container.clientHeight,
		center: {
			x: container.clientWidth / 2,
			y: container.clientHeight / 2
		}
	};
	svg.el = new LilSVG( 'svg', { width: svg.w, height: svg.h } );

	var ring = {
		val: String( container.dataset.value ),
		max: 100,
		radius: Math.min( svg.w, svg.h ) * 0.4
	};
	if ( ring.val.indexOf('%') != -1 ) {
		ring.val = ring.val.replace('%', '');
		ring.max = 100;
	}
	else if ( ring.val.indexOf('/') != -1 ) {
		var temp = ring.val.split('/');
		ring.val = temp[0];
		ring.max = temp[1];
	}

	ring.deg = Math.min( (ring.val / ring.max), 1 ) * 360;
	ring.radians = ring.deg * (Math.PI / 180);

	ring.filled = {
		d: '',
		points: [
			rc.pointOnArc( 0,        ring.radius,      svg.center ),
			rc.pointOnArc( ring.deg, ring.radius,      svg.center ),
			rc.pointOnArc( ring.deg, ring.radius - 20, svg.center ),
			rc.pointOnArc( 0,        ring.radius - 20, svg.center )
		]
	};
	var p = ring.filled.points;

	// SVG MoveTo: M x,y
	// SVG ArcTo:  A rx,ry xAxisRotate LargeArcFlag,SweepFlag x,y
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

	var text = new LilSVG( 'text', {
			'class': 'label',
			'text-anchor': 'middle',
			'alignment-baseline': 'central',
			x: svg.center.x,
			y: svg.center.y
		});
		text.textContent = ring.val;
	svg.el.appendChild( text );

	container.appendChild( svg.el );

	return rc;
};

// MATH

const dist = (a, b, x, y) => {
	return Math.sqrt(Math.pow( Math.abs(a - x), 2 ) + Math.pow( Math.abs(b - y), 2 ))
}

const area = (ax, ay, bx, by, cx, cy) => {
	return Math.abs( (ax * (by - cy)) + (bx * (cy - ay)) + (cx * (ay - by)) );
}

// DRAWING

const draw = (ctx, stroke, color, code) => {
	if (stroke) {
		ctx.strokeStyle = color;
	} else {
		ctx.fillStyle = color;
	}
		ctx.beginPath();
		code();
	if (stroke) {
		ctx.lineWidth = 2;
		ctx.stroke();
	} else {
		ctx.fill();
	}
}

const triangle = (ctx, type, color, A, B, C) => {
	draw(ctx, type, color, () => {
		ctx.moveTo(A[0], A[1]);
		ctx.lineTo(B[0], B[1]);
		ctx.lineTo(C[0], C[1]);
	});
}

const line = (ctx, type, color, A, B) => {
	draw(ctx, type, color, () => {
		ctx.moveTo(A[0], A[1]);
		ctx.lineTo(B[0], B[1]);
	});
}

const circle = (ctx, type, color, radius, x, y) => {
	draw(ctx, type, color, () => {
		ctx.arc(x, y, radius, 0, 2*Math.PI);
	});
}

const rect = (ctx, stroke, color, x, y, w, h) => {
	if (!stroke) {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, w, h);
	} else {
		ctx.strokeStyle = color;
		ctx.strokeRect(x, y, w, h);
	}
}

const text = (ctx, stroke, color, font, text, x, y) => {
	ctx.font = font;
	if (!stroke) {
		ctx.fillStyle = color;
		ctx.fillText(text, x, y);
	} else {
		ctx.strokeStyle = color;
		ctx.strokeText(text, x, y);
	}
}

function main() {

	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	A = null
	B = null
	C = null

	x = null;
	y = null;

	dragging = null;

	const setTriangle = () => {
		canvas.width = window.innerWidth;
    		canvas.height = window.innerHeight;
		midX = canvas.width / 2;
		midY = canvas.height / 2;
		A = [midX, midY - 300];
		B = [(Math.cos(Math.PI * 1.2) * 300) + midX, midY - (Math.sin(Math.PI * 1.2) * 300)];
		C = [(Math.cos(Math.PI * 1.8) * 300) + midX, midY - (Math.sin(Math.PI * 1.8) * 300)];
	}

	setTriangle();

	canvas.onmousedown = (e) => {
		console.log(A)
		x = event.pageX;
		y = event.pageY;
		for (P of [A,B,C]) {
			if (dist(x, y, P[0], P[1]) <= 5) {
				console.log('dwsfdsfa')
				dragging = P;
				return;
			}
		}
	}

	canvas.onmouseup = (e) => {
		console.log(dragging)
		if (dragging) {
			dragging[0] = e.pageX;
			dragging[1] = e.pageY;
			dragging = null;
		}
	}
	
	canvas.onmousemove = (event) => {
		x = event.pageX;
		y = event.pageY;
		if (dragging) {
			dragging[0] = x;
			dragging[1] = y;
		}
	}

	const frame = () => {

		if (canvas.width != window.innerWidth || canvas.height != window.innerHeight) {
			setTriangle();
		}

		rect(ctx, false, "white", 0, 0, canvas.width, canvas.height);
	
		const m_a = area(A[0], A[1], B[0], B[1], x, y) +
			area(B[0], B[1], C[0], C[1], x, y) +
			area(C[0], C[1], A[0], A[1], x, y);

		const t_a = area(A[0], A[1], B[0], B[1], C[0], C[1]);

		triangle(ctx, false, (m_a - t_a <= 1) ? "blue" : "black", A, B, C);

		[A, B, C].forEach(P => {
			line(ctx, true, "red", P, [x, y]);
			circle(ctx, false, "red", (dist(P[0], P[1], x, y) <= 5) ? 8 : 4, P[0], P[1]);
		});

		line(ctx, true, "red", A, B);
		line(ctx, true, "red", B, C);
		line(ctx, true, "red", C, A);

		circle(ctx, false, "green", 3, x, y);

		text(ctx, false, "black", "25px Calibri", "The Point in Triangle 2D Problem", 10, 30);

		text(ctx, false, "black", "16px Calibri", "When the cursor is in the black triangle, it becomes blue", 15, 55);
		text(ctx, false, "black", "16px Calibri", "We know this because the point is inside when the area of the 3 triangles", 15, 73);
		text(ctx, false, "black", "16px Calibri", "formed by the red lines is equal to the area of the black triangle", 15, 91);
		text(ctx, false, "black", "16px Calibri", "Click and drag the corners of the triangle to resize it", 15, 109);
	
		text(ctx, false, "black", "15px Calibri", "George Lewis - georgelewis.ca", 5, canvas.height - 8);

		requestAnimationFrame(frame);	
	}
	requestAnimationFrame(frame);
}

document.addEventListener("DOMContentLoaded", function(event) {
    main();
});
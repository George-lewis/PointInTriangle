// MATH

const dist = (a, b) => {
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5;
};

const area = (a, b, c) => {
    return Math.abs((a[0] * (b[1] - c[1])) + (b[0] * (c[1] - a[1])) + (c[0] * (a[1] - b[1])));
};


// STATS

const permute = (points) => points.flatMap((point, i) => points.slice(i + 1).map(point2 => [point, point2]));


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
};

const triangle = (ctx, type, color, a, b, c) => {
    draw(ctx, type, color, () => {
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.lineTo(c[0], c[1]);
    });
};

const line = (ctx, type, color, a, b) => {
    draw(ctx, type, color, () => {
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
    });
};

const circle = (ctx, type, color, radius, p) => {
    draw(ctx, type, color, () => {
        ctx.arc(p[0], p[1], radius, 0, 2 * Math.PI);
    });
};

// Not used currently
const rect = (ctx, stroke, color, x, y, w, h) => {
    if (!stroke) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    } else {
        ctx.strokeStyle = color;
        ctx.strokeRect(x, y, w, h);
    }
};

const clearRect = (ctx, x, y, w, h) => {
    ctx.clearRect(x, y, w, h);
};

const text = (ctx, stroke, color, font, text, x, y) => {
    ctx.font = font;
    if (!stroke) {
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    } else {
        ctx.strokeStyle = color;
        ctx.strokeText(text, x, y);
    }
};

const main = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    let points = null;
    let dragging = null;
    let mouseLoc = null;

    const setTriangle = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const midX = canvas.width / 2;
        const midY = canvas.height / 2;

        mouseLoc = [midX, midY];

        points = [
            [midX, midY - 300],
            [(Math.cos(Math.PI * 1.2) * 300) + midX, midY - (Math.sin(Math.PI * 1.2) * 300)],
            [(Math.cos(Math.PI * 1.8) * 300) + midX, midY - (Math.sin(Math.PI * 1.8) * 300)]
        ];
    };

    setTriangle();

    canvas.onmousedown = () => {
        points.some((point, i) => {
            if (dist(mouseLoc, point) <= 5) {
                dragging = i;
                return true;
            }
        });
    };

    canvas.onmouseup = () => {
        dragging = null;
    };

    canvas.onmousemove = (event) => {
        // To interact you must mouse move so it would make sense to set mouse location for this event
        mouseLoc = [event.pageX, event.pageY];

        if (dragging !== null) {
            points[dragging] = mouseLoc;
        }
    };

    const frame = () => {

        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            setTriangle();
        }

        clearRect(ctx, 0, 0, canvas.width, canvas.height);

        // Create point pairs beforehand
        const pointPairs = permute(points);

        const m_a = pointPairs.map(pointPair => {
            return area(...pointPair, mouseLoc);
        }).reduce((total, subArea) => {
            return total + subArea;
        });

        const t_a = area(...points);

        triangle(ctx, false, (m_a - t_a <= 1) ? "blue" : "black", ...points);

        points.forEach(point => {
            line(ctx, true, "red", point, mouseLoc);
            circle(ctx, false, "red", (dist(point, mouseLoc) <= 5) ? 8 : 4, point);
        });

        pointPairs.forEach(pointPair => {
            line(ctx, true, "red", ...pointPair);
        });

        circle(ctx, false, "green", 3, mouseLoc);

        text(ctx, false, "black", "25px Calibri", "The Point in Triangle 2D Problem", 10, 30);

        text(ctx, false, "black", "16px Calibri", "When the cursor is in the black triangle, it becomes blue", 15, 55);
        text(ctx, false, "black", "16px Calibri", "We know this because the point is inside when the area of the 3 triangles", 15, 73);
        text(ctx, false, "black", "16px Calibri", "formed by the red lines is equal to the area of the black triangle", 15, 91);
        text(ctx, false, "black", "16px Calibri", "Click and drag the corners of the triangle to resize it", 15, 109);

        text(ctx, false, "black", "15px Calibri", "George Lewis - georgelewis.ca", 5, canvas.height - 8);

        requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
};

document.addEventListener("DOMContentLoaded", main);
/* Draws the patterned frame of the scope diagram: three rows of marks that follow the rounded
   frame, plus signs for structure along the top, dots for data along the bottom. Down the sides
   each mark morphs continuously from plus to dot. Marks rotate with the curve at the corners.
   The stability and safety block is painted above the frame, so the band's ends run into it. */
(function () {
    var frame = document.querySelector('.scope-frame');
    if (!frame || !('ResizeObserver' in window)) return;

    var NS = 'http://www.w3.org/2000/svg';
    var STEP = 8;          // spacing between marks and between rows, px
    var ROWS = 3;
    var R = 40;            // outer corner radius, px (matches --scope-radius in CSS)
    var ARM = 3.2;         // half length of a plus arm
    var DOT = 1.3;         // dot radius

    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'scope-marks');
    svg.setAttribute('aria-hidden', 'true');
    var plus = document.createElementNS(NS, 'path');
    var dots = document.createElementNS(NS, 'path');
    plus.setAttribute('class', 'plus');
    dots.setAttribute('class', 'dot');
    svg.appendChild(plus);
    svg.appendChild(dots);
    frame.insertBefore(svg, frame.firstChild);
    frame.classList.add('has-marks');

    function draw() {
        var W = frame.offsetWidth, H = frame.offsetHeight;
        if (!W || !H) return;
        svg.setAttribute('width', W);
        svg.setAttribute('height', H);
        var p = [], d = [];

        function mark(x, y, angle) {
            // t runs from 0 (pure plus) near the top to 1 (pure dot) near the bottom;
            // in between the arms shorten while a central dot grows
            var t = Math.min(1, Math.max(0, (y / H - 0.1) / 0.8));
            var arm = ARM * (1 - t), rad = DOT * t;
            if (arm > 0.35) {
                var a = angle * Math.PI / 180, dx = Math.cos(a) * arm, dy = Math.sin(a) * arm;
                p.push('M' + r2(x - dx) + ' ' + r2(y - dy) + 'L' + r2(x + dx) + ' ' + r2(y + dy));
                p.push('M' + r2(x + dy) + ' ' + r2(y - dx) + 'L' + r2(x - dy) + ' ' + r2(y + dx));
            }
            if (rad > 0.3) {
                d.push('M' + r2(x - rad) + ' ' + r2(y) + 'a' + r2(rad) + ' ' + r2(rad) + ' 0 1 0 ' + r2(2 * rad) +
                       ' 0a' + r2(rad) + ' ' + r2(rad) + ' 0 1 0 ' + r2(-2 * rad) + ' 0');
            }
        }
        function r2(v) { return Math.round(v * 100) / 100; }
        // marks along a straight edge, spaced evenly so the first and last land on the corner arcs
        function edge(from, to, fixed, horizontal, angle) {
            var n = Math.max(1, Math.round((to - from) / STEP));
            for (var k = 0; k <= n; k++) {
                var v = from + (to - from) * k / n;
                if (horizontal) { mark(v, fixed, angle); } else { mark(fixed, v, angle); }
            }
        }
        function arc(cx, cy, r, a0, a1) {
            var n = Math.max(1, Math.round((Math.PI / 2 * r) / STEP));
            for (var k = 1; k < n; k++) {
                var a = a0 + (a1 - a0) * k / n, t = a * Math.PI / 180;
                mark(cx + r * Math.cos(t), cy + r * Math.sin(t), a);
            }
        }

        for (var row = 0; row < ROWS; row++) {
            var inset = STEP / 2 + row * STEP;   // distance of this row's centre from the outer edge
            var r = R - inset;
            edge(R, W - R, inset, true, 0);          // top
            edge(R, W - R, H - inset, true, 0);      // bottom
            edge(R, H - R, inset, false, 90);        // left
            edge(R, H - R, W - inset, false, 90);    // right
            arc(R, R, r, 180, 270);                  // top-left
            arc(W - R, R, r, 270, 360);              // top-right
            arc(R, H - R, r, 90, 180);               // bottom-left
            arc(W - R, H - R, r, 0, 90);             // bottom-right
        }
        plus.setAttribute('d', p.join(''));
        dots.setAttribute('d', d.join(''));
    }

    new ResizeObserver(draw).observe(frame);
    draw();
})();

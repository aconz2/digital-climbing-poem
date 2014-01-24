var ease = require('ease');
var css = require('css');
var raf = require('raf');
var query = require('query');
var scrollTo = require('scroll-to');
var status = require('status');

// elements
var credits = query('#credits');
var mobius = query.all('.mobius');
var mobi = [];
for (var i = 0; i < mobius.length; i++) {
    var m = mobius[i];
    var words = [];
    //for(var j = 0; j < m.children.length; j++) {
    //    var c = m.children[j];
    //    c.textContent.split(' ').forEach(function(w) {
    //        words.push(w);
    //    });
    //}
    //while(m.children.length > 0) m.removeChild(m.firstChild)
    //words.forEach(function(word) {
    //    var li = document.createElement('li');
    //    li.textContent = word;
    //    m.appendChild(li);
    //});

    mobi.push({
        mobius: mobius[i],
        lines: query.all('li', mobius[i])
    });
    css(mobius[i], {
        transformStyle: 'preserve-3d',
        perspectiveOrigin: '0 -810px',
        perspective: '1140px'
    });
}

// constants
var height = 10000;
var width = 5000;
var actualHeight = height - window.innerHeight;
var actualWidth = width - window.innerWidth;
var maxRadius = 250;
var tau = Math.PI * 2;
var white = {r:255, g:255, b:255};
var black = {r:0, g:0, b:0};

// state
var stateFns = {
    radius: function (x, y) {
        return function(i, n) {
            return i == Math.floor(n * y) ? Math.sin(y * tau * 1.5) * maxRadius : 0;
        };
    },
    opacity: function(x, y) {
        return function(i, n) {
            return i == Math.floor(n * y) ? Math.sin(y * tau * 3 - 1.5) * 0.5 + 0.5 : 0;
        };
    },
    spin: function (x, y) { return x * 360; }
};
var state = {};

// init
css(document.body, 'height', height);
css(document.body, 'width', width);
window.addEventListener('scroll', onScroll);
query('#demo').addEventListener('click', demo);
render();

function render() {
    resolveState();

    // lines
    for (var i = 0; i < mobi.length; i++) {
        var mobius = mobi[i].mobius;
        var lines = mobi[i].lines;
        var step = 360 / lines.length;
        css(mobius, 'opacity', '' + state.opacity(i, mobi.length));

        for (var j = 0; j < lines.length; j++) {
            var line = lines[j];
            var d = -1 * step * j + state.spin;
            var style = [
                'rotateY('+ d +'deg)',
                'translateZ('+ state.radius(i, mobi.length) +'px)',
                'rotateX('+ d +'deg)',
                'rotateZ(90deg)'
            ].join(' ');
            css(line, 'transform', style);
        }
    }
}

function onScroll(e) {
    raf(render);
}

function resolveState() {
    var xp = window.scrollX / actualWidth;
    var yp = window.scrollY / actualHeight;
    for(var k in stateFns) {
        state[k] = stateFns[k](xp, yp);
    }
}

function demo() {
    scrollTo(actualWidth, actualHeight, {
        duration: 1000 * 10,
        ease: 'linear'
    });
}

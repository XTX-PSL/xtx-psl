(function () {
    var hearts = [];
    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var timer;

    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function (callback) {
                setTimeout(callback, 1000 / 60);
            }
    })();

    init();

    function init() {
        css(".heart{width: 10px;height: 10px;position: fixed;background: red;transform: rotate(45deg);}");
        css(".heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;position: fixed;}");
        css(".heart:before{top: -5px;left: 0;}");
        css(".heart:after{left: -5px;top: 0;}");
        attachEvent();
        gameloop();
        startCreatingHearts();
    }

    function gameloop() {
        for (var i = 0; i < hearts.length; i++) {
            if (hearts[i].alpha <= 0) {
                document.body.removeChild(hearts[i].el);
                hearts.splice(i, 1);
                continue;
            }
            hearts[i].y--;
            hearts[i].scale += 0.004;
            hearts[i].alpha -= 0.013;
            hearts[i].el.style.cssText = "left:" + hearts[i].x + "px;top:" + hearts[i].y + "px;opacity:" + hearts[i].alpha + ";transform:scale(" + hearts[i].scale + "," + hearts[i].scale + ") rotate(45deg);background:" + hearts[i].color;
        }
        requestAnimationFrame(gameloop);
    }

    function attachEvent() {
        document.addEventListener('mousemove', function (event) {
            mouseX = event.clientX;
            mouseY = event.clientY;
        });
    }

    function createHeartAtPosition(x, y) {
        var d = document.createElement("div");
        d.className = "heart";
        hearts.push({
            el: d,
            x: x - 5,
            y: y - 5,
            scale: 1,
            alpha: 1,
            color: randomColor()
        });
        document.body.appendChild(d);
    }

    function startCreatingHearts() {
        timer = setInterval(function () {
            createHeartAtPosition(mouseX, mouseY);
        }, 1000); // 设置间隔时间为1.5秒
    }

    function css(css) {
        var style = document.createElement("style");
        style.type = "text/css";
        try {
            style.appendChild(document.createTextNode(css));
        } catch (ex) {
            style.styleSheet.cssText = css;
        }
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function randomColor() {
        return "rgb(" + (~~(Math.random() * 255)) + "," + (~~(Math.random() * 255)) + "," + (~~(Math.random() * 255)) + ")";
    }
})();
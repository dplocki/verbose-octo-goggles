document.addEventListener('alpine:init', () => {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');

    let originX = null;
    let originY = null;

    Alpine.data('app', () => ({
        width: canvas.width,
        height: canvas.height,
        scaleX: 40,
        scaleY: 100,

        k: 1,
        formula: 'k * Math.sin(x)',

        init() {
            originX = this.width / 2;
            originY = this.height / 2;
            this.redrawGraph();
        },

        drawAxes() {
            ctx.beginPath();
            ctx.strokeStyle = 'black';

            ctx.moveTo(0, originY);
            ctx.lineTo(this.width, originY);

            ctx.moveTo(originX, 0);
            ctx.lineTo(originX, this.height);

            ctx.stroke();

            ctx.font = '12px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';

            for (let x = -originX; x < this.width - originX; x += this.scaleX) {
                const canvasX = originX + x;
                ctx.moveTo(canvasX, originY - 5);
                ctx.lineTo(canvasX, originY + 5);
                ctx.stroke();
                ctx.fillText((x / this.scaleX).toFixed(1), canvasX, originY + 15);
            }

            ctx.textAlign = 'right';
            for (let y = -originY; y < this.height - originY; y += this.scaleY) {
                const canvasY = originY - y;
                ctx.moveTo(originX - 5, canvasY);
                ctx.lineTo(originX + 5, canvasY);
                ctx.stroke();
                if (y !== 0) {
                    ctx.fillText((y / this.scaleY).toFixed(1), originX - 10, canvasY + 3);
                }
            }
        },

        plotFunction(func, color = 'blue') {
            ctx.beginPath();
            ctx.strokeStyle = color;

            let first = true;
            for (let x = -originX; x < this.width - originX; x += 0.1) {
                const mathX = x / this.scaleX;
                const mathY = func(mathX);

                const canvasX = originX + x;
                const canvasY = originY - mathY * this.scaleY;

                if (first) {
                    ctx.moveTo(canvasX, canvasY);
                    first = false;
                } else {
                    ctx.lineTo(canvasX, canvasY);
                }
            }

            ctx.stroke();
        },

        redrawGraph() {
            ctx.clearRect(0, 0, this.width, this.height);
            this.drawAxes();
            this.plotFunction(((k) => x => eval(this.formula))(this.k), 'red');
        },

        globalKeydownPress(event) {
            if (event.key === 'ArrowDown') {
                this.k -= 0.1;
                this.redrawGraph();
            } else if (event.key === 'ArrowUp') {
                this.k += 0.1;
                this.redrawGraph();
            }
        }
    }));
});

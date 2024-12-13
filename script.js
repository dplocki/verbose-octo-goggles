document.addEventListener('alpine:init', () => {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    let k = 1;

    Alpine.data('app', () => ({
        width: canvas.width,
        height: canvas.height,
        scaleX: 40,
        scaleY: 100,
        originX: 0,
        originY: 0,
        formula: 'k * Math.sin(x)',

        init() {
            this.originX = this.width / 2;
            this.originY = this.height / 2;
            this.redrawGraph();
        },

        drawAxes() {
            ctx.beginPath();
            ctx.strokeStyle = 'black';

            ctx.moveTo(0, this.originY);
            ctx.lineTo(this.width, this.originY);

            ctx.moveTo(this.originX, 0);
            ctx.lineTo(this.originX, this.height);

            ctx.stroke();

            ctx.font = '12px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';

            for (let x = -this.originX; x < this.width - this.originX; x += this.scaleX) {
                const canvasX = this.originX + x;
                ctx.moveTo(canvasX, this.originY - 5);
                ctx.lineTo(canvasX, this.originY + 5);
                ctx.stroke();
                ctx.fillText((x / this.scaleX).toFixed(1), this.canvasX, this.originY + 15);
            }

            ctx.textAlign = 'right';
            for (let y = -this.originY; y < this.height - this.originY; y += this.scaleY) {
                const canvasY = this.originY - y;
                ctx.moveTo(this.originX - 5, this.canvasY);
                ctx.lineTo(this.originX + 5, this.canvasY);
                ctx.stroke();
                if (y !== 0) {
                    ctx.fillText((y / this.scaleY).toFixed(1), this.originX - 10, this.canvasY + 3);
                }
            }
        },

        plotFunction(func, color = 'blue') {
            ctx.beginPath();
            ctx.strokeStyle = color;

            let first = true;
            for (let x = -this.originX; x < this.width - this.originX; x += 0.1) {
                const mathX = x / this.scaleX;
                const mathY = func(mathX);

                const canvasX = this.originX + x;
                const canvasY = this.originY - mathY * this.scaleY;

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
            this.plotFunction(x => eval(this.formula), 'red');
        },

        globalKeydownPress(event) {
            if (event.key === 'ArrowDown') {
                k -= 0.1;
                this.redrawGraph();
            } else if (event.key === 'ArrowUp') {
                k += 0.1;
                this.redrawGraph();
            }
        }
    }));
});
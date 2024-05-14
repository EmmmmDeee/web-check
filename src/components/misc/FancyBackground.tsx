import { useEffect, useRef } from "react";

const FancyBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) {
      return;
    }

    const makeAbsolute = (elem: HTMLElement) => {
      elem.style.position = "absolute";
      elem.style.top = "0";
      elem.style.left = "0";
    };

    const maxBy = (array: any[], iteratee: (e: any) => number) => {
      let result: any = null;
      let computed: number = -Infinity;
      for (const value of array) {
        const current = iteratee(value);
        if (current != null && current > computed) {
          computed = current;
          result = value;
        }
      }
      return result;
    };

    const setup = () => {
      const chaos = 30;
      const iteratee = (e: any) => e.field + chaos * Math.random();

      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.opacity = "0.5";
      makeAbsolute(canvas);

      const container = containerRef.current;
      if (container) {
        container.style.color = "#141d2b";
        makeAbsolute(container);
        container.appendChild(canvas);
      }

      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;

      const xC = width / 2;
      const yC = height / 2;

      const stepCount = 0;
      const particles: any[] = [];

      // Build grid
      const gridSize = 8;
      const gridSteps = Math.floor(1000 / gridSize);
      const grid: any[] = [];
      let i = 0;
      for (let xx = -500; xx < 500; xx += gridSize) {
        for (let yy = -500; yy < 500; yy += gridSize) {
          const r = Math.sqrt(xx * xx + yy * yy);
          const field =
            r < 100
              ? (255 / 100) * r
              : 255 - Math.min(255, (r - 100) / 2);

          grid.push({
            x: xx,
            y: yy,
            busyAge: 0,
            spotIndex: i,
            isEdge:
              xx === -500
                ? "left"
                : xx === -500 + gridSize * (gridSteps - 1)
                ? "right"
                : yy === -500
                ? "top"
                : yy === -500 + gridSize * (gridSteps - 1)
                ? "bottom"
                : false,
            field: field,
          });
          i++;
        }
      }

      const gridMaxIndex = i;

      const initDraw = () => {
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = "#141d2b";
        ctx.fill();
        ctx.closePath();
      };

      const evolve = () => {
        // ...
      };

      const birth = () => {
        // ...
      };

      const kill = (particleName: string) => {
        // ...
      };

      const move = () => {
        // ...
      };

      initDraw();
      birth();

      const frame = () => {
        evolve();
        requestAnimationFrame(frame);
      };
      frame();
    };

    setup();
  }, []);

  return (
    <div className="ui" id="fancy-background">
      <p>
        <span className="dead">0</span>
      </p>
      <p>
        <span className="alive">0</span>
      </p>
      <p>
        <span className="drawn">0</span>
      </p>
      <p>
        <span className="fps">0</span>
      </p>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default FancyBackground;

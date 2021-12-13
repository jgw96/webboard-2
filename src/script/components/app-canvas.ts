import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { set, get } from 'idb-keyval';

@customElement('app-canvas')
export class AppCanvas extends LitElement {
  @state() canvas: HTMLCanvasElement | undefined = undefined;
  @state() ctx: CanvasRenderingContext2D | null = null;

  @property() color: string = "black";

  static styles = [
    css`
      :host {
        display: block;
      }

      canvas {
        touch-action: none;
      }
    `,
  ];

  async firstUpdated() {
    const canvasEL = this.shadowRoot?.querySelector('canvas');

    if (canvasEL) {
      this.canvas = canvasEL as HTMLCanvasElement;
      this.ctx = this.canvas.getContext('2d');

      this.canvas.height = window.innerHeight;
      this.canvas.width = window.innerWidth;

      await this.setupCanvas();
      await this.setupDrawing();

      window.onresize = async () => {
          if (this.canvas && this.ctx) {
            this.canvas.height = window.innerHeight;
            this.canvas.width = window.innerWidth;

            this.setupCanvas();

            const canvasState = await (get('canvasState') as any);

            if (canvasState) {
                const tempImage = new Image();
                tempImage.onload = () => {
                  this.ctx?.drawImage(tempImage, 0, 0);
                }
                tempImage.src = canvasState;
              }
          }
      }
    }
  }

  setupCanvas(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.canvas && this.ctx) {
        this.ctx.lineWidth = 5;
        this.ctx.lineCap = 'round';

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.globalCompositeOperation = 'source-over';

        this.ctx.strokeStyle = this.color || 'black';

        resolve();
      } else {
        reject();
      }
    });
  }

  async setupDrawing() {
    const module = await import('pointer-tracker');

    if (this.canvas && this.ctx) {
      const that = this;

      new module.default(this.canvas, {
        start(pointer, event) {
          console.log(pointer);
          event.preventDefault();
          return true;
        },
        end(pointer) {
          console.log(pointer);

          window.requestIdleCallback(() => {
              that.quickInkSave();
          }, {
            timeout: 200,
          })
        },
        move(previousPointers, changedPointers, event: any) {
          console.log(event);

          if (that.ctx) {
            that.ctx.strokeStyle = that.color || 'black';
          }

          for (const pointer of changedPointers) {
            const previous = previousPointers.find((p) => p.id === pointer.id);

            if (that.ctx && previous) {
              if (
                (pointer.nativePointer as PointerEvent).pointerType === 'pen'
              ) {
                let tweakedPressure =
                  (pointer.nativePointer as PointerEvent).pressure * 6;
                that.ctx.lineWidth =
                  (pointer.nativePointer as PointerEvent).width +
                  tweakedPressure;
              } else if (
                (pointer.nativePointer as PointerEvent).pointerType === 'touch'
              ) {
                that.ctx.lineWidth =
                  (pointer.nativePointer as PointerEvent).width - 40;
              } else if (
                (pointer.nativePointer as PointerEvent).pointerType === 'mouse'
              ) {
                that.ctx.lineWidth = 4;
              }

              that.ctx.beginPath();

              that.ctx.moveTo(previous.clientX, previous.clientY);

              for (const point of pointer.getCoalesced()) {
                that.ctx.lineTo(point.clientX, point.clientY);
              }

              that.ctx.stroke();

              that.ctx.closePath();
            }
          }
        },
      });
    }
  }

  public resetCanvas() {
    if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.ctx.fillStyle = "white";
        this.ctx?.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
  }

  async quickInkSave() {
      if (this.canvas) {
        let canvasState = this.canvas.toDataURL();
        await set('canvasState', canvasState);
      }
  }

  render() {
    return html` <canvas></canvas> `;
  }
}

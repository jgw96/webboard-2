import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '../components/app-canvas';
import '../components/canvas-controls';

@customElement('app-drawing')
export class AppDrawing extends LitElement {

  @state() chosenColor: string = "black";

  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  handleColor(color: string) {
      this.chosenColor = color;
  }

  resetCanvas() {
    (this.shadowRoot?.querySelector('app-canvas') as any)?.resetCanvas();
  }

  render() {
    return html`
        <app-canvas .color="${this.chosenColor}"></app-canvas>

        <canvas-controls @reset-canvas="${() => this.resetCanvas()}" @change-color="${(event: CustomEvent) => this.handleColor(event.detail.color)}"></canvas-controls>
    `;
  }
}

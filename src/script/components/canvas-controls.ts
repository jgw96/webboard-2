import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js'

@customElement('canvas-controls')
export class CanvasControls extends LitElement {
    static styles = [
        css`
            :host {
                display: block;

                position: fixed;
                bottom: 16px;
                right: 16px;
            }

            .color {
              height: 28px;
              border-radius: 50%;
              width: 28px;
              border: solid 3px black;
              cursor: pointer;
            }

            .red {
              background: red;
            }

            .blue {
                background: blue;
            }

            .yellow {
                background: yellow;
            }

            .black {
                background: black;
            }

            .white {
                background: white;
            }

            .controls {
                display: flex;
                flex-direction: row;
                background: white;
                padding: 8px;
                border-radius: 32px;
                box-shadow: 0 0 10px 4px #686bd261;
                justify-content: space-between;
                align-items: center;
                padding-left: 1em;
                padding-right: 1em;
                padding-top: 14px;
                padding-bottom: 14px;
            }

            #general-controls {
                display: flex;
                margin-right: 14px;
            }

            #color-controls {
                display: flex;
                justify-content: space-between;
                width: 13em;
            }
        `
    ];

    changeColor(color: string) {
        this.dispatchEvent(new CustomEvent('change-color', {
            detail: {
                color: color
            }
        }));
    }

    resetCanvas() {
        this.dispatchEvent(new CustomEvent('reset-canvas', {
            detail: {
                reset: true
            }
        }));
    }

    render() {
        return html`
          <div class="controls">
            <div id="general-controls">
                <fluent-button @click="${() => this.resetCanvas()}">Reset</fluent-button>
            </div>

            <div id="color-controls">
                <div @click="${() => this.changeColor("red")}" class="color red"></div>
                <div @click="${() => this.changeColor("blue")}" class="color blue"></div>
                <div @click="${() => this.changeColor("yellow")}" class="color yellow"></div>
                <div @click="${() => this.changeColor("black")}" class="color black"></div>
                <div @click="${() => this.changeColor("white")}" class="color white"></div>
            </div>
          </div>
        `;
    }
}

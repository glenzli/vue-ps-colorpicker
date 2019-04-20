<template>
  <div class="color-picker">
    <slider class="sb-component" :input="sbCoordinate" direction="xy" @updated="UpdateSBComponent">
      <div class="component" :style="{background: `linear-gradient(90deg, hsl(${Math.round(hsv.hue * 360)}, 100%, 100%), hsl(${Math.round(hsv.hue * 360)}, 100%, 50%))`}"></div>
      <div class="b component"></div>
      <div class="thumb" slot="thumb" :style="sbThumbStyle"></div>
    </slider>
    <slider class="h-component" :input="hCoordinate" direction="y" @updated="UpdateHComponent">
      <div class="component"></div>
      <div class="thumb" slot="thumb" :style="hThumbStyle"></div>
    </slider>
    <slider class="alpha-component" :input="hsv.alpha" direction="y" @updated="UpdateColor('alpha', $event)">
      <div class="component pattern"></div>
      <div class="component" :style="{background: `linear-gradient(0, rgba(${cssRgb.r}, ${cssRgb.g}, ${cssRgb.b}, 1), rgba(${cssRgb.r}, ${cssRgb.g}, ${cssRgb.b}, 0))`}"></div>
      <div class="thumb" slot="thumb" :style="currentBackground"></div>
    </slider>
    <div class="color-properties">
      <div class="preview pattern"></div>
      <div class="preview" :style="originalBackground"></div>
      <div class="preview" :style="currentBackground"></div>
      <span class="seperator"></span>
      <digit-input class="channel" v-for="c in ['red', 'green', 'blue']" :key="c" :input="rgb[c]" :range="[0, 255]" :coefficient="255" :digit="0" @updated="UpdateColor(c, $event)">
        <span>{{c[0].toUpperCase()}}</span>
      </digit-input>
      <span class="seperator"></span>
      <digit-input class="channel" :input="hsv.hue" :range="[0, 360]" :digit="0" :coefficient="360" @updated="UpdateColor('hue', $event)">
        <span>H</span>
      </digit-input>
      <digit-input class="channel" v-for="c in ['saturation', 'value']" :key="c" :input="hsv[c]" :range="[0, 100]" :digit="0" :coefficient="100" @updated="UpdateColor(c, $event)">
        <span>{{c[0].toUpperCase()}}</span>
      </digit-input>
      <span class="seperator"></span>
      <digit-input class="channel" :input="hsv.alpha" :range="[0, 100]" :digit="0" :coefficient="100" @updated="UpdateColor('alpha', $event)">
        <span>T</span>
      </digit-input>
      <span class="seperator"></span>
      <hex-input class="channel" :input="hex" :constraint="hexRegex" @updated="UpdateHex">
        <span>#</span>
      </hex-input>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { ColorObject, HsvColor, Color$, HsvColorObject, Point, PointObject, Color } from '../core'
import Slider from './Slider.vue'
import DigitInput from './DigitInput.vue'
import HexInput from './HexInput.vue'


@Component({
  components: { Slider, DigitInput, HexInput },
})
export default class ColorPicker extends Vue {
  @Prop ({ required: true }) color!: ColorObject

  originalBackground: { background: string } | null = null
  hsv = HsvColor()
  hexRegex = /^([0-9a-fA-F]{6})|([0-9a-fA-F]{3})$/

  get sbCoordinate() {
    return Point(this.hsv.saturation, 1 - this.hsv.value)
  }

  get sbThumbStyle() {
    const shadow = this.hsv.value > 0.5 && this.hsv.saturation < 0.5 ? '#000' : '#fff'
    return Object.assign({ 'box-shadow': `0 0 0 1px ${shadow}` }, this.currentBackground)
  }

  get hCoordinate() {
    return 1 - this.hsv.hue
  }

  get hThumbStyle() {
    return { background: `hsl(${Math.round(this.hsv.hue * 360)}, 100%, 50%)` }
  }

  get currentBackground() {
    return { background: Color$.ToCss(this.rgb) }
  }

  get rgb() {
    return Color$.ToColor(this.hsv)
  }

  get cssRgb() {
    return { r: Math.round(255 * this.rgb.red), g: Math.round(255 * this.rgb.green), b: Math.round(255 * this.rgb.blue) }
  }

  get hex() {
    return Color$.ToHex(this.rgb).substr(1)
  }

  UpdateSBComponent(coordinate: PointObject) {
    this.hsv.saturation = coordinate.x
    this.hsv.value = 1 - coordinate.y
    this.$emit('pick', this.rgb)
  }

  UpdateHComponent(value: number) {
    this.hsv.hue = (1 - value)
    this.$emit('pick', this.rgb)
  }

  UpdateAlphaComponent(value: number) {
    this.hsv.alpha = value
    this.$emit('pick', this.rgb)
  }

  UpdateColor(channel: string, value: number) {
    switch (channel) {
      case 'red':
      case 'green':
      case 'blue':
        let newColor = this.rgb
        newColor[channel] = value
        this.hsv = Color$.ToHsv(newColor)
        break
      default:
        this.hsv[channel as keyof HsvColorObject] = value
        break
    }
    this.$emit('pick', this.rgb)
  }

  UpdateHex(hex: string) {
    let alpha = this.hsv.alpha
    this.hsv = Color$.ToHsv(Color$.ToColor(`#${hex}`))
    this.hsv.alpha = alpha
    this.$emit('pick', this.rgb)
  }

  Reset() {
    this.hsv = Color$.ToHsv(this.color)
    this.originalBackground = { background: Color$.ToCss(this.color) }
  }

  mounted() {
    this.Reset()
  }
}
</script>

<style lang="less" scoped>
.pattern {
  background-image: linear-gradient(45deg, #666 25%, transparent 25%, transparent 75%, #666 75%, #666),
  linear-gradient(45deg, #666 25%, transparent 25%, transparent 75%, #666 75%, #666);
  background-size:1rem 1rem;
  background-position:0 0, .5rem .5rem;
}

.color-picker {
  display: flex;
  align-items: stretch;
  background: #eee;

  .component {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
  }

  .thumb {
    height: 0.75rem;
    width: 1.5rem;
    transform: translateX(-0.25rem);
    border-radius: 25%;
    box-shadow: 0 0 0 1px #fff;
    pointer-events: none;
  }

  .sb-component {
    height: 18rem;
    width: 18rem;

    .component {
      &.b {
        background: linear-gradient(0, #000, rgba(255, 255, 255, 0))
      }
    }

    .thumb {
      height: 1rem;
      width: 1rem;
      border-radius: 100%;
      transform: translateX(0);
    }
  }

  .h-component {
    height: 18rem;
    width: 1rem;

    .component {
      background: linear-gradient(0, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);
    }
  }

  .alpha-component {
    height: 18rem;
    width: 1rem;
  }

  .color-properties {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    color: #222;

    .seperator {
      flex: 1;
    }

    .preview {
      height: 2rem;
      width: 5rem;

      &.pattern {
        height: 4rem;
        margin-bottom: -4rem;
      }
    }

    .channel {
      margin: 1px 0;
    }
  }

  /deep/ .input-box {
    display: flex;
    align-items: center;

    input {
      height: 1.5rem;
      background: #f8f8f8;
      color: #333;
      padding: 0;
      margin: 0 0.25rem;
      border: none;
      font: inherit;
      border-radius: 2px;
      width: 4rem;
      text-align: center;

      &:focus {
        outline: none;
      }

      &:hover {
        background: #f8f8f8;
      }

      &::selection {
        background: #333;
        color: #eee;
      }

      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        appearance: none;
      }
    }
  }

  &.dark {
    background: #333;

    .pattern {
      background-image: linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff),
      linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);
    }

    .color-properties {
      color: #ccc;
    }

    /deep/ .input-box {
      input {
        color: #f8f8f8;
        background: #444;
      }
    }
  }
}
</style>

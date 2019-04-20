<template>
  <div class="slider-box" @mousemove="Slide" @mouseup="End" @mouseleave="End">
    <div ref="slider" class="slider" @mousedown.prevent="Start">
      <slot></slot>
      <div class="thumb-box" :style="thumb">
        <div class="align-box" :class="direction">
          <slot name="thumb">
            <div class="default-thumb"></div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { DirectMath } from 'direct-object'
import { PointObject } from '../core'

@Component
export default class Slider extends Vue {
  @Prop({ required: true }) input!: PointObject | number
  @Prop({ default: 'x' }) direction!: string

  sliding = false

  get thumb() {
    switch (this.direction) {
      case 'x': return { left: `${(this.input as number) * 100}%` }
      case 'y': return { top: `${(this.input as number) * 100}%` }
      default: return { left: `${(this.input as PointObject).x * 100}%`, top: `${(this.input as PointObject).y * 100}%` }
    }
  }

  Start(event: MouseEvent) {
    this.sliding = true
    this.Slide(event)
  }

  Slide(event: MouseEvent) {
    if (this.sliding) {
      let ref = (this.$refs.slider as HTMLElement).getBoundingClientRect()
      let x = DirectMath.bound((event.pageX - ref.left) / ref.width, 0, 1)
      let y = DirectMath.bound((event.pageY - ref.top) / ref.height, 0, 1)
      switch (this.direction) {
        case 'x': this.$emit('updated', x); break
        case 'y': this.$emit('updated', y); break
        default: this.$emit('updated', {x, y}); break
      }
    }
  }

  End() {
    this.sliding = false
  }
}
</script>

<style lang="less" scoped>
.slider-box {
  padding: 1rem;
}

.slider {
  position: relative;
  cursor: pointer;
  height: 100%;
  width: 100%;

  .thumb-box {
    position: absolute;

    .align-box {
      &.x {
        transform: translateX(-50%);
      }
      &.y {
        transform: translateY(-50%);
      }
      &.xy {
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>

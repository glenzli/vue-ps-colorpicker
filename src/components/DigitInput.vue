<template>
  <div class="input-box">
    <slot></slot>
    <input ref="input" type="number" :value="value" @change="Update" @keydown="Prevent" @dblclick="Focus" @blur="Blur"/>
    <div class="seperator"></div>
    <slot name="unit"></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch, Vue } from 'vue-property-decorator'
import { DirectMath } from 'direct-object'

@Component
export default class DigitInput extends Mixins(Vue) {
  @Prop({ required: true }) input!: number | null
  @Prop({ default: () => [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY] }) range!: Array<number>
  @Prop({ default: 2 }) digit!: number
  @Prop({ default: 1 }) coefficient!: number
  @Prop({ default: 3 }) size!: number

  get precision() {
    return Math.pow(10, -this.digit)
  }

  get extractor() {
    return new RegExp(`-?\\d+(\\.\\d{0,${this.digit}})?`)
  }

  get value() {
    if (this.input != null && !Number.isNaN(this.input)) {
      let roundValue = DirectMath.round(this.input * this.coefficient, this.precision)
      return this.extractor.exec(roundValue.toString())![0]
    } else {
      return ''
    }
  }

  Update(event: Event) {
    let newValue = parseFloat((event.target as HTMLInputElement).value)
    if (!Number.isNaN(newValue)) {
      newValue = DirectMath.round(DirectMath.bound(newValue, this.range[0], this.range[1]), this.precision) / this.coefficient
      if (this.input == null || Number.isNaN(this.input) || Math.abs(newValue - this.input) > 1 / this.coefficient * this.precision * 0.99) {
        this.$emit('updated', newValue)
      }
    }
    (event.target as HTMLInputElement).value = this.value
  }

  Spin(value: number) {
    let newValue = DirectMath.round(DirectMath.bound(parseFloat(this.value) + value, this.range[0], this.range[1]), this.precision) / this.coefficient
    this.$emit('updated', newValue)
  }

  Prevent(event: KeyboardEvent) {
    if (event.key.startsWith('Arrow')) {
      event.preventDefault()
    }
  }

  Focus() {
    let input = this.$refs.input as HTMLInputElement
    input.focus()
    input.select()
  }

  Blur() {
    this.$emit('blur')
  }

  @Watch('range', { deep: true })
  OnRangeChanged(range: Array<number>, lastRange: Array<number>) {
    let value = parseFloat(this.value)
    let newValue = DirectMath.round(DirectMath.bound(value, this.range[0], this.range[1]), this.precision) / this.coefficient
    value /= this.coefficient
    if (Math.abs(newValue - value) > this.precision) {
      this.$emit('updated', newValue)
    }
  }
}
</script>

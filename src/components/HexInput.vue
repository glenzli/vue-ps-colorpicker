<template>
  <div class="input-box">
    <slot></slot>
    <input ref="input" type="text" @change="Update" @dblclick="Focus" @blur="Blur"/>
    <slot name="unit"></slot>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Inject, Mixins, Watch, Vue } from 'vue-property-decorator'
import { Generic } from 'direct-object'

const HEX_REGEX = /^([0-9a-fA-F]{6})|([0-9a-fA-F]{3})$/

@Component
export default class HexInput extends Vue {
  @Prop({ required: true }) input!: string | null

  candidates = new Array<string>()

  Update(event: Event) {
    let newValue = (event.target as HTMLInputElement).value.trim()
    if (newValue && HEX_REGEX.test(newValue)) {
      this.$emit('updated', newValue)
    }
    setTimeout(() => { (event.target as HTMLInputElement).value = this.input || '' }, 0)
  }

  Blur() {
    if (this.candidates.length === 0) {
      this.$emit('blur')
    }
  }

  Focus() {
    let input = this.$refs.input as HTMLInputElement
    input.focus()
    input.select()
  }

  @Watch('input')
  OnInputChanged(input: string) {
    (this.$refs.input as HTMLInputElement).value = input
  }

  mounted() {
    (this.$refs.input as HTMLInputElement).value = this.input!
  }
}
</script>

<template>
  <div id="app">
    <div class="container">
      <div class="title" :style="{ background: css, color: textColor }">{{cssText}}</div>
      <ps-colorpicker :color="color" :class="{ dark: darkMode }" @pick="Pick" class="shadow"></ps-colorpicker>
      <div class="button" @click="Toggle">{{mode}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { PsColorpicker } from './components'
import { Color, ColorObject, Color$ } from './core'

@Component({
  components: {
    PsColorpicker,
  },
})
export default class App extends Vue {
  color = Color(Math.random(), Math.random(), Math.random(), 1)
  darkMode = false

  get mode() {
    return this.darkMode ? 'Dark Mode' : 'Light Mode'
  }

  get css() {
    return Color$.ToCss(this.color)
  }

  get textColor() {
    return Color$.ToCss(Color$.HighContrast(this.color))
  }

  get cssText() {
    return Color$.ToHex(this.color)
  }

  Pick(color: ColorObject) {
    this.color = color
  }

  Toggle() {
    this.darkMode = !this.darkMode
  }
}
</script>

<style lang="less">
html, body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Consolas, 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.title {
  height: 5rem;
  width: 100%;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.shadow {
  box-shadow: 0 0 1rem #ccc;
}

.button {
  margin-top: 2rem;
  font-size: 1rem;
  padding: 0.5rem 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 1rem #333;
  background: #efefef;
  cursor: pointer;
}
</style>

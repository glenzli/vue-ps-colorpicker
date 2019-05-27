# vue-ps-colorpicker
![Build State](https://img.shields.io/travis/luz-alphacode/vue-ps-colorpicker.svg?style=flat-square)
![License](https://img.shields.io/github/license/luz-alphacode/vue-ps-colorpicker.svg?color=%23333&style=flat-square)
![Version](https://img.shields.io/github/package-json/v/luz-alphacode/vue-ps-colorpicker.svg?style=flat-square)
<br/>vue-ps-colorpicker is Photoshop style colorpicker in vue.

## Install
The recommended way to install and maintain vue-ps-colorpicker in your project is through the Node.js Pacakge Manager (NPM), simply type the npm command in your project folder:
```
npm install
```
## Usage
To use vue-ps-colorpicker, you have to import the component
```javascript
import { PsColorpicker } from 'vue-ps-colorpicker'

// ...
export default {
  components: { PsColorpicker },
  // ...
}
```
The colorpicker component takes only one input, with the form of **{ red: number, green: number, blue: number, alpha: number }**, each channel is range from 0 to 1.
```html
<ps-colorpicker :color="color"></ps-colorpicker>
```
![Light](/public/light.jpg)
The colorpicker also has a dark style, just add a dark class on the tag.
```html
<ps-colorpicker :color="color" class="dark"></ps-colorpicker>
```
![Light](/public/dark.jpg)

## Demo and Doc
Build demo by
```sh
npm run build:demo
```
You can view the demos on my [Github Pages](https://luz-alphacode.github.io/vue-ps-colorpicker/).

## License
Distributed under the MIT license. See [LICENSE](https://github.com/luz-alphacode/vue-ps-colorpicker/blob/master/LICENSE) for detail.
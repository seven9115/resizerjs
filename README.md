# Resizer.js

[![Build Status](https://img.shields.io/travis/eknowles/resizerjs/master.svg?style=flat-square)](https://travis-ci.org/eknowles/resizerjs)
[![Coveralls](https://img.shields.io/coveralls/eknowles/resizerjs/master.svg?style=flat-square)](https://coveralls.io/github/eknowles/resizerjs?branch=master)
[![NPM Version](https://img.shields.io/npm/v/resizerjs.svg?style=flat-square)](https://www.npmjs.com/package/resizerjs)
[![NPM Downloads](https://img.shields.io/npm/dt/resizerjs.svg?style=flat-square)](https://www.npmjs.com/package/resizerjs)
[![GitHub stars](https://img.shields.io/github/stars/eknowles/resizerjs.svg?style=flat-square)](https://github.com/eknowles/resizerjs/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/eknowles/resizerjs.svg?style=flat-square)](https://github.com/eknowles/resizerjs/issues)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/eknowles/resizerjs.svg?style=social)](https://twitter.com/intent/tweet?text=Wow&url=https://github.com/eknowles/resizerjs)

Resizer is a javascript library for handling custom resizing of flex box elements.

This allows the user to drag a handle to resize the frame.

## Installation

Install with NPM

```bash
$ npm i resizerjs
```

Add script to the document

```html
<script src="./node_modules/resizerjs/dist/resizer.min.js"></script>
```

Add the CSS and customise how you wish.

```css
[data-rz-handle] {
    flex: 0 0 6px;
    background-color: rgba(0, 0, 0, 0.5);
}

[data-rz-handle] div {
    width: 6px;
    background-color: rgba(0, 0, 0, 0.5);
}
```

## Usage

Create an instance of Resizer. Use a CSS selector of the container element as the first argument.

##### JavaScript

```javascript
const myResizer = new Resizer(el,options);
el:绑定的节点 例：'.container'
options:参数配置 例：{width:8,maxWdt:600,minWdt:300,startFn}
width:边框宽度
minWdt:缩放最小宽度
maxWdt:缩放最大宽度
startFn:拖动开始回调函数 例：start:function(){myResizer.setMaxWdt(800)}
```

##### HTML

```html
<div class="container">
    <div class="item"></div>
    <div class="item"></div>
</div>
```

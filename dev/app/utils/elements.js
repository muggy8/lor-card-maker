import factory from "/Utils/element-factory.js"
import React from "/cdn/react"
import { Range } from "/cdn/react-range";
import ReactMarkdown from "/cdn/react-markdown"
import loadCss from "/Utils/load-css.js"
export default factory

const cssLoaded = Promise.all([
    loadCss("/Utils/elements.css"),
])

export const div = factory("div")
export const a = factory("a")
export const span = factory("span")
export const strong = factory("strong")
export const main = factory("main")
export const img = factory("img")
export const h1 = factory("h1")
export const h2 = factory("h2")
export const h3 = factory("h3")
export const h4 = factory("h4")
export const h5 = factory("h5")
export const h6 = factory("h6")
export const button = factory("button")
export const input = factory("input")
export const label = factory("label")
export const select = factory("select")
export const option = factory("option")
export const textarea = factory("textarea")
export const section = factory("section")
export const svg = factory("svg")
export const rect = factory("rect")
export const path = factory("path")
export const foreignObject = factory("foreignObject")
export const br = factory("br")
export const style = factory("style")
export const nav = factory("nav")
export const header = factory("header")
export const small = factory("small")
export const fragment = factory(React.Fragment)
export const markdown = factory(ReactMarkdown)
export const range = factory(Range)
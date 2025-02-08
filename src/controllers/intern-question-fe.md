## Html

#### 1. Which attribute helps to group input elements with the "radio" type together?

A. type
B. id
C. name ✅
D. value

#### 2. How important is SEO in HTML? Which tags help optimize SEO?

A. SEO is not important in HTML
B. SEO in HTML is important, and tags like `<meta>, <title>, <h1>, and alt>` help optimize it ✅
C. Using only `<h1>` is enough to optimize SEO
D. Only JavaScript affects SEO, HTML does not matter

#### 3. Which of the following tags are inline elements?

A. `<footer>, <img>, <i>`
B. `<span>, <b>, <article>`
C. `<img>, <i>, <header>`
D. `<span>, <a>, <b>, <strong>` ✅

#### 4. Which of the following is NOT a valid HTML5 element?

A. `<section>`
B. `<article>`
C. `<frame> ✅`
D. `<aside>`

#### 5. What is the correct way to define a table header in HTML?

A. `<th> ✅`
B. `<thead>`
C. `<tr>`
D. `<td>`

#### 6. Which of the following elements should NOT be placed inside a `<head> tag?`

A. `<title>`
B. `<meta>`
C. `<link>`
D. `<div> ✅`

#### 7. Is it valid to nest an `<a>` tag inside another `<a>` tag in HTML?

A. Yes
B. No ✅

## Css

#### 1. What is the difference between height: 100% and height: 100vh in CSS?

A. There is no difference; both make the element full height
B. height: 100% depends on the parent element, while height: 100vh is based on the viewport height ✅
C. height: 100% is based on the viewport, and height: 100vh depends on the parent element
D. height: 100% works without a parent, while height: 100vh requires a parent element

#### 2. What pseudo-class do we use in CSS to select the last child element of a parent?

A. :last-of-type
B. :last-child ✅
C. :last
D. :nth-last-child

#### 3. Which of the following orders correctly represents CSS specificity from highest to lowest?

A. Inline styles > ID selectors > Class selectors > Element selectors ✅
B. ID selectors > Inline styles > Class selectors > Universal selector
C. Element selectors > Class selectors > ID selectors > Inline styles
D. Universal selector > Element selectors > Class selectors > ID selectors

#### 4. What is the meaning of defining font-size: 10px; in the CSS root (html)?

A. The default value of 1rem will be 10px ✅
B. The default value of 1em in the html element will be 16px
C. The default value of 1.6rem will be 10px
D. It prevents the use of % and em units in child elements

#### 5. What is the difference between inline, block, and inline-block elements in CSS?

A. inline elements take up the full width, while block and inline-block only take the necessary space.
B. block elements start on a new line and take full width, while inline elements stay in line with other elements, and inline-block behaves like inline but allows setting width and height ✅
C. inline-block is the same as block, but it has less margin
D. There is no difference; they all behave the same way

#### 6. When you are styling for a device with a viewport of 625x442px, what is 18px equal to in vw?

A. 2.88vw ✅
B. 18vw
C. 9vw
D.3.32vw

#### 7. Which of the following CSS properties are required to create a basic animation?

A. animation-name and animation-duration ✅
B. animation-timing-function and animation-delay
C. animation-direction and animation-iteration-count
D. animation-fill-mode and animation-play-state

## JavaScript

#### 1. How many data types are there in JavaScript?

A. String, Number, Bigint, Boolean, Undefined, Null, Symbol, Object ✅
B. String, Number, Bigint, Boolean, Undefined, Null, Array, Object
C. String, Number, Bigint, Boolean, Undefined, Null, Object
D. String, Number, Boolean, Undefined, Null, Object

#### 2. Are 'var' and 'let' both block scope in JavaScript true or false?

A. True
B. False ✅

#### 3. What does the map() function return?

A. A new array ✅
B. The same array
C. A single value
D. undefined

#### 4. For the following example, select the correct result when outputting to the screen:

`const objA = {name: "A"}
objA.name = "B"
console.log(objA )`
A. {name: "A"}
B. {name: "B"} ✅
C. {name: "A", name: "B"}
D. {name: "B", name: "A"}

#### 5. For the following example, select the correct result when outputting to the screen:

`let arr = ["a", 2, 3, 5]
for(let item in arr){
console.log(item)
}`
A. 0, 1, 2, 3 ✅
B. "a", 2, 3, 5
C. undefined
D. Error

#### 6. When is the load event in javascript fired?

`window.addEventListener("load", (event) => {});`
A. Only done when opening the website
B. Executed as soon as the DOM page is loaded
C. Executed when the entire page has finished loading, including dependent resources ✅
D. Only done when the site is closed

#### 7. What will be logged to the console?

`console.log(+"10" + -"5" + +"2" \* -"3");`
A. 5
B. 1
C. -3 ✅
D. NaN

#### 8. When is data stored in localStorage deleted? localStorage setItem('company', 'Kozocom');

A. The data will not be lost unless the user deletes it ✅
B. When the user closes the browser tab
C. When the user closes the whole browser
D. When users turn off their computers

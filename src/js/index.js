import "../css/index.css";

// function add(a, b) {
//   return a + b;
// }

const add = (a, b) => a + b;

const p = new Promise(
  setTimeout(() => {
    alert(999);
  }, 2000)
);
console.log(p);
// console.log(add(1, 2));
alert(add(2, 3));

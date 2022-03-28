// set the theme when loading the page 

let COOKIES = document.cookie.split("; ");
let theme = COOKIES.find(row => row.includes("quizGeoTheme"));
document.body.className=theme.split("=")[1];


//----handle the theme btn------

document.querySelector(".theme-btn span").addEventListener("click",()=>{
    document.body.classList.toggle("dark");
    document.querySelector(".theme-btn span").classList.toggle("btn-dark");
    document.cookie = `quizGeoTheme=${document.body.className}; expires=Tue, 19 Jan 2038 04:14:07 GMT`;
  })
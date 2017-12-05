import Math from 'mathjs'
import $ from 'jQuery'

const Utils = {}

Utils.binomial = function binomial(n, k) {
    /*
        Description:  [The formula] is often read out loud as "n choose k", because there are (n k) ways to choose a subset of size k elements, disregarding their order, from a set of n elements (see Wikipedia)
            https://en.wikipedia.org/wiki/Binomial_coefficient
            https://www.khanacademy.org/partner-content/pixar/crowds/crowds2/v/combinatorics11
        Note: Something goes wrong when we do larger numbers. The formula does return a float value (super close to a int but not exactly). Try (25, 4) => 12649.999999999998

    */
    return Math.factorial(n)/(Math.factorial(k)*Math.factorial(n-k))
}

Utils.alert = function alert(property) {
    let intId = setInterval(function () {
        $('body').css(property, '#'+Math.floor(Math.random()*16777215).toString(16))
    }, 25);

    setTimeout(function () {
        clearInterval(intId)
        $('body').css(property, 'white')
    }, 1500);
}

// TODO: tbr, fun but not needed.. this was an lazy attempt
// Utils.hashCode = function(s){
//   return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
// }

export default Utils

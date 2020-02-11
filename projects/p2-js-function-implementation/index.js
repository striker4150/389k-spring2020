/*
 * Function 1: Return the string "hello world".
 * Yep - that's literally it.
 */

function helloWorld(){
    return "hello world";
}

/*
 * Function 2: Given a number (int or float), square it and convert to string.
 * Return the string.
 * Examples:
 *  5 -> '25'
 *  1.2 -> '1.44'
 */

function squareToString(num){
    return String(num * num);
}

/*
 * Function 3: Reverse a string. We will only give you strings as input.
 * Examples:
 *  'hello' -> 'olleh'
 *  'fdas' -> 'sadf'
 */

function reverseString(str){
    return str.split('').reverse().join('');
}

 /*
  * Function 4: Given a dictionary, compute the average length of the values.
  * If a value is an integer, covert it to a string, and use the length of the
  * converted string in your computation.
  * Example:
  *     {
  *         'hello': 'world',
  *         'timothy': 'chen',
  *         'allen': 'cheng',
  *         2:'hi',
  *         3: 51
  *     }
  * ^ This will return 3.6.
  */

 function avgLenOfVals(dict){
     var len = Object.keys(dict).length;
     if(len == 0) return 0;

     var sum = 0.0;
     for (var key in dict) {
         sum += String(dict[key]).length;
     }
     return sum / len;
 }

/*
 * Function 5: stringToArr -> Given a string that has comma + whitespace
 *     separated values, and creates an array containing all the elements.
 *      Example:
 *          'hello, my,   name, is ,dickerson' ->
 *          ['hello','my','name','is','dickerson']
 *      Then, apply the second argument of the function (another function)
 *      to the array. Return this result.
 *      You will have to write your own tests to see if this function works.
 *
 */

function applyFunToArray(str, fun){
    var arr = str.split(/[,\s]+/g);
    
    return fun(arr);
}

module.exports = {
    helloWorld: helloWorld,
    squareToString: squareToString,
    reverseString: reverseString,
    avgLenOfVals: avgLenOfVals,
    applyFunToArray: applyFunToArray
}

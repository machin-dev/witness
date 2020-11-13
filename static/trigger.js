function test() {
    console.log("Test");
    var element = document.createElement('p');
    element.innerHTML = "Test string";
    document.getElementById('test').appendChild(element);
}
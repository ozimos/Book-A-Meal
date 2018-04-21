// Get the modal
const modal2 = document.getElementById('myModal2');

// Get the button that opens the modal
const btn2 = document.getElementsByClassName("modal-trigger2");

// Get the <span> element that closes the modal
const span2 = document.getElementsByClassName("close")[1];


for(let elem of btn2){
  elem.onclick = function () {
        modal2.style.display = "block";
      };
}
// When the user clicks on <span> (x), close the modal
span2.onclick = function () {
  modal2.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function (event) {
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
});

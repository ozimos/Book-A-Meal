// Get the modal
const modal = document.getElementById('myModal');

// Get the button that opens the modal
const btn = document.getElementsByClassName("modal-trigger");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];


for(let elem of btn){
  elem.onclick = function () {
        modal.style.display = "block";
      };
}
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});
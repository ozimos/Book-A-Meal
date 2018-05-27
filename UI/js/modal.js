// Get the modal
const modal = document.getElementById('myModal');
const modal2 = document.getElementById('myModal2');

// Get the button that opens the modal
const btn = document.getElementsByClassName('modal-trigger');
const btn2 = document.getElementsByClassName('modal-trigger2');

// Get the <span> element that closes the modal
const span = document.getElementsByClassName('close')[0];
const span2 = document.getElementsByClassName('close')[1];

const modalOpen = (arrayLike, target) => {
  if (arrayLike && target) {
    [...arrayLike].forEach((elem) => {
      elem.onclick = () => {
        target.style.display = 'block';
      };
    });
  }
};
modalOpen(btn, modal);
modalOpen(btn2, modal2);

// When the user clicks on <span> (x), close the modal

const modalClose = (item, target) => {
  if (item) {
    item.onclick = () => {
      target.style.display = 'none';
    };
  }
};
modalClose(span, modal);
modalClose(span2, modal2);


// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
  if (event.target === modal2) {
    modal2.style.display = 'none';
  }
});
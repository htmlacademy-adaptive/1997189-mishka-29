const nav = document.querySelector('.nav');
const menuButton = document.querySelector('.toggle');
const modal = document.querySelector('.modal');
const modalButton = document.querySelector('.card__button');
const modalBtnCatalog = document.querySelector('.catalog-card__cart');
console.log(modalBtnCatalog);

nav.classList.add('nav--closed');
menuButton.addEventListener('click',() => {
  nav.classList.toggle('nav--opened');
  nav.classList.toggle('nav--closed');
  }
);

if(modalButton) {
  modalButton.addEventListener('click',() => {
    modal.classList.add('modal--opened');
    }
  );
  }

  if (modal) {
  modal.addEventListener('click',() => {
    //modal.classList.remove('modal--opened');
    }
  );
  }

  if (modalBtnCatalog) {
  modalBtnCatalog.addEventListener('click',() => {
    modal.classList.add('modal--opened');
    }
  );
  }

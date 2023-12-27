var pageWidth;
var pageHeight;
var btnUp;
var scrollY;

window.onload = function() {
	pageWidth = document.documentElement.scrollWidth;
	pageHeight = document.documentElement.scrollHeight;
	btnUp = document.querySelector('.btn-up');
	
	/*btnUp.onscroll = function(e){
		scrollY = window.scrollY || document.documentElement.scrollTop;
      // если страница прокручена больше чем на 400px, то делаем кнопку видимой, иначе скрываем
		scrollY > 400 ? btnUp.show() : btnUp.hide();
	}
	alert('onscroll read');
	alert(scrollY);*/
	btnUp.onclick = function(){
		window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
		});
	}
}

function show(){
	alert('show');
	btnUp.classList.remove('btn-up_hide');
}


function hide(){
	alert('hide');
	btnUp.classList.add('btn-up_hide');
}
/*const btnUp = {
  el: document.querySelector('.btn-up'),
  show() {
    // удалим у кнопки класс btn-up_hide
    this.el.classList.remove('btn-up_hide');
  },
  hide() {
    // добавим к кнопке класс btn-up_hide
    this.el.classList.add('btn-up_hide');
  },
  addEventListener() {
    // при прокрутке содержимого страницы
    window.addEventListener('scroll', () => {
      // определяем величину прокрутки
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      // если страница прокручена больше чем на 400px, то делаем кнопку видимой, иначе скрываем
      scrollY > 400 ? this.show() : this.hide();
    });
    // при нажатии на кнопку .btn-up
    document.querySelector('.btn-up').onclick = () => {
		alert('клик');
      // переместим в начало страницы
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }
}*/
//btnUp.addEventListener();
// import 'bootstrap';
import '../main.css';
import * as yup from 'yup';

let schema = yup.string().url();
const form = document.querySelector('form');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const input = document.getElementById('url-input').value;
  // Проверяем, соответствует ли введенное значение схеме валидации
  schema.isValid(input).then((valid) => {
    if (valid) {
      alert('Введенный URL адрес корректен');
      // Вы можете сделать что-то еще, если URL адрес корректен
    } else {
      alert('Неверный URL адрес');
      // Вы можете сделать что-то еще, если URL адрес неверный
    }
  });
  // .catch((error) => {
  //   console.log(error); // Обработка ошибки, если что-то пошло не так
  // });
});

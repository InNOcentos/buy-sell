'use strict';

module.exports.offerCreateMessage = {
    WRONG_TITLE: `Заголовок должен быть строкой`,
    MIN_TITLE_LENGTH: `Заголовок должен быть не меньше 2 символов`,
    MAX_TITLE_LENGTH: `Заголовок должен быть не больше 100 символов`,
    MIN_COMMENT_LENGTH: `Комментарий должен быть не меньше 10 символов`,
    MAX_COMMENT_LENGTH: `Комментарий должен быть не больше 300 символов`,
    MIN_SUM_COUNT: `Сумма сделки должна быть не меньше 1`,
    MAX_SUM_COUNT: `Сумма сделки не должна превышать 1.000.000`,
    MIN_DESCRIPTION_LENGTH: `Описание должно быть не меньше 10 символов`,
    MAX_DESCRIPTION_LENGTH: `Описание должно быть не больше 1000 символов`,
    EMPTY_TYPE_VALUE: `Тип сделки не выбран`,
    EMPTY_PICTURE_VALUE: `Изображение предмета сделки отсутствует`,
    EMPTY_VALUE: `Поле обязательно для заполнения`,
  }
  module.exports.LoginMessage = {
    USER_NOT_EXISTS: `Пользователь с таким email не зарегистрирован`,
    WRONG_PASSWORD: `Неправильно введён логин или пароль`,
    WRONG_EMAIL: `Неправильный email`,
    REQUIRED_FIELD: `Поле обязательно для заполнения`,
  }
  
  module.exports.registerMessage = {
    EMPTY_FIRSTNAME_VALUE: `Введите имя`,
    EMPTY_SECONDNAME_VALUE: `Введите фамилию`,
    EMPTY_VALUE: `Поле обязательно для заполнения`,
    MIN_PASSWORD_LENGTH: `Пароль должен быть не меньше 6 символов`,
    MAX_PASSWORD_LENGTH: `Пароль должен быть не больше 12 символов`,
    MAX_FRISTNAME_LENGTH: `Имя не должно содержать более 50 символов`,
    MAX_LASTNAME_LENGTH: `Фамилия не должна содержать более 50 символов`,
    PASSWORDS_NOT_EQUALS: `Введенные пароли не совпадают`,
    EMAIL_ALREADY_EXIST: `Пользователь с таким email уже зарегистрирован`,
    EMAIL_UNVALID: `Введите корректный email`
  }
  
  module.exports.loginMessage = {
    EMPTY_VALUE: `Поле обязательно для заполнения`,
    EMAIL_UNVALID: `Введите корректный email`,
    USER_NOT_EXIST: `Пользователь не найден`
  }
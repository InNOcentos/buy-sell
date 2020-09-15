'use strict';

module.exports.API_PREFIX = `/api`;
module.exports.API_URL = `http://localhost:3000/api`
module.exports.MAX_ID_LENGTH = 6;
module.exports.DEFAULT_COMMAND = `--help`;
module.exports.USER_ARGV_INDEX = 2;
module.exports.ExitCode = {
  error: 1,
  success: 0,
};
module.exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  UNPROCESSABLE_ENTITY: 422,
};

module.exports.offerCreateMessage = {
  WRONG_TITLE: `Заголовок должен быть строкой`,
  MIN_TITLE_LENGTH: `Заголовок должен быть не меньше 2 символов`,
  MAX_TITLE_LENGTH: `Заголовок должен быть не больше 100 символов`,
  MIN_SUM_COUNT: `Сумма сделки должна быть не меньше 1`,
  MAX_SUM_COUNT: `Сумма сделки не должна превышать 1.000.000`,
  MIN_DESCRIPTION_LENGTH: `Описание должно быть не меньше 10 символов`,
  MAX_DESCRIPTION_LENGTH: `Описание должно быть не больше 1000 символов`,
  EMPTY_TYPE_VALUE: `Тип сделки не выбран`,
  EMPTY_PICTURE_VALUE: `Изображение предмета сделки отсутствует`,
  EMPTY_VALUE: `Поле обязательно для заполнения`,
}

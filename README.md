How to run:
docker compose up --build

Endpoints:
POST localhost:80/app/auth/register -  {email: string, password: string, name: string}
POST localhost:80/app/auth/login - {email: string, password: string}
POST localhost:80/app/auth/refresh - {refreshToken: string}

GET localhost:80/app/movies/ - optional query params title & actor (string both)
GET localhost:80/app/movies/:id 
POST localhost:80/app/movies/upload - multipart, .file - file with data
DELETE localhost:80/app/movies/:id 
POST localhost:80/app/movies  - {title: string, year: number, format: enum, actors: [{id?: number, name?: string}]}

Note: 
1. вибрав pg замість sqlite, бо sqlite погано працює з батч записами/оновленням, так як це файлова(повністю синхронна, вже мав з цим проблеми в обробці 11 мільйонів строк, в тому числі і мігрував дані на pg), а не серверна система
2. спершу почав писати по Clean Architecture (db entity + business-logic entity, яка в свою чергу повністю незалежна і синхронна), але через нестачу часу частково відкинув цю ідею, хоча вже маю кейси як я імплементовував функціонал таким способом (пінгуйте і покажу і поясню)
3. використовую внутрішню мережу + gateway для зручності, виходить шось по типу eureka server & client
4. треба додати логи та створити мідлвейр для валідації ентіті + створити помилки у відношенні до моделі та проблеми самої помилки (UserNotFound/UserEmailMustBeUnique/etc)
5. розділив акторів та фільми, так буде простіше розширяти модель актора, та і взагалі тут не підходять вкладені об'єкти, потрібні залежності
6. якщо вже говорити про тулзи так краще вибирати fastify(+Nest.js, так як проєкт на Nest.js) або Hono 
7. покриття тестами - e2e,int, unit(дуже класно для business-logic entity, яка має тримати в собі всю бізнес логіку)
8. основні класи (репо + сервіси) написані використовуючи private constructor + init для того щоб уникати circular dependency (до речі, згадав, що система імпортів js має свій спосіб для створення Singleton  - export new Entity(), бо кеш імпортів перевикористовується кожного виклику)
9. для авторизації класно та доречно використати патерн Strategy, але саме тут імплементацію можна покращити (теж вже робив таке на проєкті, можу показати і пояснити)
10. Додати пагінацію, move transaction init to controller



![alt text](image.png)
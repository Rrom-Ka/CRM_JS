(() => {
  let client555Obj = [{
    "name": "Василий",
    "surname": "Иванов",
    "lastName": "Петрович",
    "contacts": [{ "type": "Телефон", "value": "52-13-64" }],
    "id": "1678614064681",
    "updatedAt": "2023-03-12T09:41:04.681Z",
    "createdAt": "2023-03-12T09:41:04.681Z"
  },
  {
    "name": "Артем",
    "surname": "Веселов",
    "lastName": "Сергеевич",
    "contacts": [{ "type": "Vk", "value": "№56" }],
    "id": "1678676113707",
    "updatedAt": "2023-03-13T02:55:13.707Z",
    "createdAt": "2023-03-13T02:55:13.707Z"
  }];
  let contacts = [];
  let dir = true;
  let sortLabel = 'id';
  let arrClientsList = [];
  let arrClientsListModified = [];
  //подтвердить удаление
  const deleteClient = document.getElementById('deleteClient');
  const deleteClientBtnDelete = document.getElementById('deleteClientBtnDelete');
  const deleteClientContainer = document.getElementById('deleteClientContainer');

  const formCrateClient = document.forms.crateclientformname;//форма окна изменить клиент
  const crateClient = formCrateClient.parentNode.parentNode.parentNode;
  const createClientConatainer = formCrateClient.parentNode;

  //добавить клиента
  const addNewClientConatainer = document.getElementById('addNewClientConatainer');

  //текст ошибки
  const errorText = document.createElement('div');
  errorText.classList.add('clientcontainer__errortext');
  //прелоадер
  const preloader = document.getElementById('preloader');

  //находим label полей формы для того чтобы при вводе в форму данных поднять его добавив placeholder__static
  const newClientSurnamePlaceholder = document.querySelector('.surname__placeholder');
  const newClientNamePlaceholder = document.querySelector('.name__placeholder');
  const newClientLastnamePlaceholder = document.querySelector('.lastname__placeholder');
  // находим поля формы и создем из них объект
  const newClientSurname = document.getElementById('newClientSurname');
  const newClientName = document.getElementById('newClientName');
  const newClientLastname = document.getElementById('newClientLastname');

  //функция открытия модального окна по ссылке
  // Проверяем хэш при загрузке страницы

  window.addEventListener('load', function () {
    if (window.location.hash) {
      let hashClientsId = window.location.hash.slice(1);
      eventCorrectBtn(hashClientsId);
    }
  });
  //как сбросить хаш при обновылении страницы
  window.addEventListener('beforeunload', function () {
    // history.pushState("", document.title, window.location.pathname);
  });

  //0.1 функция преобразования даты в дд.мм.гггг
  function getDate(dateIn) {
    dateIn = new Date(dateIn);
    let result = '';
    if (dateIn.getDate() < 10) {
      result = '0';
    }
    result = result + dateIn.getDate() + '.';
    if (dateIn.getMonth() < 9) {
      result = result + '0';
    }
    result = result + (dateIn.getMonth() + 1) + '.';
    result = result + dateIn.getFullYear();
    return result;
  }

  //0.2 функция преобразования даты во время
  function getTime(dateIn) {
    dateIn = new Date(dateIn);
    let result = '';
    if (dateIn.getHours() < 10) {
      result = '0';
    }
    result = result + dateIn.getHours() + ':';
    if (dateIn.getMinutes() < 10) {
      result = result + '0';
    }
    result = result + dateIn.getMinutes();
    return result;
  }

  //0.3 функция запроса src иконки контакта
  function getSrcIconContacts(typeContacts) {
    if (typeContacts == "Facebook") return 'img/fb.svg';
    else if (typeContacts == "Vk") return 'img/vk.svg';
    else if (typeContacts == "Телефон") return 'img/phone.svg';
    else if (typeContacts == "Email") return 'img/mail.svg';
    // else if (typeContacts=="Доп. телефон") return 'img/phone.svg';
    else return 'img/otherContacts.svg';

  }

  //0.4 функция запроса данных для POPUP иконки контакта
  function getValuePopupIconContacts(contacts) {
    return contacts.type + ': ' + contacts.value;
  }

  //0.6 функция удаления карточки клиента
  function deleteClientCard(id, obj = null) {
    const strDeleteClient = document.getElementById(id);
    deleteClient.classList.toggle('client-visible');
    deleteClientContainer.classList.add('form-transform');
    // закрытие окна удалить клиента по крестику
    const deleteClientModalClose = document.getElementById('deleteClientModalClose');
    function deleteClientModalCloseEvent() {
      removeEventDeleteClient();
    }
    deleteClientModalClose.addEventListener('click', deleteClientModalCloseEvent);
    // закрытие окна удалить клиента по кнопке отмена
    const deleteClientBtnCancel = document.getElementById('deleteClientBtnCancel');
    function deleteClientBtnCancelEvent() {
      removeEventDeleteClient();
    }
    deleteClientBtnCancel.addEventListener('click', deleteClientBtnCancelEvent);
    //закрытие окна подвтерждения удаления клиента по клику по оверлею
    const deleteClientOvelay = document.getElementById('deleteclientovelay');//оверлей окна подверждения удаления клиета
    function deleteClientOvelayEvent(e) {
      if (e.target == deleteClientOvelay) {
        removeEventDeleteClient();
      }
    }
    deleteClientOvelay.addEventListener('click', deleteClientOvelayEvent);
    //закрытие окна подвтерждения удаления клиента escape
    let deleteDocumentBody = document.body;
    function documentBodyEvent(e) {
      if (e.code == "Escape") {
        removeEventDeleteClient();
      }
    }
    deleteDocumentBody.addEventListener("keydown", documentBodyEvent);


    //функция удаления кдиента с сервера
    async function deleteClientBtnDeleteEvent() {
      preloader.classList.remove('preloader__close');//удаляем класс закрывающий преладер нужно-ли через if
      try {
        const responce = await fetch(`http://localhost:3000/api/clients/${id}`, {//${id}
          method: 'DELETE',
        });
        preloader.classList.add('preloader__close');//добавляем класс закрывающий преладер
        if (responce.status == 200 || responce.status == 201) {
          strDeleteClient.remove();//возможно сдесь не нужно
          deleteClient.classList.remove('client-visible');
          deleteClientContainer.classList.remove('form-transform');
          if (obj != null) {
            obj.removeEventCreateClient();
          }
          //возможно нужно внести в else obj != null но не точно
          removeEventDeleteClient();
        }
        errorText.textContent = errorServer(responce.status);
        deleteClientContainer.insertBefore(errorText, deleteClientBtnDelete);
      } catch (error) {
        hiUpsError(error);
      }
    }
    deleteClientBtnDelete.addEventListener('click', deleteClientBtnDeleteEvent);
    //функция сброса событий 
    function removeEventDeleteClient() {
      history.pushState("", document.title, window.location.pathname);//тут сброс хэш не нужен
      deleteClient.classList.remove('client-visible');
      deleteClientContainer.classList.remove('form-transform');
      deleteClientBtnCancel.removeEventListener('click', deleteClientBtnCancelEvent);
      deleteClientModalClose.removeEventListener('click', deleteClientModalCloseEvent);
      deleteClientBtnDelete.removeEventListener('click', deleteClientBtnDeleteEvent);
      deleteClientOvelay.removeEventListener('click', deleteClientOvelayEvent);
      deleteDocumentBody.removeEventListener("keydown", documentBodyEvent);
      errorText.remove();
    }
  }

  //0.7 функция поиска группы контаков в модальном окне и удаления ее элементов
  function serchAndDeleteGroupContacts() {
   let groupContacts = document.querySelectorAll('.addcontact__inputgroup');//находим и удаляем поля контактов
    for (let contact of groupContacts) {
      contact.remove();
    }
  }

  // Этап 3. функция вывода одного клиента в таблицу
  async function getClientItem(clientObj) {
    const strClient = document.createElement('ul'); //создаем эжлемент tr
    const idClient = document.createElement('li');
    const fullNameClient = document.createElement('li');
    const startdataClient = document.createElement('li');
    const startClientData = document.createElement('span');
    const startClientTime = document.createElement('span');
    const lostDataCorrectClient = document.createElement('li');
    const lostCorrectClienDate = document.createElement('span');
    const lostCorrectClienTime = document.createElement('span');
    const contactsClient = document.createElement('li');
    const searchDeleteClints = document.createElement('li');
    const correctBtn = document.createElement('a');
    const deleteBtn = document.createElement('button');

    strClient.classList.add('flex', 'list-reset', 'item__row');
    idClient.classList.add('list__id');
    fullNameClient.classList.add('list__text', 'list__text-fullName');
    startdataClient.classList.add('startdataClient');
    startClientData.classList.add('list__text');
    startClientTime.classList.add('list__text', 'list__text-gray', 'list__text-correcttime');
    lostDataCorrectClient.classList.add('lostDataCorrectClient');
    lostCorrectClienDate.classList.add('list__text');
    lostCorrectClienTime.classList.add('list__text', 'list__text-gray', 'list__text-starttime');
    contactsClient.classList.add('flex', 'contacts__client');
    correctBtn.classList.add('btn-reset', 'btn', 'btn__edit');
    deleteBtn.classList.add('btn-reset', 'btn', 'btn__close');
    strClient.setAttribute('id', clientObj.id);

    // ----------------------
    //? нужно ли

    if (clientObj.id % 2 == 0) {
      strClient.classList.add('table-secondary');
    }
    // -------------------------

    //заполняем ячеки строки
    idClient.textContent = clientObj.id.slice(7); //прописываем название дела в li передачей аргумента name
    fullNameClient.textContent = clientObj.surname + ' ' + clientObj.name + ' ' + clientObj.lastName;
    startClientData.textContent = getDate(clientObj.updatedAt);
    startClientTime.textContent = getTime(clientObj.updatedAt);
    lostCorrectClienDate.textContent = getDate(clientObj.createdAt);
    lostCorrectClienTime.textContent = getTime(clientObj.createdAt);
    // заполняем поле контактов
    for (let elCont of clientObj.contacts) {
      const tooltip2Container = document.createElement('div');
      tooltip2Container.classList.add('tooltip2__container');
      const iconContacts = document.createElement('img');
      iconContacts.classList.add('tooltip2__marker');
      iconContacts.src = getSrcIconContacts(elCont.type);
      const iconPopup = document.createElement('div');
      iconPopup.classList.add('tooltip2__popup');
      iconPopup.textContent = getValuePopupIconContacts(elCont); //elCont.value;
      tooltip2Container.append(iconContacts);
      tooltip2Container.append(iconPopup);
      contactsClient.append(tooltip2Container);
    }
    correctBtn.textContent = 'Изменить';
    deleteBtn.textContent = 'Удалить';
    correctBtn.href = '#' + clientObj.id;

    //обработчик кнопки изменить карточку клиента
    correctBtn.addEventListener('click', function () {
      eventCorrectBtn(clientObj.id);
    });

    //вкладываем в строку, что бы они объединились в один блок
    searchDeleteClints.append(correctBtn);
    searchDeleteClints.append(deleteBtn);
    startdataClient.append(startClientData);
    startdataClient.append(startClientTime);
    lostDataCorrectClient.append(lostCorrectClienDate);
    lostDataCorrectClient.append(lostCorrectClienTime);
    strClient.append(idClient);
    strClient.append(fullNameClient);
    strClient.append(lostDataCorrectClient);
    strClient.append(startdataClient);
    strClient.append(contactsClient);
    strClient.append(searchDeleteClints);

    //приложению нужен доступ к самому элементу и кнопкам ,
    // что бы обрабатвываать собтытия нажатия
    document.getElementById('baseItem').append(strClient);
    //обработчик кнопки удалить карточку клиента  из строки

    deleteBtn.addEventListener('click', function () {
      //запуск функции удалить клиента
      deleteClientCard(clientObj.id);
    });
    return {
      idClient,
    };
  }

  // Этап 4. функция отрисовки всех клиентов. Аргументом функции будет массив студентов.Функция должна использовать ранее созданную функцию создания одной записи для студента.Цикл поможет вам создать список студентов.Каждый раз при изменении списка студента вы будете вызывать эту функцию для отрисовки таблицы.
  //4,1 функция запроса данных с сервера
  async function getServerItem() {
    preloader.classList.remove('preloader__close');//удаляем класс закрывающий преладер нужно-ли через if
    try {
      const responce = await fetch(`http://localhost:3000/api/clients`);//запрашиваем данные с сервера
      arrClientsList = await responce.json();//запсывем массив с сервера в переменную
      preloader.classList.add('preloader__close');//добавляем класс закрывающий преладер
      return arrClientsList;//делем массив доступным при вызове функции
    } catch (error) {
      hiUpsError();
    }
  }

  //  4.2 функция отрисовки всех клиентов
  async function renderClients(arr) {
    arr = await arr;//присваиваем полченные данные ч/з awayt чтобы избавиться от promis
    document.getElementById('baseItem').innerHTML = '';//сбарсываем данные внутри блока(удаляем таблицу) 
    //делаем проверку на наличие записи на сервере
    if (arr.length === 0) {
      return;
    }
    //запускаем функцию отрисовки одного клиента в массиве ч/з цикл
    for (let clientObj of arr) {
      getClientItem(clientObj);
    }
    return arr;//всего скорее не нужен возвращаем массив для доступв 
  }
  renderClients(sortCliens('id', dir = false, getServerItem()));

  //4,3 *запуск фильта по вводу в инпуте
  const baseFilter = document.getElementById('basefilter');//поле поиска
  baseFilter.addEventListener('input', inputDelay);//при вводе в поле поиска запускаем функцию задержки

  //4.3.01 функция поиска-автодополнения
  baseFilter.addEventListener('input', autoCompleteFilter);//при вводе в поле поиска запускаем функцию автозаполнения

  const serchList = document.querySelector('.base__serch-list');
  async function autoCompleteFilter() {
    //событие перехода фокуса из инпута в выпадающий списко
    baseFilter.addEventListener('keyup', function (event) {
      if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
        serchList.children[0].focus();
      }
    });

    let clientsArr = inputGetText();
    const table = {};
    let html;

    if (this.value) {
      clientsArr = clientsArr.filter(({ fio }) => (!table[fio] && (table[fio] = 1)));
      html = clientsArr
        .map(serchFIO => {
          const regex = new RegExp(this.value, 'gi');
          const serchFIOReplace = serchFIO.fio.replace(regex,
            `<span class = "hl">${this.value}</span>`
          );
          return `<li tabindex="0"><span>${serchFIOReplace}</span></li>`;
        })
        .slice(0, 5)
        .join('');
    }
    serchList.innerHTML = this.value ? html : null;
    //для каждого элемента в выпадающем списке поиска добобвляем собтыия
    for (let i = 0; i < serchList.children.length; i++) {
     let el = serchList.children[i];

      //клик мышкой
      el.addEventListener('click', function () {
        getCompleteValue(el);
      });

      //движение стрелками
      let elemFocused;
      el.addEventListener('keyup', function (event) {

        elemFocused = el;
        if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {

          if (event.code === 'ArrowDown') {
            if (i == serchList.children.length - 1) {
              elemFocused = serchList.children[0];
              elemFocused.focus();
            } else {
              elemFocused = serchList.children[i + 1];
              elemFocused.focus();
            }
          }

          if (event.code === 'ArrowUp') {
            if (i == 0) {
              elemFocused = serchList.children[serchList.children.length - 1];
              elemFocused.focus();
            }
            else {
              elemFocused = serchList.children[i - 1];
              elemFocused.focus();
            }
          }
          el = elemFocused;
        } else {
          el = document.activeElement;
        }
      });

      //клавиша ентер
      el.addEventListener('keyup', function (event) {
        if (event.code === 'Enter' || event.code === 'NumpadEnter') {
          getCompleteValue(el);
        }
      });
    }
    function getCompleteValue(el) {
      baseFilter.value = el.children[0].textContent;
      arrClientsListModified = filter(arrClientsList, baseFilter.value);//запрос фунции фильтра и возврат из нее отфильтрованных данных
      renderClients(sortCliens(prop = 'id', dir, arrClientsListModified));
      serchList.innerHTML = null;
    }
  }

  //! 4,3,1 функция задержки при вводе данных в инпут фильтар
  function inputDelay() {
    arrClientsListModified = setTimeout(inputGetText, 300);//после паузы запускем функцию запроса фильтра
    return arrClientsListModified;
  }

  //! 4,3,2 функция запроса отфильтрованного массива и активацтт отрисовки клиента
  function inputGetText(prop = 'id') {
    //   //делаеи проверку на наличие данный в соответствующих полях фильта и обрщаемся
    //   // к функции фильтр и присваиваем отфильтрованные значения для дальнейшего вывода на экран
    if (baseFilter.value !== '') {
      arrClientsListModified = filter(arrClientsList, baseFilter.value);//запрос фунции фильтра и возврат из нее отфильтрованных данных
      renderClients(sortCliens(prop, dir, arrClientsListModified));
    }
    else {
      renderClients(sortCliens(prop, dir, getServerItem()));
    }
    return arrClientsListModified;
  }

  //5. добавить  клиента
  function addClientBase() {
    const baseAddClient = document.getElementById('baseAddClient');//кнопка добавить клиента
   const addNewClient = document.getElementById('addNewClient');//окно новый клиент
   const addNewClientOverlay = document.getElementById('addNewClientOverlay');//оверлей окна добавить клиента

    // открытие окна добавления клиента
    baseAddClient.addEventListener('click', function () {
      serchAndDeleteGroupContacts();
      addNewClient.classList.add('client-visible');
      addNewClientConatainer.classList.add('form-transform');

      // закрытие окна добавить клиента по крестику
      const newClientModalClose = document.getElementById('newClientModalClose');
      function newClientModalCloseEvent() {
        removeEventNewClient();
      }
      newClientModalClose.addEventListener('click', newClientModalCloseEvent);

      // закрытие окна добавить клиента по кнопке отмена
      const newClientBtnCancel = document.getElementById('newClientBtnCancel');
      function newClientBtnCancelEvent() {
        removeEventNewClient();
      }
      newClientBtnCancel.addEventListener('click', newClientBtnCancelEvent);

      //закрытие окна добавить клиента по клику по оверлею
      function addNewClientOverlayEvent(e) {
        if (e.target == addNewClientOverlay) {
          removeEventNewClient();
        }
      }
      addNewClientOverlay.addEventListener('click', addNewClientOverlayEvent);

      //закрытие окна добавить клиента escape
      let newDocumentBody = document.body;
      function newDocumentBodyEvent(e) {
        if (e.code == "Escape") {
          removeEventNewClient();
        }
      }
      newDocumentBody.addEventListener("keydown", newDocumentBodyEvent);

      

      // добалвения данных клиента в базу
      const formNewClient = document.getElementById('formNewClient');//форма окна новый клиент
      const newClientBtnAdd = document.getElementById('newClientBtnAdd');//кнопка сохранить окна новый клиент
      
      //поднимаем плейсхродер
      placeholderApFormNewClient(newClientSurname, newClientSurnamePlaceholder);
      placeholderApFormNewClient(newClientName, newClientNamePlaceholder);
      placeholderApFormNewClient(newClientLastname, newClientLastnamePlaceholder);

      async function newSaveBtnEvent(e) {//обработчик собтыия нажатия на кнопку сохранить
        e.preventDefault();
        //обнуляем массив контактов
        contacts = [];
        //убираем красную черту при вводе в данных в поле
        cancelErrorInput(newClientSurname);
        cancelErrorInput(newClientName);
        //функция подчеркивания input
        errorInput(newClientSurname, newClientName);
        //собираем все контакты в окне
        let fullgroupcontact = document.querySelectorAll('.addcontact__inputgroup');
        for (let el of fullgroupcontact) {
          cancelErrorInput(el.children[1]);
          contacts.push({ type: el.children[0].value, value: el.children[1].value });
        }
        errorText.textContent = validation(newClientSurname.value, newClientName.value, fullgroupcontact);
        formNewClient.insertBefore(errorText, newClientBtnAdd);
        if (errorText.textContent != '') return;

        try {
          preloader.classList.remove('preloader__close');//удаляем класс закрывающий преладер нужно-ли через if
          const responce = await fetch('http://localhost:3000/api/clients', {
            method: 'POST',
            headers: { 'Content-type': 'aplication/json' },
            body: JSON.stringify({
              name: newClientName.value,
              lastName: newClientLastname.value,
              surname: newClientSurname.value,
              contacts: contacts,
            })
          });
          preloader.classList.add('preloader__close');//добавляем класс закрывающий преладер
          errorTextDeleteFromWindow();
          const todoItem = await responce.json();
          if (todoItem.errors) errorText.textContent = errorServer(responce.status, todoItem.errors);
          formNewClient.insertBefore(errorText, newClientBtnAdd);
          if (responce.status == 200 || responce.status == 201) {
            renderClients(sortCliens('id', dir = true, getServerItem()));
            removeEventNewClient();
            initialStateFormNewClient();//привдения окна новый клиент к начальному состоянию
          }
        } catch (error) {
          hiUpsError(error);
        }
      }
      function removeEventNewClient() {
        history.pushState("", document.title, window.location.pathname); //тут сброс хэш не нужен
        addNewClient.classList.remove('client-visible');//закрываем окно удаляя класс
        addNewClientConatainer.classList.remove('form-transform');//закрываем окно удаляя класс
        //приводим окно к начальному состоянию
        newClientModalClose.removeEventListener('click', newClientModalCloseEvent);//собтие закрыть окно по крестику
        newClientBtnCancel.removeEventListener('click', newClientBtnCancelEvent);//по кнопке отмена
        addNewClientOverlay.removeEventListener('click', addNewClientOverlayEvent);//закртие по оверлею
        newDocumentBody.removeEventListener("keydown", newDocumentBodyEvent);//закрытие escape
        newClientBtnAdd.removeEventListener('click', newSaveBtnEvent);//кнопка сохранить
        initialStateFormNewClient();//привдедение окна новый клиент к первоначальному состоянию
        removeAddContactsNew();//событие кнопки добавить клиента
        serchAndDeleteGroupContacts();// удаление контактов из карточки
        errorText.remove();
        newClientSurname.classList.remove('form-control-danger');
        newClientName.classList.remove('form-control-danger');
      }
      newClientBtnAdd.addEventListener('click', newSaveBtnEvent);
      addContactsNew();
    });
  }
  addClientBase(); //запуск фунции добавить клиента

  //6. изменить карточку  клиента
  async function createClientBase(crateclientObj) {
    //заполнение данных клиента
    const crateclientIdspan = document.getElementById('crateclientIdspan');//поле ID вверху окна
    const crateClientSurname = document.getElementById('crateclientSurname');//поле фамилмя
    const crateClientName = document.getElementById('crateclientName');//поле имя
    const crateClientLastname = document.getElementById('crateclientLastname');//поле отчество
    //заносим в поля ID и ФИО значения
    crateclientIdspan.textContent = crateclientObj.id.slice(7);
    crateClientSurname.value = crateclientObj.surname;
    crateClientName.value = crateclientObj.name;
    crateClientLastname.value = crateclientObj.lastName;
    //создаем группу контактов
    for (let contact of crateclientObj.contacts) {
      addContactsGroup('crateclientContactsWrap', 'crateClientBtnaddcontact', false, contact);
    }
    const crateClientDeleteBtn = document.getElementById('crateclientdeleteBtn');//кнопка удалить клиента
    const crateClientOvelay = document.getElementById('crateclientovelay');//оверлей окна изменить клиента
    // закрытие окна изменить клиента по крестику
    const crateClientModalCloseFromCross = document.getElementById('crateClientModalClose');
    function crateClientModalCloseFromCrossEvent() {
      removeEventCreateClient();
    }
    crateClientModalCloseFromCross.addEventListener('click', crateClientModalCloseFromCrossEvent);

    // закртие окна изменить клиента по кнопке отмена отсутствует т.к. в окне его нет

    //закрытие окна добавить клиента по клику по оверлею
    function createClientOverlayEvent(e) {
      if (e.target == crateClientOvelay) {
        removeEventCreateClient();
      }
    }
    crateClientOvelay.addEventListener('click', createClientOverlayEvent);

    //закрытие окна добавить клиента escape
    let crateDocumentBody = document.body;
    function crateDocumentBodyEvent(e) {
      if (e.code == "Escape") {
        removeEventCreateClient();
      }
    }
    crateDocumentBody.addEventListener("keydown", crateDocumentBodyEvent);

    // добалвения данных клиента в базу
    const crateClientBtnaddcontact = document.getElementById('crateClientBtnaddcontact');
    // let selectorAddcontactNotVisible = document.querySelector('newclient__btn-addcontactnotvisible');
    if (crateclientObj.contacts.length <= 9) {
      crateClientBtnaddcontact.classList.remove('newclient__btn-addcontactnotvisible');
    } else {
      crateClientBtnaddcontact.classList.add('newclient__btn-addcontactnotvisible');
    }

    const crateClientBtnAdd = document.getElementById('crateClientBtnAdd');//кнопка сохранить окна  изменить клиента
    async function saveBtnEvent(e) {
      e.preventDefault();
      //обнуляем массив контактов
      contacts = [];
      //убираем красную черту при вводе в данных в поле
      cancelErrorInput(crateClientSurname);
      cancelErrorInput(crateClientName);
      //функция подчеркивания input
      errorInput(crateClientSurname, crateClientName);
      //собираем все контакты в окне
      let fullgroupcontact = document.querySelectorAll('.addcontact__inputgroup');//*-!!!
      for (let el of fullgroupcontact) {
        cancelErrorInput(el.children[1]);
        contacts.push({ type: el.children[0].value, value: el.children[1].value });
      }
      errorText.textContent = validation(crateClientSurname.value, crateClientName.value, fullgroupcontact);
      formCrateClient.insertBefore(errorText, crateClientBtnAdd);
      if (errorText.textContent != '') return;
      try {
        preloader.classList.remove('preloader__close');//удаляем класс закрывающий преладер нужно-ли через if
        const responce = await fetch(`http://localhost:3000/api/clients/${crateclientObj.id}`, {//${crateclientObj.id}
          method: 'PATCH',
          headers: { 'Content-type': 'aplication/json' },
          body: JSON.stringify({
            name: crateClientName.value,
            lastName: crateClientLastname.value,
            surname: crateClientSurname.value,
            contacts: contacts,
          })
        });
        preloader.classList.add('preloader__close');//добавляем класс закрывающий преладер
        errorTextDeleteFromWindow();
        const todoItem = await responce.json();
        if (todoItem.errors) errorText.textContent = errorServer(responce.status, todoItem.errors);
        formCrateClient.insertBefore(errorText, crateClientBtnAdd);
        if (responce.status == 200 || responce.status == 201) {
          if (baseFilter.value !== '') {
            arrClientsListModified = filter(arrClientsList, baseFilter.value);//запрос фунции фильтра и возврат из нее отфильтрованных данных
            renderClients(sortCliens(sortLabel, dir, arrClientsListModified));
          }
          else {
            renderClients(sortCliens(sortLabel, dir, getServerItem()));
          }
          removeEventCreateClient();
        }
      } catch (error) {
        hiUpsError(error);
      }
    }
    //массив для передачи данных в функцию удаления для сброса событий
    let obgElementsFromDelete = {
      crateClientDeleteBtn,// кнопка удалить клиента в окне изменить клиента
      sendDeleteClientCard, //функция запускющая deleteClientCard(obgElementsFromDelete)
      crateClientModalCloseFromCross, //кнопка крестик в изменить клиента
      removeEventCreateClient, // функция удаления обработчика события
      crateClientBtnAdd, //кнопка сохранить окна  изменить клиента
      saveBtnEvent,// фунция сохранения изменения данных клиента
    };
    crateClientBtnAdd.addEventListener('click', saveBtnEvent);

    //???? можно ли запустить одну фунция
    //-----------------------------------
    //функция удаления карточки клиента
    function sendDeleteClientCard() {
      deleteClientCard(crateclientObj.id, obgElementsFromDelete);
    }
    //событие удалить клиента
    crateClientDeleteBtn.addEventListener('click', sendDeleteClientCard);
    //---------------------------------

    //удаление обработчика события
    function removeEventCreateClient() {
      history.pushState("", "", window.location.pathname);
      crateClient.classList.remove('client-visible');//закрываем окно удаляя класс
      createClientConatainer.classList.remove('form-transform');//закрываем окно удаляя класс
      //приводим окно к начальному состоянию
      initialStateFormCreateClient(crateclientIdspan, crateClientSurname, crateClientName, crateClientLastname);
      crateClientDeleteBtn.removeEventListener('click', sendDeleteClientCard);//событие удалить клиента
      crateClientModalCloseFromCross.removeEventListener('click', crateClientModalCloseFromCrossEvent);//собтие закрыть окно по крестику
      crateClientOvelay.removeEventListener('click', createClientOverlayEvent);//закртие по оверлею
      crateDocumentBody.removeEventListener("keydown", crateDocumentBodyEvent);//закрытие escape
      crateClientBtnAdd.removeEventListener('click', saveBtnEvent);//кнопка сохранить
      removeAddContactsCreate();//событие кнопки добавить клиента
      serchAndDeleteGroupContacts(); //удаление контактов из карточки
      errorText.remove();
      crateClientSurname.classList.remove('form-control-danger');
      crateClientName.classList.remove('form-control-danger');
    }
    addContactsCreate();
  }

  //7. добалвение контактов  наждате на кнопку
  // изменение клиента
  function addContactsCreate() {
    const ClientBtnaddcontact = document.getElementById('crateClientBtnaddcontact');
    ClientBtnaddcontact.addEventListener('click', sendAddContactsGroupCreate);
  }

  function sendAddContactsGroupCreate() {
    addContactsGroup('crateclientContactsWrap', 'crateClientBtnaddcontact', btnClick = true);
  }

  function removeAddContactsCreate() {
    const ClientBtnaddcontact = document.getElementById('crateClientBtnaddcontact');
    ClientBtnaddcontact.removeEventListener('click', sendAddContactsGroupCreate);
  }

  //добавление клиента
  function addContactsNew() {
    const ClientBtnaddcontact = document.getElementById('newClientBtnaddcontact');
    ClientBtnaddcontact.addEventListener('click', sendAddContactsGroupNew);
  }

  function sendAddContactsGroupNew() {
    addContactsGroup('newclientContactsWrap', 'newClientBtnaddcontact', btnClick = true);
  }

  function removeAddContactsNew() {
    const ClientBtnaddcontact = document.getElementById('newClientBtnaddcontact');
    ClientBtnaddcontact.removeEventListener('click', sendAddContactsGroupNew);
  }


  //7.1 добалвение контактов  создание группы
  function addContactsGroup(clientContactsWrapId, ClientBtnaddcontactId, btnClick = false, contact = null) {
    let contactsArray = [];
    const clientContactsWrap = document.getElementById(clientContactsWrapId);//контейнер(окна добавить или удалить клиента) в который вводим контакты
    let group = document.querySelectorAll('.addcontact__inputgroup');//ищем контакты в окне
    // for (let el of group) {
    // }
    //если контактов больше 9 то кнопку делаем невидимой
    if (group.length >= 9) {//почему меньще или равно 9
      ClientBtnaddcontact.classList.add('newclient__btn-addcontactnotvisible');
    }
    if (group.length < 10) {
      // строка ввода контакта
      const addContactInputGroup = document.createElement('div');
      const addContactInputGroupSelect = document.createElement('select');
      const option1 = document.createElement('option');
      const option2 = document.createElement('option');
      const option3 = document.createElement('option');
      const option4 = document.createElement('option');
      const option5 = document.createElement('option');
      const addContactInputGroupinput = document.createElement('input');
      const addContactInputGroupBtnDelete = document.createElement('button');
      let placeholderConactValue = someFunc();
      addContactInputGroup.classList.add('addcontact__inputgroup', 'flex');
      // addContactInputGroup.classList.add('flex');
      addContactInputGroupSelect.classList.add('addcontact__inputgroup-select');
      addContactInputGroupinput.classList.add('addcontact__inputgroup-input');
      addContactInputGroupinput.placeholder = placeholderConactValue;
      addContactInputGroupBtnDelete.classList.add('btn', 'addcontact__inputgroup-btndelete', 'btn-reset');
      option1.value = 'Телефон';
      option1.textContent = 'Телефон';
      option2.value = 'Другое';
      option2.textContent = 'Другое';
      option3.vaue = 'Email';
      option3.textContent = 'Email';
      option4.value = 'Vk';
      option4.textContent = 'Vk';
      option5.value = 'Facebook';
      option5.textContent = 'Facebook';

      addContactInputGroupSelect.append(option1);
      addContactInputGroupSelect.append(option2);
      addContactInputGroupSelect.append(option3);
      addContactInputGroupSelect.append(option4);
      addContactInputGroupSelect.append(option5);
      addContactInputGroup.append(addContactInputGroupSelect);
      addContactInputGroup.append(addContactInputGroupinput);
      addContactInputGroup.append(addContactInputGroupBtnDelete);
      clientContactsWrap.prepend(addContactInputGroup);
      if (btnClick == false) {
        addContactInputGroup.children[0].value = contact.type;
        addContactInputGroup.children[1].value = contact.value;
      }

      //проврка действия кнопки добавить контакт
      if (btnClick) {
        contactsArray.push({ type: addContactInputGroup.children[0].value, value: addContactInputGroup.children[1].value });
      }
      addContactInputGroupBtnDelete.addEventListener('click', function () {
        let groupContactsCreate = document.querySelectorAll('.addcontact__inputgroup');//ищем контакты в окне
        addContactInputGroup.remove();
        if (groupContactsCreate.length == 10) {
          const crateClientBtnaddcontact = document.getElementById(ClientBtnaddcontactId); //newClientBtnaddcontact, 'crateClientBtnaddcontact'
          crateClientBtnaddcontact.classList.remove('newclient__btn-addcontactnotvisible');
        }
      });
    }
  }

  // Этап 8. Создайте функцию фильтрации массива студентов и добавьте события для элементов формы.
  function filter(arr, value) {
    let result = [],
      copy = [...arr];
    for (let item of copy) {
      if (String(item["fio"]).includes(value) == true || String(item["id"]).includes(value) == true || String(item["surname"]).includes(value) == true || String(item["name"]).includes(value) == true || String(item["lastName"]).includes(value) == true) result.push(item);
    }
    return result;
  }

  // Этап 9. Функция сортировки массива  и  события кликов на соответствующие колонки.
  async function sortCliens(prop, dir = true, arr) {
    //получаем дынные с сервера отправляем запрос на весь список
    arr = await arr;
    for (let elem of arr) {
      elem.id = elem.id;
      elem.fio = elem.surname + ' ' + elem.name + ' ' + elem.lastName;
      elem.updatedAt;
      elem.createdAt;
    }

    let result = arr.sort(function (a, b) {
      if (prop == 'id') {
        let dirIf = a[prop].slice(7) < b[prop].slice(7);
        if (dir == true) dirIf = a[prop].slice(7) > b[prop].slice(7);
        if (dirIf == true) return -1;
      } else if (prop == 'updatedAt' || prop == 'createdAt') {
        let dirIf = new Date(a[prop]) < new Date(b[prop]);
        if (dir == true) dirIf = new Date(a[prop]) > new Date(b[prop]);
        if (dirIf == true) return -1;
      }
      else {
        let dirIf = a[prop] < b[prop];
        if (dir == true) dirIf = a[prop] > b[prop];
        if (dirIf == true) return -1;
      }
    });
    // for (let elem of result) {
    // }
    // for (let i = 0; i < result.length; i++) {
    // }
    return result;
  }

  //собтия кликов на колонки при соритировке
  const idClientHead = document.getElementById('idClient'); //заголовок колонки ID
  const idClientHeadIMG = document.getElementById('idClientImg'); //заголовок колонки ID
  const fioClientHead = document.getElementById('fioClient'); //заголовок колонки FIO
  const fioClientImg = document.getElementById('fioClientImg'); //заголовок колонки FIO
  const startDataClientHead = document.getElementById('startDataClient'); //заголовок колонки дата создания
  const startDataClientHeadIMG = document.getElementById('startDataClientImg'); //заголовок колонки дата создания
  const lostDataCorrectClientHead = document.getElementById('lostDataCorrectClient'); //заголовок колонки дата изменения
  const lostDataCorrectClientHeadIMG = document.getElementById('lostDataCorrectClientImg'); //заголовок колонки дата изменения

  //событие клика по колонке ID
  idClientHead.addEventListener('click', function () {
    changeArrowSort('id', idClientHeadIMG);
    dir = !dir;
    inputGetText('id');
  });
  //событие клика по колонке FIO
  fioClientHead.addEventListener('click', function () {
    changeArrowSort('fio', fioClientImg, 'table__cell-arrowappfio', 'table__cell-arrowdownfio');
    dir = !dir;
    inputGetText('fio');
  });
  //событие клика по колонке дата создания
  startDataClientHead.addEventListener('click', function () {
    changeArrowSort('updatedAt', startDataClientHeadIMG);
    inputGetText('createdAt');//updatedAt
    dir = !dir;
  });
  //событие клика по колонке дата изменения
  lostDataCorrectClientHead.addEventListener('click', function () {
    changeArrowSort('createdAt', lostDataCorrectClientHeadIMG);
    dir = !dir;
    inputGetText('updatedAt');
  });

  //9.2 Функция изменения направления стрелки при клике на колонки сортировки
  function changeArrowSort(valueSortLabel, columnHead, classArrowAp = 'table__cell-arrowapp', classArrowDown = 'table__cell-arrowdown') {
    if (sortLabel != valueSortLabel) {
      dir = true;
      sortLabel = valueSortLabel;
    }
    if (dir == true) {
      columnHead.classList.add(classArrowAp);
      columnHead.classList.remove(classArrowDown);
    } else {
      columnHead.classList.remove(classArrowAp);
      columnHead.classList.add(classArrowDown);
    }
  }

  //этап 10 функция текста ошибок при обращении к серверу
  function errorServer(errorStatus, errorArrey) {
    let textError;
    let textErrorArrey = '';
    let punctuationMark;
    let counter = errorArrey.length;
    for (let el of errorArrey) {
      if (counter == 1) punctuationMark = '.';
      else punctuationMark = ', ';
      textErrorArrey = textErrorArrey + el.message + punctuationMark;
      counter--;
    }
    if (errorStatus === 422) {
      textError = '422 объект, переданный в теле запроса, не прошёл валидацию: ' + textErrorArrey;
    }
    else if (errorStatus === 404) {
      textError = '404 переданный в запросе метод не существует или запрашиваемый элемент не найден в базе данных';
    }

    else if (errorStatus === 500) {
      textError = '500 странно, но сервер сломался';
    }
    else if (errorStatus === 200 || errorStatus === 201) {
      return;
    }
    else console.log('вот это Да!?');
    return textError;
  }

  ///этап 10.1 функция вывода окна при непонянтной ошибке
  function hiUpsError(error = 'УПС') {
    const upsErrorWindow = document.createElement('div');
    const upsErrorWrap = document.createElement('div');
    const upsErrorDescr = document.createElement('p');
    const upsErrorBtnClose = document.createElement('button');
    upsErrorWindow.classList.add('upserror__window', 'upserror__descr', 'client-visible');
    upsErrorWrap.classList.add('upserror__wrap');
    upsErrorDescr.textContent = 'Что-то пошло не так?';
    upsErrorBtnClose.textContent = 'x';
    upsErrorWrap.append(upsErrorDescr);
    upsErrorWrap.append(upsErrorBtnClose);
    upsErrorWindow.append(upsErrorWrap);
    document.getElementById('baseItem').append(upsErrorWindow);
    upsErrorBtnClose.addEventListener('click', function () {
      upsErrorWindow.classList.remove('client-visible');
    });
  }

  //10,2 функция удаления предудущей надписи ошибки в окне изменеия или добавления клиента
  function errorTextDeleteFromWindow() {
    const serchErrorText = document.querySelector('.clientcontainer__errortext');
    if (serchErrorText) {
      serchErrorText.remove();
    }
  }

  //11.1 функция поднятия label(плейсхолдера) над input  в форме нового клиента
  function placeholderApFormNewClient(inputStr, labelStr) {
    inputStr.addEventListener('click', function () {
      labelStr.classList.add('placeholder__static');
    });
    inputStr.addEventListener('input', function () {
      inputStr.classList.remove('form-control-danger');
      labelStr.classList.add('placeholder__static');
    });
  }

  //11.2 функция привдения окна новый клиент к начальному состоянию
  function initialStateFormNewClient() {
    newClientSurnamePlaceholder.classList.remove('placeholder__static');
    newClientSurname.value = '';
    newClientNamePlaceholder.classList.remove('placeholder__static');
    newClientName.value = '';
    newClientLastnamePlaceholder.classList.remove('placeholder__static');
    newClientLastname.value = '';
  }

  //11.3 функция привдения окна изменить клиента к начальному состоянию
  function initialStateFormCreateClient(crateclientIdspan, crateClientSurname, crateClientName, crateClientLastname) {
    crateclientIdspan.textContent = '';
    crateClientSurname.value = '';
    crateClientName.value = '';
    crateClientLastname.value = '';
  }

  //11.4 функция подчеркивания незаполненного поля
  function errorInput(clientSurname, clientName) {
    let errorCheck = 0;
    if (clientSurname.value == '') {
      clientSurname.classList.add('form-control-danger');
      errorCheck++;
    }
    if (clientName.value == '') {
      clientName.classList.add('form-control-danger');
      errorCheck++;
    }
    if (errorCheck != 0) return;
  }

  //11.5 функция удаления подчеркиванни при вводе данных
  function cancelErrorInput(inputStr) {
    inputStr.addEventListener('input', function () {
      inputStr.classList.remove('form-control-danger');
    });
  }

  //11.6 валидация
  function validation(valueSurname, valueName, arrContacts) {
    let textErrorArrey = '';
    let punctuationMark;
    let erorArreyText = [];
    const regLitera = /[^a-zа-яё\(?-]/i;
    //функция Ф.И.
    function fioTextFromType(valueFIO, type) {
      if (valueFIO.trim() == '') {
        erorArreyText.push(type + ' не заполнена');
      } else if (regLitera.test(valueFIO)) {
        erorArreyText.push(type + ' содержит цифры');
      }
    }
    //Фамилия
    fioTextFromType(valueSurname, 'Фамилия');

    //Имя
    fioTextFromType(valueName, 'Имя');

    //Контакты
    const regPhone = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/; //телефон
    const regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; //email
    const regFacebook = /^(?!.*\.\.)(?!\.)(?!.*\.$)(?!\d+$)[a-zA-Z0-9.]{5,50}$/; //facebook
    const regVK = /(id\d|[a-zA-z][a-zA-Z0-9_.]{2,})/; //VK
    const reganother = /[^\s]/ //дргуое

    for (let el of arrContacts) {
      //функция контактов
      function contactsTextFromType(typeContactsEl, regularContacts) {
        if (el.children[0].value == typeContactsEl) {
          if (el.children[1].value.trim() == '') {
            erorArreyText.push(`${el.children[0].value}` + ' не заполнен');
            el.children[1].classList.add('form-control-danger');
          } else if (!regularContacts.test(el.children[1].value)) {
            erorArreyText.push(`${el.children[0].value}` + ' не соответствует маске');
            el.children[1].classList.add('form-control-danger');
          }
        }
      }
      //телефон
      contactsTextFromType('Телефон', regPhone);

      //Эл аждрес
      contactsTextFromType('Email', regEmail);

      //Facebook
      contactsTextFromType('Facebook', regFacebook);

      //VK
      contactsTextFromType('Vk', regVK);

      //Другое
      contactsTextFromType('Другое', reganother);

    }
    erorArreyText = Array.from(new Set(erorArreyText));
    let counter = erorArreyText.length;
    for (let el of erorArreyText) {
      if (counter == 1) punctuationMark = '.';
      else punctuationMark = ', ';
      textErrorArrey = textErrorArrey + el + punctuationMark;
      counter--;
    }
    return textErrorArrey;
  }

  //функция предваритльеного полученя данных кароточки клиента и ее отькрытия
  async function eventCorrectBtn(id) {
    preloader.classList.remove('preloader__close');//удаляем класс закрывающий преладер нужно-ли через if
    serchAndDeleteGroupContacts();
    try {
      // pp(`/${id}`)
      const responce = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'GET',
      });
      preloader.classList.add('preloader__close');//добавляем класс закрывающий преладер

      const arr = await responce.json();
      crateClient.classList.add('client-visible');
      createClientConatainer.classList.add('form-transform');
      createClientBase(arr);
    } catch (error) {
      hiUpsError();
    }
  }

  //функция изменения окна
  function someFunc() {
    // Выполняем действие, если ширина меньше 1000px
    let withWindow = window.innerWidth;
    if (withWindow < 768) {
      return 'Введите данные';
    } else {
      return 'Введите данные контакта';
    }
  }

  // Выполняем заново при изменении размера окна
  window.addEventListener('resize', function () {
    someFunc();
  });

})();
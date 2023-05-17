(function () {
  // Глобальный идентификатор
  let globalID = 0;
  for (let i = 0; i < localStorage.length; i++) {
    // Найти наибольший ID
    let checkID = parseInt(localStorage.key(i));

    if (!isNaN(checkID)) {
      globalID = Math.max(globalID, checkID);
    }
  }

  // Создание заголовка
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // Создание формы
  function createTodoItemForm() {
    // Элементы
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    // Классы элементов
    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    // Размещение
    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button
    };
  }

  // Создание списка
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  // Создание элементов
  function createTodoItem(name, id) {
    // Элемент списка
    let item = document.createElement('li');
    // Группа кнопок готово и удалить
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // Невидимый идентификатор
    let hiddenID = document.createElement('input');
    hiddenID.setAttribute("name", "id");
    hiddenID.setAttribute("value", id);
    // hiddenID.setAttribute("readonly", "");

    // Применение стилей Бутстрап
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    hiddenID.classList.add('d-none');

    // Размещение
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);
    item.append(hiddenID);

    return {
      item,
      doneButton,
      deleteButton,
      hiddenID
    };
  }

  // Создание приложения
  function createTodoApp(appContainer, title) {
    let todoAppTitle = createAppTitle(title)
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    appContainer.append(todoAppTitle);
    appContainer.append(todoItemForm.form);
    appContainer.append(todoList);

    // LOCALSTORAGE FUNCTIONS
    /* LocalStorage Сохранить */
    function localStorageSave(text, status) {
      globalID++;
      let info = [title, text, status];
      localStorage.setItem(globalID, JSON.stringify(info));
    }

    /* LocalStorage достать данные */
    function localStorageGet(seekID, seekTitle) {

      seekID = parseInt(seekID);

      if (localStorage.getItem(seekID) === null) {
        return;
      } else {

        array = JSON.parse(localStorage.getItem(seekID));

        if (array[0] === seekTitle) {
          return array;
        };
      };
    }

    // LOCALSTORAGE INITIALIZE
    for (var localStorageKey in localStorage) {
      // Взять запись и проверить на валидность
      if (isNaN(localStorageKey)) {
        continue;
      };
      let placeArray = localStorageGet(localStorageKey, title);
      if (placeArray === undefined) {
        continue;
      };
      // Добавить как обычно
      let todoItem = createTodoItem(placeArray[1], localStorageKey);
      // Обработчики событий
      todoItem.doneButton.addEventListener('click', function () {
        let itemID = todoItem.hiddenID.value;
        // Так же заменить в localStorage
        let itemArray = localStorageGet(itemID, title);
        if (itemArray[2] == true) {
          itemArray[2] = false;
        } else {
          itemArray[2] = true;
        };
        localStorage.setItem(itemID, JSON.stringify(itemArray));
        todoItem.item.classList.toggle('list-group-item-success');
      });
      todoItem.deleteButton.addEventListener('click', function () {
        let itemID = todoItem.hiddenID.value;
        if (confirm('Вы уверены?')) {
          localStorage.removeItem(itemID);
          todoItem.item.remove();
        };
      });

      // Проверить выполненность записи
      if (placeArray[2] == true) {
        todoItem.item.classList.toggle('list-group-item-success');
      };
      todoList.append(todoItem.item);
    };

    // Функционал
    todoItemForm.form.addEventListener('submit', function (e) {
      e.preventDefault();

      // если ничего не введено в поле
      if (!todoItemForm.input.value) {
        return;
      };
      // Сохранить глобально
      let todoItem = createTodoItem(todoItemForm.input.value, (globalID + 1));
      localStorageSave(todoItemForm.input.value, false);

      // Обработчики событий
      todoItem.doneButton.addEventListener('click', function () {
        let itemID = todoItem.hiddenID.value;

        // Так же заменить в localStorage
        let itemArray = localStorageGet(itemID, title);
        if (itemArray[2] == 1) {
          itemArray[2] = 0;
        } else {
          itemArray[2] = 1;
        };

        localStorage.setItem(itemID, JSON.stringify(itemArray));
        todoItem.item.classList.toggle('list-group-item-success');
      });

      todoItem.deleteButton.addEventListener('click', function () {
        let itemID = todoItem.hiddenID.value;
        if (confirm('Вы уверены?')) {
          localStorage.removeItem(itemID);
          todoItem.item.remove();
        };
      });

      todoList.append(todoItem.item);

      // Обнуление строчки ввода
      todoItemForm.input.value = '';
    })

    // Input Disabled
    todoItemForm.button.setAttribute("disabled", "");
    todoItemForm.input.addEventListener('input', function () {
      if (todoItemForm.input.value !== '') {
        todoItemForm.button.removeAttribute("disabled", "");
      }
      else {
        todoItemForm.button.setAttribute("disabled", "");
      };
    });
  };

  // Передача функции для использования
  window.createTodoApp = createTodoApp;
})();

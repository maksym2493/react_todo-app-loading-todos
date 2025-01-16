/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

import * as api from './api/todos';

import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [, setState] = useState(0);

  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [filter, setFilter] = useState<Filter>('All');

  const timeoutId = useRef(0);

  const hideError = useCallback(() => {
    clearTimeout(timeoutId.current);
    timeoutId.current = window.setTimeout(setShowErrorMessage, 3000, false);
  }, []);

  useEffect(() => {
    api
      .getTodos()
      .then(setTodos)
      .catch(() => {
        hideError();
        setShowErrorMessage(true);
        setErrorMessage('Unable to load todos');
      });
  }, [hideError]);

  // #region form
  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowErrorMessage(false);
      setTitle(event.target.value);
    },
    [],
  );

  const addTodo = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      if (!title) {
        hideError();
        setShowErrorMessage(true);
        setErrorMessage('Title should not be empty');

        return;
      }

      setTodos(prevTodos => {
        const id = Math.max(0, ...prevTodos.map(todo => todo.id)) + 1;

        const newTodo: Todo = {
          id,
          userId: api.USER_ID,
          title,
          completed: false,
        };

        return [...prevTodos, newTodo];
      });

      setTitle('');
    },
    [hideError, title],
  );

  // #endregion

  // #region todo info
  const completeAll = useCallback((activeCount: number) => {
    setTodos(prevTodos => {
      for (const todo of prevTodos) {
        todo.completed = !!activeCount;
      }

      return [...prevTodos];
    });
  }, []);

  const removeTodo = useCallback((todoId: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
  }, []);

  const changeTitle = useCallback((todoId: number, newValue: string) => {
    setTodos(prevTodos => {
      const foundedTodo = prevTodos.find(todo => todo.id === todoId);

      if (foundedTodo) {
        foundedTodo.title = newValue;
        setState(prevState => prevState + 1);
      }

      return prevTodos;
    });
  }, []);

  const changeCompleted = useCallback((todoId: number, newValue: boolean) => {
    setTodos(prevTodos => {
      const foundedTodo = prevTodos.find(todo => todo.id === todoId);

      if (foundedTodo) {
        foundedTodo.completed = newValue;
        setState(prevState => prevState + 1);
      }

      return prevTodos;
    });
  }, []);
  // #endregion

  // #region footer
  const clearCompleted = useCallback(() => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'All':
        return todos;

      case 'Active':
        return todos.filter(todo => !todo.completed);

      case 'Completed':
        return todos.filter(todo => todo.completed);
    }
  }, [todos, filter]);
  // #endregion

  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: !activeCount,
              })}
              data-cy="ToggleAllButton"
              onClick={() => completeAll(activeCount)}
            />
          )}

          <form onSubmit={addTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus={true}
              value={title}
              onChange={handleTitleChange}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          removeTodo={removeTodo}
          changeTitle={changeTitle}
          changeCompleted={changeCompleted}
        />

        {todos.length !== 0 && (
          <Footer
            totalCount={todos.length}
            activeCount={activeCount}
            clearCompleted={clearCompleted}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !showErrorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setShowErrorMessage(false)}
        />

        {errorMessage}
      </div>
    </div>
  );
};

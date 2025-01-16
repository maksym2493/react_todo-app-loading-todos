/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (todoId: number) => void;
  changeTitle: (todoId: number, newValue: string) => void;
  changeCompleted: (todoId: number, newValue: boolean) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  removeTodo,
  changeTitle,
  changeCompleted,
}) => {
  const [title, setTitle] = useState(todo.title);
  const [completed, setCompleted] = useState(todo.completed);

  const [isEdible, setIsEdible] = useState(false);
  const [isLoading] = useState(false);

  const formFild = useRef<HTMLInputElement>(null);

  const handleGlobalClick = useCallback((event: MouseEvent) => {
    if (event.target !== formFild.current) {
      setIsEdible(false);
    }
  }, []);

  const addListeners = useCallback(() => {
    document.addEventListener('click', handleGlobalClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeListeners = useCallback(() => {
    document.removeEventListener('click', handleGlobalClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (isEdible) {
        removeListeners();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isEdible) {
      formFild.current?.focus();
      addListeners();
    } else {
      removeListeners();

      if (title !== todo.title) {
        changeTitle(todo.id, todo.title);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdible, title]);

  const handleCompletedChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.checked;

      setCompleted(newValue);
      changeCompleted(todo.id, newValue);
    },
    [changeCompleted, todo.id],
  );

  const updateTitle = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      removeTodo(todo.id);
    } else {
      setIsEdible(false);
      changeTitle(todo.id, title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (completed !== todo.completed) {
    setCompleted(todo.completed);
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCompletedChange}
        />
      </label>

      {isEdible ? (
        <form onSubmit={updateTitle}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            ref={formFild}
            onChange={event => setTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEdible(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => removeTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

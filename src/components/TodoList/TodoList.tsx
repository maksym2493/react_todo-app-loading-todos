/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';

import { Todo } from '../../types/Todo';

import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  removeTodo: (todoId: number) => void;
  changeTitle: (todoId: number, newValue: string) => void;
  changeCompleted: (todoId: number, newValue: boolean) => void;
};

export const TodoList: React.FC<Props> = React.memo(function TodoList({
  todos,
  removeTodo,
  changeTitle,
  changeCompleted,
}) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          changeTitle={changeTitle}
          changeCompleted={changeCompleted}
        />
      ))}
    </section>
  );
});

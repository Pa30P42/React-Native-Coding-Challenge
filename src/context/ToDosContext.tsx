import React, {useEffect, useState, Dispatch, SetStateAction} from 'react';
import {v4 as uuidv4} from 'uuid';
import {ToDo} from '../types';
import {getToDos} from '../services/api';

interface IToDosContext {
  completedToDos: ToDo[];
  uncompletedToDos: ToDo[];
  loading: boolean;
  createNewTodo: (todo: string) => void;
  completeSelectedTodos: () => void;
  undoSelectedTodos: () => void;
  searchCompletedTodos: (query: string) => ToDo[];
  toggleTodoSelection: (
    todoId: string | number,
    listType: 'uncompleted' | 'completed',
  ) => void;
  searchValues: string;
  setSearchValues: Dispatch<SetStateAction<string>>;
}

const ToDosContext = React.createContext<IToDosContext | undefined>(undefined);

export default function ToDoProvider({children}: any) {
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [uncompletedToDos, setUncompletedToDos] = useState<ToDo[]>([]);
  const [completedToDos, setCompletedToDos] = useState<ToDo[]>([]);
  const [searchedToDos, setSearchedToDos] = useState<ToDo[]>([]);
  const [selectedUncompletedToDos, setSelectedUncompletedToDos] = useState<
    (string | number)[]
  >([]);
  const [selectedCompletedToDos, setSelectedCompletedToDos] = useState<
    (string | number)[]
  >([]);
  const [searchValues, setSearchValues] = useState<string>('');

  const toggleTodoSelection = (
    todoId: string | number,
    listType: 'uncompleted' | 'completed',
  ) => {
    listType === 'uncompleted'
      ? setSelectedUncompletedToDos(prevSelected =>
          prevSelected.includes(todoId)
            ? prevSelected.filter(id => id !== todoId)
            : [...prevSelected, todoId],
        )
      : setSelectedCompletedToDos(prevSelected =>
          prevSelected.includes(todoId)
            ? prevSelected.filter(id => id !== todoId)
            : [...prevSelected, todoId],
        );
  };

  const createNewTodo = (todo: string) => {
    setTodos(prev => {
      return [
        ...prev,
        {completed: false, userId: 1, id: uuidv4(), title: todo},
      ];
    });
  };

  const completeSelectedTodos = () => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        selectedUncompletedToDos.includes(todo.id)
          ? {...todo, completed: true}
          : todo,
      ),
    );
    setSelectedUncompletedToDos([]);
  };

  const undoSelectedTodos = () => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        selectedCompletedToDos.includes(todo.id)
          ? {...todo, completed: false}
          : todo,
      ),
    );

    setSelectedCompletedToDos([]);
  };

  const searchCompletedTodos = (query: string) => {
    return completedToDos.filter(todo =>
      todo.title.toLowerCase().includes(query.toLowerCase()),
    );
  };

  useEffect(() => {
    const extractToDos = async () => {
      setLoading(true);
      try {
        const todos = await getToDos();
        const filteredTodos = todos.filter(todo => todo.userId === 1);
        setTodos(filteredTodos);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log('error', error);
        throw new Error(typeof error === 'string' ? error : "Can't get data");
      }
    };

    extractToDos();
  }, []);

  useEffect(() => {
    if (searchValues.length === 0) {
      return setSearchedToDos(todos);
    }
    if (searchValues.length < 3) return;
    const filteredTodos = todos.filter(todo =>
      todo.title.toLowerCase().includes(searchValues.toLowerCase()),
    );
    setSearchedToDos(filteredTodos);
  }, [searchValues, todos]);

  useEffect(() => {
    const uncompleted = searchedToDos.filter(todo => !todo.completed);
    const completed = searchedToDos.filter(todo => todo.completed);
    setUncompletedToDos(uncompleted);
    setCompletedToDos(completed);
  }, [searchedToDos]);

  return (
    <ToDosContext.Provider
      value={{
        completedToDos,
        uncompletedToDos,
        loading,
        createNewTodo,
        completeSelectedTodos,
        undoSelectedTodos,
        searchCompletedTodos,
        toggleTodoSelection,
        searchValues,
        setSearchValues,
      }}>
      {children}
    </ToDosContext.Provider>
  );
}

export function useToDos() {
  const context = React.useContext(ToDosContext);

  if (context === undefined) {
    throw new Error('useToDos must be used within an useToDosProvider');
  }
  return context;
}

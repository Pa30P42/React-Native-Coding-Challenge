import React, {useState, useCallback} from 'react';
import {Button, View} from 'react-native';
import {useToDos} from '../../../context/ToDosContext';
import ToDoList from '../TodoList';
import StyledTextInput from '../../unknown/StyledTextInput';

const ToDoUncompleted = () => {
  const [newToDo, setNewToDo] = useState<string>('');
  const {uncompletedToDos, completeSelectedTodos, createNewTodo} = useToDos();

  const onTextChange = useCallback((text: string) => {
    setNewToDo(text);
  }, []);

  const onCreatePress = useCallback(() => {
    if (!newToDo) return;
    createNewTodo(newToDo);
    setNewToDo('');
  }, [newToDo, createNewTodo]);

  return (
    <View className="flex-1 pt-4">
      <StyledTextInput
        onChangeText={onTextChange}
        value={newToDo}
        label="Add ToDo"
        placeholder="Add new ToDo"
      />
      <Button onPress={onCreatePress} title="Create" />
      <Button onPress={completeSelectedTodos} title="Complete" />
      <ToDoList listType="uncompleted" todos={uncompletedToDos} />
    </View>
  );
};

export default ToDoUncompleted;

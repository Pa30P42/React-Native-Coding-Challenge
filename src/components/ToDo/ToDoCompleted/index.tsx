import React from 'react';
import {Button, View} from 'react-native';
import ToDoList from '../TodoList';
import StyledTextInput from '../../unknown/StyledTextInput';
import {useToDos} from '../../../context/ToDosContext';

const ToDoCompleted = () => {
  const {undoSelectedTodos, searchValues, setSearchValues, completedToDos} =
    useToDos();

  const onTextChange = (text: string) => {
    setSearchValues(text);
  };

  return (
    <View className="flex-1">
      <StyledTextInput
        onChangeText={onTextChange}
        label="Search"
        value={searchValues}
      />
      <Button onPress={undoSelectedTodos} title="Undo" />
      <ToDoList listType="completed" todos={completedToDos} />
    </View>
  );
};

export default ToDoCompleted;

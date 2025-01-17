import { memo, useRef, useState } from "react";
import { AiFillCheckCircle, AiOutlineCheckCircle } from "react-icons/ai";
import styled from "styled-components";
import { AxiosError } from "axios";

import { todoAPI } from "../../shared/httpRequest";
import { handleError } from "../../shared/handleError";
import { ITodo } from "../../types/todoInterface";

import Button from "../common/Button";
import Input from "../common/Input";

type TodoProps = {
  todo: ITodo;
  todos: ITodo[];
  setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>;
};

export default memo(function TodoItem({ todo, todos, setTodos }: TodoProps) {
  const [value, setValue] = useState(todo.todo);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isCompleted, setIsCompleted] = useState(todo.isCompleted);

  const input = useRef(null);

  const handleCompleteTodo = async () => {
    try {
      const { data } = await todoAPI.updateTodo(todo.id, value, !isCompleted);
      setTodos(
        todos.map((v) => {
          return v.id !== todo.id ? v : data;
        })
      );
    } catch (error) {
      handleError(error as AxiosError);
    }
  };

  const handleUpdateTodo = async () => {
    try {
      const { data } = await todoAPI.updateTodo(todo.id, value, isCompleted);
      setTodos(
        todos.map((v) => {
          return v.id !== todo.id ? v : data;
        })
      );
      setIsUpdate(false);
    } catch (error) {
      handleError(error as AxiosError);
    }
  };

  const handleDeleteTodo = async () => {
    try {
      await todoAPI.deleteTodo(todo.id);
      setTodos(todos.filter((v) => v.id !== todo.id));
    } catch (error) {
      handleError(error as AxiosError);
    }
  };

  return (
    <StyledTodoItem>
      {isCompleted ? (
        <AiFillCheckCircle
          className="icon"
          onClick={() => {
            handleCompleteTodo();
            setIsCompleted(false);
          }}
          color="#2ECC71"
        />
      ) : (
        <AiOutlineCheckCircle
          className="icon"
          onClick={() => {
            handleCompleteTodo();
            setIsCompleted(true);
          }}
          color="#BDC3C7"
        />
      )}

      <div className="text-box">
        {isUpdate ? (
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            ref={input}
          />
        ) : (
          <div>{todo.todo}</div>
        )}
      </div>

      <div className="button-box">
        <Button
          onClick={() => {
            !isUpdate ? setIsUpdate(true) : handleUpdateTodo();
          }}
          text={!isUpdate ? "수정" : "제출"}
          width="50px"
        />
        <Button
          onClick={() => {
            isUpdate ? setIsUpdate(false) : handleDeleteTodo();
          }}
          text={isUpdate ? "취소" : "삭제"}
          width="50px"
          margin="0 0 0 10px"
          bgColor="#ff6b6b"
        />
      </div>
    </StyledTodoItem>
  );
});

const StyledTodoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  padding: 0 20px;
  border-bottom: 1px solid #e5e5e5;

  .icon {
    font-size: 40px;
    cursor: pointer;
  }

  .text-box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 20px;
  }

  .button-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

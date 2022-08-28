/* eslint-disable react/jsx-props-no-spreading */
import { getDatabase, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import useTaskLists from '../../hooks/useTaskLists';
import Input from '../Input/Input';
import Item from '../Item/Item';
import './Board.css';

export default function Board() {
    const [todos, setTodos] = useState([]);
    const [inProgress, setInprogress] = useState([]);
    const [done, setDone] = useState([]);

    const { loading, error, taskTodo, taskInprogress, taskDone } = useTaskLists();

    function writeUserData() {
        const db = getDatabase();
        set(ref(db, 'todos'), todos);
        set(ref(db, 'inprogress'), inProgress);
        set(ref(db, 'done'), done);
    }

    function resetDatabase() {
        const db = getDatabase();
        set(ref(db, 'todos'), []);
        set(ref(db, 'inprogress'), []);
        set(ref(db, 'done'), []);

        setTodos([]);
        setInprogress([]);
        setDone([]);
    }

    useEffect(() => {
        // console.log(taskTodo);
        // console.log(taskInprogress);
        // console.log(taskDone);

        if (taskTodo.length > 0) {
            setTodos(() => taskTodo);
        }
        if (taskInprogress.length > 0) {
            setInprogress(() => taskInprogress);
        }
        if (taskDone.length > 0) {
            setDone(() => taskDone);
        }
    }, [taskTodo, taskInprogress, taskDone]);

    const handleChildData = (childData) => {
        setTodos((prevTaskLists) => [...prevTaskLists, childData]);
        writeUserData();
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!result.destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            if (source.droppableId === 'column-1') {
                const copiedArray = [...todos];
                const [removed] = copiedArray.splice(source.index, 1);
                copiedArray.splice(destination.index, 0, removed);
                setTodos(copiedArray);
            } else if (source.droppableId === 'column-2') {
                const copiedArray = [...inProgress];
                const [removed] = copiedArray.splice(source.index, 1);
                copiedArray.splice(destination.index, 0, removed);
                setInprogress(copiedArray);
            } else if (source.droppableId === 'column-3') {
                const copiedArray = [...done];
                const [removed] = copiedArray.splice(source.index, 1);
                copiedArray.splice(destination.index, 0, removed);
                setDone(copiedArray);
            }
        } else if (source.droppableId !== destination.droppableId) {
            if (source.droppableId === 'column-1') {
                if (destination.droppableId === 'column-2') {
                    const sourceArray = [...todos];
                    const destArray = [...inProgress];
                    const [removed] = sourceArray.splice(source.index, 1);
                    destArray.splice(destination.index, 0, removed);
                    setTodos(sourceArray);
                    setInprogress(destArray);
                } else if (destination.droppableId === 'column-3') {
                    const sourceArray = [...todos];
                    const destArray = [...done];
                    const [removed] = sourceArray.splice(source.index, 1);
                    destArray.splice(destination.index, 0, removed);
                    setTodos(sourceArray);
                    setDone(destArray);
                }
            } else if (source.droppableId === 'column-2') {
                if (destination.droppableId === 'column-1') {
                    const sourceArray = [...inProgress];
                    const destArray = [...todos];
                    const [removed] = sourceArray.splice(source.index, 1);
                    destArray.splice(destination.index, 0, removed);
                    setInprogress(sourceArray);
                    setTodos(destArray);
                } else if (destination.droppableId === 'column-3') {
                    const sourceArray = [...inProgress];
                    const destArray = [...done];
                    const [removed] = sourceArray.splice(source.index, 1);
                    destArray.splice(destination.index, 0, removed);
                    setInprogress(sourceArray);
                    setDone(destArray);
                }
            } else if (source.droppableId === 'column-3') {
                if (destination.droppableId === 'column-1') {
                    const sourceArray = [...done];
                    const destArray = [...todos];
                    const [removed] = sourceArray.splice(source.index, 1);
                    destArray.splice(destination.index, 0, removed);
                    setDone(sourceArray);
                    setTodos(destArray);
                } else if (destination.droppableId === 'column-2') {
                    const sourceArray = [...done];
                    const destArray = [...inProgress];
                    const [removed] = sourceArray.splice(source.index, 1);
                    destArray.splice(destination.index, 0, removed);
                    setDone(sourceArray);
                    setInprogress(destArray);
                }
            }
        }
    };

    return (
        <>
            <div className="container">
                <div className="row-1">
                    <div>
                        <Input collectChildDataFromInput={handleChildData} />
                    </div>
                </div>
                <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                    <div className="row-2">
                        <div className="column">
                            <div className="box">
                                <h1 className="box-header">To Do</h1>
                                <Droppable droppableId="column-1">
                                    {(provided) => (
                                        <div
                                            className="box-body"
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {todos.map((item, index) => (
                                                <Draggable
                                                    key={uuidv4()}
                                                    draggableId={`${index}+column-1`}
                                                    index={index}
                                                >
                                                    {(provided1) => (
                                                        <div
                                                            className="body-item"
                                                            ref={provided1.innerRef}
                                                            {...provided1.draggableProps}
                                                            {...provided1.dragHandleProps}
                                                        >
                                                            <Item item={item} />
                                                            {writeUserData()}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>
                        <div className="column">
                            <div className="box">
                                <h1 className="box-header">In Progress</h1>
                                <Droppable droppableId="column-2">
                                    {(provided) => (
                                        <div
                                            className="box-body"
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {inProgress.map((item, index) => (
                                                <Draggable
                                                    key={uuidv4()}
                                                    draggableId={`${index}+column-2`}
                                                    index={index}
                                                >
                                                    {(provided1) => (
                                                        <div
                                                            className="body-item"
                                                            ref={provided1.innerRef}
                                                            {...provided1.draggableProps}
                                                            {...provided1.dragHandleProps}
                                                        >
                                                            <Item item={item} />
                                                            {writeUserData()}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>
                        <div className="column">
                            <div className="box">
                                <h1 className="box-header">Done</h1>
                                <Droppable droppableId="column-3">
                                    {(provided) => (
                                        <div
                                            className="box-body"
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {done.map((item, index) => (
                                                <Draggable
                                                    key={uuidv4()}
                                                    draggableId={`${index}+column-3`}
                                                    index={index}
                                                >
                                                    {(provided1) => (
                                                        <div
                                                            className="body-item"
                                                            ref={provided1.innerRef}
                                                            {...provided1.draggableProps}
                                                            {...provided1.dragHandleProps}
                                                        >
                                                            <Item item={item} />
                                                            {writeUserData()}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>
                    </div>
                </DragDropContext>
                <div className="row-3">
                    <button type="button" className="clean-database-btn" onClick={resetDatabase}>
                        Clean database
                    </button>
                    {loading && (
                        <>
                            <div>Loading firebase...</div>
                            <div>please wait a moment...</div>
                        </>
                    )}
                    {!loading && ((taskTodo === taskInprogress) === taskDone) === 0 && (
                        <div>no data founds</div>
                    )}
                    {error && <div>There was a error from firebase</div>}
                </div>
            </div>
        </>
    );
}

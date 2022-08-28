import React, { useState } from 'react';
import './Input.css';

export default function Input({ collectChildDataFromInput }) {
    const [currentTask, setCurrentTask] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentTask !== '') {
            collectChildDataFromInput(currentTask);
        }
        setCurrentTask('');
    };

    const handleChange = (e) => {
        setCurrentTask(e.target.value);
    };
    return (
        <>
            <form className="FORM" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    className="input"
                    placeholder="Add Task"
                    onChange={handleChange}
                    value={currentTask}
                />

                <button className="btn" type="submit">
                    Add
                </button>
            </form>
        </>
    );
}

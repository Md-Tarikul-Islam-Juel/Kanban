import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
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
            <Form className="FORM" onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                        className="input"
                        type="text"
                        placeholder="Add Task"
                        onChange={handleChange}
                        value={currentTask}
                    />
                </Form.Group>

                <Button className="btn" variant="primary" type="submit">
                    Add
                </Button>
            </Form>
        </>
    );
}

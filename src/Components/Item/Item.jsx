import React from 'react';
import Card from 'react-bootstrap/Card';
import './Item.css';

export default function Item({ item }) {
    return (
        <>
            <Card style={{ width: '90%' }} className="item">
                <Card.Text>{item}</Card.Text>
            </Card>
        </>
    );
}

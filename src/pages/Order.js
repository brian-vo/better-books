import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

function Order() {
    const [data, setData] = useState(null);
    const [books, setBooks] = useState(null);

    const queryString = useLocation().search;

    const params = new URLSearchParams(queryString);
    const orderId = params.get('order_id');

    useEffect(() => {
        fetch(`/order/${orderId}/data`)
            .then(response => response.json())
            .then(data => {
                setData(data);
            });
    }, [orderId]);

    useEffect(() => {
        if (!data || !data.items) {
            return;
        }

        const requests = data.items.map(isbn => {
            return fetch(`/book/${isbn}/data`)
                .then(response => response.json());
        });

        Promise.all(requests)
            .then(books => {
                setBooks(books);
            });
    }, [data]);

    if (!data) {
        return <p>No Data</p>;
    }

    if (!books) {
        return <p>No Book</p>;
    }
    return (
        <div className="container px-4 py-5">
            <h2 className="pb-2">Order #{data.order_id}</h2>
            <h4 className="pb-2">{data.address}</h4>
            <p className="fw-bold">Placed on: {data.order_date}</p>
            <p className="fw-bold">Payment Status: {data.payment_status}</p>
            <p className="fw-bold">Fulfillment Status: {data.fulfillment_status}</p>
    
            <table className="table table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Product</th>
                        <th scope="col">SKU</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.items && data.items.map(item => (
                        <tr key={item.ISBN}>
                            <th scope="row">{item.name}</th>
                            <td>{item.sku}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
                    };

export default Order;

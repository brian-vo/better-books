const OrderItem = ({ order }) => {
  console.log(order);
  return (
    <tr>
      <td>
        <a href={`/order?order_id=${order.order_id}`}>{order.order_id}</a>
      </td>
      <td>${order.sum}</td>
      <td>{order.status}</td>
      <td>{order.order_date}</td>
      <td>{order.prepared_date ? order.prepared_date : "NULL"}</td>
      <td>{order.delivered_date ? order.delivered_date : "NULL"}</td>
    </tr>
  );
};

export default OrderItem;

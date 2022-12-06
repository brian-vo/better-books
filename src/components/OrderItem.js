const OrderItem = ({ order }) => {
  function formatDate(date) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }
  return (
    <tr>
      <td>
        <a href={`/order?order_id=${order.order_id}`}>{order.order_id}</a>
      </td>
      <td>{order.items}</td>
      <td>${order.sum}</td>
      <td>{order.status}</td>
      <td>{formatDate(new Date(order.order_date))}</td>
      <td>{order.prepared_date ? formatDate(new Date(order.prepared_date)) : "NULL"}</td>
      <td>{order.delivered_date ? formatDate(new Date(order.delivered_date)) : "NULL"}</td>
    </tr>
  );
};

export default OrderItem;

const OrderItem = ({ order_id }) => {
  function twoDigits(num) {
    return num.toString().padStart(2, "0");
  }

  function formatDate(date) {
    return [
      twoDigits(date.getDate()),
      twoDigits(date.getMonth()),
      date.getFullYear(),
    ].join("/");
  }

  return (
    <tr>
      <td>{order_id}</td>
      <td>4</td>
      <td>$99.96</td>
      <td>Shipped</td>
      <td>{formatDate(new Date(2022, 6, 24))}</td>
      <td>{formatDate(new Date(2022, 6, 24))}</td>
      <td>{"N/A"}</td>
    </tr>
  );
};

export default OrderItem;

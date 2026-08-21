export default function Icon({ name, size = 20,...props }) {
  const map = {
    chart: "[chart]",
    clients: "[clients]",
    money: "[money]"
  };
  return (
    <span style={{ fontSize: size, display: 'inline-flex' }} aria-label={name} {...props}>
      {map[name] || "•"}
    </span>
  );
}
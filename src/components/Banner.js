// Banner component - used as a component to display a banner, pass in title and subtitle as props
const Banner = ({ title, subtitle }) => {
  return (
    <div className="banner">
      <div className="banner-container">
        <div className="banner-title">{title}</div>
        <div className="banner-subtitle">{subtitle}</div>
      </div>
    </div>
  );
};

export default Banner;

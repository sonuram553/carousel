import Carousel from "./Carousel";

export default function App() {
  return (
    <div className="app">
      <Carousel>
        <div className="item item-50">50</div>
        <div className="item item-50">50</div>
        <div className="item item-50">50</div>
        <div className="item item-100">100</div>
        <div className="item item-100">100</div>
        <div className="item item-100">100</div>
      </Carousel>
    </div>
  );
}

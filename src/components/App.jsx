import Carousel from "./Carousel";

export default function App() {
  return (
    <div className="app">
      <Carousel itemMarginRight={10} itemHorizontalBorderWidth={2}>
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

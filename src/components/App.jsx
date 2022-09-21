import Carousel from "./carousel/Carousel";

export default function App() {
  return (
    <div className="app">
      <Carousel itemMarginRight={10} itemHorizontalBorderWidth={0}>
        <div className="item item-200">200</div>
        <div className="item item-200">200</div>
        <div className="item item-50">50</div>
        <div className="item item-50">50</div>
        <div className="item item-50">50</div>
        <div className="item item-300">300</div>
        <div className="item item-300">300</div>
        <div className="item item-100">100</div>
        <div className="item item-100">100</div>
        <div className="item item-100">100</div>
      </Carousel>
    </div>
  );
}

import React, { Component } from "react";
import "./carousel.css";
import { CSSTransitionGroup } from "react-transition-group";

export default class Carousel extends Component {
  state = {
    isArrowLeftHidden: true,
    isArrowRightHidden: true,
    isHovering: false,
  };

  componentDidMount() {
    this.prevCarouselContentWidth = null;
    this.prevCarouselChildren = null;
    this.carouselContentWidth =
      (this.carouselChildrenBox && this.carouselChildrenBox.clientWidth) || 0;
    this.carouselChildren =
      (this.carouselChildrenBox && this.carouselChildrenBox.children) || [];
    this.firstChild = this.carouselChildren[0];

    this.start = 0;
    this.end = 0;
    this.isStartedFromLeft = true;
    this.cumulativeWidth = 0;
    this.isUpdate = false;
    this.timeoutIdForArrowRight = null;
    this.timeoutIdForArrowLeft = null;
    this.waitTime = 300;

    if (this.isCarouselOverflow()) {
      this.setState({
        isArrowRightHidden: false,
      });
    }
  }

  componentDidUpdate() {
    this.carouselContentWidth =
      (this.carouselChildrenBox && this.carouselChildrenBox.clientWidth) || 0;
    this.carouselChildren =
      (this.carouselChildrenBox && this.carouselChildrenBox.children) || [];
    this.firstChild = this.carouselChildren[0];

    if (
      this.carouselContentWidth > 0 &&
      this.carouselChildren.length > 0 &&
      (this.prevCarouselContentWidth !== this.carouselContentWidth ||
        this.prevCarouselChildren.length !== this.carouselChildren.length)
    ) {
      this.prevCarouselContentWidth = this.carouselContentWidth;
      this.prevCarouselChildren = this.carouselChildren;

      if (this.isCarouselOverflow())
        this.setState({ isArrowRightHidden: false });
      else this.setState({ isArrowRightHidden: true });
    }
  }

  isCarouselOverflow = () => {
    let cumulativeWidth = 0;
    const { itemMarginRight, itemHorizontalBorderWidth } = this.props;

    for (let i = 0; i < this.carouselChildren.length; i++) {
      const child = this.carouselChildren[i];
      const childWidth =
        ((child && child.clientWidth) || 0) +
        itemMarginRight +
        itemHorizontalBorderWidth;
      cumulativeWidth += childWidth;
    }

    return this.carouselContentWidth < cumulativeWidth - 3;
  };

  setStartOrEnd = (startIndex, isMovingRight = true) => {
    let i = startIndex;
    let itemMarginRight;
    const { itemHorizontalBorderWidth } = this.props;
    this.cumulativeWidth = 0;

    while (true) {
      if (isMovingRight) {
        if (i === this.carouselChildren.length) break;
      } else {
        if (i < 0) break;
      }

      if (i === this.carouselChildren.length - 1) itemMarginRight = 0;
      else itemMarginRight = this.props.itemMarginRight;

      const child = this.carouselChildren[i];
      const childWidth =
        ((child && child.clientWidth) || 0) +
        itemMarginRight +
        itemHorizontalBorderWidth;

      if (this.cumulativeWidth + childWidth > this.carouselContentWidth) {
        break;
      }

      this.cumulativeWidth += childWidth;
      if (isMovingRight) {
        this.end = i;
        i++;
      } else {
        this.start = i;
        i--;
      }
    }
  };

  onClickArrowLeft = () => {
    if (!this.firstChild || this.timeOutIdForArrowLeft) return;

    this.timeOutIdForArrowLeft = setTimeout(() => {
      this.timeOutIdForArrowLeft = null;
    }, this.waitTime);

    let marginLeft = 0;
    const { itemMarginRight } = this.props;
    let visiblePartOfPill = this.carouselContentWidth - this.cumulativeWidth;
    const firstChildMarginLeft = this.getMarginLeft(this.firstChild);

    if (this.end === this.carouselChildren.length - 1) {
      this.setStartOrEnd(this.carouselChildren.length - 1, false);
      visiblePartOfPill =
        this.carouselContentWidth - this.cumulativeWidth - itemMarginRight;
      this.isStartedFromLeft = false;
    }

    this.end = this.start - 1;
    this.setStartOrEnd(this.end, false);

    if (this.start === 0) {
      // Reached left end
      this.setState({
        isArrowLeftHidden: true,
        isArrowRightHidden: false,
      });
    } else if (this.state.isArrowRightHidden) {
      this.setState({
        isArrowRightHidden: false,
      });
    }

    if (this.isStartedFromLeft) {
      marginLeft = firstChildMarginLeft + this.cumulativeWidth;
    } else if (this.start === 0) {
      marginLeft =
        firstChildMarginLeft +
        this.cumulativeWidth -
        visiblePartOfPill -
        itemMarginRight;
    } else {
      marginLeft =
        firstChildMarginLeft + this.carouselContentWidth - visiblePartOfPill;
    }

    this.firstChild.style.marginLeft = marginLeft + "px";
  };

  onClickArrowRight = () => {
    if (!this.firstChild || this.timeOutIdForArrowRight) return;

    const { itemMarginRight } = this.props;

    this.timeOutIdForArrowRight = setTimeout(() => {
      this.timeOutIdForArrowRight = null;
    }, this.waitTime);

    if (this.start === 0) {
      this.setStartOrEnd(this.start);
      this.isStartedFromLeft = true;
    }

    let marginLeft = 0;
    let visiblePartOfPill = this.carouselContentWidth - this.cumulativeWidth;
    const firstChildMarginLeft = this.getMarginLeft(this.firstChild);

    this.start = this.end + 1;
    this.setStartOrEnd(this.start);

    if (this.end === this.carouselChildren.length - 1) {
      // Reached right end
      this.setState({
        isArrowLeftHidden: false,
        isArrowRightHidden: true,
      });
    } else if (this.state.isArrowLeftHidden) {
      this.setState({
        isArrowLeftHidden: false,
      });
    }

    if (!this.isStartedFromLeft) {
      if (this.end === this.carouselChildren.length - 1)
        marginLeft =
          firstChildMarginLeft - this.cumulativeWidth - itemMarginRight;
      else marginLeft = firstChildMarginLeft - this.cumulativeWidth;
    } else if (this.end === this.carouselChildren.length - 1) {
      marginLeft =
        firstChildMarginLeft - this.cumulativeWidth + visiblePartOfPill;
    } else {
      marginLeft =
        firstChildMarginLeft - this.carouselContentWidth + visiblePartOfPill;
    }

    this.firstChild.style.marginLeft = marginLeft + "px";
  };

  getMarginLeft = (el) => {
    let marginLeft = (el && el.style.marginLeft) || "";

    if (marginLeft === "") marginLeft = 0;
    else marginLeft = parseInt(marginLeft.slice(0, -2));

    return marginLeft;
  };

  render() {
    return (
      <div
        className="carousel"
        onMouseOver={() => this.setState({ isHovering: true })}
        onMouseOut={(evt) => {
          const el = evt.toElement || evt.relatedTarget;
          if (this.carousel.contains(el)) return;
          this.setState({ isHovering: false });
        }}
        ref={(el) => (this.carousel = el)}
      >
        <CSSTransitionGroup
          transitionName={"carousel-arrow"}
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}
        >
          {!this.state.isArrowLeftHidden && (
            <button
              className="carousel__arrow carousel__arrow--left"
              onClick={this.onClickArrowLeft}
            ></button>
          )}
        </CSSTransitionGroup>

        <div
          className="carousel__children-box"
          ref={(el) => (this.carouselChildrenBox = el)}
        >
          {this.props.children}
        </div>

        <CSSTransitionGroup
          transitionName="carousel-arrow"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}
        >
          {!this.state.isArrowRightHidden && (
            <button
              className="carousel__arrow carousel__arrow--right"
              onClick={this.onClickArrowRight}
            ></button>
          )}
        </CSSTransitionGroup>
      </div>
    );
  }
}

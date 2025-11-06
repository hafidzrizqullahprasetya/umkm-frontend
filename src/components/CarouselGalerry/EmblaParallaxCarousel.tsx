"use client";

import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import { useEffect, useCallback, useRef } from "react";
import "./EmblaParallaxCarousel.css";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "../HelperCarousel/EmblaCarouselArrowButton";

type EmblaParallaxCarouselProps = {
  images: string[];
  options?: EmblaOptionsType;
  onImageClick?: (index: number) => void; // ✅ TAMBAHKAN INI
};

const TWEEN_FACTOR_BASE = 0.2;

export default function EmblaParallaxCarousel({
  images,
  options = { loop: true },
  onImageClick, // ✅ TAMBAHKAN INI
}: EmblaParallaxCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const setTweenNodes = useCallback((emblaApi: any) => {
    tweenNodes.current = emblaApi
      .slideNodes()
      .map((slideNode: HTMLElement) =>
        slideNode.querySelector(".embla__parallax__layer")
      );
  }, []);

  const setTweenFactor = useCallback((emblaApi: any) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenParallax = useCallback((emblaApi: any, eventName?: string) => {
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slidesInView = emblaApi.slidesInView();
    const isScrollEvent = eventName === "scroll";

    emblaApi
      .scrollSnapList()
      .forEach((scrollSnap: number, snapIndex: number) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex: number) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem: any) => {
              const target = loopItem.target();
              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);
                if (sign === -1)
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                if (sign === 1)
                  diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            });
          }

          const translate = diffToTarget * (-1 * tweenFactor.current) * 100;
          const tweenNode = tweenNodes.current[slideIndex];
          if (tweenNode)
            tweenNode.style.transform = `translateX(${translate}%)`;
        });
      });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenParallax(emblaApi);
    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenParallax)
      .on("scroll", tweenParallax)
      .on("settle", tweenParallax);
  }, [emblaApi, tweenParallax, setTweenNodes, setTweenFactor]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {images.map((image, index) => (
            <div className="embla__slide" key={index}>
              {/* ✅ TAMBAHKAN cursor-pointer dan onClick */}
              <div 
                className="embla__parallax cursor-pointer"
                onClick={() => onImageClick?.(index)}
              >
                <div className="embla__parallax__layer">
                  <img
                    className="embla__parallax__img hover:scale-105 transition-transform duration-300 ease-in-out"
                    src={image}
                    alt={`Gallery ${index + 1}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__buttons">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>
    </div>
  );
}
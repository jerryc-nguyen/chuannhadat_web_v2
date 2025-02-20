import { cn } from '@common/utils';
import { CarouselNext, CarouselPrevious } from '@components/ui/carousel';
import React from 'react';
import { EmblaCarouselType } from 'embla-carousel';

type ImageSliderActionProps = {
  countImages: number;
  api: EmblaCarouselType | undefined;
  onClick?: () => void;
};

const ImageSliderAction: React.FC<ImageSliderActionProps> = ({ countImages, api, onClick }) => {
  const [current, setCurrent] = React.useState(0);

  const handleOnClick = (event: A) => {
    if (event.target && event.target.classList.contains('js-sliderControls')) {
      onClick && onClick();
    }
  };

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const onClickIndexSlider = (id: number) => {
    setCurrent(id);
    api?.scrollTo(id, false);
  };
  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  return (
    <>
      <div
        className="js-sliderControls slider_button absolute top-1/2 flex w-full -translate-y-1/2 cursor-pointer justify-between px-4"
        onClick={handleOnClick}
      >
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>
      <section className="slider_list_dot">
        {Array.from({ length: countImages }).map((_, index) => (
          <span
            key={index}
            onClick={() => onClickIndexSlider(index)}
            className={cn('slider-dot', current === index ? 'slide-dot_active' : '')}
          />
        ))}
      </section>
    </>
  );
};

export default ImageSliderAction;

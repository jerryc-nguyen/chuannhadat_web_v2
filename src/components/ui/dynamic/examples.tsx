import React, { Suspense, useState } from 'react';
import {
  DynamicDropdownMenu,
  DynamicSelect,
  DynamicCarousel,
  DynamicCommand,
  MenuLoader,
  SelectLoader,
  CommandLoader
} from './index';

// Example: Dynamic Dropdown Menu (7.1KB saved)
export const OptimizedDropdownExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        Open Menu
      </button>
      {isOpen && (
        <Suspense fallback={<MenuLoader />}>
          <DynamicDropdownMenu>
            {/* Your dropdown content */}
          </DynamicDropdownMenu>
        </Suspense>
      )}
    </div>
  );
};

// Example: Dynamic Select (5.6KB saved)
export const OptimizedSelectExample = () => {
  const [showSelect, setShowSelect] = useState(false);

  return (
    <div>
      {showSelect ? (
        <Suspense fallback={<SelectLoader />}>
          <DynamicSelect>
            {/* Your select options */}
          </DynamicSelect>
        </Suspense>
      ) : (
        <button onClick={() => setShowSelect(true)}>
          Show Select
        </button>
      )}
    </div>
  );
};

// Example: Dynamic Command Palette (4.7KB saved)
export const OptimizedCommandExample = () => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Load only when Cmd+K is pressed
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {isCommandOpen && (
        <Suspense fallback={<CommandLoader />}>
          <DynamicCommand>
            {/* Your command palette content */}
          </DynamicCommand>
        </Suspense>
      )}
    </>
  );
};

// Example: Dynamic Carousel (6.3KB saved)
export const OptimizedCarouselExample = ({ images }: { images: string[] }) => {
  const [shouldLoadCarousel, setShouldLoadCarousel] = useState(false);

  // Load carousel when user scrolls to images section
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadCarousel(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('carousel-container');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div id="carousel-container">
      {shouldLoadCarousel ? (
        <Suspense fallback={<div className="h-64 bg-gray-200 animate-pulse rounded" />}>
          <DynamicCarousel>
            {/* Your carousel items */}
          </DynamicCarousel>
        </Suspense>
      ) : (
        <div className="h-64 bg-gray-100 flex items-center justify-center">
          <button onClick={() => setShouldLoadCarousel(true)}>
            Load Image Gallery
          </button>
        </div>
      )}
    </div>
  );
};

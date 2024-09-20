// This example uses externally hosted images due to StackBlitz free plan limitations.
//
// You can import local images in your project as follows:
//
// import image1 from "@/public/images/image1.jpg";

const images = [
  {
    src: 'https://yet-another-react-lightbox.com/images/image01.jpeg',
    width: 3840,
    height: 5760,
  },
  {
    src: 'https://yet-another-react-lightbox.com/images/image02.jpeg',
    width: 3840,
    height: 5070,
  },
  {
    src: 'https://yet-another-react-lightbox.com/images/image03.jpeg',
    width: 3840,
    height: 5120,
  },
];

const imageSizes = [16, 32, 48, 64, 96, 128, 256, 384];
const deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

function nextImageUrl(src: string, size: number) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${size}&q=75`;
}

const slides = images.map(({ src, width, height }) => ({
  width,
  height,
  src: nextImageUrl(src, width),
  srcSet: [...imageSizes, ...deviceSizes]
    .filter((size) => size <= width)
    .map((size) => ({
      src: nextImageUrl(src, size),
      width: size,
      height: Math.round((height / width) * size),
    })),
}));

export default slides;

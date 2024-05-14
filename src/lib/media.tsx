import { paths } from './pathMedia';

interface ImageData {
  path: string;
  alt: string;
}

export function getImage(src: string): ImageData | null {
  const image = paths.find((img) => {
    const pathSegments = img.path.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1].split('.')[0];
    return lastSegment === src;
  });

  if (!image) {
    console.error(`Image "${src}" not found`);
    return null;
  }

  return image;
}

interface ImageProps {
  src: string;
  className?: string;
}

const ImgData: React.FC<ImageProps> = ({ src, className }) => {
  const image = getImage(src);

  if (!image) {
    console.error(`Image "${src}" not found`);
    return null;
  }

  const { path, alt } = image;

  return <img src={path} alt={alt} className={className} />;
};

export default ImgData;
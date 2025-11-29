import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { youtubePlayerAtom } from './state';

export const YoutubePlayerModal: React.FC = () => {
  const { isShow, videoUrl } = useAtomValue(youtubePlayerAtom);
  const updateYoutubePlayerState = useSetAtom(youtubePlayerAtom);
  const handleCloseVideoYoutube = () => {
    updateYoutubePlayerState({
      isShow: false,
      videoUrl: '',
    });
  };
  const embedUrl = videoUrl?.replace('watch?v=', 'embed/');
  useEffect(() => {
    const bodyElement = document.body;
    const postDetailMobile = document.querySelector('.c-bts__content') as HTMLElement;
    if (isShow) {
      bodyElement && (bodyElement.style.overflow = 'hidden');
      postDetailMobile && (postDetailMobile.style.overflow = 'hidden');
    } else {
      bodyElement && (bodyElement.style.overflow = '');
      postDetailMobile && (postDetailMobile.style.overflow = '');
    }
    return () => {
      bodyElement && (bodyElement.style.overflow = '');
      postDetailMobile && (postDetailMobile.style.overflow = '');
    };
  }, [isShow]);
  if (!isShow) return null;
  return (
    <div
      className="pointer-events-auto fixed inset-0 z-[1200] flex items-center justify-center bg-black/85"
      onClick={handleCloseVideoYoutube}
    >
      <div
        className="relative w-screen overflow-hidden rounded-lg md:w-[90%] md:max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-black p-4">
          <h4 className="font-semibold text-white">Video tổng quan về bất động sản</h4>
          <button
            className="group rounded-md p-1 text-black transition-all hover:bg-zinc-900/60"
            onClick={handleCloseVideoYoutube}
          >
            <X className="text-3xl text-white/50 group-hover:text-white" />
          </button>
        </div>

        <div className="aspect-video w-full">
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

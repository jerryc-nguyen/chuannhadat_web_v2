import { useSetAtom } from 'jotai';
import { Play as FaPlay } from 'lucide-react';
import { youtubePlayerAtom } from './state';

type YoutubePlayerActionProps = {
  youtube_url?: string;
  isDisplay?: boolean;
};

export const YoutubePlayerAction: React.FC<YoutubePlayerActionProps> = (props) => {
  const { youtube_url, isDisplay = true } = props;
  const updateYoutubePlayerState = useSetAtom(youtubePlayerAtom);
  const handleOpenYoutubePlayer = () => {
    updateYoutubePlayerState({
      isShow: true,
      videoUrl: youtube_url,
    });
  };
  if (!youtube_url || !isDisplay) return null;
  return (
    <div
      onClick={handleOpenYoutubePlayer}
      className="flex-center group absolute z-[5] aspect-square w-[12%] cursor-pointer rounded-full border bg-black/40 transition-all hover:bg-black/60"
    >
      <FaPlay className="text-white transition-all group-hover:scale-125" />
    </div>
  );
};

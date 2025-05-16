import { atom } from 'jotai';
interface IYoutubePlayer {
  videoUrl?: string;
  isShow?: boolean;
}
export const youtubePlayerAtom = atom<IYoutubePlayer>({
  videoUrl: '',
  isShow: false,
});

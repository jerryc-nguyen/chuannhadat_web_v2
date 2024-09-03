import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { LuMoreHorizontal } from 'react-icons/lu';
import useCardAuthors from './hooks/useCardAuthors';

export default function CardAuthor({ product }: { product: A }) {
  const { getAuthorById } = useCardAuthors();

  const author = getAuthorById(product.user_id + '');
  console.log('author', author, product.user_id);
  const fullName = author?.full_name ? author.full_name : 'Loading';

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={author?.avatar_url} alt={fullName} />
          <AvatarFallback>{fullName}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold leading-none">{fullName}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {product?.formatted_publish_at} · {product?.short_location_name}
          </p>
        </div>
      </div>
      <LuMoreHorizontal className="ml-2 h-5 w-5 rounded-full text-muted-foreground hover:bg-blue-50" />
    </div>
  );
}

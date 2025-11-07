import { ColumnDef } from '@tanstack/react-table';
import { CellSelect, CellStatus } from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/components/cells';
import FeaturedImage from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/components/cells/FeaturedImage';
import { ManageProductList } from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/schemas/ManageProductListSchema';
import { PostInfo } from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/components/cells/PostInfo';
import { ActionBtns } from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/components/cells/ActionBtns';

export const postsColumns: ColumnDef<ManageProductList>[] = [
  {
    id: 'select',
    cell: CellSelect,
  },
  {
    header: 'Hình đại diện',
    cell: ({ row }) => <FeaturedImage product={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: 'Mô tả',
    cell: ({ row }) => <PostInfo product={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: 'Thông tin khác',
    cell: CellStatus,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: 'Hành động',
    cell: ({ row }) => <ActionBtns productId={row.original.id} productUid={row.original.uid} />,
    enableSorting: false,
    enableHiding: false,
  }
];

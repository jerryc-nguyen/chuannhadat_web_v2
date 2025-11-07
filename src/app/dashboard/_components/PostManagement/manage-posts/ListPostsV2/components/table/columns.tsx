import { ColumnDef } from '@tanstack/react-table';
import { CellSelect, CellStatus } from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/components/cells';
import FeaturedImage from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/components/cells/FeaturedImage';
import { ManageProductList } from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/schemas/ManageProductListSchema';
import { PostInfo } from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/components/cells/PostInfo';
import { ActionBtns } from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/components/cells/ActionBtns';
import MobileCardItem from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/components/MobileCardItem';

export const desktopColumns: ColumnDef<ManageProductList>[] = [
  {
    id: 'select',
    cell: CellSelect,
    enableResizing: false,
    meta: {
      headerClassName: 'w-10 max-w-10 px-0 min-w-10 text-center',
      cellClassName: 'w-10 max-w-10 min-w-10 px-0 text-center',
    },
  },
  {
    header: 'Hình đại diện',
    cell: ({ row }) => <FeaturedImage product={row.original} />,
    enableSorting: false,
    enableHiding: false,
    meta: { headerClassName: 'w-[20%]', cellClassName: 'w-[20%]' },
    enableResizing: false,
  },
  {
    header: 'Mô tả',
    cell: ({ row }) => <PostInfo product={row.original} />,
    enableSorting: false,
    enableHiding: false,
    meta: { headerClassName: 'w-[40%]', cellClassName: 'w-[40%]' },
    enableResizing: false,
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
    meta: { headerClassName: 'w-[20%]', cellClassName: 'w-[20%]' },
    enableResizing: false,
  }
];

export const mobileColumns: ColumnDef<ManageProductList>[] = [
  {
    id: 'content',
    cell: ({ row }) => <MobileCardItem product={row.original} />,
    enableResizing: false,
    meta: {
      headerClassName: 'w-10 max-w-10 px-0 min-w-10 text-center',
      cellClassName: 'w-10 max-w-10 min-w-10 px-0 text-center',
    },
  }
]

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Product } from "../data/schemas/product-schema";
import Image from "next/image";
import { Switch } from "@components/ui/switch";
import { ChevronsUp, ImageIcon, Maximize2, RefreshCw, SquarePen, Trash2, TriangleAlert } from "lucide-react";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import Link from "next/link";
import hideOnFrontendReasonConstant from "../constant/hide_on_frontend_reason";
import { Fragment, useState } from "react";
import UpVipProductForm from "./up-vip-form";
import useModals from "@mobile/modals/hooks";
import ProductApiService from "../apis/product-api";
import { SetUpAutoRefreshProductInput, ShowOnFrontEndProductInput } from "../data/schemas/product-action-schema";
import { toast } from 'react-toastify';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";
import useProductActionSetting from "../hooks/product-action-setting";
import { useQueryClient } from "@tanstack/react-query";
import { services } from '@api/services';
import { isLoadingModal, selectedPostId } from "@desktop/post-detail/states/modalPostDetailAtoms";
import { useAtom, useAtomValue } from "jotai";
import Spinner from '@components/ui/spinner';
import useProductsList from "../hooks/product-list";

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
  },

  {
    accessorKey: "images",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mô tả" className="container"/>
    ),
    cell: ({ row }) => {
      const hide_on_frontend_reason = row.original.hide_on_frontend_reason;

      const images = row.original.images;
      const imageUrl = images?.[0]?.url || "/default-image.jpg";
      
      const images_count = row.original.images_count;
      const visible = row.original.visible;

      const title = row.original.title;
      const productUid = row.original.uid;
      const formatted_price = row.original.formatted_price;
      const formatted_area = row.original.formatted_area;
      const formatted_price_per_m2 = row.original.formatted_price_per_m2;
      const formatted_kt = row.original.formatted_kt;

      const formatted_bussiness_category = row.original.formatted_bussiness_category;
      const short_location_name = row.original.short_location_name;

      const productId = row.original.id;
      const adsType = row.original.ads_type;
      const auto_refresh_product = row.original.auto_refresh_product;

      return (
        <div className="container">
          {
            hide_on_frontend_reason ? (
              <div className="flex w-full overflow-hidden rounded-lg md:rounded-xl lg:flex-row lg:items-center border border-[#9f3a38] bg-[#fff6f6] mb-4 p-4">
                <span className="text-sm text-[#9f3a38]">
                  {
                    hideOnFrontendReasonConstant.find(item => item.value === hide_on_frontend_reason)?.content.map((line, index) => (
                      <Fragment key={index}>
                        {line.trim()}<br />
                      </Fragment>
                    ))
                  }
                </span>
              </div>
            ) : <></>
          }
          <div className="flex w-full flex-col gap-8 overflow-hidden rounded-lg md:rounded-xl lg:flex-row lg:items-center min-h-[180px]">
            <ImageProduct 
              title={title}
              imageUrl={imageUrl}
              images_count={images_count}
              visible={visible}
              productId={productId}
              productUid={productUid}
            />
            <div className="flex flex-col flex-1 h-full">
              <div className="mb-2">
                <TitleTriggerOpenProductDetail
                  title={title}
                  visible={visible}
                  productUid={productUid}
                />
              </div>
              <div className="mb-2 flex gap-5 flex-wrap">
                <span className="text-sm font-medium">
                  {formatted_price || "--"}
                </span>
                <span className="text-sm font-medium">
                  ·
                </span>
                <span className="text-sm font-medium">
                  {formatted_area || "--"}
                </span>
                <span className="text-sm font-medium">
                  ·
                </span>
                <span className="text-sm font-medium">
                  {formatted_price_per_m2 || "--"}
                </span>
                <span className="text-sm font-medium">
                  ·
                </span>
                <span className="flex gap-2 text-sm font-medium">
                  <Maximize2 size={16} strokeWidth={1} />
                  {formatted_kt || "--"}
                </span>
              </div>
              <div className="mb-2 flex gap-5 flex-wrap">
                <span className="text-sm">
                  {formatted_bussiness_category || "--"}
                </span>
                <span className="text-sm">
                  ·
                </span>
                <span className="text-sm">
                  {short_location_name || "--"}
                </span>
              </div>

              <div className="flex gap-16">
                <ButtonUpVip productId={productId} adsType={adsType}/>

                <CheckboxAutoRefresh productId={productId} auto_refresh_product={auto_refresh_product}/>
                
              </div>
            </div>
            <div className="flex flex-col space-y-1 col-span-2 h-full">
              <div className="flex flex-col">
                <ButtonRefresh productId={productId} />

                <Button variant="outline" size="sm" className="h-8 justify-start gap-2 mb-2">
                  <SquarePen size={16}/> <span className="text-sm">Cập nhật tin</span> 
                </Button>

                <Separator className="h-[1px]" />
                
                <ButtonDelete productId={productId} />
              </div>
            </div>
          </div>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Thông tin khác" />
    ),
    cell: ({ row }) => {
      const id = row.original.id;
      const formatted_created_at = row.original.formatted_created_at;
      const formatted_published_at = row.original.formatted_published_at;
      const ads_type = row.original.ads_type;
      const expires_after_days = row.original.expires_after_days;

      return (
        <div className="flex flex-col gap-1 min-h-[180px] w-max">
          <span className="text-xs">
            <span className="font-medium mb-2">Mã tin:</span>
            <Link
              className="ml-2 text-blue-600 hover:text-blue-900"
              href={`${id}`}
            >
              #{id}
            </Link>
          </span>
          
          <div className="flex flex-col gap-1 text-xs">
            <span className="font-medium">
              Ngày đăng:
            </span>
            <span className="text-muted-foreground">
              {formatted_created_at}
            </span>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <span className="font-medium">
              Ngày làm mới:
            </span>
            <span className="text-muted-foreground">
              {formatted_published_at}
            </span>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <span className="font-medium">
              Loại tin:
            </span>
            <span className={`${
              ads_type === "vip_1" ? "text-[#dc3545]"  :
              ads_type === "vip_2" ? "text-[#fd7e14]"  :
              ads_type === "vip_3" ? "text-[#0052ea]"  : "text-muted-foreground"
            }`}>
              {
                ads_type === "vip_1" ? "TIN VIP 1" :
                ads_type === "vip_2" ? "TIN VIP 2" :
                ads_type === "vip_3" ? "TIN VIP 3" : "Tin thường"
              }
              {
                (expires_after_days && ads_type !== "normal") ? 
                  <span className="text-muted-foreground">{` (hết hạn sau ${expires_after_days})`}</span> : <></>
              }
            </span>
            
          </div>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

const ButtonUpVip = ({ productId, adsType }: { productId: string, adsType: string } ) => {
  const { openModal, closeModal } = useModals();

  const showModalUpVipProduct = () => {
    openModal({
      name: 'ModalUpVipProduct',
      title: 'Cấu hình tin đăng',
      content: (
        <UpVipProductForm productId={productId} closeModal={closeModal}/>
      ),
      footer: <></>,
      showAsDialog: true,
    });
  }

  return (
    <Button variant="outline" size="sm" className="h-8" onClick={() => {
      showModalUpVipProduct();
    }} disabled={adsType !== "normal"}>
      <ChevronsUp color="#28a745" size={16}/>
      <span className="text-sm text-[#28a745]">
        UP VIP
      </span>
      <ChevronsUp color="#28a745" size={16}/>
    </Button>
  )
}

const SwitchButtonToggleShowOnFrontEnd = ({ productId, visible }: { productId: string, visible: boolean } ) => {
  const [checked, setChecked] = useState<boolean>(visible);

  const handleShowOnFrontend = async (data: ShowOnFrontEndProductInput) => {
    try {
      const res: A = await ProductApiService.ShowOnFrontend(data);
      console.log("handleShowOnFrontend success response", res);
      if ( res.status === true && res.message ) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
        setChecked(!data.showOnFrontEnd);
      }
    } catch (err) {
      setChecked(!data.showOnFrontEnd);
      console.error("handleShowOnFrontend error", err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="flex gap-2 items-center justify-center">
      <span>Ẩn tin</span>
      <Switch
        checked={checked}
        onCheckedChange={(checked) => {
          setChecked(checked);
          handleShowOnFrontend({
            productId: productId,
            showOnFrontEnd: checked
          });
        }}
      />
      <span>Hiện tin</span>
    </div>
  )
}

const CheckboxAutoRefresh = ({ productId, auto_refresh_product }: { productId: string, auto_refresh_product: boolean } ) => {
  const [checked, setChecked] = useState<boolean>(auto_refresh_product);

  const handleSetUpAutoRefresh = async (data: SetUpAutoRefreshProductInput) => {
    try {
      const res: A = await ProductApiService.SetUpAutoRefresh(data);
      console.log("handleSetUpAutoRefresh success response", res);

      if ( res.status === true && res.message ) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
        setChecked(!data.autoRefresh);
      }
    } catch (err) {
      setChecked(!data.autoRefresh);
      console.error("handleSetUpAutoRefresh error", err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="bg-background border flex items-center px-3 space-x-2 text-sm rounded-md w-max">
      <Checkbox
        checked={checked}
        onCheckedChange={(checkedState) => {
          if (typeof checkedState === 'boolean') {
            setChecked(checkedState);
            handleSetUpAutoRefresh({
              productId: productId,
              autoRefresh: checkedState
            })
          }
        }}
      />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Làm mới tin tự động
      </label>
    </div>
  )
}

const ButtonRefresh = ({ productId }: { productId: string } ) => {
  const { productActionSettings, decreaseTotalRefreshsCount } = useProductActionSetting();

  const handleRefresh = async () => {
    try {
      const res: A = await ProductApiService.Refresh({
        productId: productId
      });
      console.log("handleRefresh success response", res);

      if ( res.status === true && res.message ) {
        toast.success(res.message);
        decreaseTotalRefreshsCount();
      } else {
        toast.error(res.message);
      }
    } catch (err: A) {
      console.error("handleRefresh error", err);
      const errMsg = err.message || "Có lỗi xảy ra, vui lòng thử lại sau.";
      toast.error(errMsg);
    }
  };

  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="outline" size="sm" className="h-8 justify-start gap-2 mb-1" onClick={handleRefresh}>
            <RefreshCw size={16}/> <span className="text-sm">Làm mới tin</span> 
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {
            ( productActionSettings && productActionSettings.total_refreshs_count ) ?
              <p>Làm mới tin thủ công. Bạn còn lần {productActionSettings.total_refreshs_count} làm mới</p> :
              <></>
          }
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const ButtonDelete = ({ productId }: { productId: string } ) => {
  const { openModal, closeModal } = useModals();
  const { handleFilterProduct, productQueryForm} = useProductsList();

  const showConfirmDelete = () => {
    openModal({
      name: 'ModalUpVipProduct',
      title: 'Xác nhận',
      content: (
        <div>Bạn muốn xóa BDS ?</div>
      ),
      footer: <>
        <Button variant="ghost" onClick={closeModal}>Hủy</Button>
        <Button onClick={handleDelete}>OK</Button>
      </>,
      showAsDialog: true,
    });
  }

  const handleDelete = async () => {
    try {
      const res: A = await ProductApiService.Delete({
        productId: productId
      });
      console.log("handleDelete success response", res);

      if ( res.status === 200 && res.success === true && res.message ) {
        toast.success(res.message);
        closeModal();
        handleFilterProduct(productQueryForm.getValues());
      } else {
        toast.error(res.message);
      }
    } catch (err: A) {
      console.error("handleDelete error", err);
      const errMsg = err.message || "Có lỗi xảy ra, vui lòng thử lại sau.";
      toast.error(errMsg);
    }
  };

  return (
    <Button variant="outline" size="sm" className="h-8 justify-start gap-2 mt-2" onClick={showConfirmDelete}>
      <Trash2 size={16}/>  <span className="text-sm">Xóa tin</span>
    </Button>
  )
}

const ImageProduct = ({ imageUrl, images_count, title, visible, productId, productUid }: { imageUrl: string, images_count: number, title: string, visible: boolean, productId: string, productUid: string } ) => {
  const postId = useAtomValue(selectedPostId);
  const isLoadingCardProduct = useAtomValue(isLoadingModal);
  
  return (
    <div className="relative group inline-flex rounded-lg flex-col gap-3 h-full">
      <Image
        alt={title}
        width={100}
        height={100}
        src={imageUrl}
        className="object-cover rounded-lg h-36 w-48 border-2"
        onError={(e) => {
          e.currentTarget.src = "/default-image.jpg"; // Set default image path
          e.currentTarget.onerror = null; // Prevents infinite loop in case the fallback image also fails
        }}
      
      />
      <SwitchButtonToggleShowOnFrontEnd productId={productId} visible={visible}/>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-black/60 font-semibold inline-flex items-center left-[50%] px-2.5 py-0.5 rounded-full text-white text-xs top-1/2 transform gap-1">
        <ImageIcon  size={16}/>
        <span>{images_count}</span>
        <span>hình</span>
      </div>
      {isLoadingCardProduct && postId === productUid && (
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-x-2 rounded-md bg-white/80 text-primary_color">
          <div role="status">
            <Spinner />
          </div>
          <span className="font-medium">Đang tải...</span>
        </div>
      )}
    </div>
  )
}

const TitleTriggerOpenProductDetail = ({ title, visible, productUid }: { title: string, visible: boolean, productUid: string } ) => {
  const queryClient = useQueryClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_postId, setSelectedPostId] = useAtom(selectedPostId);

  const openModalPostDetail = async () => {
    setSelectedPostId(productUid);
    await queryClient.prefetchQuery({
      queryKey: ['get-detail-post', productUid],
      queryFn: () => services.posts.getDetailPost(productUid),
    });
  };

  return (
    <span className="mb-3 text-16 font-semibold hover:text-primary_color cursor-pointer"
      onClick={openModalPostDetail}
    >
      {title}
      <span className={`text-sm font-semibold text-[#dc3545] ${visible ? 'hidden' : ''}`}>
        <span className="mx-2"> · </span> 
        <span className="space-x-1">
          <TriangleAlert className="inline-block" color="#dc3545" size={16}/>
          <span>{" "}Tin đang bị ẩn!{" "}</span>
          <TriangleAlert className="inline-block" color="#dc3545" size={16}/>
        </span>
      </span>
    </span>
  )
}

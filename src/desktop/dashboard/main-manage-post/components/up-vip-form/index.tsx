import { useEffect, useState } from "react";
import ProductApiService from "../../collection-post/apis/product-api";
import { toast } from 'react-toastify';
import { ButtonGroup } from "@components/ui/button-group";
import { Radio } from "@components/ui/Radio";
import { maskNumber } from "@common/priceHelpers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpVipProductInput, upVipProductInputSchema } from "../../collection-post/data/schemas/up-vip-schema";
import { Button } from "@components/ui/button";
import { LoadingSpinner } from "@components/icons/loading-spinner";

type UpVipProductOptions = {
    ads_type_options: AdsTypeOption[],
    number_of_day_options: NumberOfDayOption[],
}

type AdsTypeOption = {
    formatted_amount: string;
    text: string;
    value: string;
}

type NumberOfDayOption = {
    formatted_discount: string;
    text: string;
    value: number;
}

interface IUpVipProductFormProps {
    productId: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    closeModal: Function;
}

const UpVipProductForm = ({ productId, closeModal }: IUpVipProductFormProps) => {
    const [upVipProductOptions, setUpVipProductOptions] = useState<UpVipProductOptions | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [defaultValues] = useState<UpVipProductInput>({
        product_id: productId.toString(),
        ads_type: "",
        number_of_day: ""
    })
    
    const form = useForm({
        resolver: zodResolver(upVipProductInputSchema),
        defaultValues,
        reValidateMode: "onChange"
    });

    const handleUpVip = async (data: UpVipProductInput) => {
        try {
          const res = await ProductApiService.UpVip(data);
          console.log("handleUpVip success response", res);
          toast.success("Up VIP thành công.");
          closeModal();

          // TODO KHAI NEED HELP: Cập nhật số dư tài khoản real-time
            
        } catch (err) {
          console.error("handleUpVip error", err);
          toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
        }
    };

    const adsType = form.watch("ads_type");
    const numberOfDay = form.watch("number_of_day");


    useEffect(() => {
        handleGetUpVipSettings();
    }, [])

    const handleGetUpVipSettings = async () => {
        setIsLoading(true);
        try {
            const res = await ProductApiService.GetUpVipSettings();
            setUpVipProductOptions(res.data);
        } catch (err) {
            console.error("handleFilter error", err);
            setUpVipProductOptions(null);
            toast.error("Không thể lấy Cấu hình tin đăng, vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    };

    const [isLoadingValidate, setIsLoadingValidate] = useState<boolean>(false);
    const [errorValidate, setErrorValidate] = useState<string>("");
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const handleValidateUpVip = async (data: UpVipProductInput) => {
        setIsLoadingValidate(true);
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const res: any = await ProductApiService.ValidateUpVip(data);
          if ( res.status ) {
            setErrorValidate("");
            console.log("handleUpVip success response", res);
          } else {
            throw new Error(res.message);
          }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          console.error("handleUpVip error", err);
          const errMessage = err.message || "Có lỗi xảy ra, vui lòng thử lại sau.";
          toast.error(errMessage);
          setErrorValidate(errMessage)
        } finally {
            setIsLoadingValidate(false);
        }
    };


    useEffect(() => {
        if ( !adsType || !numberOfDay) return;

        let amountPerDay = 0;
        if ( adsType === "vip_1") {
            amountPerDay = 20000;
        } else if ( adsType === "vip_2") {
            amountPerDay = 10000;
        } else if ( adsType === "vip_3") {
            amountPerDay = 5000;
        }

        let discountPercentage = 0;
        if ( parseInt(numberOfDay) === 7) {
            discountPercentage = 15;
        } else if ( parseInt(numberOfDay) === 15) {
            discountPercentage = 20;
        } else if ( parseInt(numberOfDay) === 30) {
            discountPercentage = 30;
        }
        
        handleValidateUpVip(form.getValues())
        setTotalAmount(amountPerDay * parseInt(numberOfDay) * ((100 - discountPercentage)/ 100));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adsType, numberOfDay])

    return (
        <div className="space-y-6 w-full">
            {
                (isLoading && !upVipProductOptions) ? (
                    <div className="flex flex-1 justify-center">
                        <LoadingSpinner/> 
                    </div>
                ) : (!isLoading && !upVipProductOptions) ? (
                    <span>
                        Không thể lấy Cấu hình tin đăng, vui lòng thử lại sau. 
                    </span>
                ) :<></>
            }
            {
                upVipProductOptions ? (
                    <form onSubmit={form.handleSubmit(handleUpVip)}>
                        {
                            (upVipProductOptions?.ads_type_options && upVipProductOptions?.ads_type_options.length > 0) ? (
                                <div className="space-y-4">
                                    <h6 className="text-16 font-semibold">
                                        Chọn loại tin đăng
                                    </h6>

                                    <ButtonGroup className="flex-1 w-full" orientation="vertical">
                                        {
                                            upVipProductOptions.ads_type_options.map((item, index) => (
                                                <div key={index} className="flex justify-between space-y-2">
                                                    <Radio
                                                        key={item.value}
                                                        label={item.text}
                                                        checked={!!(adsType && adsType === item.value)}
                                                        onChange={() => {form.setValue("ads_type", item.value)}}
                                                        labelClassName={
                                                            item.value === "vip_1" ? "text-[#dc3545]"  :
                                                            item.value === "vip_2" ? "text-[#fd7e14]"  :
                                                            item.value === "vip_3" ? "text-[#0052ea]"  : ""
                                                        }
                                                    />

                                                    <span className="font-normal text-[#28a745]">{item.formatted_amount || "0%"}</span>
                                                </div>
                                            ))
                                        }
                                    </ButtonGroup>
                                    <span className="text-sm font-normal text-destructive">
                                        {form.formState.errors.ads_type?.message}
                                    </span>
                                </div>
                            ) : <></>
                        }
                        {
                            (upVipProductOptions?.number_of_day_options && upVipProductOptions?.number_of_day_options.length > 0) ? (
                                <div className="space-y-4">
                                    <h6 className="text-16 font-semibold">
                                        Chọn thời gian đăng tin
                                    </h6>

                                    <ButtonGroup className="flex-1 w-full" orientation="vertical">
                                        {
                                            upVipProductOptions.number_of_day_options.map((item, index) => (
                                                <div key={index} className="flex justify-between space-y-2">
                                                    <Radio
                                                        key={item.value}
                                                        label={item.text}
                                                        checked={!!(numberOfDay && numberOfDay === item.value.toString())}
                                                        onChange={() => {form.setValue("number_of_day", item.value.toString())}}
                                                    />

                                                    <span className="font-normal text-[#28a745]">{item.formatted_discount}</span>
                                                </div>
                                            ))
                                        }
                                    </ButtonGroup>

                                    <span className="text-sm font-normal text-destructive">
                                        {form.formState.errors.number_of_day?.message}    
                                    </span>
                                </div>
                            ) : <></>
                        }

                        <span className="flex flex-1 justify-center font-medium gap-3">
                            Tổng tiền:<p className="text-[#f39c12]">{maskNumber(totalAmount.toString()).formattedValue}{" "}Xu</p>
                        </span>

                        <span className="text-sm font-normal text-destructive">
                            {errorValidate}
                        </span>

                        <div className="flex flex-1 justify-end font-medium mt-6">
                            <Button type="submit" variant="default" size="sm" className="h-8" disabled={!!(!isLoadingValidate && errorValidate)}>
                                {
                                    isLoadingValidate ? <LoadingSpinner /> : <></>
                                }
                                <span className="text-sm">Áp dụng</span>
                            </Button>
                        </div>
                    </form>
                ) : <></>
            }
        </div>
    )
}

export default UpVipProductForm;
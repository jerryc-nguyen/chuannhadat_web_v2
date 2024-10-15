import { useAtom } from 'jotai';
import ProductApiService from '../apis/product-api';
import { productsListAtom } from '../states';
import { ProductQuery } from '../data/schemas/product-query-schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../data/schemas/product-schema';

const defaultValues = {
    business_type: "",
    category_type: "",
    city_id: "",
    district_id: "",
    ward_id: "",
    street_id: "",
    project_id: "",
    price: "",
    area: "",
    floors_count: "",
    directions: "",
    mat_tien: "",
    bedrooms_count: "",
    bathrooms_count: "",
    selected_ids: "",
    furnitures:"",
  
    sort_by: "",
    sort_direction: "",
    page: 1,
    per_page: 100,
}

export default function useProductsList() {
    const [productsList, setProductList] = useAtom(productsListAtom);

    const handleFilter = async ( data: ProductQuery ) => {
        try {
            const res = await ProductApiService.Filter(data);
            console.log("handleFilter products list", res);
            setProductList(res.data)
            
        } catch (err) {
            console.error("handleFilter error", err);
        }
    };

    const form = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: defaultValues
    });

    return {
        productsList,
        handleFilterProduct: handleFilter,
        productQueryForm: form
    };
}

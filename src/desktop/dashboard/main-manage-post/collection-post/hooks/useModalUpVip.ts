import { atom, useAtom } from 'jotai';

export default function useFilterState() {
    const isOpenModalUpVip = atom<boolean>(false);
    const productUpVipId = atom<string>("");
    
    const [isOpen, setIsOpen] = useAtom(isOpenModalUpVip);
    const [selectedProductId, setSelectedProductId] = useAtom(productUpVipId);

    const openModalUpVip = (productId: string) => {
        setIsOpen(true);
        setSelectedProductId(productId);
    }

    const closeModalUpVip = () => {
        setIsOpen(true);
        setSelectedProductId("");
    }

    return {
        openModalUpVip,
        closeModalUpVip
    };
}
    
import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { Button } from '@components/ui/button';
import { generateRandomString } from '@common/utils';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
    src: string;
    alt: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    onTriggerErrorCallback?: Function;
    isError: boolean;
    // eslint-disable-next-line @typescript-eslint/ban-types
    setIsError: Function;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, onTriggerErrorCallback, isError, setIsError, ...rest }) => {
    const [randomKey, setRandomKey] = useState<string>(generateRandomString(5));

    return (
        <div key={randomKey}>
            <Image
                {...rest}
                alt={alt}
                src={src}
                onError={() => {
                    setIsError(true);
                }}
            />
            {
                isError ? (
                    <div className="block h-full w-auto absolute inset-0 bg-black/80">
                        <Image
                            {...rest}
                            className={"!h-1/3 !w-1/3 absolute !left-1/2 -translate-x-1/2"}
                            alt={"err"}
                            src={"/error.png"}
                        />
                        <div className="mt-8 flex flex-col items-center">
                            <div className="text-12 text-white">Lỗi ảnh</div>
                            <Button type="button" className='h-5.5'
                                onClick={() => {
                                    setIsError(false);
                                    setRandomKey(generateRandomString(5));
                                    if ( onTriggerErrorCallback ) onTriggerErrorCallback();
                                }}
                            >Tải lại</Button>
                        </div>
                    </div>
                ) : <></>
            }
        </div>
    );
};

export default ImageWithFallback;

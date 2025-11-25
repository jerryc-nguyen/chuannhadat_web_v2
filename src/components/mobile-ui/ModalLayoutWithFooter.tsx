import React from 'react';

export type ModalLayoutWithFooterProps = {
  content: React.ReactNode;
  footer: React.ReactNode;
  contentClassName?: string;
  footerClassName?: string;
  containerClassName?: string;
};

/**
 * A reusable modal layout component that provides a fixed footer at the bottom
 * and scrollable content area. This component can be used across different modal
 * content builders to maintain consistent layout behavior.
 */
const ModalLayoutWithFooter: React.FC<ModalLayoutWithFooterProps> = ({
  content,
  footer,
  contentClassName = "",
  footerClassName = "",
  containerClassName = "",
}) => {
  return (
    <div className={`flex flex-col h-full ${containerClassName}`}>
      <div className={`flex-1 overflow-y-auto z-10 ${contentClassName}`}>
        {content}
      </div>
      <div className={`sticky bottom-0 bg-white border-t p-4 mt-4 z-10${footerClassName}`}>
        {footer}
      </div>
    </div>
  );
};

export default ModalLayoutWithFooter;

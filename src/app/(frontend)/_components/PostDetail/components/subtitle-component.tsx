const SubTitleComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-back absolute bottom-0 flex h-fit w-full flex-col bg-black py-2 text-center text-white">
      {children}
    </div>
  );
};
export default SubTitleComponent;

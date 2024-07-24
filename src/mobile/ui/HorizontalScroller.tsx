export default function HorizontalScroller(props: any) {
  return (
    <div className='hidden-scrollbar'>
      <div className='flex flex-row overflow-x-scroll hidden-scrollbar'>
        {props.children}
      </div>
    </div>
  );
}

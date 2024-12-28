import { IoFileTrayOutline } from "react-icons/io5";

export default function ListEmptyMessage({ message }: { message?: string }) {
  return (
    <div className="mt-4 flex flex-col items-center">
      <IoFileTrayOutline color="rgb(156 163 175)" size={25} />
      <p className="text-gray"> {message ?? 'Không tìm thấy'}</p>
    </div>
  )
}

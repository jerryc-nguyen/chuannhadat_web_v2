import { IoFileTrayOutline } from "react-icons/io5";

export default function ListEmptyMessage({ message, size }: { message?: string, size?: number }) {
  return (
    <div className="mt-4 flex flex-col items-center">
      <IoFileTrayOutline color="rgb(156 163 175)" size={size || 35} />
      <p className="text-secondary"> {message ?? 'Không tìm thấy'}</p>
    </div>
  )
}

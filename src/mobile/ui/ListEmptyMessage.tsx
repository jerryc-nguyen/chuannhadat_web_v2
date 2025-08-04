import { FileTrayOutline } from "@components/icons/CustomIcons";

export default function ListEmptyMessage({ message, size }: { message?: string, size?: number }) {
  return (
    <div className="mt-4 flex flex-col items-center">
      <FileTrayOutline color="rgb(156 163 175)" size={size || 35} />
      <p className="text-secondary"> {message ?? 'Không tìm thấy'}</p>
    </div>
  )
}

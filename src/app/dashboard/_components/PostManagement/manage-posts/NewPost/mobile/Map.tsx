import { List } from "@components/konsta";
import { CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";

export default function Map({ mapSrc, form }: { mapSrc: string, form: A }) {
  return (
    <>
      <CardTitle className="text-md flex gap-2 px-4 pb-2">Bản đồ</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg">
        <div className="p-4">
          <div className="flex items-center justify-center gap-4">
            <Label className="whitespace-nowrap">Địa chỉ:</Label>
            <Input placeholder="Nhập địa chỉ" {...form.register('full_address')} />
          </div>
          <br />
          <Label>Vị trí trên bản đồ</Label>

          <iframe
            className="min-h-64 w-full"
            style={{ border: 0 }}
            loading="lazy"
            src={mapSrc}
          ></iframe>
        </div>
      </List>
    </>
  )
}

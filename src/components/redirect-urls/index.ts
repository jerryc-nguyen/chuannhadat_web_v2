const oldCats: string[] = [
  "/mua-ban-nha-dat",
  "/ban-can-ho-chung-cu",
  "/ban-nha-hem-nha-rieng",
  "/ban-biet-thu-lien-ke",
  "/ban-nha-mat-tien-nha-mat-pho-kinh-doanh-tot",
  "/ban-dat-nen-du-an",
  "/ban-dat-tho-cu-dat-nong-nghiep",
  "/ban-trang-trai-khu-nghi-duong",
  "/ban-nha-tro-phong-tro",
  "/ban-van-phong",
  "/ban-cua-hang-ki-ot",
  "/ban-kho-nha-xuong",
  "/ban-bat-dong-san-khac",
  "/nha-dat-cho-thue",
  "/cho-thue-can-ho-chung-cu",
  "/cho-thue-nha-hem-nha-rieng",
  "/cho-thue-biet-thu-lien-ke",
  "/cho-thue-nha-mat-tien-nha-mat-pho-kinh-doanh-tot",
  "/cho-thue-dat-nen-du-an",
  "/cho-thue-dat",
  "/cho-thue-trang-trai-khu-nghi-duong",
  "/cho-thue-nha-tro-phong-tro",
  "/cho-thue-van-phong",
  "/cho-thue-cua-hang-ki-ot",
  "/cho-thue-kho-nha-xuong",
  "/cho-thue-bat-dong-san-khac"
]

const oldPaths: string[] = ['/tin-ban/', '/tin-cho-thue/']

export const redirectTokens = oldCats.concat(oldPaths)

export const shouldRedirect = (path: string) => {
  return redirectTokens.some((oldPath) => {
    const regex = new RegExp(`^${oldPath}`, 'gi');
    return regex.test(path)
  })
}

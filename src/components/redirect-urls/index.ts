const oldCats: string[] = [
  "/category/"
]

const oldPaths: string[] = ['/tin-ban/', '/tin-cho-thue/']

export const redirectTokens = oldCats.concat(oldPaths)

export const shouldRedirect = (path: string) => {
  return redirectTokens.some((oldPath) => {
    const regex = new RegExp(`^${oldPath}`, 'gi');
    return regex.test(path)
  })
}

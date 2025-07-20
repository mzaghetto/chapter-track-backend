export function transformBigIntToString<T extends Record<string, any>>(
  obj: T,
): T {
  const transformed = { ...obj }

  for (const key in transformed) {
    if (typeof transformed[key] === 'bigint') {
      transformed[key] = transformed[key].toString() as any
    }
  }

  return transformed
}

export function transformManhwaResponse(manhwa: any) {
  return {
    ...manhwa,
    id: manhwa.id.toString(),
  }
}

export function transformProviderResponse(provider: any) {
  return {
    ...provider,
    id: provider.id.toString(),
  }
}

export function transformUserManhwaResponse(userManhwa: any) {
  return {
    ...userManhwa,
    id: userManhwa.id.toString(),
    userId: userManhwa.userId.toString(),
    manhwaId: userManhwa.manhwaId.toString(),
    providerId: userManhwa.providerId?.toString(),
  }
}

export function transformManhwaProviderResponse(manhwaProvider: any) {
  return {
    ...manhwaProvider,
    id: manhwaProvider.id.toString(),
    manhwaId: manhwaProvider.manhwaId.toString(),
    providerId: manhwaProvider.providerId.toString(),
  }
}

export function transformUnreadManhwaResponse(unreadManhwa: any) {
  return {
    ...unreadManhwa,
    manhwaId: unreadManhwa.manhwaId.toString(),
  }
}

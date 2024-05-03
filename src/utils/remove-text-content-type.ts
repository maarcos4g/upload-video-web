export function removeContentType(videoName: string): string {
  const nameWithoutContentType = videoName.replace('.mp4', '')
  return nameWithoutContentType
}
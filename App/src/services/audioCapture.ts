export async function getMicrophone(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({ audio: true });
}

export function stopMicrophone(stream: MediaStream): void {
  stream.getTracks().forEach(t => t.stop());
}

export function browserDownloadFile(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
}

export function browserDownloadText(text: string, filename: string) {
  const url = `data:text/plain,${encodeURIComponent(text)}`;
  browserDownloadFile(url, filename);
}

export function browserOpenFile(accept: string): Promise<any> {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;

  return new Promise<string>((resolve, reject) => {
    input.addEventListener('change', evt => {
      //@ts-ignore
      const file = evt.target.files[0];
      const fr = new FileReader();

      fr.onload = (evt: ProgressEvent) => {
        //@ts-ignore
        const txt = evt.target.result;
        resolve(txt);
      };

      fr.onerror = (evt: ProgressEvent) => {
        //@ts-ignore
        reject(evt.target.error);
      };
      fr.readAsText(file);
    });
    input.click();
  });
}

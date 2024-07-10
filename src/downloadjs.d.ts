declare module 'downloadjs' {
    const download: (data: string | Blob | File, filename?: string, mimeType?: string) => void;
    export default download;
}

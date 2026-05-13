export const ImagePreviews = ({ previews }: { previews: string[] }) => (
  <div className="flex flex-col md:flex-row w-full md:items-center mb-2 md:mb-6">
    <div className="flex justify-center w-full flex-wrap gap-3">
      {previews.map((src, idx) => (
        <div key={idx} className="h-28 w-28 border border-dashed p-2">
          <img className="w-full h-full" alt="preview" src={src} />
        </div>
      ))}
    </div>
  </div>
);

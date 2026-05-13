import { useFormContext } from "react-hook-form";

export const GWProfilePhotoInput = ({
  handleFileChange,
  imagePreviews,
}: {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreviews: string[];
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <label
        htmlFor="profilePhoto"
        className="border w-fit py-2 px-4 rounded-full border-green-500 cursor-pointer text-green-500 text-sm"
      >
        Profile photo
      </label>
      <input
        type="file"
        id="profilePhoto"
        className="hidden"
        {...register("profilePhoto", {
          required: "Profile photo is required",
        })}
        onChange={handleFileChange}
      />
      {/* Display error message */}
      {/* {errors.profilePhoto && (
        <p className="text-red-500 text-sm mt-2">
          {errors.profilePhoto.message}
        </p>
      )} */}

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {imagePreviews.map((src, idx) => (
            <div key={idx} className="h-20 w-20 border border-dashed p-2">
              <img className="w-full h-full" alt="preview" src={src} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

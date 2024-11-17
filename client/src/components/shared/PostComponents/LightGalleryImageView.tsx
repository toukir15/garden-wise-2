import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import Image, { StaticImageData } from "next/image";

export default function LightGalleryImageView({
  images,
}: {
  images: (string | StaticImageData)[];
}) {
  return (
    <>
      <LightGallery
        elementClassNames={`grid ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-1`}
        mode="lg-fade"
      >
        {images.map((image, index) => (
          <a
            key={index}
            className={`relative h-full ${
              images.length === 3 && index === 0 ? "row-span-2" : "row-span-1"
            } ${index >= 4 ? "hidden lg:block" : ""}`}
            href={typeof image === "string" ? image : image.src}
          >
            <Image
              src={image}
              height={500}
              width={500}
              className={`h-full object-cover

                                 ${images.length == 1 && "rounded-xl"} 

                                 ${images.length == 2 && `${index == 0 && "rounded-s-md"} ${index == 1 && "rounded-e-md"} }`} 

                                 ${images.length == 3 && `${index == 0 && "rounded-s-xl"} ${index == 1 && "rounded-tr-md"} ${index == 2 && "rounded-br-xl"}`} 

                                 ${images.length > 3 && `${index == 0 && "rounded-tl-xl"} ${index == 1 && "rounded-tr-md"} ${index == 2 && "rounded-bl-xl"} ${index == 3 && "rounded-br-xl"}`} 

                                 ${index > 3 && "hidden"} `}
              alt={`Image ${index + 1}`}
            />
            {index === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl">
                +{images.length - 4} more
              </div>
            )}
          </a>
        ))}
      </LightGallery>
    </>
  );
}

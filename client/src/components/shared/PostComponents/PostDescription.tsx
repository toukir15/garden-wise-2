import { useState } from "react";

interface PostDescriptionProps {
  description: string;
}

const PostDescription: React.FC<PostDescriptionProps> = ({ description }) => {
  const [isReadMore, setIsReadMore] = useState(false);

  return (
    <div className="mx-4 xl:text-medium text-sm list-disc prose text-gray-200 break-words">
      {description.length > 500 && !isReadMore ? (
        <div>
          <div dangerouslySetInnerHTML={{ __html: description.slice(0, 500) }} />
          <button onClick={() => setIsReadMore(true)} className="text-gray-500">
            Read more...
          </button>
        </div>
      ) : (
        <div>
          <div dangerouslySetInnerHTML={{ __html: description }} />
          {description.length > 500 && (
            <button onClick={() => setIsReadMore(false)} className="text-gray-500">
              Show less
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PostDescription;

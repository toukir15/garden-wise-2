export const PostContent = ({ description }: any) => (
    <div className="pl-4">
      <div dangerouslySetInnerHTML={{ __html: description || "" }}></div>
    </div>
  );
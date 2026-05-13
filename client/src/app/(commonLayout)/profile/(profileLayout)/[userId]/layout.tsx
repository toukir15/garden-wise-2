import Sidebar from "@/src/components/shared/Sidber";
import RightSidebar from "@/src/components/shared/RightSidebar";
import MobileMenu from "@/src/components/MobileMenu";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:container mx-auto min-h-screen">
      <div className="w-full xl:w-[19%] hidden xl:block">
        <div className="fixed">
          <Sidebar />
        </div>
      </div>
      <div className="w-full xl:w-[62%]">{children}</div>
      <div className="w-full xl:w-[23%] h-fit pt-4 rounded-lg hidden xl:block">
        <div className="fixed">
          <RightSidebar />
        </div>
      </div>
      <MobileMenu />
    </div>
  );
}

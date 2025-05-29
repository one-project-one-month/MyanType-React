import { Outlet } from "react-router";
import { Toaster } from "sonner";

const RootLayout = () => {
  return (
    <section className="mx-auto max-w-6xl my-2">
      <Toaster
        position="top-center"
        closeButton
        richColors
        duration={3000}
        expand={true}
      />
      <Outlet />
    </section>
  );
};

export default RootLayout;

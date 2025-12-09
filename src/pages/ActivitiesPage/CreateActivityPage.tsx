import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { CreateActivityForm } from "@/components/features/curriculum/activities/CreateActivityForm";
import { TableProvider } from "@/contexts/Table/provider";

export default function CreateActivityPage() {
  return (
    <>
      <Header />
      <main className="mt-40 mb-20 flex justify-center">
        <TableProvider>
          <CreateActivityForm onSuccess={() => {}} />
        </TableProvider>
      </main>
      <Footer />
    </>
  );
}

import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { CreateActivityForm } from "@/components/features/curriculum/activities/CreateActivityForm";
import { TableProvider } from "@/contexts/Table/provider";
import NotSelectedAct from "./NotSelectedAct";

export default function CreateActivityPage() {
  return (
    <>
      <Header />
      <main className="mx-20 mt-40 mb-20 flex items-center gap-10">
        <TableProvider>
          <CreateActivityForm onSuccess={() => {}} />
        </TableProvider>
        <NotSelectedAct />
      </main>
      <Footer />
    </>
  );
}

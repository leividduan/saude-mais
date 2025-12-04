import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AppointmentWizard } from "@/components/appointment/AppointmentWizard";

const Agendar = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <AppointmentWizard />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Agendar;

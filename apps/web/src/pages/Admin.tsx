import { Navbar } from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorsTab } from "@/components/admin/DoctorsTab";
import { PatientsTab } from "@/components/admin/PatientsTab";
import { ConveniosTab } from "@/components/admin/ConveniosTab";
import { Stethoscope, Users, Building2 } from "lucide-react";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard Administrativo</h1>
        
        <Tabs defaultValue="doctors" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="doctors" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Médicos
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Pacientes
            </TabsTrigger>
            <TabsTrigger value="convenios" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Convênios
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="doctors">
            <DoctorsTab />
          </TabsContent>
          
          <TabsContent value="patients">
            <PatientsTab />
          </TabsContent>
          
          <TabsContent value="convenios">
            <ConveniosTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;

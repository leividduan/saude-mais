import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useHealthInsurancesQuery } from "@/hooks/queries/useHealthInsurancesQuery";
import { useAppointmentsByInsuranceReportQuery } from "@/hooks/queries/useAppointmentsByInsuranceReportQuery";

interface Convenio {
  id: string;
  name: string;
}

export const ReportsTab = () => {
  const [selectedConvenio, setSelectedConvenio] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const { toast } = useToast();

  const { data: convenios = [] } = useHealthInsurancesQuery();
  const { refetch } = useAppointmentsByInsuranceReportQuery({
    healthInsuranceId: selectedConvenio,
    startDate,
    endDate,
  });

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await refetch();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "relatorio.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast({ title: "Erro ao gerar relatório" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório de Consultas por Convênio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGenerateReport} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="convenio">Convênio</Label>
            <Select onValueChange={setSelectedConvenio}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um convênio" />
              </SelectTrigger>
              <SelectContent>
                {convenios.map((c: Convenio) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Data de Fim</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto">
            <FileDown className="h-4 w-4 mr-2" />
            Gerar PDF
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

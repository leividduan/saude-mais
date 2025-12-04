import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { convenios } from "@/data/mockData";
import { FileDown } from "lucide-react";

export const ReportsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório de Consultas por Convênio</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="convenio">Convênio</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um convênio" />
              </SelectTrigger>
              <SelectContent>
                {convenios.map((c) => (
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
              <Input id="startDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Data de Fim</Label>
              <Input id="endDate" type="date" />
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

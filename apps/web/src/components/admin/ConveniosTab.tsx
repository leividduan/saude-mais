import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Convenio } from "@/data/mockData";
import { getConvenios, addConvenio, updateConvenio, deleteConvenio } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";

export const ConveniosTab = () => {
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingConvenio, setEditingConvenio] = useState<Convenio | null>(null);
  const [formData, setFormData] = useState({ name: "", registrationNumber: "", active: true });
  const { toast } = useToast();

  useEffect(() => {
    setConvenios(getConvenios());
  }, []);

  const resetForm = () => {
    setFormData({ name: "", registrationNumber: "", active: true });
    setEditingConvenio(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingConvenio) {
      updateConvenio(editingConvenio.id, formData);
      toast({ title: "Convênio atualizado com sucesso!" });
    } else {
      addConvenio(formData);
      toast({ title: "Convênio cadastrado com sucesso!" });
    }

    setConvenios(getConvenios());
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (convenio: Convenio) => {
    setEditingConvenio(convenio);
    setFormData({ name: convenio.name, registrationNumber: convenio.registrationNumber, active: convenio.active });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteConvenio(id);
    setConvenios(getConvenios());
    toast({ title: "Convênio removido com sucesso!" });
  };

  const toggleActive = (convenio: Convenio) => {
    updateConvenio(convenio.id, { active: !convenio.active });
    setConvenios(getConvenios());
    toast({ title: `Convênio ${convenio.active ? "desativado" : "ativado"} com sucesso!` });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">Convênios Cadastrados</h2>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Novo Convênio</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingConvenio ? "Editar Convênio" : "Novo Convênio"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registro ANS</Label>
                <Input id="registrationNumber" value={formData.registrationNumber} onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })} placeholder="ANS 000000" required />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Ativo</Label>
                <Switch id="active" checked={formData.active} onCheckedChange={(checked) => setFormData({ ...formData, active: checked })} />
              </div>
              <Button type="submit" className="w-full">{editingConvenio ? "Salvar" : "Cadastrar"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Registro ANS</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {convenios.map((convenio) => (
              <TableRow key={convenio.id}>
                <TableCell className="font-medium">{convenio.name}</TableCell>
                <TableCell>{convenio.registrationNumber}</TableCell>
                <TableCell>
                  <Badge variant={convenio.active ? "default" : "secondary"} className="cursor-pointer" onClick={() => toggleActive(convenio)}>
                    {convenio.active ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(convenio)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>Tem certeza que deseja excluir {convenio.name}?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(convenio.id)}>Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

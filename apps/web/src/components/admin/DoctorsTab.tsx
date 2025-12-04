import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { specialties } from "@/data/specialties";
import { useToast } from "@/hooks/use-toast";
import { useAdminDoctorsQuery } from "@/hooks/queries/useAdminDoctorsQuery";
import { useCreateDoctorMutation } from "@/hooks/mutations/useCreateDoctorMutation";
import { useUpdateDoctorMutation } from "@/hooks/mutations/useUpdateDoctorMutation";
import { useDeleteDoctorMutation } from "@/hooks/mutations/useDeleteDoctorMutation";

interface Doctor {
  id: string;
  name: string;
  crm: string;
  specialty: string;
}

export const DoctorsTab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({ name: "", crm: "", specialty: "" });
  const { toast } = useToast();

  const { data: doctors = [] } = useAdminDoctorsQuery();
  const createDoctorMutation = useCreateDoctorMutation();
  const updateDoctorMutation = useUpdateDoctorMutation();
  const deleteDoctorMutation = useDeleteDoctorMutation();

  const resetForm = () => {
    setFormData({ name: "", crm: "", specialty: "" });
    setEditingDoctor(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingDoctor) {
        await updateDoctorMutation.mutateAsync({ id: editingDoctor.id, ...formData });
        toast({ title: "Médico atualizado com sucesso!" });
      } else {
        await createDoctorMutation.mutateAsync(formData);
        toast({ title: "Médico cadastrado com sucesso!" });
      }
      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: "Erro ao salvar médico" });
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      crm: doctor.crm,
      specialty: doctor.specialty,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoctorMutation.mutateAsync(id);
      toast({ title: "Médico removido com sucesso!" });
    } catch (error) {
      toast({ title: "Erro ao remover médico" });
    }
  };

  const getSpecialtyName = (id: string) => {
    return specialties.find((s) => s.id === id)?.name || id;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">Médicos Cadastrados</h2>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Novo Médico</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDoctor ? "Editar Médico" : "Novo Médico"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crm">CRM</Label>
                <Input id="crm" value={formData.crm} onChange={(e) => setFormData({ ...formData, crm: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade</Label>
                <Select value={formData.specialty} onValueChange={(value) => setFormData({ ...formData, specialty: value })} required>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {specialties.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">{editingDoctor ? "Salvar" : "Cadastrar"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CRM</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map((doctor: Doctor) => (
              <TableRow key={doctor.id}>
                <TableCell className="font-medium">{doctor.name}</TableCell>
                <TableCell>{doctor.crm}</TableCell>
                <TableCell>{getSpecialtyName(doctor.specialty)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(doctor)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>Tem certeza que deseja excluir {doctor.name}?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(doctor.id)}>Excluir</AlertDialogAction>
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

import { FormEvent, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  OccurrenceType,
  type Occurrence,
} from '@/types/supabase';
import {
  useCreateOccurrence,
  useDeleteOccurrence,
  useOccurrences,
  useUpdateOccurrence,
} from '@/hooks/useOccurrences';

const TYPES: OccurrenceType[] = [
  'Disciplinar',
  'Pedagógica',
  'Saúde',
  'Infrequência',
  'Outro',
];

const badgeVariant = (type: OccurrenceType) => {
  switch (type) {
    case 'Saúde':
      return 'warning';
    case 'Infrequência':
      return 'secondary';
    case 'Disciplinar':
      return 'destructive';
    case 'Pedagógica':
      return 'success';
    default:
      return 'default';
  }
};

const blankForm = {
  aluno: '',
  data: new Date().toISOString().slice(0, 10),
  tipo: 'Disciplinar' as OccurrenceType,
  descricao: '',
  encaminhamento: '',
};

export function OccurrencesPage() {
  const [search, setSearch] = useState('');
  const [professorSearch, setProfessorSearch] = useState('');
  const [tipo, setTipo] = useState<OccurrenceType | 'all'>('all');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [occurrenceToDelete, setOccurrenceToDelete] = useState<Occurrence | null>(null);
  const [editing, setEditing] = useState<Occurrence | null>(null);
  const [form, setForm] = useState(blankForm);

  const { data, isFetching } = useOccurrences({ search, tipo, page });
  const createMutation = useCreateOccurrence();
  const updateMutation = useUpdateOccurrence();
  const deleteMutation = useDeleteOccurrence();

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 10));
  const rows = (data?.data ?? []).filter((occurrence) =>
    occurrence.profiles?.full_name
      .toLowerCase()
      .includes(professorSearch.toLowerCase())
  );

  const openNew = () => {
    setEditing(null);
    setForm(blankForm);
    setModalOpen(true);
  };

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const openEdit = (occurrence: Occurrence) => {
    setEditing(occurrence);
    setForm({
      aluno: occurrence.aluno,
      data: occurrence.data,
      tipo: occurrence.tipo,
      descricao: occurrence.descricao,
      encaminhamento: occurrence.encaminhamento ?? '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    if (pathname.endsWith('/new')) {
      navigate('/occurrences', { replace: true });
    }
  };

  useEffect(() => {
    if (!modalOpen && pathname.endsWith('/new')) {
      setEditing(null);
      setForm(blankForm);
      setModalOpen(true);
    }
  }, [modalOpen, navigate, pathname]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, ...form });
        toast.success('Ocorrência atualizada com sucesso!');
      } else {
        await createMutation.mutateAsync(form);
        toast.success('Ocorrência registrada com sucesso!');
      }
      setModalOpen(false);
    } catch (error: any) {
      toast.error(error?.message ?? 'Falha ao salvar ocorrência');
    }
  };

  const handleDelete = async (occurrence: Occurrence) => {
    setOccurrenceToDelete(occurrence);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!occurrenceToDelete) return;
    try {
      await deleteMutation.mutateAsync(occurrenceToDelete.id);
      toast.success('Ocorrência excluída com sucesso!');
      setDeleteDialogOpen(false);
      setOccurrenceToDelete(null);
    } catch (error: any) {
      toast.error(error?.message ?? 'Falha ao excluir ocorrência');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Histórico</p>
          <h1 className="text-3xl font-semibold">Ocorrências</h1>
        </div>
        <Button type="button" onClick={openNew} className="w-full md:w-auto">
          + Nova Ocorrência
        </Button>
      </div>

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="search">
                Buscar aluno
              </label>
              <Input
                id="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nome do aluno"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="type">
                Filtrar por tipo
              </label>
              <Select id="type" value={tipo} onChange={(event) => setTipo(event.target.value as OccurrenceType | 'all')}>
                <option value="all">Todos</option>
                {TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="professorSearch">
                Buscar professor
              </label>
              <Input
                id="professorSearch"
                value={professorSearch}
                onChange={(event) => setProfessorSearch(event.target.value)}
                placeholder="Nome do professor"
              />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {total} ocorrência(s) encontrado(s)
            {isFetching && ' — atualizando...'}
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="px-3 py-3">Professor</th>
                <th className="px-3 py-3">Aluno</th>
                <th className="px-3 py-3">Data</th>
                <th className="px-3 py-3">Tipo</th>
                <th className="px-3 py-3">Descrição</th>
                <th className="px-3 py-3">Encaminhamento</th>
                <th className="px-3 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-sm text-muted-foreground">
                    Nenhuma ocorrência encontrada.
                  </td>
                </tr>
              ) : (
                rows.map((occurrence) => (
                  <tr key={occurrence.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-3 py-4 text-muted-foreground">
                      {occurrence.profiles?.full_name ?? 'Desconhecido'}
                    </td>
                    <td className="px-3 py-4 font-medium text-foreground">{occurrence.aluno}</td>
                    <td className="px-3 py-4 text-muted-foreground">
                      {format(new Date(`${occurrence.data}T00:00:00`), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-3 py-4">
                      <Badge variant={badgeVariant(occurrence.tipo)}>{occurrence.tipo}</Badge>
                    </td>
                    <td className="px-3 py-4 text-muted-foreground">{occurrence.descricao}</td>
                    <td className="px-3 py-4 text-muted-foreground">
                      {occurrence.encaminhamento?.trim() ? occurrence.encaminhamento : 'Nenhum encaminhamento'}
                    </td>
                    <td className="px-3 py-4 space-x-2">
                      <Button type="button" variant="ghost" onClick={() => openEdit(occurrence)}>
                        Editar
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => handleDelete(occurrence)}>
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">Página {page} de {totalPages}</p>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1}>
              Anterior
            </Button>
            <Button type="button" variant="ghost" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages}>
              Próxima
            </Button>
          </div>
        </div>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-6">
              <div>
                <h2 className="text-xl font-semibold">{editing ? 'Editar ocorrência' : 'Nova ocorrência'}</h2>
                <p className="text-sm text-muted-foreground">Preencha os dados para salvar.</p>
              </div>
            </div>
            <form className="grid gap-4" onSubmit={handleSave}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="aluno">
                    Aluno
                  </label>
                  <Input
                    id="aluno"
                    value={form.aluno}
                    onChange={(event) => setForm((state) => ({ ...state, aluno: event.target.value }))}
                    placeholder="Nome do aluno"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="data">
                    Data da ocorrência
                  </label>
                  <Input
                    id="data"
                    type="date"
                    value={form.data}
                    onChange={(event) => setForm((state) => ({ ...state, data: event.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="tipo">
                  Tipo de ocorrência
                </label>
                <Select
                  id="tipo"
                  value={form.tipo}
                  onChange={(event) => setForm((state) => ({ ...state, tipo: event.target.value as OccurrenceType }))}
                >
                  {TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="descricao">
                  Descrição
                </label>
                <Textarea
                  id="descricao"
                  value={form.descricao}
                  onChange={(event) => setForm((state) => ({ ...state, descricao: event.target.value }))}
                  placeholder="Relate os detalhes da ocorrência"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="encaminhamento">
                  Encaminhamento (opcional)
                </label>
                <Textarea
                  id="encaminhamento"
                  value={form.encaminhamento}
                  onChange={(event) => setForm((state) => ({ ...state, encaminhamento: event.target.value }))}
                  placeholder="Ação tomada após o ocorrido"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="ghost" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.status === 'pending' || updateMutation.status === 'pending'}>
                  {editing ? 'Salvar alterações' : 'Registrar ocorrência'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta ocorrência? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={confirmDelete}
              disabled={deleteMutation.status === 'pending'}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.status === 'pending' ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useOccurrenceStats, useRecentOccurrences } from '@/hooks/useOccurrences';
import type { OccurrenceType } from '@/types/supabase';

const TYPES: OccurrenceType[] = [
  'Disciplinar',
  'Pedagógica',
  'Saúde',
  'Infrequência',
  'Outro',
];

const parseDateValue = (value: string) =>
  new Date(value.length === 10 ? `${value}T00:00:00` : value);

const typeVariant = (type: string) => {
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

export function DashboardPage() {
  const [tipo, setTipo] = useState<OccurrenceType | 'all'>('all');
  const [professorSearch, setProfessorSearch] = useState('');

  const { data: stats, isLoading: statsLoading } = useOccurrenceStats();
  const { data: recent, isLoading: recentLoading } = useRecentOccurrences(10);

  const filteredOccurrences = (recent || []).filter((occurrence) => {
    const matchType = tipo === 'all' || occurrence.tipo === tipo;
    const matchProfessor = occurrence.profiles?.full_name
      .toLowerCase()
      .includes(professorSearch.toLowerCase());
    return matchType && matchProfessor;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Painel</p>
        <h1 className="text-3xl font-semibold">Resumo das ocorrências</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-muted-foreground">Total de ocorrências</p>
          <p className="mt-4 text-3xl font-semibold">{statsLoading ? '...' : stats?.total ?? 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Ocorrências no mês</p>
          <p className="mt-4 text-3xl font-semibold">{statsLoading ? '...' : stats?.month ?? 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Tipo mais frequente</p>
          <div className="mt-4">
            {statsLoading ? (
              '...'
            ) : stats?.topType ? (
              <Badge variant={typeVariant(stats.topType.tipo)}>{stats.topType.tipo}</Badge>
            ) : (
              <span className="text-sm text-muted-foreground">Nenhuma ocorrência</span>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Últimas ocorrências</h2>
            <p className="text-sm text-muted-foreground">Veja o histórico recente de ocorrências.</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                Pesquisar professor
              </label>
              <Input
                placeholder="Digite o nome do professor..."
                value={professorSearch}
                onChange={(e) => setProfessorSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                Filtrar por tipo
              </label>
              <Select value={tipo} onChange={(e) => setTipo(e.target.value as OccurrenceType | 'all')}>
                <option value="all">Todos</option>
                {TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="px-3 py-3">Professor</th>
                <th className="px-3 py-3">Aluno</th>
                <th className="px-3 py-3">Data</th>
                <th className="px-3 py-3">Tipo</th>
                <th className="px-3 py-3">Descrição</th>
                <th className="px-3 py-3">Encaminhamento</th>
              </tr>
            </thead>
            <tbody>
              {recentLoading ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-sm text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              ) : filteredOccurrences.length ? (
                filteredOccurrences.map((occurrence) => (
                  <tr key={occurrence.id} className="border-b border-border">
                    <td className="px-3 py-4 text-muted-foreground">
                      {occurrence.profiles?.full_name ?? 'Desconhecido'}
                    </td>
                    <td className="px-3 py-4 font-medium text-foreground">{occurrence.aluno}</td>
                    <td className="px-3 py-4 text-muted-foreground">
                      {format(parseDateValue(occurrence.data), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-3 py-4">
                      <Badge variant={typeVariant(occurrence.tipo)}>{occurrence.tipo}</Badge>
                    </td>
                    <td className="px-3 py-4 text-muted-foreground">
                      {occurrence.descricao}
                    </td>
                    <td className="px-3 py-4 text-muted-foreground">
                      {occurrence.encaminhamento?.trim() ? occurrence.encaminhamento : 'Nenhum encaminhamento'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-sm text-muted-foreground">
                    Nenhuma ocorrência encontrada com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

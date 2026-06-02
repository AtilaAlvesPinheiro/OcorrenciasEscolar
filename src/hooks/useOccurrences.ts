import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';
import type { Occurrence, OccurrenceType, OccurrenceWithAuthor } from '@/types/supabase';
import toast from 'react-hot-toast';

export interface OccurrenceFilters {
  search?: string;
  tipo?: OccurrenceType | 'all';
  page?: number;
  pageSize?: number;
}

const PAGE_SIZE = 10;

export function useOccurrences(filters: OccurrenceFilters = {}) {
  const { search = '', tipo = 'all', page = 1, pageSize = PAGE_SIZE } = filters;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  return useQuery({
    queryKey: ['occurrences', { search, tipo, page, pageSize }],
    queryFn: async () => {
      let query = supabase
        .from('occurrences')
        .select('*, profiles(full_name)', { count: 'exact' })
        .order('data', { ascending: false })
        .range(from, to);

      if (search.trim()) {
        query = query.ilike('aluno', '%' + search.trim() + '%');
      }
      if (tipo !== 'all') {
        query = query.eq('tipo', tipo);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return {
        data: (data ?? []) as OccurrenceWithAuthor[],
        total: count ?? 0,
      };
    },
  });
}

export function useRecentOccurrences(limit = 5) {
  return useQuery({
    queryKey: ['occurrences', 'recent', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('occurrences')
        .select('*, profiles(full_name)')
        .order('data', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as OccurrenceWithAuthor[];
    },
  });
}

export function useOccurrenceStats() {
  return useQuery({
    queryKey: ['occurrences', 'stats'],
    queryFn: async () => {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0];

      const [totalRes, monthRes, byTypeRes] = await Promise.all([
        supabase.from('occurrences').select('*', { count: 'exact', head: true }),
        supabase
          .from('occurrences')
          .select('*', { count: 'exact', head: true })
          .gte('data', firstDay)
          .lte('data', lastDay),
        supabase.from('occurrences').select('tipo'),
      ]);

      const typeCounts: Record<string, number> = {};
      (byTypeRes.data ?? []).forEach((o: any) => {
        typeCounts[o.tipo] = (typeCounts[o.tipo] ?? 0) + 1;
      });
      const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

      return {
        total: totalRes.count ?? 0,
        month: monthRes.count ?? 0,
        topType: topType ? { tipo: topType[0], count: topType[1] } : null,
        byType: typeCounts,
      };
    },
  });
}

export function useCreateOccurrence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<Occurrence, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Não autenticado');
      const occurrenceData = { ...input, user_id: user.id };
      const { data, error } = await supabase
        .from('occurrences')
        .insert(occurrenceData as any)
        .select()
        .single();
      if (error) throw error;
      return data as Occurrence;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['occurrences'] });
      qc.invalidateQueries({ queryKey: ['occurrences', 'stats'] });
      qc.invalidateQueries({ queryKey: ['occurrences', 'recent'] });
      toast.success('Ocorrência registrada!');
    },
    onError: (err: any) => {
      toast.error(err?.message ?? 'Erro ao salvar ocorrência');
    },
  });
}

export function useUpdateOccurrence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Omit<Occurrence, 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await (supabase
        .from('occurrences')
        .update(input) as any)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Occurrence;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['occurrences'] });
      qc.invalidateQueries({ queryKey: ['occurrences', 'stats'] });
      qc.invalidateQueries({ queryKey: ['occurrences', 'recent'] });
      toast.success('Ocorrência atualizada!');
    },
    onError: (err: any) => {
      toast.error(err?.message ?? 'Erro ao atualizar');
    },
  });
}

export function useDeleteOccurrence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('occurrences').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['occurrences'] });
      qc.invalidateQueries({ queryKey: ['occurrences', 'stats'] });
      qc.invalidateQueries({ queryKey: ['occurrences', 'recent'] });
      toast.success('Ocorrência excluída');
    },
    onError: (err: any) => {
      toast.error(err?.message ?? 'Erro ao excluir');
    },
  });
}

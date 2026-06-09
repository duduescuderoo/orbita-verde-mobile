import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import { COLORS } from '@/constants/theme'
import { listarAlertas } from '@/services/storage'
import AlertaCard from '@/components/AlertaCard'
import type { Alerta, NivelAlerta, TipoAlerta } from '@/types'

type Filtro = 'TODOS' | 'ATIVOS' | 'RESOLVIDOS' | NivelAlerta | TipoAlerta

const filtros: { label: string; valor: Filtro }[] = [
  { label: 'Todos', valor: 'TODOS' },
  { label: 'Ativos', valor: 'ATIVOS' },
  { label: '🔴 Perigo', valor: 'PERIGO' },
  { label: '🟠 Alerta', valor: 'ALERTA' },
  { label: '🟢 Normal', valor: 'NORMAL' },
  { label: '🔥 Queimada', valor: 'QUEIMADA' },
  { label: '☀️ Flare', valor: 'FLARE_SOLAR' },
  { label: '🌳 Desmata.', valor: 'DESMATAMENTO' },
]

const aplicarFiltro = (alertas: Alerta[], filtro: Filtro): Alerta[] => {
  if (filtro === 'TODOS') return alertas
  if (filtro === 'ATIVOS') return alertas.filter((a) => !a.resolvido)
  if (filtro === 'RESOLVIDOS') return alertas.filter((a) => a.resolvido)
  if (['PERIGO', 'ALERTA', 'NORMAL'].includes(filtro))
    return alertas.filter((a) => a.nivel === filtro)
  return alertas.filter((a) => a.tipo === filtro)
}

export default function AlertasScreen() {
  const router = useRouter()
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [carregando, setCarregando] = useState(true)
  const [atualizando, setAtualizando] = useState(false)
  const [filtroAtivo, setFiltroAtivo] = useState<Filtro>('ATIVOS')

  const carregar = async () => {
    const dados = await listarAlertas()
    setAlertas(dados)
    setCarregando(false)
    setAtualizando(false)
  }

  useFocusEffect(useCallback(() => { carregar() }, []))

  const listagem = aplicarFiltro(alertas, filtroAtivo)

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={COLORS.verde} size="large" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosScroll}
        contentContainerStyle={styles.filtros}
      >
        {filtros.map((f) => (
          <Pressable
            key={f.valor}
            style={[styles.filtro, filtroAtivo === f.valor && styles.filtroAtivo]}
            onPress={() => setFiltroAtivo(f.valor)}
          >
            <Text style={[styles.filtroTexto, filtroAtivo === f.valor && styles.filtroTextoAtivo]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.lista}
        contentContainerStyle={styles.listaConteudo}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => { setAtualizando(true); carregar() }}
            tintColor={COLORS.verde}
          />
        }
      >
        <Text style={styles.total}>
          {listagem.length} resultado{listagem.length !== 1 ? 's' : ''}
        </Text>

        {listagem.length === 0 ? (
          <View style={styles.vazio}>
            <Text style={styles.vazioEmoji}>🔍</Text>
            <Text style={styles.vazioTexto}>Nenhum alerta encontrado</Text>
            <Text style={styles.vazioSub}>Tente outro filtro</Text>
          </View>
        ) : (
          listagem.map((alerta) => (
            <AlertaCard
              key={alerta.id}
              alerta={alerta}
              onPress={() => router.push(`/alerta/${alerta.id}`)}
            />
          ))
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.fundo },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.fundo },
  filtrosScroll: { maxHeight: 52, flexGrow: 0 },
  filtros: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filtro: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorda,
  },
  filtroAtivo: {
    backgroundColor: COLORS.verde + '22',
    borderColor: COLORS.verde,
  },
  filtroTexto: { color: COLORS.textoSub, fontSize: 12, fontWeight: '600' },
  filtroTextoAtivo: { color: COLORS.verde },
  lista: { flex: 1 },
  listaConteudo: { padding: 16, paddingBottom: 32 },
  total: { color: COLORS.textoSub, fontSize: 12, marginBottom: 12 },
  vazio: { alignItems: 'center', paddingVertical: 48 },
  vazioEmoji: { fontSize: 40, marginBottom: 12 },
  vazioTexto: { color: COLORS.texto, fontSize: 16, fontWeight: '600' },
  vazioSub: { color: COLORS.textoSub, fontSize: 13, marginTop: 4 },
})

import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import { useTheme } from '@/contexts/ThemeContext'
import { listarAlertas } from '@/services/storage'
import AlertaCard from '@/components/AlertaCard'
import type { Alerta } from '@/types'

type Filtro = 'ATIVOS' | 'TODOS' | 'PERIGO' | 'ALERTA' | 'NORMAL' | 'RESOLVIDOS'

const filtros: { label: string; valor: Filtro }[] = [
  { label: 'Ativos', valor: 'ATIVOS' },
  { label: 'Todos', valor: 'TODOS' },
  { label: '🔴 Perigo', valor: 'PERIGO' },
  { label: '🟠 Alerta', valor: 'ALERTA' },
  { label: '🟢 Normal', valor: 'NORMAL' },
  { label: '✅ Resolvidos', valor: 'RESOLVIDOS' },
]

const aplicar = (alertas: Alerta[], f: Filtro) => {
  if (f === 'TODOS') return alertas
  if (f === 'ATIVOS') return alertas.filter(a => !a.resolvido)
  if (f === 'RESOLVIDOS') return alertas.filter(a => a.resolvido)
  return alertas.filter(a => a.nivel === f)
}

export default function AlertasScreen() {
  const router = useRouter()
  const { colors, sombra } = useTheme()
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

  const lista = aplicar(alertas, filtroAtivo)

  if (carregando) {
    return <View style={[styles.centro, { backgroundColor: colors.fundo }]}><ActivityIndicator color={colors.verdeEscuro} size="large" /></View>
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.fundo }]}>
      <View style={[styles.headerWrapper, { backgroundColor: colors.fundo }]}>
        <Text style={[styles.titulo, { color: colors.texto }]}>Alertas</Text>
        <Text style={[styles.subtitulo, { color: colors.textoSub }]}>{alertas.filter(a => !a.resolvido).length} ativos agora</Text>
      </View>

      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={[styles.filtrosScroll, { backgroundColor: colors.fundo }]}
        contentContainerStyle={styles.filtros}
      >
        {filtros.map(f => (
          <TouchableOpacity
            key={f.valor}
            style={[styles.chip, { backgroundColor: colors.card }, sombra as any, filtroAtivo === f.valor && { backgroundColor: colors.verdeEscuro }]}
            onPress={() => setFiltroAtivo(f.valor)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipTexto, { color: filtroAtivo === f.valor ? '#fff' : colors.textoSub }]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.lista} contentContainerStyle={styles.listaConteudo}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={atualizando}
            onRefresh={() => { setAtualizando(true); carregar() }}
            tintColor={colors.verdeEscuro} />
        }
      >
        <Text style={[styles.contagem, { color: colors.textoSub }]}>{lista.length} resultado{lista.length !== 1 ? 's' : ''}</Text>

        {lista.length === 0 ? (
          <View style={[styles.vazio, { backgroundColor: colors.card }, sombra as any]}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>🔍</Text>
            <Text style={[styles.vazioTexto, { color: colors.texto }]}>Nenhum alerta encontrado</Text>
            <Text style={[styles.vazioSub, { color: colors.textoSub }]}>Tente outro filtro</Text>
          </View>
        ) : (
          lista.map(a => (
            <AlertaCard key={a.id} alerta={a} onPress={() => router.push(`/alerta/${a.id}`)} />
          ))
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerWrapper: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  titulo: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  subtitulo: { fontSize: 14, marginTop: 2 },
  filtrosScroll: { maxHeight: 48, flexGrow: 0 },
  filtros: { paddingHorizontal: 20, gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  chipTexto: { fontSize: 13, fontWeight: '600' },
  lista: { flex: 1 },
  listaConteudo: { padding: 20, paddingTop: 16, paddingBottom: 40 },
  contagem: { fontSize: 13, marginBottom: 14, fontWeight: '500' },
  vazio: { borderRadius: 16, padding: 32, alignItems: 'center' },
  vazioTexto: { fontSize: 16, fontWeight: '700' },
  vazioSub: { fontSize: 13, marginTop: 4 },
})

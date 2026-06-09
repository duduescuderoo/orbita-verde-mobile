import { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, nivelCor } from '@/constants/theme'
import { listarAlertas } from '@/services/storage'
import AlertaCard from '@/components/AlertaCard'
import type { Alerta } from '@/types'

export default function HomeScreen() {
  const router = useRouter()
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [carregando, setCarregando] = useState(true)
  const [atualizando, setAtualizando] = useState(false)
  const [localizacao, setLocalizacao] = useState<string>('Obtendo localização...')
  const [permissaoNegada, setPermissaoNegada] = useState(false)

  const carregarAlertas = async () => {
    const dados = await listarAlertas()
    setAlertas(dados)
    setCarregando(false)
    setAtualizando(false)
  }

  const obterLocalizacao = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      setPermissaoNegada(true)
      setLocalizacao('Permissão de localização negada')
      return
    }
    try {
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
      setLocalizacao(
        `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
      )
    } catch {
      setLocalizacao('Não foi possível obter localização')
    }
  }

  useEffect(() => {
    obterLocalizacao()
  }, [])

  useFocusEffect(
    useCallback(() => {
      carregarAlertas()
    }, [])
  )

  const ativos = alertas.filter((a) => !a.resolvido)
  const perigo = ativos.filter((a) => a.nivel === 'PERIGO').length
  const alerta = ativos.filter((a) => a.nivel === 'ALERTA').length
  const normal = ativos.filter((a) => a.nivel === 'NORMAL').length
  const recentes = ativos.slice(0, 3)

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={COLORS.verde} size="large" />
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      refreshControl={
        <RefreshControl
          refreshing={atualizando}
          onRefresh={() => { setAtualizando(true); carregarAlertas() }}
          tintColor={COLORS.verde}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.titulo}>🛰️ OrbitaVerde</Text>
        <Text style={styles.subtitulo}>Monitoramento Ambiental Satelital</Text>
      </View>

      <View style={styles.gpsCard}>
        <Ionicons
          name={permissaoNegada ? 'location-off-outline' : 'location-outline'}
          size={18}
          color={permissaoNegada ? COLORS.erro : COLORS.verde}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.gpsLabel}>Sua localização (GPS)</Text>
          <Text style={[styles.gpsCoordenadas, permissaoNegada && { color: COLORS.erro }]}>
            {localizacao}
          </Text>
          {permissaoNegada && (
            <Text style={styles.gpsErro}>Permissão negada pelo usuário</Text>
          )}
        </View>
      </View>

      <Text style={styles.secao}>Painel de Alertas</Text>

      <View style={styles.statsRow}>
        {[
          { label: 'PERIGO', valor: perigo, cor: COLORS.perigo },
          { label: 'ALERTA', valor: alerta, cor: COLORS.alerta },
          { label: 'NORMAL', valor: normal, cor: COLORS.normal },
        ].map((stat) => (
          <View key={stat.label} style={[styles.statCard, { borderColor: stat.cor }]}>
            <Text style={[styles.statValor, { color: stat.cor }]}>{stat.valor}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalTexto}>
          {ativos.length} alerta{ativos.length !== 1 ? 's' : ''} ativo{ativos.length !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.totalSub}>
          {alertas.filter((a) => a.resolvido).length} resolvido{alertas.filter((a) => a.resolvido).length !== 1 ? 's' : ''}
        </Text>
      </View>

      <Text style={styles.secao}>Alertas Recentes</Text>

      {recentes.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioTexto}>✅ Nenhum alerta ativo no momento</Text>
        </View>
      ) : (
        recentes.map((alerta) => (
          <AlertaCard
            key={alerta.id}
            alerta={alerta}
            onPress={() => router.push(`/alerta/${alerta.id}`)}
          />
        ))
      )}

      {ativos.length > 3 && (
        <Text
          style={styles.verTodos}
          onPress={() => router.push('/alertas')}
        >
          Ver todos os {ativos.length} alertas →
        </Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.fundo },
  conteudo: { padding: 16, paddingBottom: 32 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.fundo },
  header: { marginBottom: 20 },
  titulo: { fontSize: 24, fontWeight: '800', color: COLORS.texto },
  subtitulo: { fontSize: 13, color: COLORS.textoSub, marginTop: 2 },
  gpsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorda,
    marginBottom: 20,
  },
  gpsLabel: { fontSize: 11, color: COLORS.textoSub, marginBottom: 2 },
  gpsCoordenadas: { fontSize: 13, color: COLORS.verde, fontWeight: '600', fontFamily: 'monospace' },
  gpsErro: { fontSize: 11, color: COLORS.erro, marginTop: 2 },
  secao: { fontSize: 14, fontWeight: '700', color: COLORS.textoSub, marginBottom: 12, letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValor: { fontSize: 28, fontWeight: '800' },
  statLabel: { fontSize: 10, color: COLORS.textoSub, fontWeight: '600', marginTop: 2 },
  totalCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorda,
    marginBottom: 20,
  },
  totalTexto: { fontSize: 15, fontWeight: '700', color: COLORS.texto },
  totalSub: { fontSize: 13, color: COLORS.textoSub },
  vazio: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorda,
  },
  vazioTexto: { color: COLORS.textoSub, fontSize: 14 },
  verTodos: {
    textAlign: 'center',
    color: COLORS.verde,
    fontWeight: '600',
    fontSize: 14,
    marginTop: 4,
    paddingVertical: 8,
  },
})

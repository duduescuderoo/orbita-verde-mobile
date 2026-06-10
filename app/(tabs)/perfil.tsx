import { useEffect, useState } from 'react'
import {
  Alert, ScrollView, StyleSheet, Switch,
  Text, TouchableOpacity, View,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/contexts/ThemeContext'
import { getUsuarioLogado, logout, Usuario } from '@/services/auth'
import MapaIlustrativo from '@/components/MapaIlustrativo'
import * as Location from 'expo-location'

export default function PerfilScreen() {
  const router = useRouter()
  const { colors, isDark, toggleTheme, sombra } = useTheme()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [lat, setLat] = useState<number | null>(null)
  const [lon, setLon] = useState<number | null>(null)
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'ok' | 'erro'>('idle')

  useEffect(() => {
    getUsuarioLogado().then(setUsuario)
    obterLocalizacao()
  }, [])

  const obterLocalizacao = async () => {
    setGpsStatus('loading')
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') { setGpsStatus('erro'); return }
    try {
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
      setLat(pos.coords.latitude)
      setLon(pos.coords.longitude)
      setGpsStatus('ok')
    } catch { setGpsStatus('erro') }
  }

  const confirmarLogout = () => Alert.alert(
    'Sair da conta',
    'Deseja encerrar sua sessão?',
    [{ text: 'Cancelar', style: 'cancel' }, {
      text: 'Sair', style: 'destructive', onPress: async () => {
        await logout()
        router.replace('/(auth)/login')
      }
    }]
  )

  const s = makeStyles(colors, sombra as any)

  return (
    <ScrollView style={[s.container, { backgroundColor: colors.fundo }]} contentContainerStyle={s.conteudo} showsVerticalScrollIndicator={false}>

      <Text style={[s.titulo, { color: colors.texto }]}>Perfil</Text>

      {/* Avatar */}
      <View style={[s.avatarCard, { backgroundColor: colors.card }, sombra as any]}>
        <View style={[s.avatar, { backgroundColor: colors.verde + '20' }]}>
          <Text style={s.avatarEmoji}>🛰️</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.nomeTexto, { color: colors.texto }]}>{usuario?.nome ?? 'Visitante'}</Text>
          <Text style={[s.emailTexto, { color: colors.textoSub }]}>{usuario?.email ?? 'Sem conta'}</Text>
        </View>
        {usuario && (
          <View style={[s.badgeAtivo, { backgroundColor: colors.verde + '18' }]}>
            <View style={[s.dotAtivo, { backgroundColor: colors.verde }]} />
            <Text style={[s.badgeTexto, { color: colors.verde }]}>Ativo</Text>
          </View>
        )}
      </View>

      {/* Localização + Mapa */}
      <Text style={[s.secaoTitulo, { color: colors.textoSub }]}>LOCALIZAÇÃO ATUAL</Text>
      <View style={[s.card, { backgroundColor: colors.card }, sombra as any]}>
        <MapaIlustrativo latitude={lat} longitude={lon} />

        <View style={s.gpsInfo}>
          {gpsStatus === 'loading' && (
            <View style={s.gpsLinha}>
              <Ionicons name="locate-outline" size={16} color={colors.textoSub} />
              <Text style={[s.gpsTexto, { color: colors.textoSub }]}>Obtendo localização...</Text>
            </View>
          )}
          {gpsStatus === 'ok' && lat !== null && lon !== null && (
            <>
              <View style={s.gpsLinha}>
                <Ionicons name="location" size={16} color={colors.verde} />
                <Text style={[s.gpsCoordenada, { color: colors.verde }]}>
                  Lat: {lat.toFixed(6)}°
                </Text>
              </View>
              <View style={s.gpsLinha}>
                <Ionicons name="location" size={16} color={colors.azul} />
                <Text style={[s.gpsCoordenada, { color: colors.azul }]}>
                  Lon: {lon.toFixed(6)}°
                </Text>
              </View>
            </>
          )}
          {(gpsStatus === 'erro' || gpsStatus === 'idle') && (
            <TouchableOpacity style={s.gpsLinha} onPress={obterLocalizacao}>
              <Ionicons name="refresh-outline" size={16} color={colors.verdeEscuro} />
              <Text style={[s.gpsTexto, { color: colors.verdeEscuro }]}>Tentar novamente</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Aparência */}
      <Text style={[s.secaoTitulo, { color: colors.textoSub }]}>APARÊNCIA</Text>
      <View style={[s.card, { backgroundColor: colors.card }, sombra as any]}>
        <View style={s.opcaoLinha}>
          <View style={s.opcaoIconeBox}>
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={isDark ? colors.azul : colors.alerta} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.opcaoTexto, { color: colors.texto }]}>Modo {isDark ? 'escuro' : 'claro'}</Text>
            <Text style={[s.opcaoSub, { color: colors.textoSub }]}>Altera o tema do aplicativo</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.separador, true: colors.verdeEscuro }}
            thumbColor={isDark ? colors.verde : '#fff'}
          />
        </View>
      </View>

      {/* Sobre */}
      <Text style={[s.secaoTitulo, { color: colors.textoSub }]}>SOBRE</Text>
      <View style={[s.card, { backgroundColor: colors.card }, sombra as any]}>
        {[
          { icone: 'satellite-outline', label: 'OrbitaVerde', valor: 'v1.0.0' },
          { icone: 'school-outline', label: 'FIAP Global Solution', valor: '2026' },
          { icone: 'leaf-outline', label: 'Foco', valor: 'Meio Ambiente' },
        ].map(({ icone, label, valor }, i, arr) => (
          <View key={label}>
            <View style={s.opcaoLinha}>
              <View style={[s.opcaoIconeBox, { backgroundColor: colors.verde + '15' }]}>
                <Ionicons name={icone as any} size={17} color={colors.verde} />
              </View>
              <Text style={[s.opcaoTexto, { color: colors.texto, flex: 1 }]}>{label}</Text>
              <Text style={[s.opcaoValor, { color: colors.textoSub }]}>{valor}</Text>
            </View>
            {i < arr.length - 1 && <View style={[s.div, { backgroundColor: colors.separador }]} />}
          </View>
        ))}
      </View>

      {/* Logout */}
      {usuario && (
        <TouchableOpacity
          style={[s.btnLogout, { borderColor: colors.perigo + '40' }]}
          onPress={confirmarLogout} activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.perigo} />
          <Text style={[s.btnLogoutTexto, { color: colors.perigo }]}>Sair da conta</Text>
        </TouchableOpacity>
      )}

      {!usuario && (
        <TouchableOpacity
          style={[s.btnLogin, { backgroundColor: colors.verdeEscuro }]}
          onPress={() => router.push('/(auth)/login')} activeOpacity={0.85}
        >
          <Ionicons name="log-in-outline" size={18} color="#fff" />
          <Text style={s.btnLoginTexto}>Entrar / Criar conta</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  )
}

const makeStyles = (colors: any, sombra: any) => StyleSheet.create({
  container: { flex: 1 },
  conteudo: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 48, gap: 8 },
  titulo: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5, marginBottom: 16 },
  secaoTitulo: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginTop: 8, marginBottom: 6, marginLeft: 4 },
  avatarCard: { borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 8 },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 28 },
  nomeTexto: { fontSize: 16, fontWeight: '700' },
  emailTexto: { fontSize: 13, marginTop: 2 },
  badgeAtivo: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  dotAtivo: { width: 6, height: 6, borderRadius: 3 },
  badgeTexto: { fontSize: 11, fontWeight: '700' },
  card: { borderRadius: 16, padding: 16, marginBottom: 4 },
  gpsInfo: { marginTop: 12, gap: 6 },
  gpsLinha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  gpsTexto: { fontSize: 13 },
  gpsCoordenada: { fontSize: 13, fontWeight: '700', fontFamily: 'monospace' },
  opcaoLinha: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  opcaoIconeBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
  opcaoTexto: { fontSize: 15, fontWeight: '600' },
  opcaoSub: { fontSize: 12, marginTop: 1 },
  opcaoValor: { fontSize: 13, fontWeight: '600' },
  div: { height: 1, marginVertical: 2 },
  btnLogout: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 14, padding: 16, borderWidth: 1.5, marginTop: 8,
  },
  btnLogoutTexto: { fontSize: 15, fontWeight: '700' },
  btnLogin: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 14, padding: 16, marginTop: 8,
  },
  btnLoginTexto: { color: '#fff', fontSize: 15, fontWeight: '700' },
})

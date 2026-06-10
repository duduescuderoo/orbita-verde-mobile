import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'

interface Props {
  latitude: number | null
  longitude: number | null
}

export default function MapaIlustrativo({ latitude, longitude }: Props) {
  const { colors } = useTheme()
  const pulsar = useRef(new Animated.Value(1)).current
  const opacidade = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulsar, { toValue: 1.8, duration: 900, useNativeDriver: true }),
          Animated.timing(opacidade, { toValue: 0, duration: 900, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulsar, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(opacidade, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start()
  }, [])

  return (
    <View style={[styles.container, { backgroundColor: colors.mapa, borderColor: colors.cardBorda }]}>

      {/* Grade */}
      {[36, 72, 108, 144].map(top => (
        <View key={`h${top}`} style={[styles.gridH, { top, backgroundColor: colors.mapaGrid }]} />
      ))}
      {[60, 120, 180, 240].map(left => (
        <View key={`v${left}`} style={[styles.gridV, { left: left * 0.45, backgroundColor: colors.mapaGrid }]} />
      ))}

      {/* Ruas ilustrativas */}
      <View style={[styles.rua, styles.ruaH, { top: 72, backgroundColor: colors.mapaRua }]} />
      <View style={[styles.rua, styles.ruaH, { top: 117, backgroundColor: colors.mapaRua }]} />
      <View style={[styles.rua, styles.ruaV, { left: 108, backgroundColor: colors.mapaRua }]} />
      <View style={[styles.rua, styles.ruaV, { left: 216, backgroundColor: colors.mapaRua }]} />

      {/* Blocos verdes (parques) */}
      <View style={[styles.bloco, { top: 18, left: 18, width: 40, height: 30, backgroundColor: colors.mapaParque }]} />
      <View style={[styles.bloco, { top: 126, left: 220, width: 30, height: 28, backgroundColor: colors.mapaParque }]} />

      {/* PIN GPS centralizado */}
      <View style={styles.pinContainer}>
        <Animated.View style={[
          styles.pulsarOuter,
          { borderColor: colors.verde, transform: [{ scale: pulsar }], opacity: opacidade }
        ]} />
        <View style={[styles.pinCircle, { backgroundColor: colors.verdeEscuro }]}>
          <Text style={styles.pinEmoji}>📍</Text>
        </View>
      </View>

      {/* Coordenadas */}
      {latitude !== null && longitude !== null && (
        <View style={[styles.coordBox, { backgroundColor: colors.card + 'EE' }]}>
          <Text style={[styles.coordTexto, { color: colors.verde }]}>
            {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
          </Text>
        </View>
      )}

      {latitude === null && (
        <View style={[styles.coordBox, { backgroundColor: colors.card + 'EE' }]}>
          <Text style={[styles.coordTexto, { color: colors.textoSub }]}>Localização ilustrativa</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 180, borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, position: 'relative',
  },
  gridH: { position: 'absolute', left: 0, right: 0, height: 1, opacity: 0.5 },
  gridV: { position: 'absolute', top: 0, bottom: 0, width: 1, opacity: 0.5 },
  rua: { position: 'absolute' },
  ruaH: { left: 0, right: 0, height: 6 },
  ruaV: { top: 0, bottom: 0, width: 6 },
  bloco: { position: 'absolute', borderRadius: 4, opacity: 0.7 },
  pinContainer: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -16 }, { translateY: -16 }], alignItems: 'center', justifyContent: 'center' },
  pulsarOuter: {
    position: 'absolute', width: 48, height: 48, borderRadius: 24,
    borderWidth: 2,
  },
  pinCircle: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  pinEmoji: { fontSize: 18 },
  coordBox: {
    position: 'absolute', bottom: 10, left: 10, right: 10,
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
    alignItems: 'center',
  },
  coordTexto: { fontSize: 12, fontWeight: '700', fontFamily: 'monospace' },
})

import Head from 'next/head'

import {
  hexFromArgb,
  sourceColorFromImage,
  Hct,
  SchemeTonalSpot,
  MaterialDynamicColors,
  TonalPalette,
} from '@material/material-color-utilities'
import { useEffect, useState } from 'react'

function toTone(palette: TonalPalette) {
  return {
    '0': hexFromArgb(palette.tone(0)),
    '5': hexFromArgb(palette.tone(5)),
    '10': hexFromArgb(palette.tone(10)),
    '20': hexFromArgb(palette.tone(20)),
    '25': hexFromArgb(palette.tone(25)),
    '30': hexFromArgb(palette.tone(30)),
    '35': hexFromArgb(palette.tone(35)),
    '40': hexFromArgb(palette.tone(40)),
    '50': hexFromArgb(palette.tone(50)),
    '60': hexFromArgb(palette.tone(60)),
    '70': hexFromArgb(palette.tone(70)),
    '80': hexFromArgb(palette.tone(80)),
    '90': hexFromArgb(palette.tone(90)),
    '95': hexFromArgb(palette.tone(95)),
    '98': hexFromArgb(palette.tone(98)),
    '99': hexFromArgb(palette.tone(99)),
    '100': hexFromArgb(palette.tone(100)),
  }
}

const tokens = [
  'primaryPaletteKeyColor',
  'secondaryPaletteKeyColor',
  'tertiaryPaletteKeyColor',
  'neutralPaletteKeyColor',
  'neutralVariantPaletteKeyColor',
  'background',
  'onBackground',
  'surface',
  'surfaceDim',
  'surfaceBright',
  'surfaceContainerLowest',
  'surfaceContainerLow',
  'surfaceContainer',
  'surfaceContainerHigh',
  'surfaceContainerHighest',
  'onSurface',
  'surfaceVariant',
  'onSurfaceVariant',
  'inverseSurface',
  'inverseOnSurface',
  'outline',
  'outlineVariant',
  'shadow',
  'scrim',
  'surfaceTint',
  'primary',
  'onPrimary',
  'primaryContainer',
  'onPrimaryContainer',
  'inversePrimary',
  'secondary',
  'onSecondary',
  'secondaryContainer',
  'onSecondaryContainer',
  'tertiary',
  'onTertiary',
  'tertiaryContainer',
  'onTertiaryContainer',
  'error',
  'onError',
  'errorContainer',
  'onErrorContainer',
  'primaryFixed',
  'primaryFixedDim',
  'onPrimaryFixed',
  'onPrimaryFixedVariant',
  'secondaryFixed',
  'secondaryFixedDim',
  'onSecondaryFixed',
  'onSecondaryFixedVariant',
  'tertiaryFixed',
  'tertiaryFixedDim',
  'onTertiaryFixed',
  'onTertiaryFixedVariant',
]

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [theme, setTheme] = useState<any>({})

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]))
    }
  }

  useEffect(() => {
    const imageEle = document.getElementById('image') as HTMLImageElement

    if (imageEle) {
      sourceColorFromImage(imageEle).then((source) => {
        const hct = Hct.fromInt(source)
        const scheme = new SchemeTonalSpot(hct, false, 0)
        const darkScheme = new SchemeTonalSpot(hct, true, 0)

        const getDynamicColors = (scheme: SchemeTonalSpot) =>
          Object.fromEntries(
            tokens.map((token) => {
              // @ts-ignore
              const num = MaterialDynamicColors[token].getArgb(scheme)

              return [token, hexFromArgb(num)]
            })
          )

        const theme = {
          source,
          schemes: {
            light: getDynamicColors(scheme),
            dark: getDynamicColors(darkScheme),
          },
          palettes: {
            primary: toTone(scheme.primaryPalette),
            secondary: toTone(scheme.secondaryPalette),
            tertiary: toTone(scheme.tertiaryPalette),
            neutral: toTone(scheme.neutralPalette),
            neutralVariant: toTone(scheme.neutralVariantPalette),
            error: toTone(scheme.errorPalette),
          },
        }

        setTheme(theme)
      })
    }
  }, [selectedImage])

  return (
    <>
      <Head>
        <title>Theme Color Tool</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main style={{ padding: 18 }}>
        <input type='file' accept='image/*' onChange={handleImageChange} />

        <br />
        <br />

        {selectedImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            id='image'
            src={selectedImage}
            alt='Selected'
            style={{ width: 300 }}
          />
        )}

        <pre>{JSON.stringify(theme, null, 4)}</pre>
      </main>
    </>
  )
}

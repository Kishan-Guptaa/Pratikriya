import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: '#7b61ff',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '50%',
          border: '2.5px solid #2d2638',
          boxShadow: '1.5px 1.5px 0px #2d2638',
          fontWeight: 'black',
          fontFamily: '"Comic Sans MS", "Caveat", cursive, sans-serif',
          lineHeight: 1,
          paddingBottom: '3px',
        }}
      >
        P
      </div>
    ),
    {
      ...size,
    }
  )
}

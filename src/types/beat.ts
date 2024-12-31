export type MusicStyle = 
  | 'Trap'
  | 'Drill'
  | 'RnB'
  | 'Rap'
  | 'Afro'
  | 'Pop'
  | 'Dancehall'
  | 'Cloud'
  | 'Boom Bap'

export interface Beat {
  id: string
  title: string
  producer: string
  audioUrl: string
  imageUrl?: string
  createdAt: Date
  duration: number
  style: MusicStyle
  price: number
  size?: number
  contentType?: string
}

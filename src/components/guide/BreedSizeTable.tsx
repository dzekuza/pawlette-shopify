import { COLLAR_SIZE_RANGES, type BreedNeckSize } from '@/lib/data'
import { cn } from '@/lib/utils'

const SMALLEST = COLLAR_SIZE_RANGES[0]
const LARGEST = COLLAR_SIZE_RANGES[COLLAR_SIZE_RANGES.length - 1]
const HEADERS = ['Veislė', 'Kaklo apimtis', 'PawsCharm dydis'] as const

interface CollarFit {
  label: string
  note?: string
}

// Maps a breed's neck range onto the collar sizes it overlaps, flagging the part
// of the range that falls outside S–L so the chart never over-promises a fit.
export function getCollarFit ({ neckMin, neckMax }: Pick<BreedNeckSize, 'neckMin' | 'neckMax'>): CollarFit {
  const fits = COLLAR_SIZE_RANGES.filter((s) => neckMin < s.max && neckMax > s.min)
  if (fits.length === 0) {
    return neckMax <= SMALLEST.min
      ? { label: '—', note: `Mažesnis nei ${SMALLEST.size} (${SMALLEST.min} cm)` }
      : { label: '—', note: `Didesnis nei ${LARGEST.size} (${LARGEST.max} cm)` }
  }
  const first = fits[0].size
  const last = fits[fits.length - 1].size
  const label = first === last ? first : `${first}–${last}`
  if (neckMin < SMALLEST.min) return { label, note: `Smulkesniems — mažiau nei ${SMALLEST.min} cm` }
  if (neckMax > LARGEST.max) return { label, note: `Stambesniems — daugiau nei ${LARGEST.max} cm` }
  return { label }
}

export function BreedSizeTable ({ breeds }: { breeds: readonly BreedNeckSize[] }) {
  return (
    <div className='rounded-2xl overflow-hidden border border-bark/10'>
      <table className='w-full border-collapse font-sans'>
        <thead>
          <tr className='bg-bark'>
            {HEADERS.map((h) => (
              <th key={h} scope='col' className='px-3 md:px-5 py-[14px] text-left text-xs font-medium text-cream tracking-[0.06em] uppercase'>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {breeds.map((breed, index) => {
            const fit = getCollarFit(breed)
            return (
              <tr key={breed.slug} id={breed.slug} className={cn('border-t border-bark/[0.06] scroll-mt-28', index % 2 === 0 ? 'bg-white' : 'bg-cream')}>
                <th scope='row' className='px-3 md:px-5 py-4 text-left text-[15px] font-medium text-bark'>{breed.name}</th>
                <td className='px-3 md:px-5 py-4 text-[15px] text-bark-light whitespace-nowrap'>{breed.neckMin}–{breed.neckMax} cm</td>
                <td className='px-3 md:px-5 py-4'>
                  <span className='text-base font-semibold text-bark'>{fit.label}</span>
                  {fit.note && <span className='block text-xs text-bark-muted mt-0.5'>{fit.note}</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

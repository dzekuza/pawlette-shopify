/**
 * Crosshair frame + label that calls out the lettered collar on the hero photo. Positions are percentages of the
 * photo, so the parent must keep the photo's aspect ratio (2200:1228); only rendered where there is room beside the headline (xl+).
 */
export function HeroHotspot ({ label }: { label: string }) {
  return (
    <div aria-hidden className='pointer-events-none absolute inset-0 hidden xl:block'>
      <div className='absolute left-[56.5%] right-0 top-[59.6%] h-px bg-white/40' />
      <div className='absolute bottom-0 left-[49.5%] top-[64.6%] w-px bg-white/40' />
      <div className='absolute left-[42.5%] top-[54.6%] h-[10%] w-[14%] border border-white/80'>
        <span className='absolute -right-px -top-px size-3 bg-white [clip-path:polygon(0_0,100%_0,100%_100%)]' />
        <span className='absolute -bottom-px -left-px size-3 bg-white [clip-path:polygon(0_0,0_100%,100%_100%)]' />
      </div>
      <span className='absolute left-[42.5%] top-[48.6%] rounded-full bg-bark/35 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-sm'>
        {label}
      </span>
    </div>
  )
}

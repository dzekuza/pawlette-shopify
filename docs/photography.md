# Product Photography Prompts

## AI Image Generation — Hero Flat Lay

Use this prompt to generate reference product photography for the hero shot: five collars in a diagonal staircase fan layout.

### Full Prompt

```
Professional product photography, flat lay, top-down shot. Five waterproof 
TPU dog collars arranged in a diagonal staircase fan layout on a warm cream 
linen surface (#FAF7F2). Each collar is a different pastel color: sage green, 
soft lavender, powder blue, blush pink, butter yellow. Each collar has 4–5 
chunky matte silicone letter charms spelling dog names — MAX, LUNA, BEAR, 
COCO, MILO — plus one star symbol charm at the end of each name. 

CRITICAL: each charm has holes on its LEFT and RIGHT sides only. The collar 
strap threads horizontally through each charm from side to side, so charms 
sit completely flat and flush on top of the strap — not hanging, not 
threaded top-to-bottom. Letter charms are butter yellow matte silicone. 
Star charms match the collar color. Metal silver D-ring on the left end, 
pastel plastic side-release buckle on the right end.

Natural soft window light from the upper left. Gentle soft shadows. 
No harsh flash. Warm, slightly creamy white tones. Clean background — 
no props, no flowers, no extra objects. Shallow depth of field with all 
five collars in focus. Shot on 85mm lens equivalent. 

Photorealistic commercial product photography. No illustrations, no CGI look, 
no text overlays, no watermarks.
```

---

## Platform-Specific Settings

### Midjourney
Append to the prompt:
```
--ar 4:5 --style raw --v 6.1 --no text watermark logo
```

Use `--cref [image URL]` with a reference photo showing correct charm mounting (horizontal threading) to reinforce the flat-flush construction.

### DALL-E 3
Append to the prompt:
```
photograph, not illustration, photorealistic, commercial product shot
```

### Stable Diffusion
Add negative prompt:
```
illustration, cartoon, CGI, floating charms, pendant charms, hanging charms, 
top-bottom threading, watermark, text, flowers, props
```

---

## Critical Detail to Always Specify

The single most important construction detail to include in any prompt is the charm mounting:

> "Charms have holes on LEFT and RIGHT sides only. The collar strap threads horizontally through each charm from side to side. Charms sit completely flat and flush on top of the strap — not hanging as pendants, not threaded top-to-bottom."

AI models default to generating pendant-style hanging charms. This language overrides that default.

---

## Photography Checklist (Real Shoot)

When shooting actual product photography, reference these settings:

- **Background:** cream linen or textured paper (#FAF7F2 equivalent) — never pure white
- **Light:** natural window light, soft diffused, from upper left
- **Lens:** 85mm equivalent (no wide-angle distortion)
- **Depth of field:** enough to keep all 5 collars in focus
- **Props:** none — clean, minimal
- **Color accuracy:** shoot in RAW, calibrate to match brand palette in post
- **Aspect ratios to export:** 4:5 (Instagram feed), 1:1 (grid), 9:16 (Stories/Reels)

---

## Future Prompt Variations

| Shot Type | Modification |
|-----------|-------------|
| Single collar hero | Remove "five collars / diagonal staircase" — use one collar centered |
| Lifestyle / on-dog | Replace flat lay with "golden retriever wearing a sage green collar..." |
| Charm close-up | Crop tight on 3–4 charms, emphasize texture and lettering detail |
| Seasonal / gift | Add "wrapped in kraft paper tissue, small gift box in background" |

"""
Remove background from generated images and convert to transparent PNG.
Uses:
  - Green chroma key for products (all green bg)
  - Green+white chroma key for characters (mostly green, some white)
  - Brightness-based alpha for graffiti/effects (gray bg)
  - backgrounds are skipped (they're scenes, no bg removal needed)
"""
from PIL import Image
import os
import math

BASE = '/data/competition/2026imagineers/src/assets/images'

def green_difference(r, g, b):
    """How 'green' is a pixel. Positive = green, negative = not green."""
    if g <= 50:
        return -1.0
    return g - max(r, b)

def is_green_pixel(r, g, b):
    """Check if pixel is green background."""
    if g < 80:
        return False
    if g <= r or g <= b:
        return False
    return g - max(r, b) > 20

def is_gray_pixel(r, g, b):
    """Check if pixel is gray background (all channels similar)."""
    if max(r, g, b) < 40:
        return False
    if abs(r - g) > 35 or abs(g - b) > 35 or abs(r - b) > 35:
        return False
    return True

def is_white_pixel(r, g, b):
    """Check if pixel is near-white background."""
    return r > 220 and g > 220 and b > 220

def chroma_key_green(img_path, out_path):
    """Remove green background, keep subject."""
    img = Image.open(img_path).convert('RGBA')
    pixels = img.load()
    w, h = img.size

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if is_green_pixel(r, g, b):
                # Calculate alpha based on green-ness
                greenness = g - max(r, b)
                alpha = max(0, int(255 - greenness * 3))
                pixels[x, y] = (r, g, b, min(a, alpha))

    # Second pass: clean up semi-transparent greens, make fully transparent
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a < 128 and is_green_pixel(r, g, b):
                pixels[x, y] = (r, g, b, 0)

    img.save(out_path, 'PNG')
    return img

def chroma_key_gray(img_path, out_path):
    """Remove gray/white background, keep subject."""
    img = Image.open(img_path).convert('RGBA')
    pixels = img.load()
    w, h = img.size

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if is_gray_pixel(r, g, b) or is_white_pixel(r, g, b):
                brightness = max(r, g, b)
                if brightness > 200:
                    pixels[x, y] = (r, g, b, 0)
                elif brightness < 120:
                    alpha_val = max(0, int(255 - brightness * 2.5))
                    pixels[x, y] = (r, g, b, min(a, alpha_val))
                else:
                    alpha_val = max(0, int(255 - (brightness - 60) * 1.5))
                    pixels[x, y] = (r, g, b, min(a, alpha_val))

    # Clean pass
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a < 128 and is_gray_pixel(r, g, b):
                pixels[x, y] = (r, g, b, 0)

    img.save(out_path, 'PNG')
    return img

def process_category(category, key_type):
    """Process all PNGs in a category directory."""
    d = os.path.join(BASE, category)
    for f in sorted(os.listdir(d)):
        if not f.endswith('.png'):
            continue
        in_path = os.path.join(d, f)
        print(f'  Processing {category}/{f}...', end=' ')
        if key_type == 'green':
            chroma_key_green(in_path, in_path)
        elif key_type == 'gray':
            chroma_key_gray(in_path, in_path)
        print('done')

def main():
    print('Removing backgrounds from products (green chroma)...')
    process_category('products', 'green')

    print('Removing backgrounds from characters (green + white chroma)...')
    process_category('characters', 'green')  # mostly green, green key handles it

    print('Removing backgrounds from graffiti (gray chroma)...')
    process_category('graffiti', 'gray')

    print('Removing backgrounds from effects (gray chroma)...')
    process_category('effects', 'gray')

    print('\nSkipping backgrounds (scene images, no bg removal)')
    print('\nAll done!')

if __name__ == '__main__':
    main()

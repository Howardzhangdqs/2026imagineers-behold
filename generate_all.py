"""
Batch image generation script using ModelScope Qwen-Image-2512 API.
Generates all assets from 素材.md with solid green background for easy chroma key removal.
"""
import requests
import time
import json
import os
from io import BytesIO
from PIL import Image

BASE_URL = "https://api-inference.modelscope.cn/"
API_KEY = "ms-8d8d2fda-b2df-4755-af88-8dc42e03484e"
ASSETS_DIR = "/data/competition/2026imagineers/src/assets/images"

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

GREEN_BG = "solid pure green background (#00FF00), no shadow, no gradient, centered subject only, no floor"

def add_green_bg(prompt):
    return f"{prompt}, {GREEN_BG}"

# ============================================================
# ALL ITEMS
# ============================================================
ITEMS = [
    # ============ 一、商品图标 (200×200) - 透明背景 ============
    ("milk", "A cute cartoon carton of fresh milk with a cow print pattern, bright white packaging, flat vector illustration with bold outlines", True),
    ("bread", "A cute cartoon loaf of whole wheat bread with visible grains, golden brown crust, flat vector illustration", True),
    ("toilet_paper", "A cute cartoon rolled toilet paper with soft texture, white with light blue packaging, flat vector illustration", True),
    ("eggs", "A cute cartoon egg carton with 12 brown eggs visible, beige cardboard box, flat vector illustration", True),
    ("detergent", "A cute cartoon bottle of liquid laundry detergent, lavender color with a flower label, flat vector illustration", True),
    ("snack", "A cute cartoon mixed snack gift box with different chip flavors, colorful packaging, flat vector illustration", True),
    ("instant_noodle", "A cute cartoon pack of five instant beef noodles bundled together, red and gold packaging, flat vector illustration", True),
    ("cola", "A cute cartoon 24-can case cola box, classic red design, flat vector illustration", True),
    ("lphone", "A sleek minimalist smartphone with a large screen, premium white/silver body, resembling a high-end phone, flat vector illustration", True),
    ("three_body", "A futuristic Android-style smartphone with a 3-body orbit pattern on the back, dark blue metallic body, flat vector illustration", True),
    ("java_phone", "A sturdy thick smartphone with a coffee bean logo, brown/warm tones, flat vector illustration", True),
    ("dami_note", "A budget-friendly smartphone with a wheat/grain logo, yellow and green accents, approachable design, flat vector illustration", True),
    ("gas_car", "A classic muscular gasoline sedan with visible exhaust pipe, metallic gold/black, flat vector illustration", True),
    ("ev_car", "A sleek futuristic electric car with glowing blue LED accents, no grille, aerodynamic shape, flat vector illustration", True),
    ("hybrid_car", "A practical hybrid car with both fuel cap and charging port visible, dual-tone green and grey, flat vector illustration", True),
    ("suv_car", "A rugged off-road SUV with big tires and roof rack, military green color, flat vector illustration", True),
    ("elder_car", "A tiny cute slow-speed electric scooter car for elderly, small and boxy, light blue, flat vector illustration", True),
    ("super_car", "A flashy exotic supercar with gullwing doors, bright red, low profile, flat vector illustration", True),
    ("label_sticker", "A cartoon label gun/sticker dispenser shooting out IQ Tax stickers, red warning labels, flat vector illustration", True),
    ("team_stick", "A glowing chemiluminescent glow stick with team colors blue vs orange, flat vector illustration", True),
    ("sarcastic_voice", "A cartoon smartphone with a devilish smirk emoji on screen and sound waves, mocking vibe, flat vector illustration", True),
    ("screenshot_cutter", "A cartoon pair of scissors cropping a screenshot with text, scissors cutting a phone screen, flat vector illustration", True),
    ("block_card", "A cartoon credit-card sized BLOCK card with a crossed-out person icon, red and black, flat vector illustration", True),
    ("persona_destroyer", "A cartoon explosive device shaped like a megaphone, sparks and smoke, dramatic red glow, flat vector illustration", True),
    ("moral_rope", "A cartoon thick rope tied in a guilt-trip knot, forming a heart shape that traps, brown hemp rope, flat vector illustration", True),
    ("old_account_glass", "A cartoon magnifying glass looking at an old calendar/timeline, revealing past posts, flat vector illustration", True),
    ("mob_summon", "A cartoon loudspeaker/conch horn summoning a crowd with angry emoji ghosts emerging, flat vector illustration", True),
    ("reflective_spike", "A cartoon shield with sharp spikes pointing outward, mirror-like surface reflecting, flat vector illustration", True),
    ("rational_shield", "A calm blue translucent energy shield with a book/scale icon in center, peaceful glow, flat vector illustration", True),
    ("zen_headphone", "A pair of noise-cancelling headphones with a lotus flower and OM symbol, tranquil zen vibe, flat vector illustration", True),
    ("shutup_redpack", "A traditional Chinese red envelope (红包) with a zipper over a mouth emoji, festive red/gold, flat vector illustration", True),

    # ============ 二、角色头像 (150×200) - 透明背景 ============
    ("fitness_coach", "A muscular male fitness coach with a tank top and whistle, friendly smile, holding a protein shake, cartoon chibi style half-body portrait", True),
    ("geek_glasses", "A tech geek with thick black glasses, messy hair, wearing a nerdy T-shirt with binary code, visibly passionate and argumentative, cartoon chibi style", True),
    ("fashionista", "A stylish young woman with trendy sunglasses pushed on head, designer scarf, holding a phone taking selfie, glamorous vibe, cartoon chibi style", True),
    ("melon_eater", "A relaxed person eating a slice of watermelon with both hands, amused expression watching drama unfold, casual hoodie, cartoon chibi style", True),
    ("dami_fan", "A young enthusiastic fanboy holding a wheat/grain sign, wearing yellow hoodie, cheap phone in hand, eager bargain-hunter look, cartoon chibi style", True),
    ("aurora_girl", "A young idealistic eco-activist girl with green hair streaks and leaf hairpin, wearing a Save Earth T-shirt, carrying a reusable bag, passionate and slightly angry, cartoon chibi style", True),
    ("carbon_uncle", "A middle-aged man with glasses holding a carbon footprint calculator tablet, wearing a green vest, data-driven serious expression, cartoon chibi style", True),
    ("zero_waste_mom", "A caring mother holding a baby with one arm and a bicycle helmet in the other, reusable containers strapped on, slightly judgmental smile, cartoon chibi style", True),
    ("old_driver_wang", "An older experienced driver with a cap, leather jacket, grey stubble, holding a steering wheel, weathered confident smirk, cartoon chibi style", True),
    ("mech_nostalgia", "A young mechanic with oil stains on face, wearing blue coveralls, holding a wrench and a piston, dreamy nostalgia in eyes, cartoon chibi style", True),
    ("oil_tough_guy", "A rugged tough outdoorsman with a beard, flannel shirt, sunglasses, leaning on a tire, cowboy boots, cartoon chibi style", True),
    ("zen_observer", "A bald monk-like character in simple grey robes, hands in prayer mudra, eyes closed peacefully, lotus flower background hint, cartoon chibi style", True),
    ("repost_editor", "A social media editor with a cap backwards, phone in one hand and laptop in the other, eyes sparkling with clickbait greed, cartoon chibi style", True),
    ("heat_hunter", "A character with a reporter hat holding a large microphone/camera, predatory grin, HOT badge on chest, cartoon chibi style", True),
    ("passerby_a", "Generic everyman in plain white T-shirt and jeans, confused whats happening expression, holding a water bottle, cartoon chibi style", True),
    ("passerby_b", "Generic young woman in casual dress, looking around bewildered, phone half-raised, cartoon chibi style", True),
    ("passerby_c", "Generic young man in shorts and flip-flops, eating popcorn from a bucket, enjoying the drama, cartoon chibi style", True),

    # ============ 三、背景图 (800×600) - 不需要透明背景，不加绿幕 ============
    ("shop_clean", "A bright clean cartoon supermarket aisle interior, white shelves with colorful products, polished floor reflecting light, warm yellow lighting, cozy and innocent atmosphere, comic art style", False),
    ("shop_slightly_messy", "Same store but slightly cluttered, a few boxes on the floor, shopping cart askew, one flickering light, subtle unsettling feeling creeping in, still bright overall, comic art style", False),
    ("shop_digital", "Electronics section of a store, blue-tinted cool lighting, glass display cases with phones, sleek modern aesthetic, slightly cold and impersonal atmosphere, comic art style", False),
    ("shop_warzone", "The same store but transformed into a battleground, shelves knocked over, red emergency lighting, first signs of rust and damage, war zone in a supermarket, comic style becoming gritty", False),
    ("shop_ruin", "Complete devastation, total ruin of the supermarket, heavy rust and decay everywhere, dark red and black tones, shattered glass, fire damage, apocalyptic retail wasteland, gritty art style", False),
    ("ending_sepia", "A frozen still frame of the ruined store in sepia/old photograph tone, everything paused mid-destruction, vintage photo feel, melancholic brown tones, held-memory aesthetic", False),

    # ============ 四、涂鸦素材 (300×300) - 透明背景 ============
    ("graffiti_scribble", "Angry chaotic scribbles and scratch marks like a childs tantrum drawing, black and red marker strokes, isolated on green, no background elements", True),
    ("graffiti_cross", "A large bold red spray-painted X mark with drips running down, vandalism style, isolated on green, no background elements", True),
    ("graffiti_angry", "A crude angry emoji face spray-painted in red and black, graffiti street art style, isolated on green, no background elements", True),
    ("graffiti_label", "Various sticker-like labels reading insults like STUPID FAKE TAX in bold text, sticker peeling effect, isolated on green, no background elements", True),
    ("graffiti_crack", "Shattered glass crack pattern spreading from center, sharp jagged lines in dark grey, isolated on green, no background elements", True),
    ("graffiti_blood", "Red paint splatter spray pattern as if thrown violently, abstract blood-like splatter isolated on green, no background elements", True),
    ("graffiti_rust", "Heavy rust texture patches in orange-brown, decayed metal surface pattern, tileable, isolated on green, no background elements", True),
    ("graffiti_warning", "A yellow and black warning hazard triangle symbol, heavy industrial danger sign style, isolated on green, no background elements", True),
    ("graffiti_chaos", "Full chaos composite: scribbles plus cracks plus splatters plus random text all layered together, maximum visual noise, isolated on green, no background elements", True),

    # ============ 五、特效素材 (200×200) - 透明背景 ============
    ("hat_throw", "A cartoon hat flying through the air with motion lines and speed trails, spinning, magic sparkles around it, isolated on green, no background elements", True),
    ("hat_stupid", "A cartoon dunce cap labeled STUBBORN, pointed cone hat with insulting words, isolated on green, no background elements", True),
    ("hat_hypocrite", "A cartoon two-faced hat, one side angelic white the other devilish red, labeled HYPOCRITE, isolated on green, no background elements", True),
    ("hat_boomer", "A cartoon old-fashioned bowler hat with a BOOMER label and cobwebs, outdated vibe, isolated on green, no background elements", True),
    ("shield_block", "A circular energy shield impact effect, blue glowing concentric rings radiating outward, defensive burst, isolated on green, no background elements", True),
    ("damage_number", "Comic-style damage number popup effect like -999 in games, bold red impact font, isolated on green, no background elements", True),
    ("red_flash", "Semi-transparent red overlay gradient center transparent edges red, for screen flash effect, 50 percent opacity built in, isolated on green background", True),
    ("rust_overlay", "Full screen seamless rust and decay texture overlay, orange-brown corrosion pattern, meant to tile, semi-transparent built in, isolated on green background", True),
]

# ============================================================
# Category -> subdirectory mapping
# ============================================================
CATEGORY_DIRS = {}
for i in range(31):
    CATEGORY_DIRS[ITEMS[i][0]] = "products"
for i in range(31, 48):
    CATEGORY_DIRS[ITEMS[i][0]] = "characters"
for i in range(48, 54):
    CATEGORY_DIRS[ITEMS[i][0]] = "backgrounds"
for i in range(54, 63):
    CATEGORY_DIRS[ITEMS[i][0]] = "graffiti"
for i in range(63, len(ITEMS)):
    CATEGORY_DIRS[ITEMS[i][0]] = "effects"

# Size for API generation
CATEGORY_GEN_SIZE = {
    "products": "1024x1024",
    "characters": "768x1024",
    "backgrounds": "1024x768",
    "graffiti": "1024x1024",
    "effects": "1024x1024",
}

# Target size after resize
CATEGORY_TARGET_SIZE = {
    "products": (200, 200),
    "characters": (150, 200),
    "backgrounds": (800, 600),
    "graffiti": (300, 300),
    "effects": (200, 200),
}


def generate_one(name, prompt, add_green):
    """Generate one image, return PIL Image or None."""
    cat = CATEGORY_DIRS[name]
    size_str = CATEGORY_GEN_SIZE[cat]
    target_size = CATEGORY_TARGET_SIZE[cat]

    final_prompt = add_green_bg(prompt) if add_green else prompt
    if not add_green:
        final_prompt += ", no text overlays, no watermark"

    payload = {
        "model": "Qwen/Qwen-Image-2512",
        "prompt": final_prompt,
        "size": size_str,
        "negative_prompt": "shadow on floor, 3D realistic, complex background, multiple unrelated objects, watermark, text overlays",
    }

    print(f"  Generating {name} | size={size_str} | target={target_size} | green_bg={add_green}")
    print(f"    Prompt: {final_prompt[:120]}...")

    resp = requests.post(
        f"{BASE_URL}v1/images/generations",
        headers={**HEADERS, "X-ModelScope-Async-Mode": "true"},
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
    )
    resp.raise_for_status()
    task_id = resp.json()["task_id"]

    while True:
        time.sleep(5)
        result = requests.get(
            f"{BASE_URL}v1/tasks/{task_id}",
            headers={**HEADERS, "X-ModelScope-Task-Type": "image_generation"},
        )
        result.raise_for_status()
        data = result.json()
        status = data.get("task_status")
        if status == "SUCCEED":
            img_url = data["output_images"][0]
            img = Image.open(BytesIO(requests.get(img_url).content))
            if img.size != target_size:
                img = img.resize(target_size, Image.LANCZOS)
            return img
        elif status == "FAILED":
            print(f"    FAILED: {data}")
            return None


def main():
    success = 0
    failed = []
    total = len(ITEMS)
    start_time = time.time()

    print(f"=" * 60)
    print(f"Starting batch generation: {total} images")
    print(f"=" * 60)

    for idx, (name, prompt, add_green) in enumerate(ITEMS):
        cat = CATEGORY_DIRS[name]
        out_path = os.path.join(ASSETS_DIR, cat, f"{name}.png")

        elapsed = time.time() - start_time
        eta = (elapsed / max(idx, 1)) * (total - idx) if idx > 0 else 0
        print(f"\n[{idx+1}/{total}] ({elapsed:.0f}s elapsed, ~{eta:.0f}s remaining)")

        try:
            img = generate_one(name, prompt, add_green)
            if img:
                img.save(out_path, "PNG")
                print(f"  -> Saved {out_path}")
                success += 1
            else:
                failed.append(name)
        except Exception as e:
            print(f"  ERROR: {e}")
            failed.append(name)

    elapsed = time.time() - start_time
    print(f"\n{'=' * 60}")
    print(f"Done! {success}/{total} succeeded in {elapsed:.0f}s ({elapsed/60:.1f} min)")
    if failed:
        print(f"Failed ({len(failed)}): {failed}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()

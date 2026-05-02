"""
Retry background images generation.
All other assets done. Only 6 backgrounds need regenerating (hit daily quota limit).
Run this tomorrow.
"""
import requests
import time
import json
from io import BytesIO
from PIL import Image
import os

BASE_URL = "https://api-inference.modelscope.cn/v1/images/generations"
TASKS_URL = "https://api-inference.modelscope.cn/v1/tasks"
API_KEY = "ms-8d8d2fda-b2df-4755-af88-8dc42e03484e"
OUT_DIR = "/data/competition/2026imagineers/src/assets/images/backgrounds"

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

ITEMS = [
    ("shop_clean", "A bright clean cartoon supermarket aisle interior, white shelves with colorful products, polished floor reflecting light, warm yellow lighting, cozy and innocent atmosphere, comic art style, no text, no watermark"),
    ("shop_slightly_messy", "Same supermarket interior but slightly cluttered, a few boxes on the floor, shopping cart askew, one flickering light, subtle unsettling feeling, still bright overall, comic art style, no text, no watermark"),
    ("shop_digital", "Electronics section of a store interior, blue-tinted cool lighting, glass display cases with phones, sleek modern aesthetic, slightly cold and impersonal atmosphere, comic art style, no text, no watermark"),
    ("shop_warzone", "Same supermarket but transformed into a battleground, shelves knocked over, red emergency lighting, rust and damage, war zone in a supermarket, comic style becoming gritty, no text, no watermark"),
    ("shop_ruin", "Complete devastation total ruin of the supermarket, heavy rust and decay, dark red and black tones, shattered glass, fire damage, apocalyptic retail wasteland, gritty art style, no text, no watermark"),
    ("ending_sepia", "Frozen still frame of a ruined store in sepia old photograph tone, everything paused mid-destruction, vintage photo feel, melancholic brown tones, held-memory aesthetic, no text, no watermark"),
]

def generate(name, prompt):
    os.makedirs(OUT_DIR, exist_ok=True)
    out_path = os.path.join(OUT_DIR, f"{name}.png")

    print(f"Generating {name}...")
    resp = requests.post(
        BASE_URL,
        headers={**HEADERS, "X-ModelScope-Async-Mode": "true"},
        data=json.dumps({
            "model": "Qwen/Qwen-Image-2512",
            "prompt": prompt,
            "size": "1024x768",
            "negative_prompt": "text, watermark, gray blank empty",
        }, ensure_ascii=False).encode("utf-8"),
    )

    if resp.status_code != 200:
        print(f"  Failed to submit: {resp.status_code} {resp.text[:200]}")
        return False

    task_id = resp.json()["task_id"]
    print(f"  Task: {task_id}, waiting...")

    while True:
        time.sleep(10)
        result = requests.get(
            f"{TASKS_URL}/{task_id}",
            headers={**HEADERS, "X-ModelScope-Task-Type": "image_generation"},
        )
        result.raise_for_status()
        data = result.json()
        status = data.get("task_status")
        print(f"  Status: {status}")

        if status == "SUCCEED":
            img = Image.open(BytesIO(requests.get(data["output_images"][0]).content))
            img = img.resize((800, 600), Image.LANCZOS)
            img.save(out_path, "PNG")

            # Quick verify
            w, h = img.size
            pixels = img.load()
            samples = set()
            for x in range(0, w, 50):
                for y in range(0, h, 50):
                    samples.add(pixels[x, y])
            if len(samples) < 10:
                print(f"  WARNING: Only {len(samples)} unique colors, image may be blank!")
            else:
                print(f"  OK: {len(samples)} unique colors")
            return True

        elif status == "FAILED":
            print(f"  FAILED: {data}")
            return False

if __name__ == "__main__":
    for name, prompt in ITEMS:
        success = generate(name, prompt)
        if not success:
            print(f"  Stopping due to failure on {name}")
            break
        time.sleep(30)  # delay between requests

    print("\nAll done! Check the files in backgrounds/ directory.")

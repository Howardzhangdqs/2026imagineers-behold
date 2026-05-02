#!/usr/bin/env python3
"""Generate placeholder images and audio for 阿原的普通市场."""
import os
import struct
import wave

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Pillow not installed. Run: pip install Pillow")
    exit(1)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(BASE_DIR, 'src', 'assets')


def get_font(size=24):
    try:
        return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", size)
    except Exception:
        try:
            return ImageFont.truetype("/usr/share/fonts/truetype/wqy/wqy-microhei.ttc", size)
        except Exception:
            return ImageFont.load_default()


def create_placeholder_image(path, text, width, height, bg_color=(204, 204, 204)):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    # Draw diagonal cross
    draw.line([(0, 0), (width, height)], fill=(80, 80, 80), width=3)
    draw.line([(width, 0), (0, height)], fill=(80, 80, 80), width=3)

    # Draw text
    font = get_font(min(22, width // 6))
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_w = text_bbox[2] - text_bbox[0]
    text_h = text_bbox[3] - text_bbox[1]
    text_x = (width - text_w) // 2
    text_y = (height - text_h) // 2
    # Text shadow/outline
    draw.text((text_x + 1, text_y + 1), text, fill=(0, 0, 0), font=font)
    draw.text((text_x + 2, text_y + 2), text, fill=(0, 0, 0), font=font)
    draw.text((text_x, text_y), text, fill=(255, 255, 255), font=font)

    img.save(path)
    print(f"  ✓ {path}")


def create_placeholder_audio(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sample_rate = 44100
    duration = 0.5
    frames = int(sample_rate * duration)
    with wave.open(path, 'w') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(struct.pack('<' + 'h' * frames, *([0] * frames)))
    print(f"  ✓ {path}")


def main():
    print("Generating product images...")
    products_dir = os.path.join(ASSETS_DIR, 'images', 'products')
    products = {
        'milk.png': '纯牛奶',
        'bread.png': '全麦面包',
        'toilet_paper.png': '卷纸一提',
        'eggs.png': '鸡蛋一盒',
        'detergent.png': '洗衣液',
        'snack.png': '薯片大礼包',
        'instant_noodle.png': '泡面五连包',
        'cola.png': '可乐一箱',
        'lphone.png': 'lPhone',
        'three_body.png': '3体 Galaxy',
        'java_phone.png': '爪哇大神',
        'dami_note.png': '大麦Note',
        'gas_car.png': '油车荣耀',
        'ev_car.png': '纯电未来',
        'hybrid_car.png': '混动折中',
        'suv_car.png': '越野硬汉',
        'elder_car.png': '老年代步车',
        'super_car.png': '超跑幻影',
        'label_sticker.png': '智商税标签粘贴器',
        'team_stick.png': '站队荧光棒',
        'sarcastic_voice.png': '阴阳怪气语音包',
        'screenshot_cutter.png': '断章取义截图器',
        'block_card.png': '拉黑威胁卡',
        'persona_destroyer.png': '人设崩塌生成器',
        'moral_rope.png': '道德绑架绳索',
        'old_account_glass.png': '翻旧账放大镜',
        'mob_summon.png': '群体围攻召集令',
        'reflective_spike.png': '反向歧视盾刺',
        'rational_shield.png': '理性护盾',
        'zen_headphone.png': '佛系耳机',
        'shutup_redpack.png': '闭嘴红包',
    }
    for filename, text in products.items():
        create_placeholder_image(os.path.join(products_dir, filename), text, 200, 200)

    print("\nGenerating character images...")
    characters_dir = os.path.join(ASSETS_DIR, 'images', 'characters')
    characters = {
        'fitness_coach.png': '健身教练朋友',
        'geek_glasses.png': '戴眼镜极客',
        'fashionista.png': '时尚达人',
        'melon_eater.png': '吃瓜群众',
        'dami_fan.png': '大麦粉',
        'aurora_girl.png': '极光少女',
        'carbon_uncle.png': '碳足迹大叔',
        'zero_waste_mom.png': '零浪费妈妈',
        'old_driver_wang.png': '老司机老王',
        'mech_nostalgia.png': '机械情怀小哥',
        'oil_tough_guy.png': '油味硬汉',
        'zen_observer.png': '佛系观察员',
        'repost_editor.png': '搬运工小编',
        'heat_hunter.png': '热度猎人',
        'passerby_a.png': '路人甲',
        'passerby_b.png': '路人乙',
        'passerby_c.png': '路人丙',
    }
    for filename, text in characters.items():
        create_placeholder_image(os.path.join(characters_dir, filename), text, 150, 200)

    print("\nGenerating graffiti images...")
    graffiti_dir = os.path.join(ASSETS_DIR, 'images', 'graffiti')
    graffiti = {
        'graffiti_scribble.png': '涂鸦-乱线',
        'graffiti_cross.png': '涂鸦-叉号',
        'graffiti_angry.png': '涂鸦-怒脸',
        'graffiti_label.png': '涂鸦-标签',
        'graffiti_crack.png': '涂鸦-裂纹',
        'graffiti_blood.png': '涂鸦-红色喷溅',
        'graffiti_rust.png': '涂鸦-锈迹',
        'graffiti_warning.png': '涂鸦-警告符号',
        'graffiti_chaos.png': '涂鸦-全混乱',
    }
    for filename, text in graffiti.items():
        create_placeholder_image(os.path.join(graffiti_dir, filename), text, 300, 300)

    print("\nGenerating background images...")
    backgrounds_dir = os.path.join(ASSETS_DIR, 'images', 'backgrounds')
    backgrounds = {
        'shop_clean.png': ('干净明亮的杂货店背景\n(Stage 1)', (251, 248, 240)),
        'shop_slightly_messy.png': ('略显杂乱的商店\n(Stage 2)', (244, 240, 232)),
        'shop_digital.png': ('数码区背景\n明亮但冷色调(Stage 3)', (235, 240, 248)),
        'shop_warzone.png': ('战区商店背景\n红色锈迹(Stage 4)', (232, 215, 210)),
        'shop_ruin.png': ('废墟风背景\n严重锈蚀(Stage 4后期)', (210, 195, 180)),
        'ending_sepia.png': ('老照片色调背景\n(Stage 5)', (195, 175, 145)),
    }
    for filename, (text, bg) in backgrounds.items():
        create_placeholder_image(os.path.join(backgrounds_dir, filename), text, 800, 600, bg)

    print("\nGenerating effects images...")
    effects_dir = os.path.join(ASSETS_DIR, 'images', 'effects')
    effects = {
        'hat_throw.png': '帽子飞行攻击',
        'hat_stupid.png': '"老顽固"帽子',
        'hat_hypocrite.png': '"伪善者"帽子',
        'hat_boomer.png': '"老古董"帽子',
        'shield_block.png': '护盾格挡特效',
        'damage_number.png': '伤害数字底图',
        'red_flash.png': '红色闪屏半透明层',
        'rust_overlay.png': '锈迹覆盖层',
    }
    for filename, text in effects.items():
        create_placeholder_image(os.path.join(effects_dir, filename), text, 200, 200)

    print("\nGenerating placeholder audio files...")
    audio_dir = os.path.join(ASSETS_DIR, 'audio')
    audio_files = [
        'bgm_stage1.mp3',
        'bgm_stage3.mp3',
        'bgm_stage4.mp3',
        'pop.mp3',
        'buy.mp3',
        'attack.mp3',
        'counter.mp3',
        'cash.mp3',
        'stage_transition.mp3',
        'ending_freeze.mp3',
    ]
    for filename in audio_files:
        create_placeholder_audio(os.path.join(audio_dir, filename))

    print("\n✅ All placeholder assets generated successfully!")


if __name__ == '__main__':
    main()

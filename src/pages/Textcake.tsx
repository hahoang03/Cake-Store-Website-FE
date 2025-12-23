import { useState, useRef } from 'react';

export default function Textcake() {
    const [text, setText] = useState('');
    const [color, setColor] = useState('#ffffff');
    const [font, setFont] = useState('Arial');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.src = 'https://cailonuong.com/wp-content/uploads/2025/02/7-2-768x1152.jpg'; // đổi đường dẫn ảnh bánh
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            ctx.fillStyle = color;
            ctx.font = `50px ${font}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, img.width / 2, img.height / 2);

            const link = document.createElement('a');
            link.download = 'cake.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <input
                type="text"
                placeholder="Nhập chữ"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="border rounded px-2 py-1 w-64"
            />
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            <select value={font} onChange={(e) => setFont(e.target.value)}>
                <option>Arial</option>
                <option>Comic Sans MS</option>
                <option>Times New Roman</option>
                <option>Courier New</option>
            </select>

            {/* Canvas hiển thị realtime */}
            <canvas
                ref={canvasRef}
                className="border rounded"
                width={300}
                height={300}
                style={{ maxWidth: '100%' }}
            />
            <button
                onClick={downloadImage}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
                Tải về ảnh bánh
            </button>
        </div>
    );
}

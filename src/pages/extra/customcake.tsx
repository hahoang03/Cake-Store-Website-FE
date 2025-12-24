import { useState } from 'react'
import strawberry from './s.png'
import kiwi from './kiwi.png'

/* ================= TYPES ================= */
type Step = 1 | 2 | 3 | 4 | 5
type Base = 'vanilla' | 'choco' | 'matcha'
type Filling = 'none' | 'cream' | 'strawberry' | 'choco'
type Cream = 'white' | 'matcha'
type Decoration = 'strawberry' | 'kiwi'


interface OptionGroupProps {
    options: Decoration[]
    value: Decoration[]
    onChange: (newValue: Decoration[]) => void
}



/* ================= PRICE CONFIG ================= */
const PRICE = {
    base: {
        vanilla: 120_000,
        choco: 140_000,
        matcha: 150_000,
    },
    filling: {
        none: 0,
        cream: 20_000,
        strawberry: 30_000,
        choco: 30_000,
    },
    layer: 80_000,
    cream: {
        white: 0,
        matcha: 20_000,
    },
    topping: {
        strawberry: 25_000,
        kiwi: 30_000,
    },
}


/* ================= PAGE ================= */
export default function CakeDesigner() {
    const [step, setStep] = useState<Step>(1)

    const [base, setBase] = useState<Base>('vanilla')
    const [filling, setFilling] = useState<Filling>('none')
    const [layers, setLayers] = useState(1)

    const [cream, setCream] = useState<Cream>('white')
    const [decoration, setDecoration] = useState<Decoration>('strawberry')
    const [toppingCount, setToppingCount] = useState(8)
    const [text, setText] = useState('')

    const [showOrder, setShowOrder] = useState(false)

    const isTopView = step >= 4

    /* ================= PRICE CALC ================= */
    const totalPrice =
        PRICE.base[base] +
        PRICE.filling[filling] +
        layers * PRICE.layer +
        PRICE.cream[cream] +
        PRICE.topping[decoration]

    return (
        <div className="min-h-screen bg-[#fafafa] p-10">
            <div className="max-w-6xl mx-auto grid md:grid-cols-[360px_1fr] gap-10">

                {/* ================= CONTROL ================= */}
                <aside className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                    <h1 className="text-xl font-semibold text-[#3E5D2A]">Thiết kế bánh theo sở thích</h1>

                    {/* STEP NAV */}
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map(s => (
                            <button
                                key={s}
                                disabled={step === 5}
                                onClick={() => setStep(s as Step)}
                                className={`flex-1 py-2 rounded-lg text-sm ${step === s ? 'bg-[#3E5D2A] text-white' : 'bg-gray-100'
                                    }`}
                            >
                                Step {s}
                            </button>
                        ))}
                    </div>

                    {step === 1 && (
                        <Section title="Cốt bánh">
                            <OptionGroup
                                options={['vanilla', 'choco', 'matcha']}
                                value={base}
                                onChange={setBase}
                            />
                        </Section>
                    )}

                    {step === 2 && (
                        <Section title="Nhân bánh">
                            <OptionGroup
                                options={['none', 'cream', 'strawberry', 'choco']}
                                value={filling}
                                onChange={setFilling}
                            />
                        </Section>
                    )}

                    {step === 3 && (
                        <Section title="Số tầng bánh">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setLayers(Math.max(1, layers - 1))}
                                    className="px-3 py-1 border rounded"
                                >
                                    −
                                </button>
                                <span>{layers}</span>
                                <button
                                    onClick={() => setLayers(layers + 1)}
                                    className="px-3 py-1 border rounded"
                                >
                                    +
                                </button>
                            </div>
                        </Section>
                    )}

                    {step === 4 && (
                        <>
                            <Section title="Kem phủ">
                                <OptionGroup
                                    options={['white', 'matcha']}
                                    value={cream}
                                    onChange={setCream}
                                />
                            </Section>

                            <Section title="Trang trí viền">
                                <OptionGroup
                                    options={['strawberry', 'kiwi']}
                                    value={decoration}
                                    onChange={setDecoration}
                                />
                            </Section>

                            <Section title="Số lượng trái cây">
                                <input
                                    type="range"
                                    min={6}
                                    max={14}
                                    value={toppingCount}
                                    onChange={e => setToppingCount(+e.target.value)}
                                />
                            </Section>

                            <Section title="Chữ trên bánh">
                                <textarea
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                    rows={2}
                                    placeholder="Happy Birthday\nAnna"
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                                <p className="text-xs text-gray-500">⏎ Enter để xuống dòng</p>
                            </Section>

                            <div className="border-t pt-4 space-y-3">
                                <div className="flex justify-between font-semibold">
                                    <span>Tổng tiền</span>
                                    <span>{totalPrice.toLocaleString()}đ</span>
                                </div>

                                <button
                                    onClick={() => setShowOrder(true)}
                                    className="w-full py-3 bg-[#3E5D2A] text-white rounded-xl"
                                >
                                    Đặt bánh
                                </button>
                            </div>
                        </>
                    )}
                </aside>

                {/* ================= PREVIEW ================= */}
                <main className="flex items-center justify-center">
                    {isTopView ? (
                        <CakeTopView
                            cream={cream}
                            text={text}
                            decoration={decoration}
                            count={toppingCount}
                        />
                    ) : (
                        <CakeSideView base={base} filling={filling} layers={layers} />
                    )}
                </main>
            </div>

            {/* ================= ORDER MODAL ================= */}
            {showOrder && (
                <OrderModal
                    onClose={() => setShowOrder(false)}
                    summary={{ base, filling, layers, cream, decoration, text, totalPrice }}
                />
            )}
        </div>
    )
}

/* ================= UI ================= */

function Section({ title, children }: any) {
    return (
        <div>
            <h3 className="font-semibold mb-2 text-[#3E5D2A]">{title}</h3>
            <div className="space-y-2">{children}</div>
        </div>
    )
}

function OptionGroup({ options, value, onChange }: any) {
    return (
        <div className="grid grid-cols-2 gap-2">
            {options.map((o: string) => (
                <button
                    key={o}
                    onClick={() => onChange(o)}
                    className={`py-2 rounded border ${value === o ? 'bg-[#3E5D2A] text-white' : 'bg-white'
                        }`}
                >
                    {o}
                </button>
            ))}
        </div>
    )
}

/* ================= SIDE VIEW ================= */

function CakeSideView({ base, filling, layers }: any) {
    const baseColor: any = {
        vanilla: '#E6CFA7',
        choco: '#6B3E2E',
        matcha: '#9DB8A0',
    }

    const fillingColor: any = {
        cream: '#fff',
        strawberry: '#F2B5B5',
        choco: '#8B5A2B',
    }

    return (
        <div className="flex flex-col gap-3">
            {Array.from({ length: layers }).map((_, i) => (
                <div key={i} className="w-72 rounded-lg overflow-hidden shadow">
                    <div className="h-8" style={{ background: baseColor[base] }} />
                    {filling !== 'none' && (
                        <div className="h-4" style={{ background: fillingColor[filling] }} />
                    )}
                    <div className="h-8" style={{ background: baseColor[base] }} />
                </div>
            ))}
        </div>
    )
}

/* ================= TOP VIEW ================= */

function CakeTopView({ cream, text, decoration, count }: any) {
    const center = 150
    const radius = 120

    const bg =
        cream === 'white'
            ? 'radial-gradient(circle at top, #fff 0%, #eee 70%)'
            : 'radial-gradient(circle at top, #dcebd8 0%, #9fbea0 70%)'

    const img = decoration === 'strawberry' ? strawberry : kiwi

    return (
        <div
            className="relative w-[300px] h-[300px] rounded-full"
            style={{
                background: bg,
                boxShadow:
                    'inset 0 6px 12px rgba(0,0,0,.08), 0 20px 40px rgba(0,0,0,.2)',
            }}
        >
            <div
                className="absolute inset-0 flex items-center justify-center text-center px-10 text-gray-700 font-medium"
                style={{ whiteSpace: 'pre-line' }}
            >
                {text}
            </div>

            {Array.from({ length: count }).map((_, i) => {
                const angle = (2 * Math.PI * i) / count
                return (
                    <img
                        key={i}
                        src={img}
                        className="absolute w-9"
                        style={{
                            left: center + radius * Math.cos(angle),
                            top: center + radius * Math.sin(angle),
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                )
            })}
        </div>
    )
}

/* ================= ORDER MODAL ================= */

function OrderModal({ onClose, summary }: any) {
    const [successMessage, setSuccessMessage] = useState('')

    const sendToDiscord = () => {
        const content = `
 **ĐƠN BÁNH MỚI**
• Cốt: ${summary.base}
• Nhân: ${summary.filling}
• Số tầng: ${summary.layers}
• Kem phủ: ${summary.cream}
• Trang trí: ${summary.decoration}
• Chữ: ${summary.text || 'Không có'}

 **Tổng tiền:** ${summary.totalPrice.toLocaleString()}đ
    `

        fetch(
            'https://discord.com/api/webhooks/1453096031884673195/ONKVjCkr6udJo5mjoOV1kjWidyKCoqmlWgZ-9h-tecb8MgoOiiVQrZDxKf7a-1U9gx3O',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            }
        )
            .then(() => {
                setSuccessMessage(
                    'H&T đã nhận đơn thành công, chúng mình sẽ liên hệ với bạn trong thời gian sớm nhất'
                )
                setTimeout(() => {
                    setSuccessMessage('')
                    onClose() // đóng modal
                }, 3000) // hiện thông báo 3s rồi tắt modal
            })
            .catch(() => {
                setSuccessMessage('Gửi thất bại, vui lòng thử lại')
            })
    }

    return (
        <>
            {successMessage && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                    {successMessage}
                </div>
            )}

            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
                <div className="bg-white w-[420px] rounded-2xl p-6 space-y-4">
                    <h2 className="text-lg font-semibold">Thông tin đơn bánh</h2>

                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Cốt bánh: {summary.base}</li>
                        <li>• Nhân bánh: {summary.filling}</li>
                        <li>• Số tầng: {summary.layers}</li>
                        <li>• Kem phủ: {summary.cream}</li>
                        <li>• Trang trí: {summary.decoration}</li>
                        <li>• Chữ: {summary.text || 'Không có'}</li>
                        <li className="font-semibold pt-2">
                            Tổng tiền: {summary.totalPrice.toLocaleString()}đ
                        </li>
                    </ul>

                    <div className="border-t pt-4 space-y-2">
                        <input className="w-full border rounded px-3 py-2" placeholder="Tên khách hàng" />
                        <input className="w-full border rounded px-3 py-2" placeholder="Số điện thoại" />
                        <textarea className="w-full border rounded px-3 py-2" placeholder="Ghi chú thêm" />
                    </div>

                    <div className="flex gap-2">
                        <button onClick={onClose} className="flex-1 py-2 border rounded">
                            Huỷ
                        </button>
                        <button
                            onClick={sendToDiscord}
                            className="flex-1 py-2 bg-black text-white rounded"
                        >
                            Gửi đơn
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

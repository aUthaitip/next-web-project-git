import AwardsSlider from '@/components/AwardsSlider'; // 1. Import Client Component

export default function AwardsPage() {
    return (
        <section className="content-section awards_accreditations-page">
            <div className="content-container">
                <h2>🏆 รางวัลและการรับรอง</h2>
                <div className="divider"></div>
                <p>มุ่งสู่ความเป็นเลิศ ในการดูแลสุขภาพและยกระดับคุณภาพชีวิตสัตว์เลี้ยง</p>


                <AwardsSlider />

            </div>
        </section>
    );
}
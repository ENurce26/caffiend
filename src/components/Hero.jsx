export default function Hero() {
    return (
        <>
            <h1>Coffee Tracking for Coffee <abbr title="An enthusiast or devotee">Fiends</abbr>!</h1>
            <div className="benefits-list">
                <h3 className="font-bolder">Try <span className="text-gradient">Caffiend</span> and start ...</h3>
                <p>✅ Tracking every coffee</p>
                <p>✅ Measuring blood caffeine levels</p>
                <p>✅ Quantifying your addiction</p>

            </div>
            <div className="card info-card">
                <div>
                    <i class="fa-solid fa-circle-info"></i>
                    <h3>Did you know...</h3>
                </div>
                <h5>That caffiene&apos;s half-life is about 5 hours?</h5>
                <p> This means that after 5 hours, half of the caffeine you consumed is still in your system -- keeping you alert for longer. If you drink 200mg of caffiene at this moment, 5 hours later you will have 100mg still circulating around in your body.</p>
            </div>
        </>
    )
}
import {DonationSlot, formatDateToIST} from "../types/DonationTypes.ts";
import {TimeLineTickSvg} from "../assets/TimeLineTickSvg.tsx";

interface HistoryProps {
    history: DonationSlot[];
}

export function DonationHistory({history}: HistoryProps) {
    return (
        <div className="card bg-base-300 h-fit rounded-btn">
            <div className="card-body">
                <h2 className="card-title">History</h2>
            </div>
            {history.length === 0 ? (
                <div className="timeline-box">No donations yet</div>
            ) : (
                <ul className="timeline timeline-vertical">
                    {history.map((donation, index) => (
                        <li key={index}>
                            {index != 0 && <hr className="bg-accent"/>}
                            <div className="timeline-middle">
                                <TimeLineTickSvg />
                            </div>
                            {index % 2 === 0 ? (
                                <div className="timeline-start timeline-box">
                                    <p>
                                        Donated on {formatDateToIST(donation.slotTime)} at {donation.centerName}
                                        <div className="badge badge-secondary">{donation.slotStatus}</div>
                                    </p>
                                </div>
                            ) : (
                                <div className="timeline-end timeline-box">
                                    <p>
                                        Donated on {formatDateToIST(donation.slotTime)} at {donation.centerName}
                                        <div className="badge badge-secondary">{donation.slotStatus}</div>
                                    </p>
                                </div>
                            )}
                            <hr className="bg-accent" />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}